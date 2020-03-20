'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var compression = require("compression");
var cors = require("cors");
var express = require("express");
var session = require("express-session");
var util_1 = require("./util");
var crypto = require("crypto");
var passport = require("passport");
var passport_local_1 = require("passport-local");
var expressValidator = require("express-validator");
var bunyanFactory = require("express-bunyan-logger");
var ws_1 = require("ws");
var http = require("http");
var api_1 = require("./routes/api");
var App = (function () {
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.launchConf();
    }
    App.prototype.middleware = function () {
        initPassport();
        this.express.set('port', process.env.PORT || 5000);
        this.express.set('stt_service', util_1.getCfenv());
        this.express.use(cors({ origin: 'http://localhost:3000', credentials: true }));
        this.express.use(bunyanFactory({
            excludes: ['req', 'res',
                'req-headers', 'res-headers',
                'response-hrtime', 'user-agent'],
            obfuscate: ['body.password']
        }));
        this.express.use(compression());
        this.express.use(expressValidator());
        this.express.use(session({
            resave: true,
            saveUninitialized: true,
            secret: crypto.randomBytes(64).toString('hex'),
        }));
        this.express.use(bodyParser.json({ limit: '2mb' }));
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(isAuthenticated);
    };
    App.prototype.routes = function () {
        this.express.use('/api', api_1.router);
        this.express.use(express.static(path.join(__dirname, '..', 'client', 'build')));
        this.express.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
        });
    };
    App.prototype.launchConf = function () {
        var _this = this;
        var server = http.createServer();
        var wss = new ws_1.Server({ server: server });
        server.on('request', this.express);
        wss.on('connection', util_1.wsHandler);
        server.listen(this.express.get('port'), function () {
            console.log(('  App is running at http://localhost:%d \
      in %s mode'), _this.express.get('port'), _this.express.get('env'));
            console.log('  Press CTRL-C to stop');
        })
            .setTimeout(600000);
    };
    return App;
}());
function initPassport() {
    var users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'model', 'user.json')).toString());
    passport.serializeUser(function (user, done) {
        done(undefined, user.username);
    });
    passport.deserializeUser(function (username, done) {
        done(undefined, Object.assign({ username: username }, users[username]));
    });
    passport.use(new passport_local_1.Strategy({ usernameField: 'username' }, function (username, password, done) {
        if (users[username]) {
            if (users[username].password === password) {
                return done(undefined, Object.assign({ username: username }, users[username]));
            }
            return done(undefined, false, { message: 'Invalid username or password.' });
        }
        else {
            return done(undefined, false, { message: "user: " + username + " doesn't exist" });
        }
    }));
}
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.path === '/api/login' ||
        !(req.path.includes('api'))) {
        return next();
    }
    return res.status(401).json({
        error: 'Not authorized to view this resource.'
    });
}
exports.server = (new App()).express;
//# sourceMappingURL=server.js.map