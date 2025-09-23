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
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);
  const [fireworkDataShape, setFireworkDataShape] = useState(null)
  const [fireworkDataURL, setFireworkDataURL] = useState(null);

  useEffect(() => {
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

    // TODO IMPLEMENT SAVE FUNCTION
    /*
    if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ "id": id, "data": position }));
          }
    */

    // TODO Fix the disconnect logic
    // websocket.onclose = () => console.log('Disconnected from WebSocket server');
    // return () => websocket.close();
  }, []);

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
          console.log(dataURL)
          // TODO Change to set data instead of sending.
          setFireworkDataURL(dataURL);
        }} />}
      />
      <Route path="/marker" element={<ArUco arUcoId={id} />} />
      <Route path="/launch" element={<LaunchScreen />} />
    </Routes>
  )
}

export default App
