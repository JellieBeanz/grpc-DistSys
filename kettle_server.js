var PROTO_PATH = __dirname + '/kettle.proto';

var grpc = require('grpc');


var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var kettle_proto = grpc.loadPackageDefinition(packageDefinition);

function boilKettle(call, callback){
    callback(null, {message: `Kettle is boiling: ${call.request.on}`});
}

function boilingStatus(call){

  var status = call.request.on;
  var i = 0;
  if(status == "Yes"){
      setInterval(function(){
        i = ++i %360;
        call.write({boilState: `Kettle is boiled to ${i} Degrees Celcius`});
        if(i == 100){
          call.write({boilState: 'Kettle is fully boiled'});
          call.end();
        }
      }, 500);

  }
}

function startServer(){
  var server = new grpc.Server();
  server.addService(kettle_proto.Kettle.service, {
    boilKettle: boilKettle,
    boilingStatus: boilingStatus
  });

  server.bind('0.0.0.0:8000', grpc.ServerCredentials.createInsecure());
  server.start();
}

startServer();
