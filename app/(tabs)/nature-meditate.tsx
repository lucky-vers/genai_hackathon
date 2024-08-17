import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useState, useRef } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button
} from "react-native";


// import for the files
import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import AppGradient from "@/components/AppGradient";

// imports for the audio
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const Page = () => {

    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const soundRef = useRef<Audio.Sound | null>(null);

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        console.log('Stopping recording..');
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        if (uri) {
            const { sound } = await Audio.Sound.createAsync({ uri });
            soundRef.current = sound;

            // Play sound immediately for feedback
            try {
                await sound.playAsync();
            } catch (error) {
                console.error('Error playing sound:', error);
            }

            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            sendAudioToApi(base64);
        }
    }

    async function sendAudioToApi(base64Audio: string) {
        const apiUrl = 'http://your-server-ip:5000/transcribe'; // Replace with your server's IP

        const requestData = {
            audio: base64Audio,
        };

        try {
            const response = await axios.post(apiUrl, requestData);
            setTranscription(response.data.transcription);
            console.log('Transcription: ', response.data.transcription);
        } catch (error) {
            console.error('Error sending audio to API: ', error);
        }
    }

    return (
        <View style={styles.container}>
            <AppGradient
                // Background Linear Gradient
                colors={["#161b2e", "#0a4d4a", "#766e67"]}
            >
                <View style={styles.mb6}>
                    <Text style={styles.title}>Welcome to the ZenZone</Text>
                    <Text style={styles.subtitle}>
                        Start your meditation practice today
                    </Text>

                    <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
                        <Image
                            source={require('/home/verma/Downloads/ready-app/simple-meditation-app-expo-react-native/voice.png')}
                            style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', flex: 1 }} // Adjust the size as needed
                        />
                    </TouchableOpacity>
                    <Text>{'' }</Text>
                    <Text style={styles.transcription}>{transcription}</Text>
                </View>
                <View>
                    <FlatList
                        data={MEDITATION_DATA}
                        contentContainerStyle={styles.list}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() =>
                                    router.push(`/meditate/${item.id}`)
                                }
                                style={styles.pressable}
                            >
                                <ImageBackground
                                    source={MEDITATION_IMAGES[item.id - 1]}
                                    resizeMode="cover"
                                    style={styles.backgroundImage}
                                >
                                    <LinearGradient
                                        // Gradient from transparent to black
                                        colors={[
                                            "transparent",
                                            "rgba(0,0,0,0.8)",
                                        ]}
                                        style={styles.gradient}
                                    >
                                        <Text style={styles.itemTitle}>
                                            {item.title}
                                        </Text>
                                    </LinearGradient>
                                </ImageBackground>
                            </Pressable>
                        )}
                    />
                </View>
            </AppGradient>
            <StatusBar style="light" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mb6: {
        marginBottom: 24,
    },
    title: {
        color: '#f5f5f5',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subtitle: {
        color: '#d1d1d1',
        fontSize: 18,
    },
    transcription: {
        marginTop: 20,
        fontSize: 16,
        color: '#ffffff',
    },
    pressable: {
        height: 192,
        marginVertical: 12,
        borderRadius: 10,
        overflow: 'hidden',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
    },
    gradient: {
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        width: "100%",
    },
    itemTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    list: {
        paddingBottom: 150,
    },
});

export default Page;
