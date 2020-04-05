var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);
var isFull = 'False';

function dishwasherCapacity(call, callback) {
  //process data that comes on from client
  call.on('data', function(data){
     console.log('capacity is at: ' + data.capacity + '%');
  });

  call.on('end', function() {
    isFull = 'True'
    callback(null, {message:'Dishwasher is now Full' });
  });
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
  // clientStreaming: clientStreaming
});

  server.bind('0.0.0.0:8002', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
