import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { format, startOfWeek, addDays } from 'date-fns';

const timeHeaderWidth = 32; // Width for the time header area
const dayHeaderHeight = 40; // Height for the day header area
const { width: screenWidth } = Dimensions.get('window');
const dayColumnWidth = (screenWidth - timeHeaderWidth) / 5; // Width for each day column
const timeSlotHeight = 35; // Height for each time slot

// Helper function to generate the weekdays for the current week
const generateWeekDays = (startDate, daysBefore, daysAfter) => {
  let days = [];
  for (let i = -daysBefore; i <= daysAfter; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

const TimeSlot = ({ hour }) => (
  <View style={{ flexDirection: 'row', height: timeSlotHeight }}>
    <View style={[styles.timeSlot, { width: timeHeaderWidth }]}>
      <Text>{`${hour}`}</Text>
    </View>
    {Array.from({ length: 5 }).map((_, index) => (
      <View key={index} style={[styles.daySlot, { width: dayColumnWidth }]}>
        {/* Empty slots for each hour across all days */}
      </View>
    ))}
  </View>
);

const DayColumnHeader = ({ date }) => (
  <View style={[styles.dayColumn, { height: dayHeaderHeight }]}>
    <Text style={styles.dayHeader}>{`${format(date, 'E')}\n${format(date, 'MMM d')}`}</Text>
  </View>
);

const ScheduleScreen = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [dates, setDates] = useState(() => generateDatesRange(startDate, 21, 21));
  const hours = useMemo(() => Array.from({ length: 24 }, (_, index) => index), []);

  return (
    <View style={{ flex: 1 }}>
      {/* Static Header for Time */}
      <View style={{ flexDirection: 'row', paddingTop: 5 }}>
        <View style={{ width: timeHeaderWidth, height: dayHeaderHeight, backgroundColor: '#D3D3D3' }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {dates.map((date, index) => (
            <DayColumnHeader key={index} date={date} />
          ))}
        </ScrollView>
      </View>
      {/* FlatList for Time Slots, with static time header and scrollable day slots */}
      <FlatList
        data={hours}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => <TimeSlot hour={item} />}
        ListHeaderComponent={() => (
          <View style={{ width: timeHeaderWidth, backgroundColor: '#D3D3D3' }} />  // Placeholder to keep time headers static
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dayColumn: {
    width: dayColumnWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#d3d3d3',  // Dark grey for day headers
  },
  dayHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeSlot: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#d3d3d3',  // Slightly lighter grey for time headers
  },
  daySlot: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});


export default ScheduleScreen;
