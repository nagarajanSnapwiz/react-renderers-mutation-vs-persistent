import { useState } from "react";
import reactLogo from "./assets/react.svg";
//import { Custom } from './renderer/persistent';
import { Canvas } from "./renderer/konva/rendererMutation";
import { range } from "lodash";
import "./App.css";



function App() {
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);

  return (
    <div className="App">
      
      <h1>Canvas Renderer</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <Canvas  width={700} height={400} style={{border:"2px solid #000"}}>
          <layer>
            
            <group>
                {showCircle ? <circle radius={30} x={35} y={80} fill="red" strokeWidth={3} stroke="black" />: null}
            </group>
            <rect x={40} y={40} onClick={ ()=> setShowCircle(!showCircle)} height={20} width={100} fill="yellow" />
            <regularPolygon sides={6} fill="green" shadowColor="rgba(0,0,0,0.3)" shadowOffset={{x:3, y:5}} radius={60} x={160} y={50} />
            {showCircle ? <circle radius={30} x={145} y={80} fill="red" strokeWidth={3} stroke="black" />: null}
          </layer>
        </Canvas>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
