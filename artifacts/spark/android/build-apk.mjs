/**
 * Builds a signed, installable APK that ships the SPARK prototype offline.
 *
 * There is no Android Studio, Gradle plugin or `sdkmanager` in the loop: the
 * four tools this needs are pulled straight from public mirrors into a local
 * cache, then driven by hand.
 *
 *   aapt2      compiles resources and links the base APK
 *   android.jar  the API 35 stubs, used both to compile against and to link
 *   dx         turns the compiled classes into classes.dex (AOSP's dexer,
 *              republished to Maven Central as dalvik-dx)
 *   apksig     signs with v1 + v2 (v2 is required for targetSdk 30+)
 *
 * Run `pnpm --filter @workspace/spark run build:apk`. Output: dist/spark.apk
 */
import { execFileSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const androidDir = path.resolve(import.meta.dirname);
const pkgRoot = path.resolve(androidDir, "..");
const cacheDir = process.env.SPARK_ANDROID_CACHE ?? path.join(androidDir, ".tools");
const workDir = path.join(pkgRoot, "dist", "apk-build");
const outApk = path.join(pkgRoot, "dist", "spark.apk");

// v2-only signing is verified from Android 7.0 onwards; see tools/ApkSign.java.
const MIN_SDK = 24;
const APKTOOL_JAR =
  "https://repo1.maven.org/maven2/org/apktool/apktool-lib/2.9.3/apktool-lib-2.9.3.jar";
const ANDROID_JAR =
  "https://raw.githubusercontent.com/Sable/android-platforms/master/android-35/android.jar";
const DX_JAR =
  "https://repo1.maven.org/maven2/com/jakewharton/android/repackaged/dalvik-dx/16.0.1/dalvik-dx-16.0.1.jar";
const APKSIG_JAR =
  "https://repo1.maven.org/maven2/com/android/tools/build/apksig/2.3.0/apksig-2.3.0.jar";

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", cwd: androidDir, ...opts });

const download = (url, dest) => {
  if (existsSync(dest) && statSync(dest).size > 0) return dest;
  console.log(`fetching ${path.basename(dest)}…`);
  mkdirSync(path.dirname(dest), { recursive: true });
  execFileSync("curl", ["-sSfL", "-o", dest, url], { stdio: "inherit" });
  return dest;
};

/* ------------------------------------------------------------- toolchain */

const aapt2 = path.join(cacheDir, "aapt2");
const androidJar = path.join(cacheDir, "android.jar");
const dxJar = path.join(cacheDir, "dx.jar");
const apksigJar = path.join(cacheDir, "apksig.jar");

if (!existsSync(aapt2)) {
  // aapt2 has no standalone distribution outside the SDK; apktool bundles one.
  const apktool = download(APKTOOL_JAR, path.join(cacheDir, "apktool-lib.jar"));
  run("unzip", ["-o", "-q", apktool, "prebuilt/linux/aapt2_64", "-d", cacheDir]);
  cpSync(path.join(cacheDir, "prebuilt/linux/aapt2_64"), aapt2);
  rmSync(path.join(cacheDir, "prebuilt"), { recursive: true, force: true });
  chmodSync(aapt2, 0o755);
}
download(ANDROID_JAR, androidJar);
download(DX_JAR, dxJar);
download(APKSIG_JAR, apksigJar);

/* ------------------------------------------------------------ web assets */

// Always rebuild — the APK must never ship a stale bundle.
console.log("building the web bundle…");
run("node", [path.join(pkgRoot, "scripts", "build-single-file.mjs")]);
const webAsset = path.join(pkgRoot, "dist", "standalone", "index.html");

rmSync(workDir, { recursive: true, force: true });
mkdirSync(path.join(workDir, "assets", "www"), { recursive: true });
mkdirSync(path.join(workDir, "classes"), { recursive: true });
cpSync(webAsset, path.join(workDir, "assets", "www", "index.html"));

/* --------------------------------------------------------- resources/APK */

console.log("compiling resources…");
run(aapt2, ["compile", "--dir", path.join(androidDir, "res"), "-o", path.join(workDir, "res.zip")]);

console.log("linking base APK…");
const baseApk = path.join(workDir, "base.apk");
run(aapt2, [
  "link",
  "-o", baseApk,
  "--manifest", path.join(androidDir, "AndroidManifest.xml"),
  "-I", androidJar,
  "-A", path.join(workDir, "assets"),
  "--min-sdk-version", String(MIN_SDK),
  "--target-sdk-version", "35",
  path.join(workDir, "res.zip"),
]);

/* ------------------------------------------------------------------- dex */

console.log("compiling java…");
run("javac", [
  "--release", "8",
  "-nowarn",
  "-classpath", androidJar,
  "-d", path.join(workDir, "classes"),
  path.join(androidDir, "java/com/spark/prototype/MainActivity.java"),
]);

console.log("dexing…");
run("java", [
  "-cp", dxJar,
  "com.android.dx.command.Main",
  "--dex",
  `--output=${path.join(workDir, "classes.dex")}`,
  path.join(workDir, "classes"),
]);

run("zip", ["-q", "-j", baseApk, path.join(workDir, "classes.dex")]);

/* ---------------------------------------------------------------- signing */

const keystore = path.join(cacheDir, "spark-debug.p12");
const storePass = "sparkprototype";
if (!existsSync(keystore)) {
  console.log("creating a debug keystore…");
  run("keytool", [
    "-genkeypair", "-storetype", "PKCS12", "-keystore", keystore,
    "-storepass", storePass, "-keypass", storePass, "-alias", "spark",
    "-keyalg", "RSA", "-keysize", "2048", "-validity", "10000",
    "-dname", "CN=SPARK Prototype, OU=Prototype, O=SPARK, C=IN",
  ]);
}

console.log("signing…");
const signerClasses = path.join(cacheDir, "signer-classes");
mkdirSync(signerClasses, { recursive: true });
run("javac", [
  "-nowarn",
  "-classpath", apksigJar,
  "-d", signerClasses,
  path.join(androidDir, "tools", "ApkSign.java"),
]);
run("java", [
  // apksig 2.3.0 predates the module system and reaches into sun.security.*,
  // which a modern JDK hides unless it is explicitly exported.
  "--add-exports", "java.base/sun.security.x509=ALL-UNNAMED",
  "--add-exports", "java.base/sun.security.pkcs=ALL-UNNAMED",
  "-cp", `${apksigJar}:${signerClasses}`,
  "ApkSign",
  baseApk, outApk, keystore, storePass, "spark", String(MIN_SDK),
]);

console.log(`\n${outApk} — ${(statSync(outApk).size / 1024 / 1024).toFixed(2)} MB`);
