import { Pressable, SafeAreaView, TextInput, View, StyleSheet, Text } from "react-native";
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
        console.log("Fetched id:", id); // Debug id value
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("notes");
                const storage = jsonValue != null ? JSON.parse(jsonValue) : [];

                if (storage.length) {
                    const mynote = storage.find(note => note.id.toString() === id.toString());
                    if (mynote) {
                        setNote(mynote);
                        setTitle(mynote.title); // Set the title from the fetched note
                        setContent(mynote.content); // Set the content from the fetched note
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSave = async () => {
        try {
            // Create a new note object with updated title and content
            const saveData = { ...note, title: title, content: content };

            const jsonValue = await AsyncStorage.getItem("notes");
            const storage = jsonValue != null ? JSON.parse(jsonValue) : [];

            // Filter out the old note and add the updated note
            const otherData = storage.filter(n => n.id !== saveData.id);
            const allData = [...otherData, saveData];

            // Save the updated notes back to AsyncStorage
            await AsyncStorage.setItem("notes", JSON.stringify(allData));
            router.push(`/`); // Navigate back to the main screen
        } catch (e) {
            console.error(e);
        }
    };

    const handleClose = () => {
        router.push(`/(tabs)/notes`); // Navigate back to the main screen
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputTitle}
                    maxLength={30}
                    placeholder="Edit Title"
                    placeholderTextColor="grey"
                    value={title} // Display the current title
                    onChangeText={setTitle} // Update title state
                />
                <TextInput
                    style={styles.inputContent}
                    maxLength={100}
                    placeholder="Edit Content"
                    placeholderTextColor="grey"
                    value={content} // Display the current content
                    onChangeText={setContent} // Update content state
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
        justifyContent: 'space-between', // Fixed spacing issue
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