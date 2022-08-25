package com.merkasoft.capacitor.plugin.navigationbar;

import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.app.Activity;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.regex.Pattern;

@CapacitorPlugin(name = "NavigationBar")
public class NavigationBarPlugin extends Plugin {

    private NavigationBar implementation = new NavigationBar();

    @PluginMethod
    public void setColor(PluginCall call) {
        this.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    String color = call.getString("color");
                    Boolean darkButtons = call.getBoolean("darkButtons");

                    if(color == null || color.isEmpty()) {
                        color = "#FFFFFF";
                    }

                    if(!this.validateHexColor(color)) {
                        call.reject("Invalid Hexadecimal color");
                        return;
                    }

                    if(darkButtons == null) {
                        darkButtons = false;
                    }

                    Window window = getActivity().getWindow();
                    View decorView = window.getDecorView();

                    WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, decorView);
                    windowInsetsControllerCompat.setAppearanceLightNavigationBars(!darkButtons);
                    windowInsetsControllerCompat.setAppearanceLightStatusBars(!darkButtons);

                    window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
                    window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
                    window.setNavigationBarColor(Color.parseColor(color));
                    window.setStatusBarColor(Color.parseColor(color));

                    call.resolve();
                } else {
                    call.unavailable("Not available on Android API 20 or earlier.");
                }
            }

            /*
            * Support Hex values with alpha and without alpha
            * */
            private boolean validateHexColor(String color) {
                if (color == null || color.isEmpty()) {
                    return false;
                }

                Pattern hexPattern = Pattern.compile("^#([A-Fa-f0-9]{6})$|^#([A-Fa-f0-9]{8})$");
                return hexPattern.matcher(color).matches();
            }
        });
    }
}
