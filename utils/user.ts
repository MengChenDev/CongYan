import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from "@/store/user";

export const GetUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const SetUserData = async (userData: UserData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

export const Logout = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};