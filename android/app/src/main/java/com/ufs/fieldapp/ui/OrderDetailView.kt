package com.ufs.fieldapp.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.Done
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ufs.fieldapp.theme.*
import com.ufs.fieldapp.utils.VoiceGuidance
import android.graphics.Bitmap
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.launch
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.foundation.Image
import androidx.compose.ui.layout.ContentScale
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.compose.ui.platform.LocalContext
import android.widget.Toast

// ═══════════════════════════════════════════════════════════════════════
// OrderDetailView — Premium Work Order Execution Screen
// ═══════════════════════════════════════════════════════════════════════

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderDetailView(
    orderId: String,
    voice: VoiceGuidance?,
    onBack: () -> Unit
) {
    val context = LocalContext.current

    var photoBeforeBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var selectedTaskIndex by remember { mutableStateOf<Int?>(null) }
    var taskPhotosAfter by remember { mutableStateOf(mapOf<Int, Bitmap>()) }

    val cameraBeforeLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        if (bitmap != null) {
            photoBeforeBitmap = bitmap
            voice?.speak("Foto de inicio registrada. Seleccione una tarea para comenzar.")
        }
    }

    val cameraAfterLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        if (bitmap != null && selectedTaskIndex != null) {
            val taskIdx = selectedTaskIndex!!
            taskPhotosAfter = taskPhotosAfter + (taskIdx to bitmap)
            voice?.speak("Evidencia de tarea ${taskIdx + 1} registrada. Completada.")
            
            // Auto-select the next uncompleted task
            val totalTasks = 4
            val nextUncompleted = (0 until totalTasks).firstOrNull { it != taskIdx && !taskPhotosAfter.containsKey(it) }
            selectedTaskIndex = nextUncompleted
        }
    }

    val permissionBeforeLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            try {
                cameraBeforeLauncher.launch(null)
            } catch (e: Exception) {
                Toast.makeText(context, "Error de cámara: ${e.message}", Toast.LENGTH_LONG).show()
            }
        } else {
            voice?.speak("Permiso de cámara denegado.")
        }
    }

    val permissionAfterLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            try {
                cameraAfterLauncher.launch(null)
            } catch (e: Exception) {
                Toast.makeText(context, "Error de cámara: ${e.message}", Toast.LENGTH_LONG).show()
            }
        } else {
            voice?.speak("Permiso de cámara denegado.")
        }
    }

    val launchCameraBefore = {
        try {
            val permissionCheck = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
            if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
                cameraBeforeLauncher.launch(null)
            } else {
                permissionBeforeLauncher.launch(Manifest.permission.CAMERA)
            }
        } catch (e: Exception) {
            Toast.makeText(context, "Error al abrir la cámara: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    val launchCameraAfter = {
        try {
            val permissionCheck = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
            if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
                cameraAfterLauncher.launch(null)
            } else {
                permissionAfterLauncher.launch(Manifest.permission.CAMERA)
            }
        } catch (e: Exception) {
            Toast.makeText(context, "Error al abrir la cámara: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    val hasPhotoBefore = photoBeforeBitmap != null
    val totalTasks = 4
    val hasPhotoAfter = taskPhotosAfter.size == totalTasks
    val itemsChecked = taskPhotosAfter.keys
    var clientSignatureCaptured by remember { mutableStateOf(false) }
    var orderClosed by remember { mutableStateOf(false) }

    val checklist = remember {
        listOf(
            "Desinfección profunda de superficies de contacto",
            "Mantenimiento y limpieza de filtros de aire central",
            "Inspección de luminarias y reemplazo de focos",
            "Sanitización de pasillos de alto tránsito"
        )
    }

    val progress = remember(taskPhotosAfter, hasPhotoBefore, clientSignatureCaptured) {
        var p = 0f
        if (hasPhotoBefore) p += 0.15f
        p += (taskPhotosAfter.size.toFloat() / totalTasks) * 0.65f
        if (clientSignatureCaptured) p += 0.2f
        p.coerceIn(0f, 1f)
    }

    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(500),
        label = "progress"
    )

    val canClose = hasPhotoBefore && hasPhotoAfter && clientSignatureCaptured && !orderClosed

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgBase)
    ) {
        // Background ambient glow
        Canvas(modifier = Modifier.fillMaxSize()) {
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(GlowBlue, Color.Transparent),
                    center = Offset(size.width * 0.8f, size.height * 0.1f),
                    radius = size.width * 0.5f
                ),
                radius = size.width * 0.5f,
                center = Offset(size.width * 0.8f, size.height * 0.1f)
            )
        }

        Column(modifier = Modifier.fillMaxSize()) {
            // ── Custom App Bar ──────────────────────────
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(BgElevated, BgBase)
                        )
                    )
                    .drawBehind {
                        drawLine(
                            brush = Brush.horizontalGradient(GradientCyanBlue),
                            start = Offset(0f, size.height),
                            end = Offset(size.width, size.height),
                            strokeWidth = 1.5f
                        )
                    }
                    .padding(horizontal = 16.dp, vertical = 14.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(BgSurface)
                            .clickable { onBack() },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "Volver",
                            tint = NeonCyan,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "OT-2026-0104",
                            style = MaterialTheme.typography.titleMedium.copy(
                                color = TextPrimary,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            )
                        )
                        Text(
                            text = "EJECUCIÓN DE SERVICIO",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted
                            )
                        )
                    }
                    // Progress ring
                    Box(
                        modifier = Modifier.size(42.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val strokeW = 4f
                            val arcSize = size.minDimension - strokeW
                            drawArc(
                                color = CyberBorder,
                                startAngle = -90f,
                                sweepAngle = 360f,
                                useCenter = false,
                                topLeft = Offset(strokeW / 2, strokeW / 2),
                                size = Size(arcSize, arcSize),
                                style = Stroke(width = strokeW, cap = StrokeCap.Round)
                            )
                            drawArc(
                                brush = Brush.sweepGradient(GradientGreenCyan),
                                startAngle = -90f,
                                sweepAngle = 360f * animatedProgress,
                                useCenter = false,
                                topLeft = Offset(strokeW / 2, strokeW / 2),
                                size = Size(arcSize, arcSize),
                                style = Stroke(width = strokeW, cap = StrokeCap.Round)
                            )
                        }
                        Text(
                            text = "${(animatedProgress * 100).toInt()}%",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = NeonGreen,
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp
                            )
                        )
                    }
                }
            }

            // ── Content ─────────────────────────────────
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item { Spacer(modifier = Modifier.height(4.dp)) }

                // ── Service Info Card ────────────────────
                item {
                    GlassCard(
                        accentColor = NeonCyan
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "LIMPIEZA GENERAL Y PREVENTIVO",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = NeonCyan,
                                        letterSpacing = 1.sp
                                    )
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "Genpact Costa Rica",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        color = TextPrimary,
                                        fontWeight = FontWeight.Black
                                    )
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Zona Franca Cariari, Edificio C, Piso 3",
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = TextSecondary
                                    )
                                )
                            }
                            // SLA badge
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(NeonOrange.copy(alpha = 0.12f))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = "SLA",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            color = TextMuted
                                        )
                                    )
                                    Text(
                                        text = "2h",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            color = NeonOrange,
                                            fontWeight = FontWeight.Black
                                        )
                                    )
                                }
                            }
                        }
                    }
                }

                // ── Visual Evidence Grid ─────────────────
                item {
                    SectionHeader(title = "EVIDENCIA VISUAL", subtitle = "FOTOS ANTES Y DESPUÉS")
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        EvidenceCard(
                            modifier = Modifier.weight(1f),
                            label = "ANTES",
                            bitmap = photoBeforeBitmap,
                            icon = Icons.Filled.Info,
                            onClick = {
                                launchCameraBefore()
                            }
                        )
                        EvidenceCard(
                            modifier = Modifier.weight(1f),
                            label = if (selectedTaskIndex != null) "DESPUÉS T.${selectedTaskIndex!! + 1}" else "DESPUÉS",
                            bitmap = if (selectedTaskIndex != null) taskPhotosAfter[selectedTaskIndex!!] else null,
                            icon = Icons.Filled.Star,
                            onClick = {
                                if (!hasPhotoBefore) {
                                    voice?.speak("Debe capturar la foto de antes primero.")
                                    Toast.makeText(context, "Tome la foto de antes primero", Toast.LENGTH_SHORT).show()
                                } else if (selectedTaskIndex == null) {
                                    voice?.speak("Seleccione una tarea de la lista para capturar su foto final.")
                                    Toast.makeText(context, "Seleccione una tarea primero", Toast.LENGTH_SHORT).show()
                                } else {
                                    launchCameraAfter()
                                }
                            }
                        )
                    }
                }

                // ── Checklist ────────────────────────────
                item {
                    SectionHeader(
                        title = "VERIFICACIÓN OPERATIVA",
                        subtitle = "${itemsChecked.size}/$totalTasks COMPLETADAS"
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    // Progress bar
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(4.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(CyberBorder)
                    ) {
                        val taskProgress by animateFloatAsState(
                            targetValue = itemsChecked.size.toFloat() / totalTasks,
                            animationSpec = tween(400),
                            label = "taskProg"
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(taskProgress)
                                .clip(RoundedCornerShape(2.dp))
                                .background(
                                    Brush.horizontalGradient(GradientGreenCyan)
                                )
                        )
                    }
                }

                // Checklist items
                checklist.forEachIndexed { index, task ->
                    val isChecked = taskPhotosAfter.containsKey(index)
                    val isSelected = selectedTaskIndex == index
                    item {
                        ChecklistItem(
                            task = task,
                            index = index,
                            isChecked = isChecked,
                            isSelected = isSelected,
                            isEnabled = hasPhotoBefore,
                            onToggle = {
                                if (!hasPhotoBefore) {
                                    voice?.speak("Debe capturar la foto del estado inicial antes de comenzar.")
                                    Toast.makeText(context, "Tome la foto de antes para habilitar el checklist", Toast.LENGTH_SHORT).show()
                                } else {
                                    selectedTaskIndex = index
                                    if (isChecked) {
                                        voice?.speak("Tarea ${index + 1} seleccionada. Puede volver a capturar la foto de evidencia.")
                                    } else {
                                        voice?.speak("Tarea ${index + 1} seleccionada. Registre la foto de después para completarla.")
                                    }
                                }
                            }
                        )
                    }
                }

                // ── Digital Signature ────────────────────
                item {
                    SectionHeader(title = "FIRMA DIGITAL", subtitle = "APROBACIÓN DEL CLIENTE")
                    Spacer(modifier = Modifier.height(10.dp))
                    SignatureCard(
                        isSigned = clientSignatureCaptured,
                        isEnabled = hasPhotoAfter,
                        onClick = {
                            if (!hasPhotoAfter) {
                                voice?.speak("Debe capturar la foto final antes de firmar.")
                                Toast.makeText(context, "Tome la foto de después para habilitar la firma", Toast.LENGTH_SHORT).show()
                            } else {
                                clientSignatureCaptured = !clientSignatureCaptured
                                if (clientSignatureCaptured) voice?.speak("Firma de conformidad registrada.")
                            }
                        }
                    )
                }

                // ── Close Order Button ───────────────────
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    val buttonColor by animateColorAsState(
                        targetValue = when {
                            orderClosed -> NeonGreen
                            canClose -> UfsMediumBlue
                            else -> CyberBorder
                        },
                        animationSpec = tween(400),
                        label = "btnColor"
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .then(
                                if (canClose || orderClosed) {
                                    Modifier.background(
                                        Brush.horizontalGradient(
                                            if (orderClosed) GradientGreenCyan else GradientCyanBlue
                                        )
                                    )
                                } else {
                                    Modifier.background(BgElevated)
                                }
                            )
                            .then(
                                if (canClose) {
                                    Modifier.clickable {
                                        orderClosed = true
                                        voice?.speak("Sincronizando con base de datos. Orden cerrada exitosamente. Buen trabajo.")
                                    }
                                } else {
                                    Modifier
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Icon(
                                imageVector = if (orderClosed) Icons.Filled.CheckCircle else Icons.Filled.Lock,
                                contentDescription = null,
                                tint = if (canClose || orderClosed) TextPrimary else TextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                            Text(
                                text = if (orderClosed) "ORDEN CERRADA CON ÉXITO"
                                       else if (canClose) "CERRAR ORDEN DE TRABAJO"
                                       else "COMPLETE TODOS LOS PASOS",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    color = if (canClose || orderClosed) TextPrimary else TextMuted,
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 1.5.sp
                                )
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════

@Composable
private fun GlassCard(
    accentColor: Color = NeonCyan,
    content: @Composable ColumnScope.() -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(BgElevated, BgSurface.copy(alpha = 0.5f))
                )
            )
            .drawBehind {
                drawLine(
                    brush = Brush.horizontalGradient(
                        listOf(accentColor.copy(alpha = 0.6f), accentColor.copy(alpha = 0.1f))
                    ),
                    start = Offset(0f, 0f),
                    end = Offset(size.width, 0f),
                    strokeWidth = 2.5f
                )
            }
            .padding(16.dp)
    ) {
        Column(content = content)
    }
}

@Composable
private fun SectionHeader(title: String, subtitle: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Bottom
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.labelLarge.copy(
                color = TextPrimary,
                fontWeight = FontWeight.Black,
                letterSpacing = 2.sp
            )
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.labelSmall.copy(
                color = TextMuted
            )
        )
    }
}

