package com.example.vandanastores;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class login extends AppCompatActivity {

    Button btnlogin;
    EditText etepassword;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        btnlogin = findViewById(R.id.btnlogin);

        etepassword  =  (EditText)findViewById(R.id.etpassword);


        btnlogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                final String password  = etepassword.getText().toString().trim();
                final String ab   =  "abhishek123456";
                if (password.equals(ab))
                {
                    Intent i = new Intent(login.this, welcome.class);
                    startActivity(i);
                    Toast.makeText(login.this, "Successfully logged in", Toast.LENGTH_SHORT).show();
                }

                else
                {
                    Toast.makeText(login.this, "Enter the correct password", Toast.LENGTH_SHORT).show();
                }

            }
        });

    }
}
