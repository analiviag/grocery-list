import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TrashIcon, CircleIcon, CheckCircleIcon } from "./Icons";
import { Item } from "./ShoppingListItemType.types";

interface ShoppingListItemProps {
  item: Item;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const ShoppingListItem = ({
  item,
  onDelete,
  onToggleComplete,
}: ShoppingListItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemInfo}
        onPress={() => onToggleComplete(item.id)}
      >
        {item.isCompleted ? <CheckCircleIcon /> : <CircleIcon />}
        <Text
          style={[
            styles.itemText,
            item.isCompleted && styles.itemTextCompleted,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <TrashIcon />
      </TouchableOpacity>
    </View>
  );
};

//Styles
const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemText: {
    color: "#F3F4F6",
    fontSize: 18,
    margin: 0,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
});

export default ShoppingListItem;
