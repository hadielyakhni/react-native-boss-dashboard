package com.hadistop;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.devio.rn.splashscreen.SplashScreen;

public class NativeSplashScreenModule extends ReactContextBaseJavaModule {

    public NativeSplashScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);  //required by React Native
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "NativeSplashScreen";
    }

    @ReactMethod
    public void show() {
        SplashScreen.show(MainActivity.getInstance(), R.style.SplashScreenTheme);
    }
}