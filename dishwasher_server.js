var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);

function setDishwasher(call, callback){
  var isFull = `${call.request.isFull}`;
  if(isFull == "True"){
    callback(null,{message: `The Dishwasher is Full,  The Temperature is set to:  ${call.request.temp} Degrees Celcius and Timer set to: ${call.request.timer}`});
  }else{
    callback(null, {message:`Dishwasher is not full`});
  }
}

function startServer(){
  var server = new grpc.Server();
  server.addService(dishwasher_proto.Dishwasher.service,{
  setDishwasher: setDishwasher
});

  server.bind('0.0.0.0:8001', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
