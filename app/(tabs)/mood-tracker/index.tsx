import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface MoodData {
  [date: string]: {
    selected: boolean;
    marked: boolean;
    text: string;
  };
}

const MoodTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [moodData, setMoodData] = useState<MoodData>({});
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const emojis: string[] = ['😢', '😕', '😐', '🙂', '😄'];

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    // Set the current mood based on moodData
    const mood = moodData[day.dateString]?.text || null;
    setCurrentMood(mood);
  };

  const selectMood = (mood: string) => {
    if (selectedDate) {
      setMoodData(prevMoodData => ({
        ...prevMoodData,
        [selectedDate]: { selected: true, marked: true, text: mood }
      }));
      setCurrentMood(mood);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoodTracker</Text>

      <Calendar
        onDayPress={onDayPress}
        markedDates={moodData}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          textDisabledColor: '#d9e1e8',
        }}
      />

      <View style={styles.moodBar}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={styles.emojiButton}
            onPress={() => selectMood(emoji)}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.selectedDate}>
        Selected Date: {selectedDate}
      </Text>
      <Text style={styles.selectedMood}>
        Mood: {currentMood || 'No mood selected'}
      </Text>
    </View>
  );
};

export default MoodTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  moodBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  emojiButton: {
    padding: 10,
  },
  emojiText: {
    fontSize: 30,
  },
  selectedDate: {
    marginTop: 20,
    fontSize: 16,
  },
  selectedMood: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
