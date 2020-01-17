require('dotenv').config();
const session = require('express-session');
const passport = require("passport");

const bodyParser = require('body-parser');
var cors = require('cors')

const redis = require('redis');

let RedisStore = require('connect-redis')(session);
let client = redis.createClient();

const User = require('./models/User');
const UserInfo = require('./models/UserInfo');

const AWS_S3 = require('./AWS_S3');

function authentication(app) {
    app.use(cors({origin: 'http://localhost:3000', credentials: true}));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({
        store: new RedisStore({ client: client }),
        secret: process.env.CHAT_FOR_CLASS_SECRET,
        resave: false,
        saveUninitialized: false, 
        cookie: {maxAge: 630720000000}
    }));
      
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.post('/signup', (req, res) => {
        User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
            if (!err) {
                passport.authenticate("local")(req, res, () => {
                    const newUser = new UserInfo({
                        username: req.body.username, 
                        name: req.body.name, 
                        avatarUrl: "null", 
                        isStudent: req.body.isStudent, 
                        enrolledClassIds: [],
                        enrolledClassNames: [], 
                        connectedSocketIds: []
                    });
                    newUser.save((err, newuser) => {
                        res.json({success: true, userId: newuser._id, username: newuser.username});
                    });
                });
            }
        });
    });

    app.post("/login", (req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
      
        req.login(user, err => {
            if (!err) {
                passport.authenticate("local")(req, res, () => {
                    res.json({success: true});
                });
            }
        });
    });

    app.get("/logout", function(req, res) {
        req.logout();
        res.json({success: true});
    });

    app.get("/isAuthenticated", function(req, res) {
        res.json({isAuthenticated: req.isAuthenticated()});
    });

    app.get("/info", function(req, res) {
        res.json(req.user.username);
    });

    app.get("/AWS_S3", AWS_S3.AWS_S3);
    
    app.post("/setImageUrl", function(req, res) {
        const {avatarUrl, username} = req.body;
        UserInfo.updateOne({username: username}, {avatarUrl: avatarUrl, dirty: true}, (err, result) => {
            client.del("userinfos_" + username);
            if (!err) res.json({success: true});
            else res.json({success: false});
        });
    });
}

module.exports = authentication;