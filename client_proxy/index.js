import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

// Carregar o arquivo .proto
const PROTO_PATH = './thermostat.proto'; // Substitua pelo caminho correto do seu arquivo .proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const thermostatService = protoDescriptor.thermostat.ThermostatService; // Substitua 'thermostat_package' pelo nome do pacote no seu arquivo .proto

// Conectar ao servidor gRPC Python
const pythonServerAddress = 'localhost:50051'; // Substitua pelo endereço do servidor gRPC Python
const client = new thermostatService(pythonServerAddress, grpc.credentials.createInsecure());

// Exemplo de chamada a um método no servidor gRPC Python
client.UpdateDesiredTemperature({ temperature: 25.0 }, (error, response) => {
  if (error) {
    console.error('Erro ao chamar o método UpdateDesiredTemperature:', error);
  } else {
    console.log('Resposta do servidor Python:', response);
  }
});
