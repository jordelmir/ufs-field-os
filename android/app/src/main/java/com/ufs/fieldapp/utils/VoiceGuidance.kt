package com.ufs.fieldapp.utils

import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

class VoiceGuidance(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var isInitialized = false

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale("es", "CR"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // Fallback to general Spanish if Costa Rican locale is missing
                tts?.setLanguage(Locale("es"))
            }
            isInitialized = true
            speak("UFS Field O S iniciado. Sistema operacional en línea.")
        } else {
            Log.e("VoiceGuidance", "Error initializing TextToSpeech engine.")
        }
    }

    fun speak(text: String) {
        if (isInitialized) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "UfsFieldMsgId")
        } else {
            Log.w("VoiceGuidance", "TTS not initialized yet. Queued message: $text")
        }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
    }
}
