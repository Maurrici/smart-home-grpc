import { ActuatorTypes, SensorTypes } from "../interfaces/ObjectTypes";
import { Row, Col } from 'react-bootstrap';

interface ObjectProps {
    invert?: Boolean,
    isAvailable: boolean,
    type: SensorTypes,
    value: string
}

const ObjectSensor = ({type, invert=false, isAvailable, value}: ObjectProps) => {
    const getObjectTitle = (): string => {
        switch(type){
            case SensorTypes.PRESENCE:  return "Presença"
            case SensorTypes.TEMPERATURE: return "Temperatura"
            case SensorTypes.HUMIDITY: return "Umidade"
        }
    }

    const getObjectImg = () => {
        switch(type){
            case SensorTypes.PRESENCE:  return <img src="/img/PRESENCE.png" alt="" />
            case SensorTypes.TEMPERATURE: return <img src="/img/TEMPERATURE.png" alt="" />
            case SensorTypes.HUMIDITY: return <img src="/img/HUMIDITY.png" alt="" />
        }
    }

    const getUnitValue = () => {
        switch(type){
            case SensorTypes.PRESENCE:  return ""
            case SensorTypes.TEMPERATURE: return "°C"
            case SensorTypes.HUMIDITY: return "%"
        }
    }

    return(
        <div className={`card-object ${invert ? "invert" : ""} ${isAvailable ? "opacity" : ""}`}>
            <h3>{getObjectTitle()}</h3>
            
            <Row className="align-items-center h-100 w-100">
                <Col sm={6}>
                    {getObjectImg()}
                </Col>

                <Col sm={6} className="card-data text-center">
                    {value} {getUnitValue()}
                </Col>
            </Row>
        </div>
    )
}

export default ObjectSensor;