import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';

//import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import images from '@/constants/images';
import { data } from '@/data/notes'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Path ke file JSON di storage lokal
const categories = [
  { id: 1, category: 'joy', image: images.joy },
  { id: 2, category: 'anger', image: images.anger },
  { id: 3, category: 'fear', image: images.fear },
  { id: 4, category: 'sad', image: images.sad },
  { id: 5, category: 'disgust', image: images.disgust },
];

export default function App() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState([])

  
  useEffect(() =>{
    const fetchData = async() =>{
      try{
        const jsonValue = await AsyncStorage.getItem("notes")
        const storage = jsonValue != null ? JSON.parse(jsonValue) : null
        if(storage && storage.length){
          setNote(storage.sort((a,b)=>b.id - a.id))
        }
      }catch(e){
        console.error(e)
      }
    }
    fetchData()
  }, [data])

  useEffect(() =>{
    const addStorage = async() =>{
      try {
        const jsonValue = JSON.stringify(note)
        await AsyncStorage.setItem("notes",jsonValue)
      } catch (e) {
        console.error(e)
      }
    }
    addStorage()
  }, [note])


  // if(!loaded &&!error){
  //   return null
  // }

  const addEmo = () =>{
    if(content.trim()){
      const newId = note.length > 0 ? note[0].id + 1 : 1;
      setNote([{id: newId, category:category, title: title, content:content, Date:Date.now()}, ...note])
      setCategory('')
      setTitle('')
      setContent('')
    }
  };

  
  // Fungsi untuk membaca data JSON
  // const readNotes = async () => {
  //   try {
  //     const fileExists = await FileSystem.getInfoAsync(NOTES_FILE_PATH);
  //     if (fileExists.exists) {
  //       const fileContent = await FileSystem.readAsStringAsync(NOTES_FILE_PATH);
  //       return JSON.parse(fileContent);
  //     }
  //     return [];
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to read notes.');
  //     console.error(error);
  //     return [];
  //   }
  // };

  // // Fungsi untuk menambahkan catatan baru
  // const addNote = async () => {
  //   if (!title || !content || !category) {
  //     Alert.alert('Error', 'Please fill all fields.');
  //     return;
  //   }

  //   const newNote = {
  //     id: Date.now(),
  //     category,
  //     title,
  //     content,
  //   };

  //   try {
  //     const notes = await readNotes();
  //     notes.push(newNote);
  //     await FileSystem.writeAsStringAsync(NOTES_FILE_PATH, JSON.stringify(notes));
  //     Alert.alert('Success', 'Note added successfully!');
  //     setCategory('');
  //     setTitle('');
  //     setContent('');
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to save note.');
  //     console.error(error);
  //   }
  // };

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/gradient_bg.jpg')}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Add a Note</Text>
            <Text style={styles.text}>Fill in the details below</Text>
          </View>

          {/* Stack Image for Category */}
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.category)}
                style={[
                  styles.categoryImageContainer,
                  category === cat.category && styles.selectedCategory,
                ]}
              >
                <Image source={cat.image} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>{cat.category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#ccc"
              onChangeText={setTitle}
              value={title}
            />
            <TextInput
              style={styles.input}
              placeholder="Content"
              placeholderTextColor="#ccc"
              onChangeText={setContent}
              value={content}
              multiline
            />
            <Button title="Add Note" onPress={addEmo} />
          </View>
        </View>
      </ImageBackground>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginTop: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  categoryImageContainer: {
    alignItems: 'center',
    margin: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 25,
  },
  categoryLabel: {
    marginTop: 5,
    color: 'black',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
