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
} from "../data";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [volunteers, setVolunteers] = useState(initialVolunteers);

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
      updateEdgeStatus,
    }),
    [nodes, edges, volunteers],
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
