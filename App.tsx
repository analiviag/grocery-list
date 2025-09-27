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
} from "react-native";
import React, { useState, useMemo } from "react";
import ShoppingListItem from "./src/components/ShoppingListItem";
import { Item } from "./src/components/ShoppingListItemType.types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<Item[]>([
    { id: "1", text: "Tomatoes", isCompleted: false },
    { id: "2", text: "Onions", isCompleted: false },
  ]);

  const handleAddItem = () => {
    if (item.trim() === "") return;
    const newItem: Item = {
      id: Date.now().toString(),
      text: item,
      isCompleted: false, // New items are not completed
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setItem("");
    Keyboard.dismiss();
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) => Number(a.isCompleted) - Number(b.isCompleted)
    );
  }, [items]);

  return (
    <>
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
              <TouchableOpacity
                onPress={handleAddItem}
                style={styles.addButton}
              >
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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}

//Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
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
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
