// src/styles/theme.ts
export const theme = {
  // ===== BRAND COLORS =====
  colors: {
    // Primary Brand Colors
    primary: {
      saffron: '#F5CB5C',
      mint: '#D9FCFB',
      pink: '#FF96D7',
    },

    // Supporting Colors
    secondary: {
      amber: '#f59e0b',
      emerald: '#10b981',
      rose: '#f472b6',
      sky: '#3b82f6',
      coral: '#ef4444',
      violet: '#8b5cf6',
    },

    // Neutral Foundation
    neutral: {
      charcoal: '#374151',
      slate: '#6b7280',
      lightGray: '#f9fafb',
      white: '#ffffff',
      black: '#000000',
    },

    // Extended Palette for Gradients & Variations
    extended: {
      // Saffron variations
      saffron: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#F5CB5C', // Primary
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },

      // Mint variations
      mint: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#D9FCFB', // Primary (adjusted)
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },

      // Pink variations
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#FF96D7', // Primary
        600: '#ec4899',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },

      // Purple variations (for admin)
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },

      // Orange variations
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },

      // Gray variations
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
  },

  // ===== GRADIENTS =====
  gradients: {
    // Brand gradients
    saffron: 'linear-gradient(135deg, #F5CB5C 0%, #f59e0b 100%)',
    saffronText: 'linear-gradient(to right, #ea580c, #f59e0b, #ea580c)',
    mint: 'linear-gradient(135deg, #D9FCFB 0%, #10b981 100%)',
    pink: 'linear-gradient(135deg, #FF96D7 0%, #f472b6 100%)',
    purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',

    // Background gradients
    mainBg: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f0fdf4 100%)',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    
    // Accent gradients
    sunset: 'linear-gradient(45deg, #FF96D7 0%, #F5CB5C 50%, #D9FCFB 100%)',
    warm: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    cool: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',

    // Hover effects
    hover: {
      saffron: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
      mint: 'linear-gradient(135deg, #86efac 0%, #059669 100%)',
      pink: 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
      purple: 'linear-gradient(135deg, #c084fc 0%, #6d28d9 100%)',
    },
  },

  // ===== SHADOWS =====
  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
    md: '0 4px 15px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 25px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 50px rgba(0, 0, 0, 0.2)',
    
    // Colored shadows
    saffron: '0 8px 25px rgba(245, 203, 92, 0.3)',
    mint: '0 8px 25px rgba(217, 252, 251, 0.4)',
    pink: '0 8px 25px rgba(255, 150, 215, 0.3)',
    purple: '0 8px 25px rgba(139, 92, 246, 0.3)',
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Inter', 'system-ui'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },

    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // ===== SPACING =====
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ===== ANIMATIONS =====
  animations: {
    transition: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },

    keyframes: {
      fadeIn: {
        from: { opacity: '0', transform: 'translateY(10px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      slideIn: {
        from: { opacity: '0', transform: 'translateX(-20px)' },
        to: { opacity: '1', transform: 'translateX(0)' },
      },
      bounce: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.7' },
      },
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ===== COMPONENT STYLES =====
export const componentStyles = {
  // Button variants
  button: {
    base: `
      inline-flex items-center justify-center px-6 py-3 
      font-semibold rounded-xl transition-all duration-300 
      transform hover:scale-105 focus:outline-none focus:ring-2 
      focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    `,
    
    variants: {
      primary: `
        bg-gradient-to-r from-yellow-400 to-orange-400 
        hover:from-yellow-500 hover:to-orange-500 
        text-orange-900 shadow-lg hover:shadow-xl
        focus:ring-yellow-500
      `,
      
      secondary: `
        bg-gradient-to-r from-cyan-50 to-cyan-100 
        hover:from-cyan-100 hover:to-cyan-200 
        text-cyan-700 border border-cyan-200 
        hover:border-cyan-300 focus:ring-cyan-500
      `,
      
      accent: `
        bg-gradient-to-r from-pink-400 to-pink-500 
        hover:from-pink-500 hover:to-pink-600 
        text-white shadow-lg hover:shadow-xl
        focus:ring-pink-500
      `,
      
      admin: `
        bg-gradient-to-r from-purple-500 to-purple-600 
        hover:from-purple-600 hover:to-purple-700 
        text-white shadow-lg hover:shadow-xl
        focus:ring-purple-500
      `,
      
      outline: `
        bg-white hover:bg-gray-50 text-gray-700 
        border-2 border-gray-200 hover:border-gray-300
        focus:ring-gray-500
      `,
      
      ghost: `
        bg-transparent hover:bg-gray-100 text-gray-700 
        focus:ring-gray-500
      `,
    },

    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
  },

  // Card styles
  card: {
    base: `
      bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg 
      border border-white/50 transition-all duration-300
    `,
    
    variants: {
      default: 'hover:shadow-xl hover:-translate-y-1',
      interactive: 'hover:shadow-xl hover:scale-105 cursor-pointer',
      flat: 'shadow-sm hover:shadow-md',
    },
  },

  // Input styles
  input: {
    base: `
      w-full px-4 py-3 rounded-xl border border-gray-200 
      focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 
      transition-colors duration-200 bg-white/90 backdrop-blur-sm
    `,
    
    variants: {
      default: 'placeholder-gray-400 text-gray-700',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-500/20',
    },
  },

  // Status badge styles
  badge: {
    base: 'px-3 py-1 rounded-full text-sm font-semibold',
    
    variants: {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
    },
  },
};

// ===== UTILITY FUNCTIONS =====
export const themeUtils = {
  // Get color with opacity
  colorWithOpacity: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },

  // Generate CSS custom properties
  generateCSSCustomProperties: () => {
    const cssVars: Record<string, string> = {};
    
    // Colors
    Object.entries(theme.colors.extended).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    });
    
    // Primary colors
    Object.entries(theme.colors.primary).forEach(([name, value]) => {
      cssVars[`--color-${name}`] = value;
    });
    
    return cssVars;
  },

  // Media query helper
  media: {
    sm: (styles: string) => `@media (min-width: ${theme.breakpoints.sm}) { ${styles} }`,
    md: (styles: string) => `@media (min-width: ${theme.breakpoints.md}) { ${styles} }`,
    lg: (styles: string) => `@media (min-width: ${theme.breakpoints.lg}) { ${styles} }`,
    xl: (styles: string) => `@media (min-width: ${theme.breakpoints.xl}) { ${styles} }`,
  },
};

// ===== SEMANTIC COLORS =====
export const semanticColors = {
  // User interface
  text: {
    primary: theme.colors.neutral.charcoal,
    secondary: theme.colors.neutral.slate,
    muted: theme.colors.extended.gray[400],
    inverse: theme.colors.neutral.white,
  },

  // Backgrounds
  background: {
    primary: theme.colors.neutral.white,
    secondary: theme.colors.neutral.lightGray,
    gradient: theme.gradients.mainBg,
  },

  // Status colors
  status: {
    success: theme.colors.secondary.emerald,
    warning: theme.colors.secondary.amber,
    error: theme.colors.secondary.coral,
    info: theme.colors.secondary.sky,
  },

  // Role-based colors
  roles: {
    user: theme.colors.primary.saffron,
    admin: theme.colors.secondary.violet,
    business: theme.colors.secondary.violet,
  },

  // Business states
  business: {
    open: theme.colors.secondary.emerald,
    closed: theme.colors.secondary.coral,
    preparing: theme.colors.secondary.amber,
    delivered: theme.colors.secondary.emerald,
  },
};

export default theme;