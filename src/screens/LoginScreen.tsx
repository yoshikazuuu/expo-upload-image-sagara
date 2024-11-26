import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { authService } from '../services/api';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('user@gmail.com');
	const [password, setPassword] = useState('123456789');
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async () => {
		try {
			const result = await authService.login(email, password, true);
			if (result.status === 'success') {
				navigation.navigate('UploadScreen');
			}
		} catch (error) {
			Alert.alert('Login Error', 'Failed to login. Please try again.', [
				{ text: 'OK' },
			]);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<View style={styles.content}>
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<Ionicons
							name='cloud-upload'
							size={40}
							color={theme.colors.primary}
						/>
					</View>
					<Text style={styles.title}>IndonesiaUpload</Text>
					<Text style={styles.subtitle}>
						Upload and share your content with Indonesia
					</Text>
				</View>

				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholder='Email or username'
						placeholderTextColor={theme.colors.muted}
						value={email}
						onChangeText={setEmail}
						autoCapitalize='none'
						keyboardType='email-address'
					/>
					<View style={styles.passwordContainer}>
						<TextInput
							style={[styles.input, styles.passwordInput]}
							placeholder='Password'
							placeholderTextColor={theme.colors.muted}
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
						/>
						<Pressable
							onPress={() => setShowPassword(!showPassword)}
							style={styles.eyeIcon}
						>
							<Ionicons
								name={showPassword ? 'eye-off' : 'eye'}
								size={24}
								color={theme.colors.muted}
							/>
						</Pressable>
					</View>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={handleLogin}
					>
						<Text style={styles.loginButtonText}>Log in</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		padding: theme.spacing.xl,
		maxWidth: 400,
		width: '100%',
		alignSelf: 'center',
	},
	header: {
		alignItems: 'center',
		marginBottom: theme.spacing.xl * 2,
	},
	logoContainer: {
		width: 64,
		height: 64,
		borderRadius: 16,
		backgroundColor: theme.colors.card,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: theme.spacing.lg,
	},
	title: {
		fontSize: theme.fontSize.lg,
		fontWeight: 'bold',
		color: theme.colors.foreground,
		marginBottom: theme.spacing.sm,
	},
	subtitle: {
		fontSize: theme.fontSize.md,
		color: theme.colors.muted,
		textAlign: 'center',
	},
	form: {
		gap: theme.spacing.md,
	},
	input: {
		height: 52,
		backgroundColor: theme.colors.card,
		borderRadius: theme.borderRadius.md,
		paddingHorizontal: theme.spacing.md,
		fontSize: theme.fontSize.md,
		color: theme.colors.foreground,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	passwordContainer: {
		position: 'relative',
	},
	passwordInput: {
		paddingRight: 50,
	},
	eyeIcon: {
		position: 'absolute',
		right: theme.spacing.md,
		height: '100%',
		justifyContent: 'center',
	},
	loginButton: {
		height: 52,
		backgroundColor: theme.colors.primary,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: theme.spacing.sm,
	},
	loginButtonText: {
		fontSize: theme.fontSize.md,
		fontWeight: 'bold',
		color: theme.colors.background,
	},
});

export default LoginScreen;
