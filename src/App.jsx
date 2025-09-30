import Canvas from './Canvas/Canvas';
import ArUco from './ArUco/ArUco';
import LaunchScreen from './LaunchScreen/LaunchScreen';
import Information from './Information/Information'
import ShapePicker from './ShapePicker/ShapePicker';
import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useRefreshRedirect } from './hooks/useRefreshRedirect';

// TODO Add darkmode
// https://medium.com/@chaman388/websockets-in-reactjs-a-practical-guide-with-real-world-examples-2efe483ee150
function App() {
  const navigate = useNavigate();
  const ENABLE_WS = true;

  // Handle refresh redirect to index page
  useRefreshRedirect();
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);
  const [fireworkDataShape, setFireworkDataShape] = useState(null)
  const [fireworkDataURL, setFireworkDataURL] = useState(null);
  const [fireworkDataShapeColor, setFireworkDataShapeColor] = useState("#FF00FF");
  const [fireworkDataShapeSecondColor, setFireworkDataShapeSecondColor] = useState("#FF00FF");
  const [canLaunch, setCanLaunch] = useState(false);

  useEffect(() => {

    if (!ENABLE_WS) return;
    const websocket = new WebSocket("ws://localhost:8765");
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
        console.log(
          "%c Received:" + data,
          "color: #00ff00; background: black; font-family: monospace; font-size: 14px; padding: 2px 6px;"
        );
        console.log("")
        console.log('ID from server:', data.data.id);
        if (data.data.id !== undefined) {
          setId(data.data.id);
        }

        if (data.data.status !== undefined) { // READY TO LAUNCH
          console.log()
          if (data.data.status == "ready") {
            setCanLaunch(true);
          }
        }

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        console.log('Raw message:', event.data);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };



    // TODO Fix the disconnect logic
    // websocket.onclose = () => console.log('Disconnected from WebSocket server');
    // return () => websocket.close();
  }, [ENABLE_WS]);

  const sendFireworkData = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      let jsondata = JSON.stringify({
        "id": id,
        "data": {
          "outer_layer": fireworkDataShape,
          "outer_layer_color": hexStringToNormalizedRGB(fireworkDataShapeColor),
          "outer_layer_second_color": hexStringToNormalizedRGB(fireworkDataShapeSecondColor),
          "inner_layer": fireworkDataURL
        }
      })
      ws.send(jsondata);
      console.log("sent data to server", jsondata);
    }
  }

  const hexStringToNormalizedRGB = (hexString) => {
    hexString = hexString.replace("#", "");
    console.log(hexString);
    let r = parseInt(hexString.slice(0, 2), 16) / 255;
    let g = parseInt(hexString.slice(2, 4), 16) / 255;
    let b = parseInt(hexString.slice(4, 6), 16) / 255;

    return [r, g, b];
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8 pb-20">
        <Routes>
          <Route index element={<Information />} />
          <Route path="/shapePicker" element={<ShapePicker onSaveDataShape={(dataShape, dataShapeColor) => {
            setFireworkDataShape(dataShape);
            setFireworkDataShapeColor(dataShapeColor)
          }} />}
          />
          <Route path="/innerlayer" element={
            <Canvas onSaveDataURL={(dataURL) => {
              setFireworkDataURL(dataURL);
            }} />}
          />
          <Route path="/marker" element={<ArUco arUcoId={id} />} />
          <Route path="/launch" element={<LaunchScreen onSendLaunchData={() => {
            console.log("Send Launch Data")
            sendFireworkData();
          }} canLaunch={true} arUcoId={id} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
