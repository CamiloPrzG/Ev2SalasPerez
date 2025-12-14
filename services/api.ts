import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://todo-list.dobleb.cl';

export interface LoginResponse {
    token: string;
    user: {
        email: string;
    };
}

export interface ApiTask {
    id: string;
    title: string;
    completed: boolean;
    photoUri?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    userId: string;
}

const getHeaders = async (isMultipart = false) => {
    const token = await AsyncStorage.getItem('auth_token');
    const headers: HeadersInit = {
        'Authorization': token ? `Bearer ${token}` : '',
    };

    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

export const api = {
    async register(username: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error en el registro');
            }

            const responseData = await response.json();
            return {
                token: responseData.data.token,
                user: responseData.data.user
            };
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error en la autenticación');
            }

            const responseData = await response.json();
            return {
                token: responseData.data.token,
                user: responseData.data.user
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getTasks(): Promise<ApiTask[]> {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/todos`, { headers });

        if (!response.ok) throw new Error('Error al obtener tareas');
        const data = await response.json();
        return data.data || [];
    },

    async createTask(title: string, imageUri?: string, location?: { latitude: number; longitude: number }): Promise<ApiTask> {
        let finalPhotoUri = undefined;

        // 1. Si hay imagen, la subimos primero
        if (imageUri) {
            const formData = new FormData();
            const filename = imageUri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', { uri: imageUri, name: filename, type } as any);

            const headers = await getHeaders(true);
            const uploadResponse = await fetch(`${API_URL}/images`, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!uploadResponse.ok) {
                const err = await uploadResponse.text();
                throw new Error(`Error al subir imagen: ${err}`);
            }

            const uploadData = await uploadResponse.json();
            finalPhotoUri = uploadData.data.url;
        }

        // 2. Crear la tarea con los datos (incluyendo la URL de la foto si existe)
        const headers = await getHeaders();
        const body = JSON.stringify({
            title,
            location,
            photoUri: finalPhotoUri,
        });

        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Error al crear tarea: ${err}`);
        }

        const data = await response.json();
        return data.data || data;
    },

    async updateTask(id: string, updates: Partial<ApiTask>): Promise<ApiTask> {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Error al actualizar tarea');
        const data = await response.json();
        return data.data || data;
    },

    async deleteTask(id: string): Promise<void> {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) throw new Error('Error al eliminar tarea');
    }
};
