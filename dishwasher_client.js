var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);

var client = new dishwasher_proto.Dishwasher('localhost:8001', grpc.credentials.createInsecure());
var call = client.dishwasherCapacity();

function configureClient(){
  var client = new dishwasher_proto.Dishwasher('localhost:8001', grpc.credentials.createInsecure());


      call.on('data', function(response){
        call.write({capacity:'100'});
        console.log('Full');
      });


    client.setDishwasher({temp:'150', timer:'60'}, function(err, response){
        console.log(`response: ${response.message}`);
    });
}

configureClient();
