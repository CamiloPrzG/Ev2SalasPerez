import { useUser } from '@/contexts/UserContext';
import { Task } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

export function useTodoManager() {
    const { userEmail } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const STORAGE_KEY = `tasks_${userEmail}`;

    // Cargar tareas al iniciar o cambiar de usuario
    useEffect(() => {
        if (!userEmail) return;
        loadTasks();
    }, [userEmail]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveTasks = async (newTasks: Task[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
            setTasks(newTasks);
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const addTask = async (title: string, imageUri?: string, location?: { latitude: number; longitude: number }) => {
        let finalImageUri = imageUri;

        // Si hay imagen, moverla a un directorio permanente
        // @ts-ignore
        if (imageUri && FileSystem.documentDirectory) {
            try {
                const fileName = imageUri.split('/').pop();
                // @ts-ignore
                const newPath = FileSystem.documentDirectory + (fileName || `image_${Date.now()}.jpg`);

                console.log('📁 Guardando imagen en sistema de archivos...');
                console.log('   Desde (Temp):', imageUri);
                console.log('   Hacia (Persistente):', newPath);

                await FileSystem.moveAsync({
                    from: imageUri,
                    to: newPath,
                });
                finalImageUri = newPath;
            } catch (error) {
                console.error('Error saving image:', error);
            }
        }
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            isCompleted: false,
            imageUri: finalImageUri,
            location,
            createdAt: Date.now(),
        };

        const updatedTasks = [...tasks, newTask];
        await saveTasks(updatedTasks);
    };

    const deleteTask = async (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id);

        // Eliminar imagen asociada si existe
        if (taskToDelete?.imageUri) {
            try {
                // Verificar si es una ruta local válida antes de intentar borrar
                if (taskToDelete.imageUri.startsWith('file://')) {
                    await FileSystem.deleteAsync(taskToDelete.imageUri, { idempotent: true });
                    console.log('🗑️ Imagen eliminada:', taskToDelete.imageUri);
                }
            } catch (error) {
                console.log('Nota: No se pudo borrar el archivo de imagen (puede que ya no exista o sea una ruta externa):', error);
                // No lanzamos el error para permitir que la tarea se borre de la lista de todos modos
            }
        }

        const updatedTasks = tasks.filter(t => t.id !== id);
        await saveTasks(updatedTasks);
    };

    const toggleTaskCompletion = async (id: string) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        );
        await saveTasks(updatedTasks);
    };

    return {
        tasks,
        loading,
        addTask,
        deleteTask,
        toggleTaskCompletion,
    };
}
