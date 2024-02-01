
import { create } from "zustand";

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
}

export type Question = {
  question: string;
  answer: string;
};

export type Quiz = {
  question: string;
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
  selectedAnswer?: string;
};

export type Workspace = {
  _id: string;
  name: string;
  user: string;
  questions: Question[];
  quiz: Quiz[];
};

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
}));

export { useWorkspaceStore };