import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import ScreenContainer from '../components/ScreenContainer';

export default function CalendarScreen() {
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario</Text>
      </View>

      <Calendar
        current={today}
        markedDates={{
          [today]: {
            selected: true,
            marked: true,
            selectedColor: '#5E17EB',
          },
        }}
        theme={{
          selectedDayBackgroundColor: '#5E17EB',
          todayTextColor: '#5E17EB',
          arrowColor: '#5E17EB',
          dotColor: '#5E17EB',
          textMonthFontWeight: 'bold',
        }}
      />
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
    color: '#1E1E1E',
  },
});