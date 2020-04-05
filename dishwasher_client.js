var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);

var client = new dishwasher_proto.Dishwasher('localhost:8002', grpc.credentials.createInsecure());

function setDishwasher(){
  setTimeout(function(){
      client.setDishwasher({temp:'150', timer:'60'}, function(err, response){
          console.log(`response: ${response.message}`);
      });
    },2000);
}

function dishwasherCapacity(callback){
  const numbers = ['0','20','40','60','80','100'];

  var call = client.dishwasherCapacity(function(error, number){
     console.log('Response: ' + number.message);
  });

  for(let number of numbers){
    call.write({capacity: number});
  }
   call.end();
   setDishwasher();
}

dishwasherCapacity();
