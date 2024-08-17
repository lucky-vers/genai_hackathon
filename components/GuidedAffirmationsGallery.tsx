import React, { useState } from 'react';
import { Image, View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { GalleryPreviewData } from "@/constants/models/Product";

interface AiAffirmationsGalleryProps {
    title: string;
    products: GalleryPreviewData[];
}

const AiAffirmationsGallery = ({
    title,
    products,
}: AiAffirmationsGalleryProps) => {
    const [newAffirmation, setNewAffirmation] = useState('Click to generate an affirmation');
    const [isLoading, setIsLoading] = useState(false);
    const [currentSubject, setCurrentSubject] = useState('');

    const subjects = [
        "Positivity",
        "Reduce Anxiety",
        "Success",
        "Self-Belief",
        "Mental Health",
        "Law of Attraction",
        "Limiting Beliefs",
    ];

    const generateNewAffirmation = () => {
        setIsLoading(true);
        setNewAffirmation('Loading...');

        const API_URL = "https://5883-2401-4900-16e3-56aa-90fa-8107-a0dc-2c9d.ngrok-free.app/query";
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        setCurrentSubject(randomSubject);

        const requestData = {
            assistant_id: "ffffffffffffffffffffffffffffffff",
            assistant_version: "10.0.0",
            api_key: "ffffffffffffffffffffffffffffffff",
            query: `give me a short  affirmation on ${randomSubject} ${Math.random()}`,
            history: "{}",
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                const history = JSON.parse(data.history);
                if (history.items && history.items.length > 0) {
                    const firstItem = history.items[0];
                    let affirmation = JSON.parse(firstItem.assistant_response).message;
                    affirmation = affirmation.replace('Here is a positive affirmation for you: ', '').trim();
                    setNewAffirmation(affirmation);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setNewAffirmation('Failed to generate affirmation. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.galleryContainer}>
                <FlatList
                    data={[{ id: 'ai-generated', title: 'AI Generated' }, ...products]}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        index === 0 ? (
                            <Pressable onPress={generateNewAffirmation} disabled={isLoading}>
                                <View style={styles.aiAffirmationCard}>
                                    <Text style={styles.aiAffirmationTitle}>{item.title}</Text>
                                    <Text style={styles.aiAffirmationText}>{newAffirmation}</Text>
                                </View>
                            </Pressable>
                        ) : (
                            <Link href={`/affirmations/${item.id}`} asChild>
                                <Pressable>
                                    <View style={styles.affirmationCard}>
                                        <Image
                                            source={item.image}
                                            resizeMode="cover"
                                            style={styles.affirmationImage}
                                        />
                                        <Text style={styles.affirmationTitle}>{item.title}</Text>
                                    </View>
                                </Pressable>
                            </Link>
                        )
                    )}
                    horizontal
                />
            </View>
        </View>
    );
};

// ... (styles remain unchanged)

export default AiAffirmationsGallery;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    titleContainer: {
        marginBottom: 10,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    galleryContainer: {
        marginTop: 10,
    },
    affirmationCard: {
        height: 144,
        width: 128,
        borderRadius: 8,
        marginRight: 16,
        overflow: 'hidden',
    },
    affirmationImage: {
        width: '100%',
        height: '100%',
    },
    affirmationTitle: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        color: 'white',
        fontWeight: 'bold',
    },
    aiAffirmationCard: {
        height: 144,
        width: 128,
        borderRadius: 8,
        marginRight: 16,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    aiAffirmationTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    aiAffirmationSubject: {
        color: 'white',
        fontSize: 12,
        marginBottom: 8,
    },
    aiAffirmationText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 12,
    },
});

export default AiAffirmationsGallery;
