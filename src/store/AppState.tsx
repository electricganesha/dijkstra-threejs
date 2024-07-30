import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
  enableWireframe: boolean;
  setEnableWireframe: (wireframe: boolean) => void;
  enableClouds: boolean;
  setEnableClouds: (clouds: boolean) => void;
}

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      enableWireframe: false,
      enableClouds: true,
      setEnableWireframe: (enableWireframe: boolean) =>
        set({ enableWireframe }),
      setEnableClouds: (enableClouds: boolean) => set({ enableClouds }),
    }),
    {
      name: "appState",
      version: 1,
    }
  )
);
