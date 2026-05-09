export const lightColors = {
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
  textTertiary: '#808080',
  borderDefault: 'rgba(0,0,0,0.08)',

  white: '#FFFFFF',
  black: '#000000',

  // Vote Colors
  voteFreeBg: '#E1F5EE',
  voteFreeBorder: '#9FE1CB',
  voteFreeText: '#085041',
  votePreferBg: '#EEEDFE',
  votePreferBorder: '#AFA9EC',
  votePreferText: '#3C3489',
  voteCantBg: '#FCEBEB',
  voteCantBorder: '#F09595',
  voteCantText: '#791F1F',
} as const;

export const darkColors = {
  peachBase: '#2D1A14',
  peachSoft: '#712B13',
  peachMid: '#D85A30',
  peachPunch: '#F0997B',
  peachDeep: '#FDF6F0',

  indigoBase: '#1A1A2E',
  indigoSoft: '#3C3489',
  indigoMid: '#534AB7',
  indigoPunch: '#AFA9EC',
  indigoDeep: '#EEEDFE',

  mintBase: '#04342C',
  mintSoft: '#0F6E56',
  mintPunch: '#9FE1CB',

  pageBg: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#F5F5F5',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  borderDefault: 'rgba(255,255,255,0.12)',

  white: '#FFFFFF',
  black: '#000000',

  // Vote Colors
  voteFreeBg: '#04342C',
  voteFreeBorder: '#0F6E56',
  voteFreeText: '#9FE1CB',
  votePreferBg: '#1A1A2E',
  votePreferBorder: '#3C3489',
  votePreferText: '#AFA9EC',
  voteCantBg: '#3D1515',
  voteCantBorder: '#791F1F',
  voteCantText: '#F09595',
} as const;

// Default to light for now, but export both for future implementation
export const colors = lightColors;

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
  12: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
