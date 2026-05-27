package com.ufs.fieldapp.ui

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ufs.fieldapp.theme.*
import com.ufs.fieldapp.utils.VoiceGuidance

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderDetailView(
    orderId: String,
    voice: VoiceGuidance?,
    onBack: () -> Unit
) {
    var hasPhotoBefore by remember { mutableStateOf(false) }
    var hasPhotoAfter by remember { mutableStateOf(false) }
    var itemsChecked by remember { mutableStateOf(setOf<Int>()) }
    var clientSignatureCaptured by remember { mutableStateOf(false) }
    var orderClosed by remember { mutableStateOf(false) }

    val totalTasks = 4
    val checklist = remember {
        listOf(
            "Desinfección profunda de superficies de contacto",
            "Mantenimiento y limpieza de filtros de aire central",
            "Inspección de luminarias y reemplazo de focos en oficinas",
            "Sanitización de pasillos de alto tránsito"
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(UfsDeepNavy)
    ) {
        // App Bar with dark futuristic styling
        TopAppBar(
            title = {
                Text(
                    text = "Orden de Trabajo #0104",
                    style = MaterialTheme.typography.titleLarge.copy(
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    )
                )
            },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Volver",
                        tint = UfsSkyBlue
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = CyberSurface
            )
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Service & Client overview card
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = CyberSurface),
                    border = BorderStroke(1.dp, CyberBorder),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "LIMPIEZA GENERAL Y PREVENTIVO",
                                color = UfsSkyBlue,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                            Text(
                                text = "SLA: 2h",
                                color = NeonOrange,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Genpact Costa Rica",
                            style = MaterialTheme.typography.titleLarge.copy(color = TextPrimary)
                        )
                        Text(
                            text = "Zona Franca Cariari, Edificio C, Piso 3",
                            style = MaterialTheme.typography.bodyMedium.copy(color = TextSecondary)
                        )
                    }
                }
            }

            // Visual Evidence Grid: BEFORE and AFTER photos
            item {
                Text(
                    text = "Evidencia Visual del Servicio",
                    color = UfsSkyBlue,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // BEFORE PHOTO CARD
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(100.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (hasPhotoBefore) UfsDarkBlue.copy(alpha = 0.4f) else CyberSurface)
                            .border(1.dp, if (hasPhotoBefore) NeonGreen else CyberBorder, RoundedCornerShape(8.dp))
                            .clickable {
                                hasPhotoBefore = !hasPhotoBefore
                                if (hasPhotoBefore) {
                                    voice?.speak("Foto del estado inicial registrada.")
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (hasPhotoBefore) "✓ ANTES CAPTURADO" else "CÁMARA: ANTES",
                                color = if (hasPhotoBefore) NeonGreen else TextSecondary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                        }
                    }

                    // AFTER PHOTO CARD
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(100.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (hasPhotoAfter) UfsMediumBlue.copy(alpha = 0.4f) else CyberSurface)
                            .border(1.dp, if (hasPhotoAfter) NeonGreen else CyberBorder, RoundedCornerShape(8.dp))
                            .clickable {
                                hasPhotoAfter = !hasPhotoAfter
                                if (hasPhotoAfter) {
                                    voice?.speak("Foto del trabajo terminado registrada.")
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (hasPhotoAfter) "✓ DESPUÉS CAPTURADO" else "CÁMARA: DESPUÉS",
                                color = if (hasPhotoAfter) NeonGreen else TextSecondary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }

            // Operations Tasks Checklist
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Lista de Verificación Operativa",
                        color = UfsSkyBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = "${itemsChecked.size}/$totalTasks",
                        color = NeonGreen,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    checklist.forEachIndexed { index, task ->
                        val isChecked = itemsChecked.contains(index)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(CyberSurface)
                                .clickable {
                                    if (isChecked) {
                                        itemsChecked = itemsChecked - index
                                    } else {
                                        itemsChecked = itemsChecked + index
                                        voice?.speak("Tarea ${index + 1} completada.")
                                    }
                                }
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = isChecked,
                                onCheckedChange = { checked ->
                                    if (checked) {
                                        itemsChecked = itemsChecked + index
                                        voice?.speak("Tarea ${index + 1} completada.")
                                    } else {
                                        itemsChecked = itemsChecked - index
                                    }
                                },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = NeonGreen,
                                    uncheckedColor = CyberBorder
                                )
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = task,
                                fontSize = 12.sp,
                                color = if (isChecked) TextSecondary else TextPrimary,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }
            }

            // Client Digital Signature panel
            item {
                Text(
                    text = "Aprobación y Firma de Conformidad",
                    color = UfsSkyBlue,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = CyberSurface),
                    border = BorderStroke(1.dp, if (clientSignatureCaptured) NeonGreen else CyberBorder),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .clickable {
                                clientSignatureCaptured = !clientSignatureCaptured
                                if (clientSignatureCaptured) {
                                    voice?.speak("Firma de conformidad registrada.")
                                }
                            }
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(UfsDeepNavy)
                                .border(1.dp, CyberBorder, RoundedCornerShape(6.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            if (clientSignatureCaptured) {
                                Text(
                                    "🖊️ FIRMA ELECTRÓNICA REGISTRADA",
                                    color = NeonGreen,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            } else {
                                Text(
                                    "PRESIONE AQUÍ PARA FIRMAR",
                                    color = TextSecondary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }

            // Closure Submit button
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = {
                        orderClosed = true
                        voice?.speak("Sincronizando con base de datos. Órden cerrada exitosamente. Buen trabajo.")
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (orderClosed) NeonGreen else UfsMediumBlue,
                        disabledContainerColor = Color.DarkGray
                    ),
                    enabled = hasPhotoBefore && hasPhotoAfter && itemsChecked.size == totalTasks && clientSignatureCaptured && !orderClosed
                ) {
                    Text(
                        text = if (orderClosed) "✓ ORDEN TOTALMENTE CERRADA" else "CERRAR ORDEN DE TRABAJO",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = TextPrimary
                    )
                }
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
