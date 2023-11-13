import { WebSocketServer } from 'ws';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
const PROTO_PATH = './smart_home.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const grpcService = protoDescriptor.smart_home.ClientService;

// Conexão com servidor
const serverAddress = 'localhost:50051';
const client = new grpcService(serverAddress, grpc.credentials.createInsecure());

// ENUMS
const ACTUATOR = { LAMP: "LAMP", THERMOSTAT: "THERMOSTAT", IRRIGATOR: "IRRIGATOR" }
const SENSOR = { PRESENCE: "PRESENCE", TEMPERATURE: "TEMPERATURE", HUMIDITY: "HUMIDITY" }

var availableObjects = [];

// Chamadas para o servidor
function getActuatorValue(type) {
  return new Promise((resolve, reject) => {
    client.GetActuatorValues({ type: type, value: "" }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response.values)
      }
    });
  })
}

function setActuatorValue(type, value) {
  return new Promise((resolve, reject) => {
    client.SetActuatorValues({ type: type, value: value }, (error, response) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log(response)
        if(response?.values?.length > 0 && response.values[0].value.toLowerCase() == value.toLowerCase()) resolve(response.values)
        else reject({type: "error", value: "Não foi possível alterar o valor do objeto"})
      }
    });
  })
}

function getSensorValues() {
  const call = client.GetSensorValues({ type: "" });

  // Recebe os dados da comunicação
  call.on('data', (response) => {
    console.log('Mensagem recebida:', response);
    if(!availableObjects.includes(response.values[0]?.type)) availableObjects.push(response.values[0]?.type);
    
    clientsSockets.forEach(c => {
      if(c?.sensorsObserve){
        let res = { values: response.values, type: response.values[0]?.type}
        c?.socket?.send(JSON.stringify(res))
      }
    })
  });

  // Executado ao fim da comunicação
  call.on('end', () => {
    console.log('Stream de mensagens encerrado');
  });

  // Executado se houver erro na comunicação
  call.on('error', (error) => {
    console.error('Erro no stream de mensagens:', error);
  });
}

// Verify objects in service
getActuatorValue(ACTUATOR.LAMP).then(res => {
  if(res.type != "error") availableObjects.push(ACTUATOR.LAMP);
})
getActuatorValue(ACTUATOR.THERMOSTAT).then(res => {
  if(res.type != "error") availableObjects.push(ACTUATOR.THERMOSTAT);
})
getActuatorValue(ACTUATOR.IRRIGATOR).then(res => {
  if(res.type != "error") availableObjects.push(ACTUATOR.IRRIGATOR);
})

getSensorValues()

// Websocket
const websocket = new WebSocketServer({port: 5001})

var clientsSockets = []
websocket.on("connection", (clientSocket) => {
  clientsSockets.push({
    socket: clientSocket,
    sensorsObserve: false
  });

  clientSocket.send(JSON.stringify({ values: availableObjects, type: "connection"})); // Retornando objetos disponíveis

  clientSocket.on('message', (request) => {
    request = JSON.parse(request)
    switch(request.type){
      case "SET_ACTUATOR":
        setActuatorValue(request.objectType, request.value).then(res => {
          let respose = { values: res, type: request.objectType}
          clientSocket.send(JSON.stringify(respose))
        })
        .catch(err => console.log("Erro ao enviar: ", request))
        break
      case "GET_ACTUATOR":
        getActuatorValue(request.objectType).then(res => {
          let respose = { values: res, type: request.objectType}
          clientSocket.send(JSON.stringify(respose))
        })
        .catch(err => console.log("Erro ao enviar: ", request))
        break
      case "GET_SENSOR":
        clientsSockets = clientsSockets.map(c => {
          if(c.socket == clientSocket){
            c.sensorsObserve = true
          }

          return c
        })
        break
      case "GET_OBJECTS":
        let response = { values: availableObjects, type: "connection"}
        clientSocket.send(JSON.stringify(response));
        break
    }
  })

  clientSocket.on('close', function() {
    console.log("Client saiu")
    clientsSockets = clientsSockets.filter(c => c?.socket !== clientSocket);
  });
})
