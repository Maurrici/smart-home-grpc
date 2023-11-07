import {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [isConected, setIsConected] = useState<boolean>(false);

  const socket:WebSocket = new WebSocket('ws://localhost:5001');

  socket.onopen = () => {
    setIsConected(true);
    console.log('Conexão estabelecida com o servidor WebSocket');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Mensagem do servidor:', data);
  };

  const handleSendMessage = () => {
    if (socket) {
      console.log("HERE", socket)
      socket.send(JSON.stringify({ type: 'GET_OBJECTS' }));
    }
  };

  const handleSetActuator = () => {
    if (socket) {
      const request = { type: 'SET_ACTUATOR', objectType: 'LAMP', value: 'on' };
      console.log(request);
      socket.send(JSON.stringify(request));
    }
  };

  return (
    <div>
      {!isConected && <h1>Tentando conectar</h1>}
      <button onClick={handleSendMessage}>Get Objects</button>
      <button onClick={handleSetActuator}>Set Lamp</button>
    </div>
  )
}

export default App;
