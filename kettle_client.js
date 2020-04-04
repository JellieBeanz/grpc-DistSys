var PROTO_PATH = __dirname + '/kettle.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var kettle_proto = grpc.loadPackageDefinition(packageDefinition);

function configureClient(){
  var client = new kettle_proto.Kettle('localhost:8000', grpc.credentials.createInsecure());

      client.boilKettle({on:'Yes'}, function(err, response){
         console.log(`Response: ${response.message}`);
     });

      var call = client.boilingStatus({on:'Yes'});

          call.on('data', function(response){
              console.log(`Response: ${response.boilState}`);
          });

        call.on('end', function(){
          console.log('end');
      });

  }


configureClient();
