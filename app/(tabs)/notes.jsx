import React, { useState, useEffect } from 'react';
import { 
  Text, View, StyleSheet, Image, TouchableOpacity, Alert, FlatList,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure correct import
import images from '@/constants/images';
import Animated from 'react-native-reanimated'; // Import Animated correctly
import {data} from '@/data/notes'
import { useRouter } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const categoriesData = [
  { id: 1, category: 'joy', image: images.joy, color: '#e9ef6e' },
  { id: 2, category: 'anger', image: images.anger, color: '#f87070' },
  { id: 3, category: 'fear', image: images.fear, color: '#9b59b6' },
  { id: 4, category: 'sad', image: images.sad, color: '#3498db' },
  { id: 5, category: 'disgust', image: images.disgust, color: '#2ecc71' },
];

function Notes() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [note, setNote] = useState([]);
  const router = useRouter()
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("notes");
        const storage = jsonValue != null ? JSON.parse(jsonValue) : [];
        if (storage && storage.length) {
          setNote(storage.sort((a, b) => b.id - a.id));
        }else{
          setNote(data.sort((a,b)=> b.id - a.id))
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []); // Removed data from dependency array

  const loadCategories = async () => {
    try {
      const groupedCategories = categoriesData.map(cat => ({
        ...cat,
        content: [],
        style: {
          container: { backgroundColor: '#e9ef6e' },
          contentContainer: { backgroundColor: '#fff7b3' },
          button: { backgroundColor: '#d4de0a' }
        }
      }));

      note.forEach((note) => {
        const categoryIndex = groupedCategories.findIndex((cat) => cat.category === note.category);
        if (categoryIndex !== -1) {
          groupedCategories[categoryIndex].content.push(note);
        }
      });

      setCategories(groupedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load notes.');
    }
  };

  useEffect(() => {
    loadCategories();
  }, [note]); // Load categories when notes change

  if (categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const deleteNote = (id) =>{
    setNote(note.filter(notes => notes.id != id))
  }

  const handleNote = (id) =>{
    router.push(`/list/${id}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedIndex === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedIndex(index)}
          >
            <Image source={category.image} style={styles.imageButton} />
          </TouchableOpacity>
        ))}
      </View>

      <Animated.FlatList
        data={categories[selectedIndex].content} // Use the content of the selected category
        renderItem={({ item }) => (
          <View style={[styles.item, {backgroundColor: categories[selectedIndex].color}]}>
            <Pressable
            onPress={() => handleNote(item.id)}
            >
              <Text style={styles.titleNote}>{item.title}</Text>
              <Text style={styles.contentNote}>{item.content}</Text>
              <Text style={styles.dateNote}>Date: {item.date}</Text>
              <Pressable onPress={() => deleteNote(item.id)}>
              <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
              </Pressable>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardDismissMode="on-drag"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#d1e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  selectedButton: {
    backgroundColor: '#ffff',
  },
  imageButton: {
    width: 50,
    height: 50,
    borderRadius: 35,
    resizeMode: 'contain',
  },
  contentContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  item: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    Margin: 5,
    elevation: 3,
  },
  titleNote: {
    fontSize:20,
    color: '#333',
    fontWeight: 'bold'

  },
  contentNote: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  dateNote: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

});

export default Notes;