var http = require('http'), 
url = require('url'),
p = require('path'),
fs = require('fs'),
io = require('./socket.io'),
sys = require('sys'),



stdin = process.openStdin();

stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  process.stdout.write('data: ' + chunk);
});

stdin.on('end', function () {
  process.stdout.write('end');
});



process.title = "serveur gearth";
sys.log('process.title: ' + process.title);
		
server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    sys.log('request : '+path);

    switch (path){
        case '/':
            sendFile("/index.html",res);
            break;
      case '/modules':
            sendFile(path,res);
            break;
			
        default:
            sendFile(path,res);
            break;
    }
}),

send404 = function(res){
    sys.log('404');
    res.writeHead(404);
    res.write('404');
    res.end();
};

sendFile = function(path,res){
    path = "/www"+path
    fs.readFile(__dirname + path, function(err, data){
        if (err) return send404(res);
        switch (p.extname(path)) {
            case ".html":
            case ".htm":
                ctt = 'text/html'
                break;
            case ".js":
                ctt = 'text/javascript'
                break;
            case ".css":
                ctt = 'text/css'
                break;
            case ".gif":
                ctt = 'image/gif'
                break;
            case ".png":
                ctt = 'image/png'
                break;
            case ".jpg":
                ctt = 'image/jpeg'
                break;
            case ".ico":
                ctt = 'image/x-icon'
                break;
            default:
                ctt = 'text/plain'
                break;
        }
        sys.log("mime : "+ctt + " ext : "+p.extname(path))
        res.writeHead(200, {
            'Content-Type': ctt
        })
        res.write(data, 'utf8');
        res.end();
    });
};

server.listen(8085);
		
// socket.io, I choose you
// simplest chat application evar
var io = io.listen(server),
buffer = [];
		
io.on('connection', function(client){
    client.send({
        buffer: buffer
    });
    //client.broadcast({ announcement: client.sessionId + ' connected' });

    client.on('message', function(message){
        var msg = {
            message: [client.sessionId, message]
        };
        buffer.push(msg);
        if (buffer.length > 15) buffer.shift();
        client.broadcast(msg);
    });

    client.on('disconnect', function(){
        //client.broadcast({ announcement: client.sessionId + ' disconnected' });
        });
});
