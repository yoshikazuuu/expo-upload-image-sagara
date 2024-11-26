import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import UploadScreen from './src/screens/UploadScreen';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { theme } from './src/lib/theme'; // Import the theme

const Stack = createStackNavigator();

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<View style={styles.container}>
					<SafeAreaView style={styles.safeArea}>
						<Stack.Navigator
							id={undefined}
							screenOptions={{ headerShown: false }}
							initialRouteName='LoginScreen'
						>
							<Stack.Screen
								name='LoginScreen'
								component={LoginScreen}
								options={{ title: 'Login' }}
							/>
							<Stack.Screen
								name='UploadScreen'
								component={UploadScreen}
								options={{ title: 'File Upload' }}
							/>
						</Stack.Navigator>
					</SafeAreaView>
				</View>
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
		backgroundColor: theme.colors.background, // Apply background color from theme
	},
});