@Composable
private fun EvidenceCard(
    modifier: Modifier = Modifier,
    label: String,
    bitmap: Bitmap?,
    icon: ImageVector,
    onClick: () -> Unit
) {
    val isCaptured = bitmap != null
    val bgColor by animateColorAsState(
        targetValue = if (isCaptured) NeonGreen.copy(alpha = 0.08f) else BgElevated,
        animationSpec = tween(400),
        label = "evBg"
    )
    val borderColor by animateColorAsState(
        targetValue = if (isCaptured) NeonGreen.copy(alpha = 0.4f) else CyberBorder,
        animationSpec = tween(400),
        label = "evBorder"
    )

    Box(
        modifier = modifier
            .height(110.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .drawBehind {
                drawRoundRect(
                    color = borderColor,
                    cornerRadius = CornerRadius(12.dp.toPx()),
                    style = Stroke(width = 1.5f)
                )
                if (isCaptured) {
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(GlowGreen, Color.Transparent),
                            center = Offset(size.width / 2f, size.height / 2f),
                            radius = size.width * 0.4f
                        ),
                        radius = size.width * 0.4f,
                        center = Offset(size.width / 2f, size.height / 2f)
                    )
                }
            }
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        if (bitmap != null) {
            Image(
                bitmap = bitmap.asImageBitmap(),
                contentDescription = label,
                modifier = Modifier
                    .fillMaxSize()
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.35f)),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        imageVector = Icons.Filled.CheckCircle,
                        contentDescription = null,
                        tint = NeonGreen,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "✓ $label OK",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = NeonGreen,
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }
        } else {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = TextMuted,
                    modifier = Modifier.size(28.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "CAPTURAR $label",
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = TextSecondary,
                        fontWeight = FontWeight.Bold
                    )
                )
            }
        }
    }
}

