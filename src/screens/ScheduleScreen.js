import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { format, subMonths, addMonths, addDays, subDays } from 'date-fns';

// Get the screen width and height
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// Adjust the height if necessary to account for other UI elements
const adjustedHeight = screenHeight;
const dayColumnWidth = screenWidth / 5; // Divide by the number of days to fit on screen
const timeSlotHeight = adjustedHeight / 14; // Divide by the number of time slots to display at once

// This function generates a set of dates for the initial load
const getInitialDates = (startDate, numberOfDays) => {
  let dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
};

// Define initial start date
const startDate = subMonths(new Date(), 6); // 6 months before today

const initialDates = getInitialDates(startDate, 35); // Starting with 35 days

const TimeSlot = ({ hour }) => {
  return (
    <View style={[styles.timeSlot, { height: timeSlotHeight }]}>
      <Text>{hour}:00</Text>
    </View>
  );
};

const TimeHeaders = ({ hours }) => {
  return (
    <View style={styles.timeHeaderContainer}>
      {hours.map((hour, index) => (
        <View key={index} style={styles.timeHeader}>
          <Text>{hour}:00</Text>
        </View>
      ))}
    </View>
  );
};

const DayColumn = ({ date, hours }) => {
  const formattedDay = format(date, 'E'); // e.g., "Sun"
  const formattedDate = format(date, 'MMM d'); // e.g., "Feb 19"
  return (
    <View style={[styles.dayColumnWrapper, { width: dayColumnWidth }]}>
      <Text style={styles.dayColumnHeader}>{`${formattedDay}\n${formattedDate}`}</Text>
      <View style={styles.dayColumnContainer}>
        {hours.map((hour, index) => (
          <TimeSlot key={index} hour={hour} />
        ))}
      </View>
    </View>
  );
};

const ScheduleScreen = () => {
  const [dates, setDates] = useState(initialDates);
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0AM to 23PM, adjust as needed

  const loadMoreDates = (direction) => {
    if (direction === 'past') {
      let newStartDate = subDays(dates[0], 7);
      let newDates = getInitialDates(newStartDate, 7).concat(dates);
      setDates(newDates);
    } else if (direction === 'future') {
      let newEndDate = addDays(dates[dates.length - 1], 7);
      let newDates = dates.concat(getInitialDates(newEndDate, 7));
      setDates(newDates);
    }
  };

  const onScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const closeToStart = currentOffset < 50; // Adjust threshold as needed

    if (closeToStart) {
      loadMoreDates('past');
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <TimeHeaders hours={hours.slice(8, 22)} /> {/* Static header for visible hours 8AM to 9PM */}
      <FlatList
        horizontal
        data={dates}
        renderItem={({ item }) => <DayColumn date={item} hours={hours} />}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => loadMoreDates('future')}
        onEndReachedThreshold={0.5} // Load more when halfway reached to the end
        onScroll={onScroll}
      />
    </View>
  );

};


const styles = StyleSheet.create({
  timeHeaderContainer: {
    width: 50, // Width of the time headers, adjust as necessary
    backgroundColor: '#f0f0f0',
  },

  timeHeader: {
    height: timeSlotHeight,
    justifyContent: 'center',
    paddingLeft: 10,
  },

  scheduleContainer: {
    flexDirection: 'row',
  },

  dayColumnWrapper: {
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: 'black', // This adds the separation line between days
  },

  dayColumnContainer: {
    flex: 1,}, // Takes up the remaining space

  dayColumnHeader: {
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#ddd',
    textAlign: 'center',
  },

  timeSlot: {
    height: timeSlotHeight, // Adjust the height so the desired number of slots fit on the screen
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ScheduleScreen;