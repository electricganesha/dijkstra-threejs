import GUI from "lil-gui";
import { useAppState } from "../store/AppState";

export const GUIComponent = () => {
  const setEnableWireframe = useAppState((s) => s.setEnableWireframe);
  const setEnableClouds = useAppState((s) => s.setEnableClouds);

  const myObject = {
    wireframe: false,
    clouds: true,
  };
  const gui = new GUI();

  gui
    .add(myObject, "wireframe")
    .onChange((value: boolean) => setEnableWireframe(value));
  gui.add(myObject, "clouds").onChange((value: boolean) => {
    setEnableClouds(value);
  });
  return null;
};
