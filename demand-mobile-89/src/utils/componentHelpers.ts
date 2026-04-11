
import { ReactNode } from 'react';

export interface MetricCardData {
  title: string;
  subtitle: string;
  value: string;
  footerText: string;
  badgeText: string;
  badgeColors: string;
  gradientColors: string;
  borderColor: string;
  iconColor: string;
  iconBgColor: string;
}

export const createMetricCardProps = (
  title: string,
  value: number | string,
  options: {
    subtitle?: string;
    footerText?: string;
    badgeText?: string;
    theme?: 'emerald' | 'blue' | 'purple' | 'amber';
  } = {}
): Partial<MetricCardData> => {
  const themes = {
    emerald: {
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-100',
      gradientColors: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100',
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      badgeColors: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
    },
    blue: {
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      gradientColors: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 hover:from-blue-100 hover:via-indigo-100 hover:to-cyan-100',
      borderColor: 'border-blue-200 hover:border-blue-300',
      badgeColors: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
    },
    purple: {
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      gradientColors: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 hover:from-purple-100 hover:via-violet-100 hover:to-indigo-100',
      borderColor: 'border-purple-200 hover:border-purple-300',
      badgeColors: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200'
    },
    amber: {
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-100',
      gradientColors: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 hover:from-amber-100 hover:via-yellow-100 hover:to-orange-100',
      borderColor: 'border-amber-200 hover:border-amber-300',
      badgeColors: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
    }
  };

  const theme = themes[options.theme || 'blue'];

  return {
    title,
    value: typeof value === 'number' ? value.toString() : value,
    subtitle: options.subtitle || '',
    footerText: options.footerText || '',
    badgeText: options.badgeText || '',
    ...theme
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateGradient = (colors: string[]): string => {
  return `bg-gradient-to-br ${colors.join(' ')}`;
};

export const classNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
