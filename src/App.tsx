import { useState } from "react";
import { Canvas } from "./renderer/konva/rendererMutation";
//import { Canvas } from "./renderer/konva/rendererPersistent";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [showCircle, setShowCircle] = useState(false);
  const [cursorPointer, setCursorPointer] = useState(false);

  return (
    <div className="App">
      <h1>Canvas Renderer</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <Canvas
          width={500}
          height={400}
          style={{
            border: "2px solid #000",
            ...(cursorPointer ? { cursor: "pointer" } : {}),
          }}
        >
          <layer>
            <group>
              {showCircle ? (
                <circle
                  radius={30}
                  x={35}
                  y={80}
                  fill="red"
                  strokeWidth={3}
                  stroke="black"
                />
              ) : null}
            </group>
            <rect
              x={40}
              stroke="blue"
              strokeWidth={showCircle ? 2 : 6}
              //@ts-ignore
              shadowColor={cursorPointer ? "rgba(0,0,0,0.3)" : "transparent"}
              shadowOffset={{ x: 3, y: 5 }}
              onMouseEnter={() => setCursorPointer(true)}
              onMouseLeave={() => setCursorPointer(false)}
              y={40}
              onClick={() => setShowCircle(!showCircle)}
              height={20}
              width={100}
              fill="yellow"
            />
            {count % 2 === 0 ? (
              <regularPolygon
                sides={6}
                fill="green"
                shadowColor="rgba(0,0,0,0.3)"
                shadowOffset={{ x: 3, y: 5 }}
                radius={60}
                x={160}
                y={50}
              />
            ) : null}
            {showCircle ? (
              <circle
                radius={30}
                x={145}
                y={80}
                fill="red"
                strokeWidth={3}
                stroke="black"
              />
            ) : null}
          </layer>
        </Canvas>
        <p>Click on the yellow rectangle</p>
      </div>
    </div>
  );
}

export default App;
