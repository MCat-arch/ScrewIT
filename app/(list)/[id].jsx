import { Pressable, SafeAreaView, Text, TextInput, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NoteID() {
    const { id } = useLocalSearchParams();
    const [note, setNote] = useState({});
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("notes");
                const storage = jsonValue != null ? JSON.parse(jsonValue) : [];

                if (storage.length) {
                    const mynote = storage.find(note => note.id.toString() === id);
                    if (mynote) {
                        setNote(mynote);
                        setTitle(mynote.title); // Set title from fetched note
                        setContent(mynote.content); // Set content from fetched note
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchData(id);
    }, [id]);

    const handleSave = async () => {
        try {
            const saveData = { ...note, title: title, content: content };

            const jsonValue = await AsyncStorage.getItem("notes");
            const storage = jsonValue != null ? JSON.parse(jsonValue) : [];

            if (storage.length) {
                const otherData = storage.filter(note => note.id !== saveData.id);
                const allData = [...otherData, saveData];
                await AsyncStorage.setItem("notes", JSON.stringify(allData));
            } else {
                await AsyncStorage.setItem("notes", JSON.stringify([saveData]));
            }

            router.push(`/`); // Navigate back to the main screen
        } catch (e) {
            console.error(e);
        }
    };

    const handleClose = () => {
        router.push(`/`); // Navigate back to the main screen
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputTitle}
                    maxLength={30}
                    placeholder="Edit Title"
                    placeholderTextColor="grey"
                    value={title}
                    onChangeText={setTitle} // Use onChangeText
                />
                <TextInput
                    style={styles.inputContent}
                    maxLength={100}
                    placeholder="Edit Content"
                    placeholderTextColor="grey"
                    value={content}
                    onChangeText={setContent} // Use onChangeText
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={handleSave} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable onPress={handleClose} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputTitle: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputContent: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space -between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});