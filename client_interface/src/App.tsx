import {useState, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import ObjectSensor from './components/ObjectSensor';
import ObjectActuator from './components/ObjectActuator';
import './App.css';
import { ActuatorTypes, SensorTypes } from './interfaces/ObjectTypes';

interface ObjectModel {
  id: string
}

function App() {
  const [isConected, setIsConected] = useState<boolean>(false);
  const [objects, setObjects] = useState<ObjectModel[]>([]);

  const socket:WebSocket = new WebSocket('ws://localhost:5001');

  socket.onopen = () => {
    setIsConected(true);
    console.log('Conexão estabelecida com o servidor WebSocket');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Mensagem do servidor:', data);

    if(data.actuatorType == undefined){
      data.forEach((item: string) => {
        let existObject = objects.find(obj => obj.id == item);

        if(existObject == undefined) {
          setObjects([...objects, {
            id: item
          }])
        }
      });
    }
  };

  const handleSendMessage = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'GET_OBJECTS' }));
    }
  };

  const handleSetActuator = (type: ActuatorTypes) => {
    if (socket) {
      const request = { type: 'SET_ACTUATOR', objectType: type, value: 'on' };
      console.log("SET", request);
      socket.send(JSON.stringify(request));
    }
  };

  const objectIsAvailable = (type: ActuatorTypes | SensorTypes) => {
    let existObject = objects.find(item => item.id == type);

    return existObject != undefined
  }

  return (
    <div>
      {!isConected && <h1>Tentando conectar</h1>}
      <button onClick={() => handleSetActuator(ActuatorTypes.LAMP)}>Teste</button>
      <div className="containter">
        <Row className='justify-content-around'>
          <Col sm={12} md={3} className='px-0'>
            <ObjectSensor type={SensorTypes.PRESENCE} isAvailable={objectIsAvailable(SensorTypes.PRESENCE)} value='Ativo' />
            <ObjectSensor type={SensorTypes.TEMPERATURE} isAvailable={objectIsAvailable(SensorTypes.TEMPERATURE)} value='32°C' />
            <ObjectSensor type={SensorTypes.HUMIDITY} isAvailable={objectIsAvailable(SensorTypes.HUMIDITY)} value='60%' />
          </Col>

          <Col sm={12} md={5} className='d-flex flex-column'>
            <div className='d-flex flex-column justify-content-start align-items-center'>
              <img className='logo-ufc' src="/img/ufc.png" />

              <h1>Univesidade Federal do Ceará</h1>

              <h2>Sistemas Distribuídos 2023.2</h2>
            </div>

            <div className='card-control d-flex justify-content-center align-items-center h-100'>
              <button className='update'>Atualizar dispositivos</button>
            </div>
          </Col>

          <Col sm={12} md={3} className='px-0'>
            <ObjectActuator type={ActuatorTypes.LAMP} invert={true} isAvailable={objectIsAvailable(ActuatorTypes.LAMP)} value='ON' />
            <ObjectActuator type={ActuatorTypes.THERMOSTAT} invert={true} isAvailable={objectIsAvailable(ActuatorTypes.THERMOSTAT)} value='28' />
            <ObjectActuator type={ActuatorTypes.IRRIGATOR} invert={true} isAvailable={objectIsAvailable(ActuatorTypes.IRRIGATOR)} value='OFF' />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default App;
