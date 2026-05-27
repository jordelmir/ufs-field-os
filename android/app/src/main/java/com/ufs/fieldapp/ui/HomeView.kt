package com.ufs.fieldapp.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
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
    val timeDue: String,
    val serviceType: String
)

// ═══════════════════════════════════════════════════════════════════════
// HomeView — Premium HUD Dashboard for Field Operatives
// ═══════════════════════════════════════════════════════════════════════

@Composable
fun HomeView(
    voice: VoiceGuidance?,
    onNavigateToOrder: (String) -> Unit
) {
    var isShiftActive by remember { mutableStateOf(false) }
    val locationCoords = "9.9333° N, 84.0833° W"

    val orders = remember {
        listOf(
            WorkOrderDemo("1", "OT-2026-0104", "Genpact Costa Rica", "Plaza Real Cariari, Heredia", "ALTA", "14:00", "Limpieza General"),
            WorkOrderDemo("2", "OT-2026-0105", "Hospital CIMA Escazú", "Autopista Próspero Fernández", "CRÍTICO", "15:30", "Desinfección"),
            WorkOrderDemo("3", "OT-2026-0106", "Intel Belén", "San Antonio de Belén, Heredia", "MEDIA", "17:00", "Mantenimiento HVAC")
        )
    }

    // Pulsing animation for the check-in ring
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseRadius by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseRadius"
    )
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 0.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )
    val scanlineOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "scanline"
    )

    val glowColor by animateColorAsState(
        targetValue = if (isShiftActive) NeonGreen else NeonCyan,
        animationSpec = tween(durationMillis = 600),
        label = "GlowColor"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgBase)
    ) {
        // Background ambient glow orbs
        Canvas(modifier = Modifier.fillMaxSize()) {
            // Top-left cyan glow
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(GlowBlue, Color.Transparent),
                    center = Offset(size.width * 0.15f, size.height * 0.08f),
                    radius = size.width * 0.5f
                ),
                radius = size.width * 0.5f,
                center = Offset(size.width * 0.15f, size.height * 0.08f)
            )
            // Bottom-right accent glow
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        if (isShiftActive) GlowGreen else GlowCyan,
                        Color.Transparent
                    ),
                    center = Offset(size.width * 0.85f, size.height * 0.7f),
                    radius = size.width * 0.4f
                ),
                radius = size.width * 0.4f,
                center = Offset(size.width * 0.85f, size.height * 0.7f)
            )
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ── Header ──────────────────────────────────
            item {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "UFS FIELD OS",
                            style = MaterialTheme.typography.displayMedium.copy(
                                brush = Brush.horizontalGradient(GradientCyanBlue),
                                fontWeight = FontWeight.Black,
                                letterSpacing = 2.sp
                            )
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "SERVIMOS CON PASIÓN, POR EL BIENESTAR",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted,
                                letterSpacing = 2.sp
                            )
                        )
                    }

                    // Status pill
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(
                                if (isShiftActive) NeonGreen.copy(alpha = 0.12f)
                                else BgSurface
                            )
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .clip(CircleShape)
                                    .background(if (isShiftActive) NeonGreen else TextMuted)
                            )
                            Text(
                                text = if (isShiftActive) "EN TURNO" else "INACTIVO",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = if (isShiftActive) NeonGreen else TextMuted,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                }
            }

            // ── Stats Telemetry Bar ─────────────────────
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "OTS HOY",
                        value = "3",
                        accent = NeonCyan
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "COMPLETADAS",
                        value = "0",
                        accent = NeonGreen
                    )
                    StatCard(
                        modifier = Modifier.weight(1f),
                        label = "SLA RIESGO",
                        value = "1",
                        accent = NeonOrange
                    )
                }
            }

            // ── Check-in Card ───────────────────────────
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    BgElevated,
                                    BgSurface.copy(alpha = 0.6f)
                                )
                            )
                        )
                        .drawBehind {
                            // Top accent line
                            drawLine(
                                brush = Brush.horizontalGradient(
                                    if (isShiftActive) GradientGreenCyan else GradientCyanBlue
                                ),
                                start = Offset(0f, 0f),
                                end = Offset(size.width, 0f),
                                strokeWidth = 3f,
                                cap = StrokeCap.Round
                            )
                        }
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "CONTROL DE JORNADA EN CAMPO",
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = TextSecondary,
                                letterSpacing = 2.sp
                            )
                        )

                        Spacer(modifier = Modifier.height(20.dp))

                        // Pulsing Check-in Button with canvas glow rings
                        Box(
                            modifier = Modifier.size(160.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            // Outer pulsing glow rings
                            Canvas(modifier = Modifier.fillMaxSize()) {
                                val center = Offset(size.width / 2f, size.height / 2f)
                                val baseRadius = size.minDimension / 2f

                                // Ring 3 (outermost)
                                drawCircle(
                                    color = glowColor.copy(alpha = pulseAlpha * 0.3f),
                                    radius = baseRadius * pulseRadius * 1.05f,
                                    center = center,
                                    style = Stroke(width = 1.5f)
                                )
                                // Ring 2
                                drawCircle(
                                    color = glowColor.copy(alpha = pulseAlpha * 0.5f),
                                    radius = baseRadius * pulseRadius * 0.92f,
                                    center = center,
                                    style = Stroke(width = 2f)
                                )
                                // Ring 1 (inner glow)
                                drawCircle(
                                    color = glowColor.copy(alpha = pulseAlpha * 0.7f),
                                    radius = baseRadius * 0.82f,
                                    center = center,
                                    style = Stroke(width = 2.5f)
                                )
                                // Ambient glow fill
                                drawCircle(
                                    brush = Brush.radialGradient(
                                        colors = listOf(
                                            glowColor.copy(alpha = 0.08f),
                                            Color.Transparent
                                        ),
                                        center = center,
                                        radius = baseRadius
                                    ),
                                    radius = baseRadius,
                                    center = center
                                )
                            }

                            // Inner solid button
                            Box(
                                modifier = Modifier
                                    .size(120.dp)
                                    .clip(CircleShape)
                                    .background(
                                        Brush.radialGradient(
                                            colors = if (isShiftActive)
                                                listOf(
                                                    NeonGreen.copy(alpha = 0.25f),
                                                    BgSurface
                                                )
                                            else
                                                listOf(
                                                    UfsMediumBlue.copy(alpha = 0.3f),
                                                    BgElevated
                                                )
                                        )
                                    )
                                    .clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null
                                    ) {
                                        isShiftActive = !isShiftActive
                                        if (isShiftActive) {
                                            voice?.speak("Check-in exitoso. Geolocalización satelital activa. Su turno ha iniciado.")
                                        } else {
                                            voice?.speak("Check-out registrado. Fin de la jornada de trabajo.")
                                        }
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Icon(
                                        imageVector = if (isShiftActive) Icons.Filled.CheckCircle else Icons.Filled.LocationOn,
                                        contentDescription = null,
                                        tint = glowColor,
                                        modifier = Modifier.size(28.dp)
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = if (isShiftActive) "CHECK-OUT" else "CHECK-IN",
                                        style = MaterialTheme.typography.labelLarge.copy(
                                            color = TextPrimary,
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 2.sp
                                        )
                                    )
                                    Text(
                                        text = if (isShiftActive) "TURNO ACTIVO" else "GPS LISTO",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = glowColor.copy(alpha = 0.7f)
                                        )
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Telemetry footer
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            TelemetryItem(
                                label = "ÚLTIMA UBICACIÓN",
                                value = locationCoords,
                                valueColor = TextPrimary
                            )
                            TelemetryItem(
                                label = "TELEMETRÍA",
                                value = if (isShiftActive) "PRECISIÓN: 3m" else "SIN PING",
                                valueColor = if (isShiftActive) NeonGreen else NeonRed,
                                alignEnd = true
                            )
                        }
                    }
                }
            }

            // ── Section Header ──────────────────────────
            item {
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "ÓRDENES DE TRABAJO",
                            style = MaterialTheme.typography.labelLarge.copy(
                                color = TextPrimary,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 2.sp
                            )
                        )
                        Text(
                            text = "PROGRAMADAS PARA HOY",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted
                            )
                        )
                    }
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(NeonCyan.copy(alpha = 0.1f))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "${orders.size} ACTIVAS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = NeonCyan,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }

            // ── Order Cards ─────────────────────────────
            items(orders) { order ->
                OrderCard(
                    order = order,
                    onClick = { onNavigateToOrder(order.id) }
                )
            }

            // Bottom spacer
            item { Spacer(modifier = Modifier.height(24.dp)) }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    label: String,
    value: String,
    accent: Color
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(BgElevated)
            .drawBehind {
                drawLine(
                    color = accent.copy(alpha = 0.5f),
                    start = Offset(0f, 0f),
                    end = Offset(size.width, 0f),
                    strokeWidth = 2f
                )
            }
            .padding(12.dp)
    ) {
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall.copy(
                    color = TextMuted,
                    letterSpacing = 1.5.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.displayMedium.copy(
                    color = accent,
                    fontWeight = FontWeight.Black,
                    fontSize = 24.sp
                )
            )
        }
    }
}

