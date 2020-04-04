var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);
var isFull = 'False';

function dishwasherCapacity(callback){
    callback(null,{message: 'Dishwasher is full'});
    console.log('Dishwasher full');
}

function setDishwasher(call, callback){
  if(isFull == "True"){
    callback(null,{message: `The Dishwasher is Full,  The Temperature is set to:  ${call.request.temp} Degrees Celcius and Timer set to: ${call.request.timer}`});
  }else{
    callback(null, {message:`Dishwasher is not full`});
  }
}

function startServer(){
  var server = new grpc.Server();
  server.addService(dishwasher_proto.Dishwasher.service,{
  setDishwasher: setDishwasher,
  dishwasherCapacity: dishwasherCapacity
});

  server.bind('0.0.0.0:8002', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
