/**
 * Swarupa Panchang — Design System
 *
 * "Starlit Ocean" — Warm maritime dark theme.
 * Backgrounds: deep navy-slate from #25343F family
 * Text: warm cream from #FBF5DD / #EAEFEF
 * Primary accent: amber-gold (warm, not orange)
 * Secondary: muted teal-gray from #BFC9D1
 * Festival pop: vibrant #FF9B51 (from palette)
 */

// ─── Color Palette ───────────────────────────────────────────────────────────

export const Colors = {
  // Primary gradient (deep navy-slate backgrounds)
  background: {
    deepIndigo: '#0D1B25',      // deepest dark (was #0f0c29)
    navy: '#182B38',            // dark navy (was #302b63)
    purple: '#1C3040',          // mid navy (was #24243e)
    surface: '#182B38',         // surface level (was #1a1a3e)
    surfaceLight: '#253E50',    // lighter surface (was #2a2a5e)
    card: 'rgba(191, 201, 209, 0.07)',      // glass tint (was rgba white)
    cardBorder: 'rgba(191, 201, 209, 0.18)',
    solidCard: '#1A2D3C',       // solid card bg (was #1C1C23) — from #25343F lighter
    solidCardBorder: '#26404F', // solid card border (was #2C2C35)
  },

  // Accent colors — Starlit Ocean
  accent: {
    saffron: '#D4A843',         // warm amber-gold (was #ff6b35 orange) — today, primary
    gold: '#F0CE6A',            // bright warm gold (was #ffd700) — festivals, highlights
    teal: '#7BBBD0',            // muted teal-gray (was #00d2ff) — from #BFC9D1 saturated
    emerald: '#4DC9A8',         // teal-green (was #00e676) — auspicious
    rose: '#D97080',            // muted rose (was #ff4081) — alerts
    violet: '#7A9BBB',          // steel blue (was #7c4dff) — yoga, subtle
  },

  // Festival dot colors
  festival: {
    major: '#FF9B51',           // vibrant orange from ColorHunt palette — big festivals
    fast: '#F0CE6A',            // warm gold — ekadashi fasts
    auspicious: '#4DC9A8',      // teal-green — auspicious muhurtas
    national: '#7BBBD0',        // muted teal — national/civic
    swaminarayan: '#D4A843',    // amber gold — Swaminarayan events
  },

  // Text colors — warm cream tones
  text: {
    primary: '#E8E0CC',         // warm cream (was #ffffff) — from #FBF5DD
    secondary: 'rgba(234, 239, 239, 0.82)', // from #EAEFEF semi-transparent
    tertiary: 'rgba(191, 201, 209, 0.60)',  // from #BFC9D1 muted
    accent: '#F0CE6A',          // bright gold
    inverse: '#0D1B25',         // deep navy (dark on light)
  },

  // Status colors
  status: {
    success: '#4DC9A8',
    warning: '#D4A843',
    error: '#D97080',
    info: '#7BBBD0',
  },

  // Glassmorphism — navy-tinted
  glass: {
    background: 'rgba(191, 201, 209, 0.07)',
    backgroundHover: 'rgba(191, 201, 209, 0.13)',
    border: 'rgba(191, 201, 209, 0.20)',
    borderLight: 'rgba(191, 201, 209, 0.10)',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
} as const;

// ─── Gradients ───────────────────────────────────────────────────────────────

export const Gradients = {
  /** Main background gradient — deep navy */
  background: ['#0D1B25', '#182B38', '#1C3040'],
  /** Today card gradient — warm amber glow */
  todayCard: ['rgba(212, 168, 67, 0.18)', 'rgba(212, 168, 67, 0.05)'],
  /** Tomorrow card gradient — muted teal glow */
  tomorrowCard: ['rgba(123, 187, 208, 0.18)', 'rgba(123, 187, 208, 0.05)'],
  /** Festival highlight gradient — gold glow */
  festivalCard: ['rgba(240, 206, 106, 0.18)', 'rgba(240, 206, 106, 0.05)'],
  /** Header gradient */
  header: ['#1A2D3C', '#0D1B25'],
  /** Amber action gradient */
  saffronAction: ['#D4A843', '#E8C060'],
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const Typography = {
  // Font families (system fonts — no Google Fonts dependency for mobile)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;

// ─── Animation Durations ─────────────────────────────────────────────────────

export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
} as const;
