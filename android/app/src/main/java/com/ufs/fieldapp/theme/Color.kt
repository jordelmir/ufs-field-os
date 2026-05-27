package com.ufs.fieldapp.theme

import androidx.compose.ui.graphics.Color

// ═══════════════════════════════════════════════════════════════════════
// United Facility Services Costa Rica — Premium Futuristic Color System
// ═══════════════════════════════════════════════════════════════════════

// Brand Core
val UfsDarkBlue = Color(0xFF003087)
val UfsMediumBlue = Color(0xFF0056D2)
val UfsSkyBlue = Color(0xFF00A3E0)
val UfsDeepNavy = Color(0xFF020916)       // Ultra-dark base

// Background layers (depth system)
val BgBase = Color(0xFF020916)            // Deepest layer
val BgElevated = Color(0xFF0B1224)        // Cards level 1
val BgSurface = Color(0xFF111B33)         // Cards level 2
val BgOverlay = Color(0xFF182444)         // Hover / Active states

// Neon Semantics
val NeonCyan = Color(0xFF00D4FF)          // Primary accent glow
val NeonGreen = Color(0xFF00FF87)         // Success / Active
val NeonOrange = Color(0xFFFF9F00)        // Warning / SLA
val NeonRed = Color(0xFFFF3B30)           // Danger / Critical
val NeonPurple = Color(0xFF8B5CF6)        // AI / Special
val NeonAmber = Color(0xFFFFBB00)         // Highlight

// Legacy aliases
val CyberSurface = BgElevated
val CyberBorder = Color(0xFF1E2D52)

// Text hierarchy
val TextPrimary = Color(0xFFF0F2F5)
val TextSecondary = Color(0xFF7B8DB0)
val TextMuted = Color(0xFF4A5A7A)
val TextDark = Color(0xFF070C1E)

// Glow / Shadow colors (for canvas drawing)
val GlowCyan = Color(0x5500D4FF)
val GlowGreen = Color(0x4400FF87)
val GlowOrange = Color(0x44FF9F00)
val GlowRed = Color(0x44FF3B30)
val GlowBlue = Color(0x550056D2)

// Gradient presets
val GradientCyanBlue = listOf(NeonCyan, UfsMediumBlue)
val GradientGreenCyan = listOf(NeonGreen, NeonCyan)
val GradientOrangeRed = listOf(NeonOrange, NeonRed)
val GradientPurpleCyan = listOf(NeonPurple, NeonCyan)
val GradientCardBorder = listOf(
    Color(0xFF1E2D52),
    Color(0xFF0D1A35),
    Color(0xFF1E2D52)
)
