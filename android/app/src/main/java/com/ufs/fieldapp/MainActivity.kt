package com.ufs.fieldapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.ufs.fieldapp.theme.UfsFieldTheme
import com.ufs.fieldapp.ui.HomeView
import com.ufs.fieldapp.ui.OrderDetailView
import com.ufs.fieldapp.utils.VoiceGuidance

class MainActivity : ComponentActivity() {
    private var voiceGuidance: VoiceGuidance? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize the premium voice feedback engine
        voiceGuidance = VoiceGuidance(this)

        setContent {
            UfsFieldTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    var currentScreen by remember { mutableStateOf("home") }
                    var selectedOrderId by remember { mutableStateOf("") }

                    when (currentScreen) {
                        "home" -> {
                            HomeView(
                                voice = voiceGuidance,
                                onNavigateToOrder = { id ->
                                    selectedOrderId = id
                                    currentScreen = "detail"
                                    voiceGuidance?.speak("Abriendo detalle de órden número $id")
                                }
                            )
                        }
                        "detail" -> {
                            OrderDetailView(
                                orderId = selectedOrderId,
                                voice = voiceGuidance,
                                onBack = {
                                    currentScreen = "home"
                                }
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        // Shutdown text-to-speech to prevent resource leaks
        voiceGuidance?.shutdown()
        super.onDestroy()
    }
}
