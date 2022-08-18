package com.merkasoft.kit;

import android.content.res.Configuration;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  // Source: https://fellow.engineering/how-we-implemented-dark-mode-with-capacitor-d59b29e51b7d
  @Override
  public void onConfigurationChanged(Configuration configuration) {
    super.onConfigurationChanged(configuration);

    this.updateDarkMode(configuration);
  }

  private void updateDarkMode(Configuration configuration) {
    // read the new night mode value
    int currentNightMode = configuration.uiMode & Configuration.UI_MODE_NIGHT_MASK;
    switch (currentNightMode) {
      case Configuration.UI_MODE_NIGHT_NO:
        forceDarkMode(WebSettingsCompat.FORCE_DARK_AUTO);
        break;
      case Configuration.UI_MODE_NIGHT_YES:
        forceDarkMode(WebSettingsCompat.FORCE_DARK_ON);
        break;
    }
  }

  // Update webview theme
  private void forceDarkMode(int mode) {
    // This Dark Mode Strategy sets the css prefers-color-scheme property,
    // instead of trying to automatically convert pages. (Consistent with iOS)
    if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK_STRATEGY)) {
      WebSettingsCompat.setForceDarkStrategy(bridge.getWebView().getSettings(), WebSettingsCompat.DARK_STRATEGY_WEB_THEME_DARKENING_ONLY);
    }
    if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
      WebSettingsCompat.setForceDark(bridge.getWebView().getSettings(), mode);
    }
  }

  public void onResume() {
    super.onResume();
    updateDarkMode(getResources().getConfiguration());
  }
}
