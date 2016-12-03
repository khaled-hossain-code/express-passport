const fs = require('fs');
const options = JSON.parse(fs.readFileSync('package.json'));

const http = require('http'),
      express = require('express'),
      app = express(),
      server = http.createServer(app);

app.use(express.static(options.webServer.folder));

server.listen(options.webServer.port, ()=>{
    console.log(`webserver started on port ${options.webServer.port} `);
})