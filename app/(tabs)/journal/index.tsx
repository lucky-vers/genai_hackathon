import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

interface Note {
  text: string;
  mood: string;
  date: string;
}

const Journal: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');

  const addNote = async () => {
    if (newNote.trim() !== '') {
      try {
        const response = await axios.post('https://5883-2401-4900-16e3-56aa-90fa-8107-a0dc-2c9d.ngrok-free.app/query', {
          assistant_version: "10.0.0",
          query: 'Write a journal entry about how' + newNote,
          history: "{}",
          assistant_id: "ffffffffffffffffffffffffffffffff",
          api_key: "ffffffffffffffffffffffffffffffff",
        });

        const result = JSON.parse(response.data.history);
        const parsedResponse = JSON.parse(result.items[0].assistant_response) as { thought: string; message: string; parameters: Record<string, any>; related_queries: string[]; is_parameter_complete: boolean };

        const newNoteItem: Note = {
            text: newNote,
            mood: parsedResponse.parameters.Emoji_Return,
            date: parsedResponse.parameters.date_time,
        };

        setNotes([newNoteItem, ...notes]);
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error, result);
      }
    }
  };

  const renderNoteCard = ({ item }: { item: Note }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.moodIcon}>{item.emoji}</Text>
      </View>
      <Text style={styles.cardText}>{item.text}</Text>
      <Text style={styles.moodTag}>{item.mood}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="How are you feeling today?"
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteCard}
        contentContainerStyle={styles.noteList}
      />
    </View>
  );
};

export default Journal;

const styles = StyleSheet.create({
  moodTag: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
  },
  container: {
    flex: 1,
    padding: 19,
    backgroundColor: '#aaa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 11,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 7,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ddd',
    fontWeight: 'bold',
  },
  noteList: {
    paddingBottom: 18,
  },
  card: {
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 9,
    marginBottom: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  moodIcon: {
    fontSize: 3,
  },
  cardText: {
    fontSize: 17,
    color: '#333',
  },
});
