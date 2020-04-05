var PROTO_PATH = __dirname + '/fridge.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var fridge_proto = grpc.loadPackageDefinition(packageDefinition);

//global variable.
var items = [];

//function to set the temperature level in the fridge
function setTemperatureLevel(call, callback){
  console.log('setTemperatureLevel called');
  //obtain the input from the call from the client
  var templevel = `${call.request.templevel}`;
  //validate the input
  if(templevel > 0 && templevel < 7){
    console.log('temp changed to: ' +templevel);
    callback(null, {message: `Fridge temperature level was set to: ` + templevel});
  }else{
    //handle the error in the client console
    callback(null, {message: `Error: invalid input. Please enter a number between 1 - 7.`});
  }
}

//fuction to add items to the fridge
function addRemoveItem(call){
  //obtain the item name from the call
  call.on('data', function(request){

  var itemName = `${request.itemName}`;

  //end the stream on the server
  if(itemName == 'exit' || itemName == ''){
    call.end();
    return;
  }
  var index = items.indexOf(itemName);
  if (index > -1) {
        //In the array!
        items.splice(index, 1);
        call.write({message: itemName + ' Removed from fridge'});
        call.write({message: '\nContents: ' + items})
  } else {
        //Not in the array
        items.push(itemName);
        call.write({message: itemName + ' Added to fridge'});
        call.write({message: '\nContents: ' + items})
    }
        console.log(items);
  });
}

function startServer(){
  var server = new grpc.Server();
  server.addService(fridge_proto.Fridge.service, {
    setTemperatureLevel: setTemperatureLevel,
    addRemoveItem: addRemoveItem
  });

  server.bind('0.0.0.0:8001', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
