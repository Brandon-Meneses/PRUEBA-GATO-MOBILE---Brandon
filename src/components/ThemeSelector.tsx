import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeSettings } from '../context/ThemeContext';

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeSettings();
    const activeColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'icon');
    const bg = useThemeColor({}, 'background');
  
    const scaleAnim = useRef(new Animated.Value(1)).current;
  
    useEffect(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, [theme]);
  
    const options = [
      { label: '🌗 Sistema', value: 'system' },
      { label: '☀️ Claro', value: 'light' },
      { label: '🌙 Oscuro', value: 'dark' },
    ];
  
    return (
      <View style={[styles.container, { backgroundColor: bg, borderColor }]}>
        {options.map(opt => {
          const isActive = theme === opt.value;
          const ButtonComponent = isActive ? Animated.View : View;
  
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              activeOpacity={0.7}
            >
              <ButtonComponent
                style={[
                  styles.option,
                  {
                    backgroundColor: isActive ? activeColor : 'transparent',
                    transform: isActive ? [{ scale: scaleAnim }] : undefined,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: isActive ? '#fff' : borderColor,
                    fontSize: 12,
                    fontWeight: '500',
                  }}
                >
                  {opt.label}
                </ThemedText>
              </ButtonComponent>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
export default ThemeSelector;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 8,
      padding: 2,
      marginTop: 0,
      marginBottom: 4,
    },
    option: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6,
      marginHorizontal: 2,
    },
  });