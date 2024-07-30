import { GUIComponent } from "./components/GUI";
import { Scene } from "./components/Scene";
import "./index.css";

export default function App() {
  return (
    <div className="App">
      <p>
        Click on two consecutive points to draw the shortest path between them
      </p>
      <Scene />
      <GUIComponent />
    </div>
  );
}
