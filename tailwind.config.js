/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
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
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#D9FCFB', // Primary (custom mint)
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'persian-pink': {
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
        
        // Supporting Colors (using existing Tailwind colors)
        // amber, emerald, rose, sky, red, violet are already in Tailwind
        
        // Business Status Colors
        'business-open': '#10b981',    // emerald-500
        'business-closed': '#ef4444',  // red-500
        'business-preparing': '#f59e0b', // amber-500
      },
      
      backgroundImage: {
        // Brand Gradients
        'gradient-saffron': 'linear-gradient(135deg, #F5CB5C 0%, #f59e0b 100%)',
        'gradient-mint': 'linear-gradient(135deg, #D9FCFB 0%, #10b981 100%)',
        'gradient-pink': 'linear-gradient(135deg, #FF96D7 0%, #f472b6 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        
        // Background Gradients
        'gradient-main': 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f0fdf4 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        
        // Accent Gradients
        'gradient-sunset': 'linear-gradient(45deg, #FF96D7 0%, #F5CB5C 50%, #D9FCFB 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
        'gradient-cool': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        
        // Hover Gradients
        'gradient-saffron-hover': 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
        'gradient-mint-hover': 'linear-gradient(135deg, #86efac 0%, #059669 100%)',
        'gradient-pink-hover': 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)',
        'gradient-purple-hover': 'linear-gradient(135deg, #c084fc 0%, #6d28d9 100%)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      
      boxShadow: {
        'brand-sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'brand-md': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'brand-lg': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'brand-xl': '0 20px 50px rgba(0, 0, 0, 0.2)',
        
        // Colored Shadows
        'saffron': '0 8px 25px rgba(245, 203, 92, 0.3)',
        'mint': '0 8px 25px rgba(217, 252, 251, 0.4)',
        'pink': '0 8px 25px rgba(255, 150, 215, 0.3)',
        'purple': '0 8px 25px rgba(139, 92, 246, 0.3)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};