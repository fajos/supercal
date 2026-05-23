import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY_KEY = '@supercalc_memory';

export const storeValue = async (key, value) => {
  try {
    const existingMemory = await getMemory();
    const newMemory = { ...existingMemory, [key]: value };
    await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(newMemory));
    return true;
  } catch (e) {
    console.error('Error storing value', e);
    return false;
  }
};

export const getMemory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEMORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Error getting memory', e);
    return {};
  }
};

export const clearMemory = async () => {
  try {
    await AsyncStorage.removeItem(MEMORY_KEY);
  } catch (e) {
    console.error('Error clearing memory', e);
  }
};
