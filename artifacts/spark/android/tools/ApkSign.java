import com.android.apksig.ApkSigner;

import java.io.File;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Signs an APK with an APK Signature Scheme v2 signature.
 *
 * Android requires v2 for anything targeting API 30+, which `jarsigner` cannot
 * produce, so this wraps Google's apksig library instead. v1 (JAR) signing is
 * deliberately off: the only apksig build published outside Google's own Maven
 * repo is 2.3.0, whose v1 signer calls a JDK-internal PKCS7 method that no
 * longer exists. v2 alone is verified by Android 7.0 and newer, which is why
 * the app declares minSdkVersion 24.
 *
 * Usage: ApkSign <in.apk> <out.apk> <keystore.p12> <storepass> <alias> <minSdk>
 */
public final class ApkSign {

    public static void main(String[] args) throws Exception {
        if (args.length != 6) {
            System.err.println(
                    "usage: ApkSign <in.apk> <out.apk> <keystore.p12> <storepass> <alias> <minSdk>");
            System.exit(2);
        }

        File input = new File(args[0]);
        File output = new File(args[1]);
        char[] password = args[3].toCharArray();
        String alias = args[4];
        int minSdk = Integer.parseInt(args[5]);

        KeyStore keyStore = KeyStore.getInstance("PKCS12");
        try (java.io.FileInputStream in = new java.io.FileInputStream(args[2])) {
            keyStore.load(in, password);
        }

        PrivateKey key = (PrivateKey) keyStore.getKey(alias, password);
        if (key == null) throw new IllegalStateException("No private key for alias " + alias);

        List<X509Certificate> chain = new ArrayList<X509Certificate>();
        for (java.security.cert.Certificate certificate : keyStore.getCertificateChain(alias)) {
            chain.add((X509Certificate) certificate);
        }

        ApkSigner.SignerConfig signer =
                new ApkSigner.SignerConfig.Builder("spark", key, chain).build();

        new ApkSigner.Builder(Collections.singletonList(signer))
                .setInputApk(input)
                .setOutputApk(output)
                .setMinSdkVersion(minSdk)
                .setV1SigningEnabled(false)
                .setV2SigningEnabled(true)
                .build()
                .sign();

        System.out.println("signed " + output.getName());
    }
}
