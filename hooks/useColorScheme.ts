import { useColorScheme as _useColorScheme } from 'react-native';
import { useThemeSettings } from '../src/context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  const { theme } = useThemeSettings();
  const systemScheme = _useColorScheme();

  if (theme === 'system') {
    return systemScheme ?? 'light';
  }

  return theme;
}