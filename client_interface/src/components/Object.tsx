import { ActuatorTypes, SensorTypes } from "../interfaces/ObjectTypes";
import { Row, Col } from 'react-bootstrap';

interface ObjectProps {
    type: ActuatorTypes | SensorTypes
}

const Object = ({type}: ObjectProps) => {
    const getObjectTitle = (): string => {
        switch(type){
            case ActuatorTypes.LAMP: return "Lâmpada"
            case ActuatorTypes.THERMOSTAT: return "Termostato"
            case ActuatorTypes.IRRIGATOR: return "Irrigador"
            case SensorTypes.PRESENCE:  return "Presença"
            case SensorTypes.TEMPERATURE: return "Temperatua"
            case SensorTypes.HUMIDITY: return "Umidade"
        }
    }

    const getObjectImg = () => {
        switch(type){
            case ActuatorTypes.LAMP: return <img src="/img/TEMPERATURE.png" alt="" />
            case ActuatorTypes.THERMOSTAT: return <img src="/img/TEMPERATURE.png" alt="" />
            case ActuatorTypes.IRRIGATOR: return <img src="/img/TEMPERATURE.png" alt="" />
            case SensorTypes.PRESENCE:  return <img src="/img/PRESENCE.png" alt="" />
            case SensorTypes.TEMPERATURE: return <img src="/img/TEMPERATURE.png" alt="" />
            case SensorTypes.HUMIDITY: return <img src="/img/HUMIDITY.png" alt="" />
        }
    }

    return(
        <div className='card-object'>
            <h3>{getObjectTitle()}</h3>
            
            <Row className="align-items-center h-100 w-100">
                <Col sm={6}>
                    {getObjectImg()}
                </Col>

                <Col sm={6} className="card-data text-center">
                    38°C
                </Col>
            </Row>
        </div>
    )
}

export default Object;