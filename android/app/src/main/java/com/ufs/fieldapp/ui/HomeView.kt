package com.ufs.fieldapp.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ufs.fieldapp.theme.*
import com.ufs.fieldapp.utils.VoiceGuidance

data class WorkOrderDemo(
    val id: String,
    val numero: String,
    val clientName: String,
    val address: String,
    val priority: String,
    val timeDue: String
)

@Composable
fun HomeView(
    voice: VoiceGuidance?,
    onNavigateToOrder: (String) -> Unit
) {
    var isShiftActive by remember { mutableStateOf(false) }
    var locationCoords by remember { mutableStateOf("9.9333° N, 84.0833° W") }
    
    val orders = remember {
        listOf(
            WorkOrderDemo("1", "OT-2026-0104", "Genpact Costa Rica", "Plaza Real Cariari, Heredia", "ALTA", "14:00"),
            WorkOrderDemo("2", "OT-2026-0105", "Hospital CIMA Escazú", "Autopista Próspero Fernández", "CRÍTICO", "15:30"),
            WorkOrderDemo("3", "OT-2026-0106", "Intel Belén", "San Antonio de Belén, Heredia", "MEDIA", "17:00")
        )
    }

    val glowColor by animateColorAsState(
        targetValue = if (isShiftActive) NeonGreen else CyberBorder,
        animationSpec = tween(durationMillis = 500),
        label = "GlowAnimation"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(UfsDeepNavy)
            .padding(16.dp)
    ) {
        // App header with branding
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "UFS FIELD OS",
                    style = MaterialTheme.typography.displayMedium.copy(
                        color = UfsSkyBlue,
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp
                    )
                )
                Text(
                    text = "Servimos con pasión, por el bienestar",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                )
            }
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(if (isShiftActive) NeonGreen.copy(alpha = 0.2f) else Color.DarkGray)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (isShiftActive) "EN TURNO" else "INACTIVO",
                    color = if (isShiftActive) NeonGreen else Color.LightGray,
                    fontWeight = FontWeight.Bold,
                    fontSize = 10.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Futuristic biometric check-in card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CyberSurface),
            border = BorderStroke(1.dp, glowColor),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Control de Jornada en Campo",
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                
                // Glowing radar-like check-in button
                Button(
                    onClick = {
                        isShiftActive = !isShiftActive
                        if (isShiftActive) {
                            voice?.speak("Check-in exitoso. Geolocalización satelital activa. Su turno ha iniciado.")
                        } else {
                            voice?.speak("Check-out registrado. Fin de la jornada de trabajo.")
                        }
                    },
                    modifier = Modifier.size(130.dp),
                    shape = RoundedCornerShape(65.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isShiftActive) UfsMediumBlue else UfsDarkBlue
                    ),
                    border = BorderStroke(3.dp, glowColor)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = if (isShiftActive) "CHECK-OUT" else "CHECK-IN",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 14.sp,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "GPS ACTIVO",
                            fontSize = 9.sp,
                            color = if (isShiftActive) NeonGreen else TextSecondary
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("ÚLTIMA UBICACIÓN", fontSize = 10.sp, color = TextSecondary)
                        Text(locationCoords, fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("TELEMETRÍA", fontSize = 10.sp, color = TextSecondary)
                        Text(if (isShiftActive) "PRECISIÓN: 3m" else "SIN PING", fontSize = 12.sp, color = if (isShiftActive) NeonGreen else NeonRed, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Órdenes de Trabajo para Hoy",
            color = UfsSkyBlue,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))

        // High-density tasks scroll list
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxHeight().weight(1f)
        ) {
            items(orders) { order ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(CyberSurface)
                        .clickable { onNavigateToOrder(order.id) }
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Side priority indicator
                    Box(
                        modifier = Modifier
                            .width(4.dp)
                            .height(40.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(
                                when (order.priority) {
                                    "CRÍTICO" -> NeonRed
                                    "ALTA" -> NeonOrange
                                    else -> UfsSkyBlue
                                }
                            )
                    )
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = order.numero,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = order.timeDue,
                                fontSize = 11.sp,
                                color = NeonOrange,
                                fontWeight = FontWeight.Medium
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = order.clientName,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = order.address,
                            fontSize = 11.sp,
                            color = TextSecondary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}
