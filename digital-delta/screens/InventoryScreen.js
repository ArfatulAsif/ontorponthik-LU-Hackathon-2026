import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
} from "react-native";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const theme = {
  primary: "#F04E36",
  secondary: "#081F2E",
  background: "#F9FAFB",
  white: "#FFFFFF",
  gray: "#94A3B8",
  lightGray: "#E2E8F0",
  success: "#2FC94E",
};

export default function InventoryScreen({ navigation }) {
  const { inventory, addItem, deleteItem, updateItem } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", sku: "", quantity: "" });

  // Modal States
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    name: "",
    sku: "",
    quantity: "",
    category: "",
  });

  // Initialize edit fields when an item is selected
  useEffect(() => {
    if (selectedItem) {
      setEditFields({
        name: selectedItem.name,
        sku: selectedItem.sku,
        quantity: selectedItem.quantity.toString(),
        category: selectedItem.category || "General",
      });
    } else {
      setIsEditing(false);
    }
  }, [selectedItem]);

  const handleSaveUpdate = () => {
    updateItem(selectedItem.id, {
      name: editFields.name,
      sku: editFields.sku,
      quantity: parseInt(editFields.quantity) || 0,
      category: editFields.category,
      timestamp: new Date().toLocaleDateString(), // Update the timestamp on edit
    });
    setSelectedItem(null); // Close modal after save
    setIsEditing(false);
  };

  const handleAdd = () => {
    if (newItem.name && newItem.sku) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      addItem({
        ...newItem,
        quantity: parseInt(newItem.quantity) || 0,
        category: "Active Supply",
        timestamp: new Date().toLocaleDateString(),
      });
      setNewItem({ name: "", sku: "", quantity: "" });
      setIsAdding(false);
    }
  };

  const handleConfirmDelete = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteItem(confirmDelete.id);
    setConfirmDelete({ visible: false, id: null });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        <Pressable
          style={styles.mainInfo}
          onPress={() => setSelectedItem(item)}
        >
          <View style={styles.skuRow}>
            <Text style={styles.skuText}>{item.sku}</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    item.quantity > 0 ? theme.success : theme.primary,
                },
              ]}
            />
          </View>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.categoryText}>{item.category || "General"}</Text>
        </Pressable>

        <View style={styles.stockActionArea}>
          <View style={styles.quantityContainer}>
            <Text style={styles.qtyLabel}>STOCK</Text>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
          </View>
          <Pressable
            onPress={() => setConfirmDelete({ visible: true, id: item.id })}
            style={styles.trashBtn}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color={theme.primary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconCircle}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={theme.secondary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Registry</Text>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setIsAdding(!isAdding);
          }}
          style={[
            styles.iconCircle,
            isAdding && { backgroundColor: theme.primary },
          ]}
        >
          <MaterialCommunityIcons
            name={isAdding ? "close" : "plus"}
            size={24}
            color={isAdding ? theme.white : theme.secondary}
          />
        </Pressable>
      </View>

      {isAdding && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Item Description"
            value={newItem.name}
            onChangeText={(t) => setNewItem({ ...newItem, name: t })}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="SKU"
              value={newItem.sku}
              onChangeText={(t) => setNewItem({ ...newItem, sku: t })}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Qty"
              keyboardType="numeric"
              value={newItem.quantity}
              onChangeText={(t) => setNewItem({ ...newItem, quantity: t })}
            />
          </View>
          <Pressable style={styles.submitBtn} onPress={handleAdd}>
            <Text style={styles.submitText}>ADD TO INVENTORY</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Item Details & Edit Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.detailsContent]}>
            <View style={styles.detailsHeader}>
              <Pressable
                onPress={() => setIsEditing(!isEditing)}
                style={[
                  styles.editToggleBtn,
                  isEditing && { backgroundColor: theme.success },
                ]}
              >
                <MaterialCommunityIcons
                  name={isEditing ? "check" : "pencil"}
                  size={20}
                  color={isEditing ? theme.white : theme.secondary}
                />
              </Pressable>
              <Pressable
                onPress={() => setSelectedItem(null)}
                style={styles.closeModalBtn}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.gray}
                />
              </Pressable>
            </View>

            {isEditing ? (
              <View style={styles.editFormContainer}>
                <Text style={styles.editHeading}>Edit Information</Text>
                <TextInput
                  style={styles.detailInput}
                  value={editFields.name}
                  onChangeText={(t) =>
                    setEditFields({ ...editFields, name: t })
                  }
                  placeholder="Item Name"
                />
                <TextInput
                  style={styles.detailInput}
                  value={editFields.sku}
                  onChangeText={(t) => setEditFields({ ...editFields, sku: t })}
                  placeholder="SKU Code"
                />
                <View style={styles.detailGrid}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Units</Text>
                    <TextInput
                      style={styles.detailValueInput}
                      value={editFields.quantity}
                      keyboardType="numeric"
                      onChangeText={(t) =>
                        setEditFields({ ...editFields, quantity: t })
                      }
                    />
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <TextInput
                      style={styles.detailValueInput}
                      value={editFields.category}
                      onChangeText={(t) =>
                        setEditFields({ ...editFields, category: t })
                      }
                    />
                  </View>
                </View>
                <Pressable
                  style={[
                    styles.detailActionBtn,
                    { backgroundColor: theme.success },
                  ]}
                  onPress={handleSaveUpdate}
                >
                  <Text style={styles.submitText}>SAVE UPDATES</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={styles.detailSku}>{selectedItem?.sku}</Text>
                <Text style={styles.detailName}>{selectedItem?.name}</Text>
                <View style={styles.detailGrid}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Current Stock</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem?.quantity} Units
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem?.category || "General"}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={styles.detailActionBtn}
                  onPress={() => setSelectedItem(null)}
                >
                  <Text style={styles.submitText}>CLOSE</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={confirmDelete.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteIconCircle}>
              <MaterialCommunityIcons
                name="trash-can"
                size={30}
                color={theme.primary}
              />
            </View>
            <Text style={styles.modalTitle}>Remove Item?</Text>
            <Text style={styles.modalText}>
              This will permanently erase this SKU from the Registry.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setConfirmDelete({ visible: false, id: null })}
              >
                <Text style={styles.btnText}>KEEP</Text>
              </Pressable>
              <Pressable
                style={styles.confirmBtn}
                onPress={handleConfirmDelete}
              >
                <Text style={[styles.btnText, { color: theme.white }]}>
                  DELETE
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: theme.secondary },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: theme.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  cardWrapper: { marginBottom: 12 },
  card: {
    backgroundColor: theme.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  mainInfo: { flex: 1, marginRight: 10 },
  skuRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  skuText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.gray,
    letterSpacing: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 8 },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.secondary,
    marginBottom: 2,
  },
  categoryText: { fontSize: 12, color: theme.gray, fontWeight: "500" },
  stockActionArea: { flexDirection: "row", alignItems: "center" },
  quantityContainer: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 60,
  },
  qtyLabel: { fontSize: 8, fontWeight: "800", color: theme.gray },
  qtyValue: { fontSize: 18, fontWeight: "900", color: theme.secondary },
  trashBtn: {
    marginLeft: 12,
    padding: 10,
    backgroundColor: "rgba(240, 78, 54, 0.05)",
    borderRadius: 12,
  },

  // Edit/Detail Modal Styles
  detailsContent: { width: "90%", paddingBottom: 30 },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  editToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalBtn: { padding: 5 },
  editHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.secondary,
    marginBottom: 15,
  },
  detailSku: {
    fontSize: 12,
    fontWeight: "800",
    color: theme.primary,
    letterSpacing: 2,
    marginBottom: 5,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.secondary,
    marginBottom: 25,
  },
  detailGrid: { flexDirection: "row", gap: 15, marginBottom: 20 },
  detailBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.lightGray,
  },
  detailLabel: {
    fontSize: 10,
    color: theme.gray,
    fontWeight: "700",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  detailValue: { fontSize: 16, fontWeight: "800", color: theme.secondary },
  detailInput: {
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.lightGray,
  },
  detailValueInput: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.secondary,
    padding: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },
  infoText: { fontSize: 12, color: theme.gray },
  detailActionBtn: {
    backgroundColor: theme.secondary,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
  },

  // Add Form & Global Modals
  addForm: {
    backgroundColor: theme.white,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    elevation: 4,
    gap: 12,
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.lightGray,
    color: theme.secondary,
  },
  inputRow: { flexDirection: "row", gap: 10 },
  submitBtn: {
    backgroundColor: theme.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    color: theme.white,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8, 31, 46, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  modalContent: {
    backgroundColor: theme.white,
    borderRadius: 30,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  deleteIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(240, 78, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.secondary,
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
    color: theme.gray,
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: "center",
  },
  btnText: { fontWeight: "700", fontSize: 14 },
});
