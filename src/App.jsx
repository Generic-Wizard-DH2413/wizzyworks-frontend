import Canvas from './Canvas/Canvas';
import ArUco from './ArUco/ArUco';
import LaunchScreen from './LaunchScreen/LaunchScreen';
import './App.css';
import { useEffect, useState } from 'react';

// https://medium.com/@chaman388/websockets-in-reactjs-a-practical-guide-with-real-world-examples-2efe483ee150
function App() {
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(1); //TODO Change back to null
  const [showArUco, setShowArUco] = useState(false);
  const [shouldLaunch, setShouldLaunch] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket("ws://130.229.164.26:8765");
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
        if (data.id !== undefined) {
          setId(data.id);
        }

        // TODO Implement launch (ready connection from server)
        if (data.shouldLaunch) {
          setShouldLaunch(true);
          setShowArUco(false);
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
  }, []);

  // TODO I know this is ugly, should probably fix this conditional later.
  if (!showArUco && !shouldLaunch) {
    return (
      <>
        <Canvas onSend={(position) => {
          setShowArUco(true);
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ "id": id, "data": position }));
          }
        }} />
      </>
    )
  } else if (!shouldLaunch && showArUco) {
    return (
      <>
        <ArUco arUcoId={id} />
      </>
    )
  } else {
    return (
      <>
        <LaunchScreen />
      </>
    )
  }

}

export default App
