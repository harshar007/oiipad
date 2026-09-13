export type ThemeMode = 'light' | 'dark';

export const LightTheme = {
  mode: 'light' as ThemeMode,
  colors: {
    bgRoot: '#F8F9FE',
    bgCard: '#FFFFFF',
    bgCardHover: '#F3EDF7',
    bgInput: '#FFFFFF',
    bgSubtle: '#F1F3F9',

    primary: '#6750A4',
    primaryLight: '#7C3AED',
    primaryDark: '#4F378B',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    lavender: '#E8DEF8',

    white: '#FFFFFF',
    textPrimary: '#1C1B1F',
    textSecondary: '#49454F',
    textMuted: '#79747E',
    textDim: '#A09CA8',

    border: '#E7E0EC',
    borderActive: '#6750A4',
    borderSubtle: '#EDE8F2',

    online: '#16A34A',
    onlineBg: '#DCFCE7',
    offline: '#79747E',
    offlineBg: '#F1F3F9',
    error: '#DC2626',
    errorBg: '#FEE2E2',

    brake: '#E11D48',
    brakeBg: '#FFE4E6',
    accelerate: '#6750A4',
    accelerateGlow: '#7C3AED',
    boost: '#D97706',
    boostBg: '#FEF3C7',
    powerUp: '#0284C7',
    powerUpBg: '#E0F2FE'
  }
};

export const DarkTheme = {
  mode: 'dark' as ThemeMode,
  colors: {
    bgRoot: '#0B0714',
    bgCard: '#150E24',
    bgCardHover: '#23143D',
    bgInput: '#0B0714',
    bgSubtle: '#1C1330',

    primary: '#9333EA',
    primaryLight: '#A855F7',
    primaryDark: '#6B21A8',
    primaryContainer: '#2E1253',
    onPrimaryContainer: '#E9D5FF',
    lavender: '#C084FC',

    white: '#FFFFFF',
    textPrimary: '#F8F7FF',
    textSecondary: '#D8CEEC',
    textMuted: '#9B8EB3',
    textDim: '#65587E',

    border: '#2C1B4A',
    borderActive: '#9333EA',
    borderSubtle: '#3A2461',

    online: '#10B981',
    onlineBg: '#064E3B',
    offline: '#65587E',
    offlineBg: '#1C1330',
    error: '#F43F5E',
    errorBg: '#881337',

    brake: '#E11D48',
    brakeBg: '#4C0519',
    accelerate: '#9333EA',
    accelerateGlow: '#C084FC',
    boost: '#F59E0B',
    boostBg: '#78350F',
    powerUp: '#06B6D4',
    powerUpBg: '#164E63'
  }
};

export let Theme = LightTheme;

export function getTheme(mode: ThemeMode) {
  return mode === 'dark' ? DarkTheme : LightTheme;
}
