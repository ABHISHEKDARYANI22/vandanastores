package com.example.vandanastores;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class startuppage extends AppCompatActivity {


    Button btnlogin,btnsell;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_startuppage);
        btnlogin = (Button) findViewById(R.id.btnlogin);
        btnsell = (Button) findViewById(R.id.btnsell);


        btnlogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
               Intent intent =  new Intent(startuppage.this,login.class);
               startActivity(intent);
            }
        });

       btnsell.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Intent intent  =  new Intent(startuppage.this,sellstock.class);
                startActivity(intent);
            }
        });
    }
}
