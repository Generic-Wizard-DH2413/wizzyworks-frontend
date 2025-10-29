import ArUco from './pages/ArUco/ArUco';
import LaunchScreen from './pages/LaunchScreen/LaunchScreen';
import Information from './pages/Information/Information'
import ShapePicker from './pages/ShapePicker/ShapePicker';
import Canvas from './pages/Canvas/Canvas';
import './App.css';
import FireworkBox from './pages/FireworkBox/FireworkBox';
import PresenterDesign from './pages/Design/PresenterDesign';

/* TODO Press launch (marker will show) → Wait for signal from bridge → When signal is there → remove marker and start start animation.  */
import { useEffect, useState } from 'react';
import { useFireworkStore } from '@/store/useFireworkStore';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useRefreshRedirect } from './hooks/useRefreshRedirect';
import { usePreventBackButton } from './hooks/usePreventBackButton';

// TODO Add darkmode
// https://medium.com/@chaman388/websockets-in-reactjs-a-practical-guide-with-real-world-examples-2efe483ee150
function App() {
  const navigate = useNavigate();
  const ENABLE_WS = true;

  // Handle refresh redirect to index page
  useRefreshRedirect();

  // Prevent browser back button navigation
  usePreventBackButton(
    true, // Enable back button prevention
    () => {
      // Optional callback when back is attempted
      console.log('User attempted to navigate back - prevented');
    },
    false // Set to true if you want to show confirmation dialog
  );

  //component local state (application)
  //re-render of a component when a state-setters are called
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null); //ArUco id
  const [fireworkDataShape, setFireworkDataShape] = useState(null)
  const [fireworkDataURL, setFireworkDataURL] = useState(null);
  const [fireworkDataShapeColor, setFireworkDataShapeColor] = useState("#FF00FF");
  const [fireworkDataShapeSecondColor, setFireworkDataShapeSecondColor] = useState("#FF00FF");
  //const [canLaunch, setCanLaunch] = useState(false);
  //const [shouldLaunch, setShouldLaunch] = useState(false);

  /*@@@@@@@@@@@@@@@@@@@@@@@@ NEW START @@@@@@@@@@@@@@@@@@@@@@@@*/
  const slots = useFireworkStore((state) => state.slots);
  const canLaunch = useFireworkStore((state) => state.canLaunch);
  const shouldLaunch = useFireworkStore((state) => state.shouldLaunch);
  const { setCanLaunch, setShouldLaunch } = useFireworkStore();
  






  /*@@@@@@@@@@@@@@@@@@@@@@@@ NEW END @@@@@@@@@@@@@@@@@@@@@@@@*/


  useEffect(() => {

    if (!ENABLE_WS) return;

    // Debug environment variables
    // console.log('Environment variables:', {
    //   VITE_WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL,
    //   all_env: import.meta.env
    // });

    const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8765";

    if (!import.meta.env.VITE_WEBSOCKET_URL) {
      console.warn('VITE_WEBSOCKET_URL not found, using fallback URL');
    }

    const websocket = new WebSocket(websocketUrl);
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
          if (data.data.status == "ready") {
            console.log("Can launch true")
            setCanLaunch(true);
          }
        }

        if (data.data.status !== undefined) { // READY TO LAUNCH
          if (data.data.status == "launch") {
            console.log("Should launch true")
            setShouldLaunch(true);
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
  /* OLD VER
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
    }*/

  const hexStringToNormalizedRGB = (hexString) => {
    if (!hexString) {
      return null;
    }

    hexString = hexString.replace("#", "");
    let r = parseInt(hexString.slice(0, 2), 16) / 255;
    let g = parseInt(hexString.slice(2, 4), 16) / 255;
    let b = parseInt(hexString.slice(4, 6), 16) / 255;

    return [r, g, b];
  }

  const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
  const normalizeSettings = (value, min = 10, max = 100) => {
    return clamp01((value - min) / (max - min));
  }

  const buildJSONFireworkFromSlot = (slot, idx) => {
    const { type, color1, color2, launchSpeed, launchWobble, specialFxStr, drawing } = slot;

    return {
      //same JSON names as before
      outer_layer: type.godotName, // previously known as fireworkDataShape
      outer_layer_color: hexStringToNormalizedRGB(color1), // prev fireworkDataShapeColor
      outer_layer_second_color: hexStringToNormalizedRGB(color2), //prev fireworkDataShapeSecondColor
      //outer_layer_size: normalizeSettings(burstSize), // REMOVED
      path_speed: normalizeSettings(launchSpeed), // new field; default 0.5 if missing
      path_wobble: normalizeSettings(launchWobble), // new field; default 0.5 if missing
      outer_layer_specialfx: normalizeSettings(specialFxStr), // new field; default 0.5 if missing
      inner_layer: drawing, // prev fireworkDataURL

      // (Optional but handy for the server/debugging), curr not passed inside Design page
      //slot_index: idx,
    };
  };

  const sendFireworkData = () => {
    // Concat only the filled slots and turn into JSON format
    const fireworks = slots
      .map((slot, idx) => (slot ? buildJSONFireworkFromSlot(slot, idx) : null))
      .filter(Boolean);

    const payload = { id, fireworks }; //{ id, fireworks: [ { ... }, { ... } ] }
    console.log('payload looks like:')
    console.log(payload);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WS not open; skipping send");
      return;
    }

    try {
      ws.send(JSON.stringify(payload));
      console.log("Sent fireworks payload:", payload);
    } catch (err) {
      console.error("Failed to send fireworks payload:", err);
    }
  }





  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto">
        <Routes>
          <Route index element={<Information />} />

          <Route
            path="/fireworkBox"
            element={
              <FireworkBox
                onFinishBox={() => {
                  console.log("Send Launch Data")
                  sendFireworkData();
                }}
              />
            }
          />
          <Route path="/design" element={<PresenterDesign />} />



          <Route path="/shapePicker" element={<ShapePicker onSaveDataShape={(dataShape, dataShapeColor) => { //props down
            setFireworkDataShape(dataShape); //pass setter
            setFireworkDataShapeColor(dataShapeColor) //pass setter
          }} />}
          />
          <Route path="/innerlayer" element={
            <Canvas onSaveDataURL={(dataURL) => {
              setFireworkDataURL(dataURL);
            }} />}
          />
          <Route path="/marker" element={<ArUco arUcoId={id} />} />

          <Route path="/launch" element={<LaunchScreen arUcoId={id /*from on msg*/} />} //canLunch={canLaunch} shouldLaucnh={shouldLaunch}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
