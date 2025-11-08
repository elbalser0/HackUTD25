import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext({});

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  const addWorkspace = (workspace) => {
    setWorkspaces(prev => [...prev, workspace]);
  };

  const updateWorkspace = (updatedWorkspace) => {
    setWorkspaces(prev => 
      prev.map(ws => ws.id === updatedWorkspace.id ? updatedWorkspace : ws)
    );
    if (currentWorkspace?.id === updatedWorkspace.id) {
      setCurrentWorkspace(updatedWorkspace);
    }
  };

  const value = {
    currentWorkspace,
    workspaces,
    loading,
    selectWorkspace,
    addWorkspace,
    updateWorkspace,
    setLoading,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};