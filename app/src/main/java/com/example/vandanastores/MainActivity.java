package com.example.vandanastores;

import androidx.appcompat.app.AppCompatActivity;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.graphics.BlurMaskFilter;
import android.os.Bundle;
import android.view.animation.Animation;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {

    private ImageView imgview;
    long animationtime  =  1000;
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        imgview  = findViewById(R.id.imageview);
        imgview.isOpaque();
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                Intent intent  =  new Intent(MainActivity.this,startuppage.class);
                startActivity(intent);
            }
        },1000);




    }
}
