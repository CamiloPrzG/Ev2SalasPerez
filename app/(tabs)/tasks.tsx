import { useTodoManager } from '@/hooks/useTodoManager';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TasksScreen() {
    const { tasks, loading, addTask, deleteTask, toggleTaskCompletion } = useTodoManager();
    const [title, setTitle] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTask = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'El título es obligatorio');
            return;
        }

        setIsAdding(true);

        let currentLocation = undefined;
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const locationResult = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                currentLocation = {
                    latitude: locationResult.coords.latitude,
                    longitude: locationResult.coords.longitude,
                };
            }
        } catch (error) {
            console.log('Error obteniendo ubicación:', error);
        }

        await addTask(title, imageUri, currentLocation);
        setTitle('');
        setImageUri(undefined);
        setIsAdding(false);
    };

    const launchCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);

            // Guardar copia en la galería manualmente
            try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status === 'granted') {
                    await MediaLibrary.saveToLibraryAsync(uri);
                    Alert.alert('Éxito', 'Foto guardada en tu galería');
                }
            } catch (error) {
                console.log('Error guardando en galería:', error);
            }
        }
    };

    const launchGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                    <FontAwesome
                        name={item.isCompleted ? 'check-square-o' : 'square-o'}
                        size={24}
                        color={item.isCompleted ? '#4CAF50' : '#666'}
                    />
                </TouchableOpacity>
                <Text style={[styles.cardTitle, item.isCompleted && styles.completedText]}>
                    {item.title}
                </Text>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <FontAwesome name="trash-o" size={24} color="#FF5252" />
                </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
                {item.imageUri && (
                    <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
                )}

                {item.location && (
                    <Text style={styles.locationText}>
                        📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nueva tarea..."
                    value={title}
                    onChangeText={setTitle}
                />
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={launchCamera} style={styles.iconButton}>
                        <FontAwesome name="camera" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={launchGallery} style={styles.iconButton}>
                        <FontAwesome name="image" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAddTask}
                        style={[styles.addButton, isAdding && styles.disabledButton]}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.addButtonText}>Agregar</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {imageUri && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        <TouchableOpacity onPress={() => setImageUri(undefined)} style={styles.removeImage}>
                            <FontAwesome name="times-circle" size={20} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No hay tareas pendientes</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#99c9ff',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    previewContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
    },
    removeImage: {
        marginLeft: 10,
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    locationText: {
        color: '#666',
        fontSize: 12,
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
        fontSize: 16,
    },
});
