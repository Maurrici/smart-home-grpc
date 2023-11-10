import { ActuatorTypes, SensorTypes } from "../interfaces/ObjectTypes";
import { Row, Col } from 'react-bootstrap';

interface ObjectProps {
    invert?: Boolean,
    isAvailable: boolean,
    type: ActuatorTypes,
    value: string,
    setValue: (type: ActuatorTypes, value: string) => void
}

enum Status {
    on = "ON",
    off = "OFF"
}

const ObjectActuator = ({type, invert=false, isAvailable, value, setValue}: ObjectProps) => {
    const getObjectTitle = (): string => {
        switch(type){
            case ActuatorTypes.LAMP: return "Lâmpada"
            case ActuatorTypes.THERMOSTAT: return "Termostato"
            case ActuatorTypes.IRRIGATOR: return "Irrigador"
        }
    }

    const getObjectImg = () => {
        switch(type){
            case ActuatorTypes.LAMP:
                if (value == Status.on) return <img src="/img/LAMPON.png" alt="" />
                else return <img src="/img/LAMPOFF.png" alt="" />
            case ActuatorTypes.THERMOSTAT: return <img src="/img/THERMOSTAT.png" alt="" />
            case ActuatorTypes.IRRIGATOR:
                if (value == Status.on) return <img src="/img/IRRIGATORON.png" alt="" />
                else return <img src="/img/IRRIGATOROFF.png" alt="" />
        }
    }

    const handleActionLeft = () => {
        if(type == ActuatorTypes.IRRIGATOR && value != Status.on) setValue(type, Status.on);
        if(type == ActuatorTypes.LAMP && value != Status.on) setValue(type, Status.on);
        if(type == ActuatorTypes.THERMOSTAT) setValue(type, (parseInt(value) + 1).toString());
    }

    const handleActionRight = () => {
        if(type == ActuatorTypes.IRRIGATOR && value != Status.off) setValue(type, Status.off);
        if(type == ActuatorTypes.LAMP && value != Status.off) setValue(type, Status.off);
        if(type == ActuatorTypes.THERMOSTAT) setValue(type, (parseInt(value) - 1).toString());
    }

    return(
        <div className={`card-object ${invert ? "invert" : ""} ${isAvailable ? "opacity" : ""}`}>
            <h3>{getObjectTitle()}</h3>
            
            <Row className="align-items-center justify-content-center flex-column h-100 w-100">
                <Col sm={12} className="d-flex justify-content-center mb-2">
                    {getObjectImg()}
                </Col>

                <Col sm={12} className="card-control d-flex justify-content-center">
                    <button className={`left ${value == Status.on ? 'active' : ''}`} onClick={handleActionLeft}>
                        {type == ActuatorTypes.THERMOSTAT ? <img src="/img/arrow.png" width={40} height={40} /> : "Ligar"}
                    </button>

                    {
                        type == ActuatorTypes.THERMOSTAT && <input value={value} type="number" min={0} max={100} onChange={(e) => setValue(ActuatorTypes.THERMOSTAT, e.target.value)} />
                    }

                    <button className={`right ${value == Status.off ? 'active' : ''}`} onClick={handleActionRight}>
                        {type == ActuatorTypes.THERMOSTAT ? <img src="/img/arrow.png" className="rotate" width={40} height={40} /> : "Desligar"}
                    </button>
                </Col>
            </Row>
        </div>
    )
}

export default ObjectActuator;