@Composable
private fun ChecklistItem(
    task: String,
    index: Int,
    isChecked: Boolean,
    isSelected: Boolean,
    isEnabled: Boolean,
    onToggle: () -> Unit
) {
    val bgColor by animateColorAsState(
        targetValue = when {
            isSelected -> NeonCyan.copy(alpha = 0.08f)
            isChecked -> NeonGreen.copy(alpha = 0.05f)
            else -> BgElevated
        },
        animationSpec = tween(300),
        label = "clBg$index"
    )
    val borderColor by animateColorAsState(
        targetValue = when {
            isSelected -> NeonCyan
            isChecked -> NeonGreen.copy(alpha = 0.3f)
            else -> Color.Transparent
        },
        animationSpec = tween(300),
        label = "clBorder$index"
    )
    val opacity by animateFloatAsState(
        targetValue = if (isEnabled) 1.0f else 0.4f,
        animationSpec = tween(300),
        label = "clAlpha$index"
    )

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(bgColor)
            .then(
                if (isSelected) {
                    Modifier.drawBehind {
                        drawRoundRect(
                            color = borderColor,
                            cornerRadius = CornerRadius(10.dp.toPx()),
                            style = Stroke(width = 2f)
                        )
                    }
                } else {
                    Modifier
                }
            )
            .graphicsLayer(alpha = opacity)
            .clickable { onToggle() }
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Custom checkbox
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(
                    when {
                        isChecked -> NeonGreen.copy(alpha = 0.2f)
                        isSelected -> NeonCyan.copy(alpha = 0.2f)
                        else -> BgSurface
                    }
                )
                .drawBehind {
                    drawRoundRect(
                        color = when {
                            isChecked -> NeonGreen
                            isSelected -> NeonCyan
                            else -> CyberBorder
                        },
                        cornerRadius = CornerRadius(6.dp.toPx()),
                        style = Stroke(width = 2f)
                    )
                },
            contentAlignment = Alignment.Center
        ) {
            if (isChecked) {
                Icon(
                    imageVector = Icons.Filled.Check,
                    contentDescription = null,
                    tint = NeonGreen,
                    modifier = Modifier.size(16.dp)
                )
            } else if (isSelected) {
                Canvas(modifier = Modifier.size(8.dp)) {
                    drawCircle(color = NeonCyan)
                }
            }
        }

        Spacer(modifier = Modifier.width(12.dp))

        Text(
            text = task,
            style = MaterialTheme.typography.bodyMedium.copy(
                color = when {
                    isSelected -> TextPrimary
                    isChecked -> TextSecondary
                    else -> TextPrimary
                },
                fontWeight = if (isChecked) FontWeight.Normal else FontWeight.Medium
            ),
            modifier = Modifier.weight(1f)
        )

        Text(
            text = when {
                isChecked -> "LISTO"
                isSelected -> "EN PROCESO"
                else -> ""
            },
            style = MaterialTheme.typography.labelSmall.copy(
                color = if (isChecked) NeonGreen else NeonCyan,
                fontWeight = FontWeight.Bold
            )
        )
    }
}

