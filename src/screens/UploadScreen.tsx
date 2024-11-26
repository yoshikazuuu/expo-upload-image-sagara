import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ScrollView,
	Platform,
	Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../lib/theme';
import { uploadService } from '../services/api';

const UploadScreen = ({ navigation }) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedFileInfo, setUploadedFileInfo] = useState(null);

	const pickImage = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [16, 9],
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0].uri);
		}
	};

	const handleUpload = async () => {
		if (!selectedImage) return;

		setUploading(true);
		try {
			const result = await uploadService.uploadFile(selectedImage);
			if (result.status === 'success') {
				setUploadedFileInfo(result.data);
				// Optional: Show success message
				Alert.alert('Upload Successful', 'Your file has been uploaded');
			} else {
				// More detailed error handling
				Alert.alert(
					'Upload Failed',
					result.message || 'Unknown error occurred'
				);
				console.error('Upload failed:', result);
			}
		} catch (error) {
			// Handle network errors, timeout, etc.
			Alert.alert(
				'Upload Error',
				error.message || 'Could not upload file'
			);
			console.error('Detailed upload error:', error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Upload an introduction</Text>
					<Text style={styles.subtitle}>
						For best results, image uploads should be high
						resolution JPG or PNG format.
					</Text>
				</View>

				<TouchableOpacity
					style={styles.uploadArea}
					onPress={pickImage}
					activeOpacity={0.7}
				>
					{selectedImage ? (
						<Image
							source={{ uri: selectedImage }}
							style={styles.selectedImage}
							resizeMode='cover'
						/>
					) : (
						<View style={styles.placeholder}>
							<View style={styles.iconContainer}>
								<Ionicons
									name='cloud-upload'
									size={32}
									color={theme.colors.primary}
								/>
							</View>
							<Text style={styles.uploadText}>
								Drag and drop files to upload
							</Text>
							<TouchableOpacity style={styles.selectButton}>
								<Text style={styles.selectButtonText}>
									Select files
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</TouchableOpacity>

				<View style={styles.footer}>
					<TouchableOpacity
						style={[styles.footerButton, styles.cancelButton]}
						onPress={() => navigation.goBack()}
					>
						<Text style={styles.cancelButtonText}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.footerButton,
							styles.uploadButton,
							(!selectedImage || uploading) &&
								styles.uploadButtonDisabled,
						]}
						onPress={handleUpload}
						disabled={!selectedImage || uploading}
					>
						<Text style={styles.uploadButtonText}>
							{uploading ? 'Uploading...' : 'Upload File'}
						</Text>
					</TouchableOpacity>
				</View>

				{uploadedFileInfo && (
					<View style={styles.uploadedInfoContainer}>
						<Text style={styles.uploadInfoTitle}>
							Upload Details:
						</Text>
						<Text style={styles.uploadInfoText}>
							Original Name: {uploadedFileInfo.originalname}
						</Text>
						<Text style={styles.uploadInfoText}>
							File Size: {uploadedFileInfo.size} bytes
						</Text>
						<Text style={styles.uploadInfoText}>
							MIME Type: {uploadedFileInfo.mimetype}
						</Text>
						<Text style={styles.uploadInfoText}>
							Bucket: {uploadedFileInfo.bucket}
						</Text>
						<Text style={styles.uploadInfoText}>
							Key: {uploadedFileInfo.key}
						</Text>
						<Text style={styles.uploadInfoText}>
							ACL: {uploadedFileInfo.acl}
						</Text>
						<Text style={styles.uploadInfoText}>
							Storage Class: {uploadedFileInfo.storageClass}
						</Text>
						<Text
							style={styles.uploadInfoText}
							numberOfLines={1}
							ellipsizeMode='middle'
						>
							Location: {uploadedFileInfo.location}
						</Text>
						<Text style={styles.uploadInfoText}>
							ETag: {uploadedFileInfo.etag}
						</Text>
					</View>
				)}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		padding: theme.spacing.xl,
		maxWidth: 600,
		width: '100%',
		alignSelf: 'center',
	},
	header: {
		marginBottom: theme.spacing.xl,
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
	},
	uploadArea: {
		width: '100%',
		aspectRatio: 16 / 9,
		backgroundColor: theme.colors.card,
		borderRadius: theme.borderRadius.lg,
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderStyle: 'dashed',
		overflow: 'hidden',
		marginBottom: theme.spacing.xl,
	},
	placeholder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing.xl,
	},
	iconContainer: {
		width: 64,
		height: 64,
		borderRadius: theme.borderRadius.md,
		backgroundColor: `${theme.colors.primary}10`,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: theme.spacing.md,
	},
	uploadText: {
		fontSize: theme.fontSize.md,
		color: theme.colors.muted,
		marginBottom: theme.spacing.md,
	},
	selectButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		backgroundColor: theme.colors.card,
		borderRadius: theme.borderRadius.sm,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	selectButtonText: {
		fontSize: theme.fontSize.sm,
		color: theme.colors.foreground,
		fontWeight: '500',
	},
	selectedImage: {
		width: '100%',
		height: '100%',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: theme.spacing.xs,
	},
	footerButton: {
		flex: 1,
		paddingVertical: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cancelButton: {
		backgroundColor: theme.colors.card,
		marginRight: theme.spacing.sm,
	},
	cancelButtonText: {
		fontSize: theme.fontSize.md,
		color: theme.colors.muted,
		fontWeight: '500',
	},
	uploadButton: {
		backgroundColor: theme.colors.primary,
		marginLeft: theme.spacing.sm,
	},
	uploadButtonDisabled: {
		opacity: 0.5,
	},
	uploadButtonText: {
		fontSize: theme.fontSize.md,
		color: theme.colors.background,
		fontWeight: '500',
	},
	uploadedInfoContainer: {
		backgroundColor: theme.colors.card,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.lg,
		marginTop: theme.spacing.xl,
	},
	uploadInfoTitle: {
		fontSize: theme.fontSize.md,
		fontWeight: 'bold',
		color: theme.colors.foreground,
		marginBottom: theme.spacing.md,
	},
	uploadInfoText: {
		fontSize: theme.fontSize.sm,
		color: theme.colors.muted,
		marginBottom: theme.spacing.sm,
	},
});

export default UploadScreen;
