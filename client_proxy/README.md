# Client_Proxy: Servidor com comunicação gRPC e websocket

## Executar Servidor
Na pasta client_proxy, execute o comando:

```
node index.js
```

### Comunicação com o servidor
A comunicação funciona via Websocket rodando na porta 5001 e segue o seguinte padrão em JSON:
```
{
  type: "string",
  objectType: "string",
  value: "string"
}
```

- Tipos de Mensagens:
  1. SET_ACTUATOR : Passando o tipo de Atuador e seu valor, essa mensagem envia uma requisição para alterar o valor de um atuador.

  2. GET_ACTUATOR : Passando o tipo de Atuador, essa mensagem envia uma requisição para obter o valor atual de um atuador. Obs.: O campo value pode ser enviado vazio nessa mensagem.

  3. GET_SENSOR   : Passando o tipo de Sensor, essa mensagem envia uma requisição para receber os valores dos sensores de forma contínua. Obs.: O campo value pode ser enviado vazio nessa mensagem.

  4. GET_OBJECTS  : Essa requisição retorna uma lista com os tipos de objetos disponíveis. Obs.: O campo value e objectType pode ser enviado vazio nessa mensagem.

- Tipos de Objetos:

  Atuadores
  1. LAMP
  2. THERMOSTAT
  3. IRRIGATOR
     
  Sensores
  1. PRESENCE
  2. TEMPERATURE 
  3. HUMIDITY
