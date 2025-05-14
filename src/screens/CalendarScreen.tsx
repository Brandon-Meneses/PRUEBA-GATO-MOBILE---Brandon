import { useThemeColor } from '@/hooks/useThemeColor';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ScreenContainer from '../components/ScreenContainer';

export default function CalendarScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const theme = useColorScheme() ?? 'light';

  const [selectedDate, setSelectedDate] = useState(today);

  const textColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');
  const highlightColor = useThemeColor({}, 'tint');

  return (
    <ScreenContainer>
      <View style={[styles.header, { backgroundColor: bgColor }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Calendario</Text>
      </View>

      <Calendar
        key={theme}
        current={today}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: highlightColor,
            selectedTextColor: theme === 'dark' ? '#000' : '#fff',
          },
        }}
        theme={{
          backgroundColor: bgColor,
          calendarBackground: bgColor,
          selectedDayBackgroundColor: highlightColor,
          selectedDayTextColor: theme === 'dark' ? '#000' : '#fff',
          todayTextColor: highlightColor,
          arrowColor: highlightColor,
          dotColor: highlightColor,
          textSectionTitleColor: textColor,
          textDayColor: textColor,
          textDayHeaderColor: textColor,
          monthTextColor: textColor,
          selectedDotColor: theme === 'dark' ? '#000' : '#fff',
          textMonthFontWeight: 'bold',
        }}
      />

      <View style={{ padding: 16 }}>
        <Text style={{ color: textColor, fontSize: 16 }}>
          Fecha seleccionada: {dayjs(selectedDate).format('DD/MM/YYYY')}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
});