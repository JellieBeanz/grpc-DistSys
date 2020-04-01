var PROTO_PATH = __dirname + '/fridge.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var fridge_proto = grpc.loadPackageDefinition(packageDefinition);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

var client = new fridge_proto.Fridge('localhost:8001', grpc.credentials.createInsecure());


function setTemperature(){
  readline.question(`Set fridge temperature level to: `, (templevel) => {
    client.setTemperatureLevel({templevel:templevel}, function(err, response){
        console.log(`Response: ${response.message}`);
    });
    readline.close()
  })
}

function addItem(){
  readline.question('What Item would you like to add to the fridge: ', (itemName) => {
    client.addItem({itemName:itemName}, function(err, response){
      console.log(`Response: ${response.message}`);
    });
    readline.close()
  })
}


addItem();
setTemperature();
