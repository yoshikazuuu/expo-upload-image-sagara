import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://api-cms.indonesiabrain.com/api';

// Create axios instance
const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

// Authentication services
export const authService = {
	login: async (email: string, password: string, remember: boolean) => {
		try {
			const response = await api.post('/users/login', {
				email,
				password,
				remember,
			});

			// Store tokens in secure storage
			if (response.headers['set-cookie']) {
				await SecureStore.setItemAsync(
					'refreshToken',
					response.headers['set-cookie'][0]
				);
			}

			return response.data;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	},

	logout: async () => {
		await SecureStore.deleteItemAsync('refreshToken');
	},
};

// File upload service
export const uploadService = {
	uploadFile: async (fileUri: string) => {
		try {
			const formData = new FormData();

			// Extract file name and type
			const fileName = fileUri.split('/').pop() || 'image.jpg';
			const fileType = fileName.split('.').pop();

			formData.append('file', {
				uri: fileUri,
				name: fileName,
				type: `image/${fileType}`,
			} as any);

			const response = await api.post('/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return response.data;
		} catch (error) {
			console.error('File upload error:', error);
			throw error;
		}
	},
};

export default api;
