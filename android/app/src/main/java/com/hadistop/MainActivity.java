package com.hadistop;

import com.reactnativenavigation.NavigationActivity;
import org.devio.rn.splashscreen.SplashScreen;

import android.content.pm.ActivityInfo;
import android.os.Bundle;

public class MainActivity extends NavigationActivity {

    private static MainActivity instance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SplashScreen.show(this, R.style.SplashScreenTheme);
        instance = this;
    }

    public static MainActivity getInstance() {
        return instance;
    }

}
