import {useState, useEffect, useMemo} from 'react';
import { Row, Col } from 'react-bootstrap';
import ObjectSensor from './components/ObjectSensor';
import ObjectActuator from './components/ObjectActuator';
import './App.css';
import { ActuatorTypes, SensorTypes } from './interfaces/ObjectTypes';

interface ObjectModel {
  id: string
  value?: string
}

function App() {
  const [isConected, setIsConected] = useState<boolean>(false);
  const [objects, setObjects] = useState<ObjectModel[]>([]);
  const [intervalRequest, setIntervalRequest] = useState(setInterval(() => {}));

  const socket:WebSocket = useMemo(() => {
    return new WebSocket('ws://localhost:5001');
  }, [])

  socket.onopen = () => {
    setIsConected(true);
    console.log('Conexão estabelecida com o servidor WebSocket');
    updateObjectValues();
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Mensagem do servidor:', data);

    if(data.type == "connection"){
      let objList: ObjectModel[] = []
      data.values.forEach((item: string) => {
        let existObject = objects.find(obj => obj.id == item);

        if(existObject == undefined) objList.push({ id: item });
      });
      
      setObjects(objList);
    }else {
      setObjects(objects.map(obj => {
        if(obj.id == data.type){
          
          obj.value = data?.values[0]?.value
        }

        return obj
      }))
    }
  };

  const handleSendMessage = (type: string, objectType?: string) => {
    if (socket) {
      socket.send(JSON.stringify({ type: type, objectType: objectType }));
    }
  };

  const handleSetActuator = (type: ActuatorTypes, value: string) => {
    if (socket) {
      const request = { type: 'SET_ACTUATOR', objectType: type, value: value };
      socket.send(JSON.stringify(request));
    }
  };

  const objectIsAvailable = (type: ActuatorTypes | SensorTypes) => {
    let existObject = objects.find(item => item.id == type);

    return existObject == undefined
  }

  const getObjectValue = (type: ActuatorTypes | SensorTypes): string => {
    let existObject = objects.find(item => item.id == type);

    if(existObject != undefined && existObject.value){
      return existObject.value
    }

    return ""
  }

  const updateObjectValues =() => {
    handleSendMessage("GET_ACTUATOR", ActuatorTypes.LAMP)
    handleSendMessage("GET_ACTUATOR", ActuatorTypes.THERMOSTAT)
    handleSendMessage("GET_ACTUATOR", ActuatorTypes.IRRIGATOR)
    handleSendMessage("GET_SENSOR", SensorTypes.PRESENCE)
    handleSendMessage("GET_SENSOR", SensorTypes.TEMPERATURE)
    handleSendMessage("GET_SENSOR", SensorTypes.HUMIDITY)
  }

  useEffect(() => {
    clearInterval(intervalRequest)
    setIntervalRequest(setInterval(updateObjectValues, 5000))
  }, [])

  return (
    <div>
      {!isConected && <h1>Tentando conectar</h1>}
      <div className="containter">
        <Row className='justify-content-around'>
          <Col sm={12} md={3} className='px-0'>
            <ObjectSensor 
              type={SensorTypes.PRESENCE} 
              isAvailable={objectIsAvailable(SensorTypes.PRESENCE)} 
              value={getObjectValue(SensorTypes.PRESENCE)} />
              
            <ObjectSensor 
              type={SensorTypes.TEMPERATURE} 
              isAvailable={objectIsAvailable(SensorTypes.TEMPERATURE)} 
              value={getObjectValue(SensorTypes.TEMPERATURE)} />

            <ObjectSensor 
              type={SensorTypes.HUMIDITY} 
              isAvailable={objectIsAvailable(SensorTypes.HUMIDITY)} 
              value={getObjectValue(SensorTypes.HUMIDITY)} />
          </Col>

          <Col sm={12} md={5} className='d-flex flex-column'>
            <div className='d-flex flex-column justify-content-start align-items-center'>
              <img className='logo-ufc' src="/img/ufc.png" />

              <h1>Univesidade Federal do Ceará</h1>

              <h2>Sistemas Distribuídos 2023.2</h2>
            </div>

            <div className='card-control d-flex justify-content-center align-items-center h-100'>
              <button 
                onClick={() => handleSendMessage("GET_OBJECTS")} 
                className='update'>
                  Atualizar dispositivos
              </button>
            </div>
          </Col>

          <Col sm={12} md={3} className='px-0'>
            <ObjectActuator 
              type={ActuatorTypes.LAMP} 
              invert={true} 
              isAvailable={objectIsAvailable(ActuatorTypes.LAMP)} 
              value={getObjectValue(ActuatorTypes.LAMP)}
              setValue={handleSetActuator} 
              />

            <ObjectActuator 
              type={ActuatorTypes.THERMOSTAT} 
              invert={true} 
              isAvailable={objectIsAvailable(ActuatorTypes.THERMOSTAT)} 
              value={getObjectValue(ActuatorTypes.THERMOSTAT)}
              setValue={handleSetActuator}
              />

            <ObjectActuator 
              type={ActuatorTypes.IRRIGATOR} 
              invert={true} 
              isAvailable={objectIsAvailable(ActuatorTypes.IRRIGATOR)} 
              value={getObjectValue(ActuatorTypes.IRRIGATOR)} 
              setValue={handleSetActuator}
              />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default App;
