var PROTO_PATH = __dirname + '/fridge.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var fridge_proto = grpc.loadPackageDefinition(packageDefinition);

//global variable.
var items = [];

//function to set the temperature level in the fridge
function setTemperatureLevel(call, callback){
  //obtain the input from the call from the client
  var templevel = `${call.request.templevel}`;
  //validate the input
  if(templevel > 0 && templevel < 7){
    callback(null, {message: `Fridge temperature level was set to: ` + templevel});
  }else{
    //handle the error in the client console
    callback(null, {message: `Error: invalid input. Please enter a number between 1 - 7.`});
  }
}

//fuction to add items to the fridge
function addItem(call){
  //obtain the item name from the call
  call.on('data', function(request){
  var itemName = `${request.itemName}`;
  console.log(itemName);
  if(itemName == "exit"){
    call.end();
    return;
  }
  items.push(itemName);
  call.write({message: itemName + ' added to fridge'});
});
}

function startServer(){
  var server = new grpc.Server();
  server.addService(fridge_proto.Fridge.service, {
    setTemperatureLevel: setTemperatureLevel,
    addItem: addItem
  });

  server.bind('0.0.0.0:8001', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
