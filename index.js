const fs = require('fs');
const options = JSON.parse(fs.readFileSync('package.json'));

const http = require('http'),
      express = require('express'),
      app = express(),
      server = http.createServer(app),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser');
      path = require('path');

const db = require('./database');

const passport = require('passport'),
      session = require('express-session'),
      { Strategy: LocalStrategy} = require('passport-local');

const localStrategyOption = {
    usernameField: 'username',
    passwordField: 'password'
};

passport.use(new LocalStrategy(localStrategyOption, (username, password, done)=>{
    
    if(db.authenticate(username, password)){
        done(null,{
            username: username
        }); //here null means no problem with authentication
    }else{
        done(null, false); //authentication failed
    }
}));

const sessions = new Map();

passport.serializeUser((user, cb)=>{
    sessions.set(user.username, user);
    cb(null, user.username);
});

passport.deserializeUser((username, cb)=>{
    cb(null, sessions.get(username));
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}));

app.use((req, res, next)=>{
    console.log(req.cookies);
    res.cookie('demo', 'test');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res, next)=>{
    res.sendFile(path.join(__dirname, 'www', 'login.html'));
});

app.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/login'}));

app.use((req, res, next)=>{
    if(!req.user){
        res.redirect('/login');
        return;
    }
    next();
});



app.use(express.static(options.webServer.folder));

server.listen(options.webServer.port, ()=>{
    console.log(`webserver started on port ${options.webServer.port} `);
})