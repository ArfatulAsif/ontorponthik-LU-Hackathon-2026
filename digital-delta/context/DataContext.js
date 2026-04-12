import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  NODES as initialNodes,
  EDGES as initialEdges,
  VOLUNTEERS as initialVolunteers,
  INITIAL_INVENTORY as initialInventory,
} from "../data";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [inventory, setInventory] = useState(initialInventory);

  // Inventory CRUD Operations
  const addItem = (item) =>
    setInventory((prev) => [...prev, { ...item, id: Date.now().toString() }]);
  const updateItem = (id, updatedFields) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item,
      ),
    );
  };
  const deleteItem = (id) =>
    setInventory((prev) => prev.filter((item) => item.id !== id));

  // Map CRUD Operations
  const updateEdgeStatus = (edgeId, isFlooded) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId ? { ...edge, is_flooded: isFlooded } : edge,
      ),
    );
  };

  const value = useMemo(
    () => ({
      nodes,
      edges,
      volunteers,
      inventory,
      updateEdgeStatus,
      addItem,
      updateItem,
      deleteItem,
    }),
    [nodes, edges, volunteers, inventory],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
