import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';

//import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import images from '@/constants/images';
import { data } from '@/data/notes'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ListView } from 'react-native';

// Path ke file JSON di storage lokal
const categories = [
  { id: 1, category: 'joy', image: images.joy },
  { id: 2, category: 'anger', image: images.anger },
  { id: 3, category: 'fear', image: images.fear },
  { id: 4, category: 'sad', image: images.sad },
  { id: 5, category: 'disgust', image: images.disgust },
];

export default function App() {
  const [category, setCategory] = useState('joy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState([]);
  const [doDont, setdoDont] = useState({
    joy: [],
    sad: [],
    anger: [],
    fear: [],
    disgust: []
  });
  const [newDoItem, setDoItem] = useState('')
  const [newDontItem, setDontItem] = useState('')
  const [showDoInput, setShowDoInput] = useState(false); // State to control Do input visibility
  const [showDontInput, setShowDontInput] = useState(false);

  
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("doDontData");
        if (jsonValue) {
          setdoDont(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, []);  

  useEffect(() => {
    const saveData = async () => {
      try {
        const jsonValue = JSON.stringify(doDont);
        await AsyncStorage.setItem("doDontData", jsonValue);
      } catch (e) {
        console.error(e);
      }
    };
    saveData();
  }, [doDont]); // Runs whenever doDont changes


  const addEmo = () =>{
    if(content.trim()){
      const newId = note.length > 0 ? note[0].id + 1 : 1;
      setNote([{id: newId, category:category, title: title, content:content, Date:Date.now()}, ...note])
      setCategory('')
      setTitle('')
      setContent('')
    }
  };

  const addDoItem = () => {
    if(newDoItem.trim()){
      setdoDont(prev => ({
        ...prev,[category]: [...prev[category], {id: Date.now(), do: newDoItem}]
      }));
      setDoItem('');
      setShowDoInput(false)
    }
  }

  const addDontItem = () =>{

    if(newDontItem.trim()){
      setdoDont(prev =>({
        ...prev, [category]: [...prev[category], {id:Date.now(), dont: newDontItem}]
      }));
      setDontItem('')
      setShowDontInput(false)
    }
  }

  const removeDoItem = (id) =>{
    setdoDont(prev => ({
      ...prev, [category]: [...prev[category].filter(item =>item.id != id)]
    }))
  }

  const removeDontItem = (id) => {
    setdoDont(prev =>({
      ...prev,[category]: [...prev[category].filter(item => item.id != id)]
    }))
  }

  const renderDoItem = ({item}) =>{
    return(
    <View style={styles.ListItemContainer}>
      <Pressable
      onLongPress={() =>{removeDoItem(item.id)}}
      >
      <Text style={styles.ListItem}>{item.do}</Text>
      </Pressable>
    </View>
    )
  }
  const renderDontItem = ({item}) =>{
    return(
    <View style={styles.ListItemContainer}>
      <Pressable
      onLongPress={() => {removeDontItem(item.id)}}
      >
      <Text style={styles.ListItem}>{item.dont}</Text>
      </Pressable>
    </View>
    )
  }

  const renderCategoryContent = () => {
    return (
      <View style={styles.categoryContent}>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>I am {category}</Text>
          <Text style={styles.text}>Why am I {category} now?</Text>
        </View>
  
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
        
        <Text style={styles.title}>Guidelines: Things to Do and Not to Do</Text>
        <View style={styles.explanationContainer}>
        <View style={styles.doDontContainer}>
          <View style={styles.do}>
          <Text style={styles.listTitle}>Do</Text>
            <FlatList
              data={doDont[category].filter(item => item.do)}
              renderItem={renderDoItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <Pressable onPress={() => setShowDoInput(!showDoInput)}>
              <FontAwesome6 name="add" size={24} color="black" />
            </Pressable>
            {showDoInput && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder='Add Do'
                  placeholderTextColor="#ccc"
                  onChangeText={setDoItem}
                  value={newDoItem}
                />
                <Button title='Submit' onPress={addDoItem} />
              </View>
            )}
          </View>
  
          <View style={styles.dont}>
          <Text style={styles.listTitle}>Dont</Text>
            <FlatList
              data={doDont[category].filter(item => item.dont)}
              renderItem={renderDontItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <Pressable onPress={() => setShowDontInput(!showDontInput)}>
              <FontAwesome6 name="add" size={24} color="black" />
            </Pressable>
            {showDontInput && (
              <View >
                <TextInput
                  style={styles.input}
                  placeholder='Add Dont'
                  placeholderTextColor="#ccc"
                  onChangeText={setDontItem}
                  value={newDontItem}
                />
                <Button title='Submit' onPress={addDontItem} />
              </View>
            )}
          </View>
        </View>
        </View>
      </View>
    );
  };
  

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/gradient_bg.jpg')}
        style={styles.background}
      >
        <View style={styles.content}>

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
            {/* Render content based on selected category */}
            {category && renderCategoryContent()}

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
    marginBottom:30,
    marginTop:0,

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
  explanationContainer: {
    marginTop: 20,
  },
  explanationInput: {
    height: 80,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#333',
    backgroundColor: '#fff',
  },
  doDontContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  do: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    elevation: 2,
  },
  dont: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    elevation: 2,
  },
  doDontTitle: {
    fontWeight: 'bold',
  },
  doDontContent: {
    marginTop: 5,
  },

  ListItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  ListItem: {
    fontSize: 16,
    color: 'black',
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop:30,
    color: "#333",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  
});

