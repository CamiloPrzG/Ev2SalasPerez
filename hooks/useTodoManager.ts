import { useUser } from '@/contexts/UserContext';
import { api, ApiTask } from '@/services/api';
import { Task } from '@/types';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useTodoManager() {
    const { user } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadTasks();
        } else {
            setTasks([]);
        }
    }, [user]);

    const mapApiTaskToTask = (apiTask: ApiTask): Task => {
        let parsedLocation = undefined;
        if (apiTask.location) {
            try {
                // Intentar parsear si es string, si ya es objeto usarlo
                parsedLocation = typeof apiTask.location === 'string'
                    ? JSON.parse(apiTask.location)
                    : apiTask.location;
            } catch (e) {
                console.log('Error parsing location', e);
            }
        }

        return {
            id: apiTask.id,
            title: apiTask.title,
            isCompleted: apiTask.completed, // Mapeo correcto: completed -> isCompleted
            imageUri: apiTask.photoUri, // Mapeo correcto: photoUri -> imageUri
            location: parsedLocation,
            createdAt: Date.now(),
        };
    };

    const loadTasks = async () => {
        try {
            setLoading(true);
            const apiTasks = await api.getTasks();
            setTasks(apiTasks.map(mapApiTaskToTask));
        } catch (error) {
            console.error('Error loading tasks:', error);
            // No mostrar alerta en carga inicial para no ser intrusivo si falla silenciosamente
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (title: string, imageUri?: string, location?: { latitude: number; longitude: number }) => {
        try {
            // No ponemos loading global para no bloquear toda la UI, o sí?
            // Mejor manejar loading local o dejar que la UI responda.
            // El requerimiento pide "estados de carga".
            // Usaremos el loading del hook o retornaremos una promesa.

            const newApiTask = await api.createTask(title, imageUri, location);
            const newTask = mapApiTaskToTask(newApiTask);
            setTasks(prev => [...prev, newTask]);
            return true;
        } catch (error) {
            console.error('Error adding task:', error);
            Alert.alert('Error', 'No se pudo crear la tarea');
            return false;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            // Optimistic update
            const previousTasks = [...tasks];
            setTasks(prev => prev.filter(t => t.id !== id));

            await api.deleteTask(id);
        } catch (error) {
            console.error('Error deleting task:', error);
            Alert.alert('Error', 'No se pudo eliminar la tarea');
            loadTasks(); // Revertir cambios recargando
        }
    };

    const toggleTaskCompletion = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        try {
            // Optimistic update
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
            ));

            // La API espera 'completed', no 'isCompleted'
            await api.updateTask(id, { completed: !task.isCompleted } as any);
        } catch (error) {
            console.error('Error updating task:', error);
            Alert.alert('Error', 'No se pudo actualizar la tarea');
            loadTasks(); // Revertir
        }
    };

    return {
        tasks,
        loading,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks: loadTasks
    };
}