@Composable
private fun SignatureCard(
    isSigned: Boolean,
    isEnabled: Boolean,
    onClick: () -> Unit
) {
    val bgColor by animateColorAsState(
        targetValue = if (isSigned) NeonGreen.copy(alpha = 0.06f) else BgElevated,
        animationSpec = tween(400),
        label = "sigBg"
    )
    val opacity by animateFloatAsState(
        targetValue = if (isEnabled) 1.0f else 0.4f,
        animationSpec = tween(400),
        label = "sigAlpha"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(bgColor)
            .graphicsLayer(alpha = opacity)
            .drawBehind {
                drawRoundRect(
                    color = if (isSigned) NeonGreen.copy(alpha = 0.3f) else CyberBorder,
                    cornerRadius = CornerRadius(14.dp.toPx()),
                    style = Stroke(width = 1.5f)
                )
                if (isSigned) {
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(GlowGreen, Color.Transparent),
                            center = Offset(size.width / 2f, size.height / 2f),
                            radius = size.width * 0.3f
                        ),
                        radius = size.width * 0.3f,
                        center = Offset(size.width / 2f, size.height / 2f)
                    )
                }
            }
            .clickable { onClick() }
            .padding(20.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = if (isSigned) Icons.Filled.Done else Icons.Filled.Create,
                contentDescription = null,
                tint = if (isSigned) NeonGreen else TextMuted,
                modifier = Modifier.size(32.dp)
            )
            Text(
                text = if (isSigned) "FIRMA ELECTRÓNICA REGISTRADA" else "PRESIONE PARA CAPTURAR FIRMA",
                style = MaterialTheme.typography.labelLarge.copy(
                    color = if (isSigned) NeonGreen else TextSecondary,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            )
            if (!isSigned) {
                Text(
                    text = "El cliente debe firmar en la pantalla del dispositivo",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextMuted
                    )
                )
            }
        }
    }
}
