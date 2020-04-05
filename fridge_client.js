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
var call = client.addRemoveItem();

call.on('data', function(response){
    console.log(`\nResponse: ${response.message}`);
});
//set the temperature level of the fridge
function setTemperature(){
  readline.question(`Set fridge temperature level to: `, (templevel) => {
    client.setTemperatureLevel({templevel:templevel}, function(err, response){
        console.log(`Response: ${response.message}`);
    });
  })
}
//Bidirectional Streaming of items in and out of the fridge
function addRemoveItem(){
  //time out function to position lines and allow for an asychronous call callback
  setTimeout(function(){
  readline.question('\nWhat Item would you like to add or remove from the fridge: ', (itemName) => {
    //to end the stream and call set temperature
    if(itemName == '' || itemName == 'exit'){
      setTemperature();
      }

    call.write({itemName:itemName})
    addRemoveItem();
  })
 }, 500);
}

addRemoveItem();
