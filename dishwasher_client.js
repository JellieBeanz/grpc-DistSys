var PROTO_PATH = __dirname + '/dishwasher.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var dishwasher_proto = grpc.loadPackageDefinition(packageDefinition);

var client = new dishwasher_proto.Dishwasher('localhost:8002', grpc.credentials.createInsecure());

function setDishwasher(){
    client.setDishwasher({temp:'150', timer:'60'}, function(err, response){
        console.log(`response: ${response.message}`);
    });
}

function dishwasherCapacity(){
  var capacity = ['0','25','50','75','100'];

  console.log('\nCapacity called: ');
  var call = client.dishwasherCapacity(function(error, response){
      call.write({capacity:'100'});
  for (let i = 0; i<capacity.length; i++){
    call.write({capacity:'100'});
  }
    call.end();
  })
}

dishwasherCapacity();
