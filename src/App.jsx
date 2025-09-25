import Canvas from './Canvas/Canvas';
import ArUco from './ArUco/ArUco';
import LaunchScreen from './LaunchScreen/LaunchScreen';
import Information from './Information/Information'
import ShapePicker from './ShapePicker/ShapePicker';
import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";

// https://medium.com/@chaman388/websockets-in-reactjs-a-practical-guide-with-real-world-examples-2efe483ee150
function App() {
  const ENABLE_WS = false;
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);
  const [fireworkDataShape, setFireworkDataShape] = useState(null)
  const [fireworkDataURL, setFireworkDataURL] = useState(null);
  const [fireworkDataShapeColor, setFireworkDataShapeColor] = useState([0, 0, 0]);
  const [fireworkDataShapeSecondColor, setFireworkDataShapeSecondColor] = useState([0, 0, 0]);

  useEffect(() => {
    if (!ENABLE_WS) return;
    const websocket = new WebSocket("ws://130.229.164.4:8765");
    setWs(websocket);

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      // Send initial connection message with origin info
      websocket.send(JSON.stringify({
        type: "connection",
        origin: window.location.origin,
        userAgent: navigator.userAgent
      }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        // TODO Set ID
        console.log('ID from server:', data.data.id);
        if (data.data.id !== undefined) {
          setId(data.data.id);
        }

        // TODO Implement launch (ready connection from server)
        if (data.shouldLaunch) {
          // TODO Switch on launch
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.log('Raw message:', event.data);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const sendFireworkData = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          "id": id,
          "data": {
            "outer_layer": fireworkDataShape,
            "outer_layer_color": hexStringToNormalizedRGB(fireworkDataShapeColor),
            "outer_layer_second_color": hexStringToNormalizedRGB(fireworkDataShapeSecondColor),
            "inner_layer": fireworkDataURL
          }
        }));
      }
    }

    // TODO Fix the disconnect logic
    // websocket.onclose = () => console.log('Disconnected from WebSocket server');
    // return () => websocket.close();
  }, [ENABLE_WS]);

  const hexStringToNormalizedRGB = (hexString) => {
    hexString = hexString.replace("#", "");

    let r = parseInt(hexString.slice(0, 2), 16) / 255;
    let g = parseInt(hexString.slice(2, 4), 16) / 255;
    let b = parseInt(hexString.slice(4, 6), 16) / 255;

    return [r, g, b];
  }

  return (
    <Routes>
      <Route index element={<Information />} />
      <Route path="/shapePicker" element={<ShapePicker onSaveDataShape={(dataShape) => {
        console.log(dataShape)
        setFireworkDataShape(dataShape);
      }} />}
      />
      <Route path="/innerlayer" element={
        <Canvas onSaveDataURL={(dataURL) => {
          setFireworkDataURL(dataURL);
        }} />}
      />
      <Route path="/marker" element={<ArUco arUcoId={id} />} />
      <Route path="/launch" element={<LaunchScreen />} />
    </Routes>
  )
}

export default App
