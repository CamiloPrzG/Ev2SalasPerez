export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    imageUri?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    createdAt: number;
}
