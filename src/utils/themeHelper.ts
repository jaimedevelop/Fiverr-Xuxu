// src/utils/themeHelper.ts
import { theme, componentStyles } from '../styles/theme';

/**
 * Theme Helper Utility
 * Makes it easy to migrate components to use the central theme
 */
export class ThemeHelper {
  // ===== QUICK COLOR GETTERS =====
  static get colors() {
    return {
      // Primary brand colors
      saffron: theme.colors.primary.saffron,
      mint: theme.colors.primary.mint,
      pink: theme.colors.primary.pink,
      
      // Role-based colors
      user: theme.colors.primary.saffron,
      admin: theme.colors.secondary.violet,
      business: theme.colors.secondary.violet,
      
      // Status colors
      success: theme.colors.secondary.emerald,
      warning: theme.colors.secondary.amber,
      error: theme.colors.secondary.coral,
      info: theme.colors.secondary.sky,
      
      // Business states
      open: theme.colors.secondary.emerald,
      closed: theme.colors.secondary.coral,
      preparing: theme.colors.secondary.amber,
      delivered: theme.colors.secondary.emerald,
      
      // Text colors (semantic naming)
      charcoal: theme.colors.neutral.charcoal,
      slate: theme.colors.neutral.slate,
      textPrimary: theme.colors.neutral.charcoal,
      textSecondary: theme.colors.neutral.slate,
      textMuted: theme.colors.extended.gray[400],
    };
  }
  
  // ===== QUICK GRADIENT GETTERS =====
  static get gradients() {
    return {
      saffron: theme.gradients.saffron,
      mint: theme.gradients.mint,
      pink: theme.gradients.pink,
      purple: theme.gradients.purple,
      mainBg: theme.gradients.mainBg,
      cardBg: theme.gradients.cardBg,
      sunset: theme.gradients.sunset,
      warm: theme.gradients.warm,
      cool: theme.gradients.cool,
    };
  }
  
  // ===== COMPONENT CLASS BUILDERS =====
  static button(variant: 'primary' | 'secondary' | 'accent' | 'admin' | 'outline' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') {
    const baseClasses = componentStyles.button.base.replace(/\s+/g, ' ').trim();
    const variantClasses = componentStyles.button.variants[variant].replace(/\s+/g, ' ').trim();
    const sizeClasses = componentStyles.button.sizes[size];
    
    return `${baseClasses} ${variantClasses} ${sizeClasses}`;
  }
  
  static card(variant: 'default' | 'interactive' | 'flat' = 'default') {
    const baseClasses = componentStyles.card.base.replace(/\s+/g, ' ').trim();
    const variantClasses = componentStyles.card.variants[variant].replace(/\s+/g, ' ').trim();
    
    return `${baseClasses} ${variantClasses}`;
  }
  
  static input(variant: 'default' | 'error' | 'success' = 'default') {
    const baseClasses = componentStyles.input.base.replace(/\s+/g, ' ').trim();
    const variantClasses = componentStyles.input.variants[variant].replace(/\s+/g, ' ').trim();
    
    return `${baseClasses} ${variantClasses}`;
  }
  
  static badge(variant: 'success' | 'warning' | 'error' | 'info' | 'open' | 'closed' | 'preparing' | 'delivered') {
    const baseClasses = componentStyles.badge.base;
    const variantClasses = componentStyles.badge.variants[variant];
    
    return `${baseClasses} ${variantClasses}`;
  }
  
  // ===== STATUS HELPERS =====
  static getBusinessStatusStyle(isOpen: boolean) {
    return {
      className: this.badge(isOpen ? 'open' : 'closed'),
      text: isOpen ? 'Abierto' : 'Cerrado',
      color: isOpen ? this.colors.open : this.colors.closed,
    };
  }
  
  static getAvailabilityStyle(available: boolean, inventory: number) {
    if (!available) {
      return {
        className: this.badge('error'),
        text: 'No disponible',
        color: this.colors.error,
      };
    }
    
    if (inventory > 0 && inventory <= 5) {
      return {
        className: this.badge('warning'),
        text: inventory === 1 ? '¡Queda 1!' : `¡Quedan ${inventory}!`,
        color: this.colors.warning,
      };
    }
    
    return {
      className: this.badge('success'),
      text: 'Disponible',
      color: this.colors.success,
    };
  }
  
  static getOrderStatusStyle(status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled') {
    const statusMap = {
      pending: { variant: 'warning' as const, text: 'Pendiente' },
      preparing: { variant: 'preparing' as const, text: 'Preparando' },
      ready: { variant: 'info' as const, text: 'Listo' },
      delivered: { variant: 'delivered' as const, text: 'Entregado' },
      cancelled: { variant: 'error' as const, text: 'Cancelado' },
    };
    
    const config = statusMap[status];
    return {
      className: this.badge(config.variant),
      text: config.text,
    };
  }
  
  // ===== ROLE-BASED HELPERS =====
  static getRoleStyle(role: 'user' | 'admin') {
    if (role === 'admin') {
      return {
        primary: this.colors.admin,
        gradient: this.gradients.purple,
        buttonClass: this.button('admin'),
        textClass: 'text-purple-600',
        bgClass: 'bg-gradient-purple',
      };
    }
    
    return {
      primary: this.colors.user,
      gradient: this.gradients.saffron,
      buttonClass: this.button('primary'),
      textClass: 'text-saffron-600',
      bgClass: 'bg-gradient-saffron',
    };
  }
  
  // ===== RESPONSIVE HELPERS =====
  static responsive = {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-12 sm:py-16 lg:py-20',
    grid: {
      cols1: 'grid grid-cols-1',
      cols2: 'grid grid-cols-1 md:grid-cols-2',
      cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    },
    spacing: {
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    },
  };
  
  // ===== UTILITY FUNCTIONS =====
  static combineClasses(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }
  
  static conditionalClass(condition: boolean, trueClass: string, falseClass: string = ''): string {
    return condition ? trueClass : falseClass;
  }
}

// ===== CONVENIENCE EXPORTS =====
export const { colors, gradients } = ThemeHelper;

// Quick access functions
export const getButtonClass = ThemeHelper.button;
export const getCardClass = ThemeHelper.card;
export const getInputClass = ThemeHelper.input;
export const getBadgeClass = ThemeHelper.badge;

// Status helpers
export const getBusinessStatus = ThemeHelper.getBusinessStatusStyle;
export const getAvailabilityStyle = ThemeHelper.getAvailabilityStyle;
export const getOrderStatus = ThemeHelper.getOrderStatusStyle;
export const getRoleStyle = ThemeHelper.getRoleStyle;

// Utility functions
export const combineClasses = ThemeHelper.combineClasses;
export const conditionalClass = ThemeHelper.conditionalClass;

export default ThemeHelper;