import Canvas from './Canvas/Canvas';
import './App.css';
import { useEffect, useState } from 'react';

// https://medium.com/@chaman388/websockets-in-reactjs-a-practical-guide-with-real-world-examples-2efe483ee150
function App() {
  const [ws, setWs] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    // const websocket = new WebSocket('ws://localhost:8765');
    const websocket = new WebSocket("ws://localhost:8765");
    setWs(websocket);

    websocket.onopen = () => console.log('Connected to WebSocket server');
    websocket.onmessage = (event) => {
      setId(event.data.id);
      // TODO setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    // websocket.onclose = () => console.log('Disconnected from WebSocket server');

    // return () => websocket.close();
  }, []);

  return (
    <>
      {/*Add websocket*/}
      <Canvas onSend={(position) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ "id": id, "data": position }));
        }
      }} /> {/*TODO Send data from this component up to this level. */}
    </>
  )
}

export default App
