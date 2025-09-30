import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import ShoppingListItem from "./src/components/ShoppingListItem";
import { Item } from "./src/components/ShoppingListItemType.types";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfettiCannon from "react-native-confetti-cannon";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateRecipeFromIngredients } from "./src/services/aiService";
import { SparklesIcon, BroomIcon, ScheduleIcon } from "./src/components/Icons";
import { requestNotificationPermissionsAsync } from "./src/services/notificationService";
import * as Notifications from "expo-notifications";

const STORAGE_KEY = "@grocery_list_items";
const GROQ_API_KEY = Constants.expoConfig?.extra?.groqApiKey;

export default function App() {
  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedItems !== null) {
          setItems(JSON.parse(storedItems));
        }
      } catch (e) {
        console.error("Failed to load items from storage", e);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    const saveItems = async () => {
      try {
        const stringifiedItems = JSON.stringify(items);
        await AsyncStorage.setItem(STORAGE_KEY, stringifiedItems);
      } catch (e) {
        console.error("Failed to save items to storage", e);
      }
    };
    if (items) {
      saveItems();
    }
  }, [items]);

  const handleAddItem = () => {
    if (item.trim() === "") return;
    const newItem: Item = {
      id: Date.now().toString(),
      text: item,
      isCompleted: false,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setItem("");
    Keyboard.dismiss();
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () =>
          setItems((prevItems) => prevItems.filter((item) => item.id !== id)),
        style: "destructive",
      },
    ]);
  };

  const handleToggleComplete = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleClearCompleted = () => {
    Alert.alert(
      "Clear Completed",
      "Are you sure you want to clear all completed items?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () =>
            setItems((prevItems) =>
              prevItems.filter((item) => !item.isCompleted)
            ),
          style: "destructive",
        },
      ]
    );
  };

  const handleGenerateRecipe = async () => {
    const ingredients = items
      .filter((item) => !item.isCompleted)
      .map((item) => item.text);

    if (ingredients.length < 2) {
      Alert.alert(
        "Not Enough Ingredients",
        "Please add at least two items to generate a recipe."
      );
      return;
    }

    if (!GROQ_API_KEY) {
      Alert.alert(
        "API Key Missing",
        "Please make sure your Groq API Key is configured correctly in your .env file and restart the app."
      );
      return;
    }

    setIsGenerating(true);

    try {
      const recipeText = await generateRecipeFromIngredients(
        ingredients,
        GROQ_API_KEY
      );
      Alert.alert("Recipe Idea!", recipeText);
    } catch (error: any) {
      Alert.alert("AI Error", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScheduleNotification = async () => {
    const permissionStatus = await requestNotificationPermissionsAsync();

    if (permissionStatus === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🛒 Shopping Reminder!",
          body: "Don't forget to pick up groceries.",
          sound: true,
        },
        // @ts-ignore - This comment tells TypeScript to ignore the incorrect error on the next line.
        trigger: {
          type: "timeInterval",
          seconds: 5,
          repeats: false,
        },
      });

      Alert.alert("Reminder Scheduled", "You will be reminded in 5 seconds.");
    } else {
      Alert.alert(
        "Permissions Required",
        "Please enable notifications in your device settings to use this feature."
      );
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) => Number(a.isCompleted) - Number(b.isCompleted)
    );
  }, [items]);

  const allTasksCompleted = useMemo(() => {
    if (items.length === 0) return false;
    return items.every((item) => item.isCompleted);
  }, [items]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <Text style={styles.title}>Grocery List</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., Avocados"
              placeholderTextColor="#9CA3AF"
              value={item}
              onChangeText={setItem}
            />
            <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sortedItems}
            renderItem={({ item }) => (
              <ShoppingListItem
                item={item}
                onDelete={handleDeleteItem}
                onToggleComplete={handleToggleComplete}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleClearCompleted}
          >
            <BroomIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleGenerateRecipe}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <SparklesIcon />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleScheduleNotification}
          >
            <ScheduleIcon />
          </TouchableOpacity>
        </View>

        {allTasksCompleted && (
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#111827" },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    marginTop: 50,
  },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "#374151",
    color: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: { color: "#FFF", fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#374151",
    backgroundColor: "#1F2937",
  },
  footerButton: {
    backgroundColor: "#4B5563",
    padding: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
