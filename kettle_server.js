var PROTO_PATH = __dirname + '/kettle.proto';

var grpc = require('grpc');
var bonjour = require('bonjour')()


var protoLoader = require('@grpc/proto-loader');

// advertise an HTTP server on port 3000
bonjour.publish({ name: 'KettleServer', type: 'http', port: 8001 })

// browse for all http services
bonjour.find({ type: 'http' }, function (service) {
  console.log('Found an HTTP server:', service)
})

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });

var kettle_proto = grpc.loadPackageDefinition(packageDefinition);

function boilKettle(call, callback){
    callback(null, {message: `Kettle is boiling: ${call.request.on}`});
}

function boilingStatus(call){

  var status = call.request.on;

  if(status == "Yes"){
    for(var i=0; i<=100; i++){
        call.write({boilState: `Kettle is boiled to ${i} Degrees Celcius`});
        if(i == 100){
          call.write({boilState: `Kettle is fully boiled`});
        }
    }
  }

    call.end();
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
