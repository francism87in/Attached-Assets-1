package com.spark.prototype;

import android.app.Activity;
import android.graphics.Insets;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * The SPARK prototype runs entirely inside the APK: the whole app — markup,
 * styles, script and fonts — is a single asset file, so the WebView never
 * touches the network and the app works offline.
 */
public class MainActivity extends Activity {

    // The installed app opens on the app's own home screen, not the marketing
    // site; routing is hash-based so the whole app is one asset file.
    private static final String ENTRY = "file:///android_asset/www/index.html#/app";

    private WebView web;

    @Override
    protected void onCreate(Bundle savedState) {
        super.onCreate(savedState);

        web = new WebView(this);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        // The prototype keeps bookings and city preferences in localStorage.
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        // Honour the app's own responsive layout rather than desktop-width scaling.
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // Keep every navigation inside the WebView — routing is client-side.
        web.setWebViewClient(new WebViewClient());
        web.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        // Targeting API 35 makes the window edge-to-edge on Android 15, so the
        // page would otherwise run under the status and navigation bars.
        web.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View view, WindowInsets insets) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    applyBarInsets(view, insets);
                } else {
                    view.setPadding(
                            insets.getSystemWindowInsetLeft(),
                            insets.getSystemWindowInsetTop(),
                            insets.getSystemWindowInsetRight(),
                            insets.getSystemWindowInsetBottom());
                }
                return insets;
            }
        });

        setContentView(web);

        if (savedState == null) {
            web.loadUrl(ENTRY);
        } else {
            web.restoreState(savedState);
        }
    }

    /**
     * Kept in its own method so devices below API 30 never verify a body that
     * references {@link WindowInsets.Type}.
     */
    private static void applyBarInsets(View view, WindowInsets insets) {
        Insets bars =
                insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
        view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    /**
     * Back steps through the in-app history first. Handled via onKeyDown rather
     * than onBackPressed so the same code path works on API 21 through 35.
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && web.canGoBack()) {
            web.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            web.clearHistory();
        }
        web.destroy();
        super.onDestroy();
    }
}
