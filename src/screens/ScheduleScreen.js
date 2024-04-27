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

const TimeSlotRowHeaders = ({ hours }) => {
  return (
    <View style={styles.timeSlotHeadersContainer}>
      {hours.map((hour, index) => (
        <TimeSlot key={index} hour={hour} />
      ))}
    </View>
  );
};
const DayColumnContent = ({ date, hours }) => {
  
  return (
    <View style={[styles.dayColumnWrapper, { width: dayColumnWidth }]}>
      {hours.slice(8, 22).map((_, index) => (
        <View key={index} style={styles.timeSlot}>
        </View>
      ))}
    </View>
  );
};

const DayColumn = ({ date }) => {
  const formattedDay = format(date, 'E'); // e.g., "Sun"
  const formattedDate = format(date, 'MMM d'); // e.g., "Feb 19"

  return (
    <View style={[styles.dayColumnWrapper, { width: dayColumnWidth }]}>
      <Text style={styles.dayColumnHeader}>{`${formattedDay}\n${formattedDate}`}</Text>
    </View>
  );
};


const ScheduleScreen = () => {
  const [dates, setDates] = useState(initialDates);
  const hours = Array.from({ length: 24 }, (_, index) => index); // 0AM to 23PM, adjust as needed
  const columnHeaderHeight = 0; // the height of your day/date header


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
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Empty top-left corner spacer */}
        <View style={{ width: 50, height: columnHeaderHeight }} />
        <FlatList
          horizontal
          data={dates}
          renderItem={({ item }) => <DayColumn date={item} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => loadMoreDates('future')}
          onEndReachedThreshold={0.5}
          onScroll={onScroll}
          ListHeaderComponent={<View style={{ height: columnHeaderHeight }} />} // Placeholder to align headers
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {/* Static Time Headers on the left */}
        <View>
          {hours.slice(8, 22).map((hour, index) => (
            <View key={index} style={styles.timeHeader}>
              <Text>{`${hour}:00`}</Text>
            </View>
          ))}
        </View>
        {/* Scrollable content */}
        <FlatList
          horizontal
          data={dates}
          renderItem={({ item }) => <DayColumnContent date={item} hours={hours} />}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => loadMoreDates('future')}
          onEndReachedThreshold={0.5}
          onScroll={onScroll}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );

};



const styles = StyleSheet.create({
  dayColumnWrapper: {
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: 'black', 
  },
  timeHeadersContainer: {
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  timeHeader: {
    height: timeSlotHeight,
    justifyContent: 'center',
  },
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
    // Style for each individual time slot
    height: timeSlotHeight, // This height should match the height of the time headers
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // This adds the separation line between time slots
    // You may want to add additional styling such as paddingLeft if needed
  },
});

export default ScheduleScreen;