@Composable
private fun TelemetryItem(
    label: String,
    value: String,
    valueColor: Color,
    alignEnd: Boolean = false
) {
    Column(
        horizontalAlignment = if (alignEnd) Alignment.End else Alignment.Start
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                color = TextMuted
            )
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium.copy(
                color = valueColor,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp
            )
        )
    }
}

@Composable
private fun OrderCard(
    order: WorkOrderDemo,
    onClick: () -> Unit
) {
    val priorityColor = when (order.priority) {
        "CRÍTICO" -> NeonRed
        "ALTA" -> NeonOrange
        else -> NeonCyan
    }
    val priorityGlow = when (order.priority) {
        "CRÍTICO" -> GlowRed
        "ALTA" -> GlowOrange
        else -> GlowCyan
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(
                Brush.horizontalGradient(
                    colors = listOf(
                        BgElevated,
                        BgSurface.copy(alpha = 0.5f)
                    )
                )
            )
            .drawBehind {
                // Left accent bar
                drawLine(
                    color = priorityColor,
                    start = Offset(0f, size.height * 0.15f),
                    end = Offset(0f, size.height * 0.85f),
                    strokeWidth = 6f,
                    cap = StrokeCap.Round
                )
                // Subtle left glow
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(priorityGlow, Color.Transparent),
                        center = Offset(0f, size.height / 2f),
                        radius = size.width * 0.15f
                    ),
                    radius = size.width * 0.15f,
                    center = Offset(0f, size.height / 2f)
                )
            }
            .clickable { onClick() }
            .padding(start = 16.dp, end = 14.dp, top = 14.dp, bottom = 14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Icon container
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(priorityColor.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when (order.priority) {
                        "CRÍTICO" -> Icons.Filled.Warning
                        "ALTA" -> Icons.Filled.Notifications
                        else -> Icons.Filled.Person
                    },
                    contentDescription = null,
                    tint = priorityColor,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = order.numero,
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = TextSecondary,
                            letterSpacing = 1.sp
                        )
                    )
                    // Priority badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(priorityColor.copy(alpha = 0.12f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = order.priority,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = priorityColor,
                                fontWeight = FontWeight.Black
                            )
                        )
                    }
                }
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = order.clientName,
                    style = MaterialTheme.typography.titleMedium.copy(
                        color = TextPrimary,
                        fontWeight = FontWeight.Bold
                    )
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = order.address,
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = TextSecondary,
                        fontSize = 11.sp
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            // Time due column
            Column(
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    text = order.timeDue,
                    style = MaterialTheme.typography.titleMedium.copy(
                        color = priorityColor,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp
                    )
                )
                Text(
                    text = "SLA",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextMuted
                    )
                )
            }
        }
    }
}
