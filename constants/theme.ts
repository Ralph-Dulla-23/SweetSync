export const colors = {
  peachBase: '#FDF6F0',
  peachSoft: '#F5C4B3',
  peachMid: '#F0997B',
  peachPunch: '#D85A30',
  peachDeep: '#712B13',

  indigoBase: '#EEEDFE',
  indigoSoft: '#AFA9EC',
  indigoMid: '#7F77DD',
  indigoPunch: '#534AB7',
  indigoDeep: '#3C3489',

  mintBase: '#E1F5EE',
  mintSoft: '#9FE1CB',
  mintPunch: '#0F6E56',

  pageBg: '#FAFAF9',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A0A0A0',
  borderDefault: 'rgba(0,0,0,0.08)',
} as const;

export const fonts = {
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_700Bold_Italic',
  body: 'PlusJakartaSans_400Regular',
  bodySemibold: 'PlusJakartaSans_600SemiBold',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
