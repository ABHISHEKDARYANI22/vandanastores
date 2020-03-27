package com.example.vandanastores.ui.ADDSTOCK;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.AppLaunchChecker;
import androidx.fragment.app.Fragment;
import androidx.appcompat.app.AppCompatActivity;

import com.example.vandanastores.R;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

public class AddStockFragment extends Fragment {


    Button btnscanimei;
    EditText etimei;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {


        View v = inflater.inflate(R.layout.fragment_addstock, container, false);
        btnscanimei = (Button) v.findViewById(R.id.btnscanimei);
        etimei = v.findViewById(R.id.etimei);
        btnscanimei.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.CAMERA}, PackageManager.PERMISSION_GRANTED);
                IntentIntegrator intentIntegrator = new IntentIntegrator(getActivity());
                intentIntegrator.setBeepEnabled(true);
                intentIntegrator.initiateScan();


            }
        });


        return v;
    }



    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);



        IntentResult intentResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        Toast.makeText(getActivity(), "hello h i", Toast.LENGTH_SHORT).show();
        if (intentResult != null) {
            if (intentResult.getContents() == null) {
                etimei.setText("Cancelled");
            } else {

                etimei.setText(intentResult.getContents());
            }
        }

        Log.d("testbarcode", " result "+intentResult.getContents());
    }

}