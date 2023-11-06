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
        reject(error)
      } else {
        if(response?.values?.length > 0 && response.values[0].value == value) resolve(response.values)
        else reject({type: "error", value: "Não foi possível alterar o valor do objeto"})
      }
    });
  })
}

function getSensorValues(type) {
  const call = client.GetSensorValues({ type: type });

  // Recebe os dados da comunicação
  call.on('data', (response) => {
    console.log('Mensagem recebida:', response);
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

getActuatorValue(ACTUATOR.IRRIGATOR).then(res => {
  console.log(res);
})

setActuatorValue(ACTUATOR.THERMOSTAT, "29").then(res => {
  console.log(res)
})

getSensorValues(SENSOR.PRESENCE)
