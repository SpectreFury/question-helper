import { create } from "zustand";

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
}

export type Workspace = {
  _id: string;
  name: string;
};

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));

export { useWorkspaceStore };
