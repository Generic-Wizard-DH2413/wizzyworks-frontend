import ArUco from './pages/ArUco/ArUco';
import LaunchScreen from './pages/LaunchScreen/LaunchScreen';
import Information from './pages/Information/Information'
import ShapePicker from './pages/ShapePicker/ShapePicker';
import Canvas from './pages/Canvas/Canvas';
import './App.css';
import FireworkBox from './pages/FireworkBox/FireworkBox'; //new

import { useEffect, useState } from 'react';
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
  const [id, setId] = useState(null);
  const [fireworkDataShape, setFireworkDataShape] = useState(null)
  const [fireworkDataURL, setFireworkDataURL] = useState(null);
  const [fireworkDataShapeColor, setFireworkDataShapeColor] = useState("#FF00FF");
  const [fireworkDataShapeSecondColor, setFireworkDataShapeSecondColor] = useState("#FF00FF");
  const [canLaunch, setCanLaunch] = useState(false);
/*@@@@@@@@@@@@@@@@@@@@@@@@ NEW START @@@@@@@@@@@@@@@@@@@@@@@@*/
  const slotsAmount = 9; // fixed for now (you can make this dynamic later)
  // Each slot is either null (empty), true (reserved/used), or an object (final design)
  const [slots, setSlots] = useState(() => Array(slotsAmount).fill(null));
  // Which slot we’re editing in the design page
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null);

  // Edit handler invoked from FireworkBox (by clicking a specific slot or "Add")
  //will set(update) both slots and selectedSlotIdx and navigate to Design
  const handleEditSlot = (idx) => {
    setSlots(prev => {
      const next = [...prev]; //copy
      // Mark as used if empty (no placeholder object; just true)
      if (!next[idx]) next[idx] = true; //if empty, fill it
      return next;
    });
    setSelectedSlotIdx(idx);
    navigate('/design');
  };

  //TODO
  // When FireworkBox is finished (you decide what "finish" means in your flow)
  const handleFinishBox = (finalSlots) => {
    // e.g., send to backend, or go to a summary page
    console.log('Finish FireworkBox:', finalSlots);
    // navigate('/summary');
  };

  // When DesignProcess completes a design
  //update slots and navigate back to fireworkBox
  const handleDesignDone = (design) => {
    if (selectedSlotIdx == null) {
      // No active slot; just go back
      navigate('/fireworkBox');
      console.log('no slotIdxset');

      return;
    }
    setSlots(prev => {
      const next = [...prev];
      // Store the real design object at that index
      next[selectedSlotIdx] = design; // { type, colors, burstSize } or your shape
      return next;
    });
    navigate('/fireworkBox');
  };

   //Design cancel returns to box and undo any changes
  const handleDesignCancel = () => {
    setSlots(prev => {
      const next = [...prev];
      // Store the real design object at that index
      next[selectedSlotIdx] = null; // { type, colors, burstSize } or your shape
      return next;
    });
    setSelectedSlotIdx(null);
    navigate('/fireworkBox');
  };

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
  //TODO
  /*
 <Route path="/design" element={ //new
              <DesignProcess
                selectedSlotIdx={selectedSlotIdx}
                slots={slots}
                setSlots={setSlots}
                onCancel={handleDesignCancel}
                onDone={handleDesignDone}
              />
               }
            />
  */
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto">
        <Routes>
          <Route index element={<Information />} />
          
          <Route path="/fireworkBox" element={ //new
            <FireworkBox
            slotsAmount={slotsAmount}
            slots={slots}
            setSlots={setSlots}
            onEditSlot={handleEditSlot}
            onFinish={handleFinishBox}
            />
            } 
          />

         
          
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
          <Route path="/launch" element={<LaunchScreen onSendLaunchData={() => {
            console.log("Send Launch Data")
            sendFireworkData();
          }} canLaunch={canLaunch} arUcoId={id} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
