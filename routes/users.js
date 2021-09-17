const express = require('express');
const connect = require('connect');
const router = express.Router();
const bcrypt =  require('bcrypt');
const mongoose = require('mongoose');
const passport =  require('passport');
const LocalStrategy =  require('passport-local').Strategy;
const session =  require('express-session');
const MongoDBStore =  require('connect-mongodb-session')(session);

const User = require('../database/Models/user');

const store = new MongoDBStore({
    uri: "mongodb+srv://fisocodes:sotooscar1@dandocluster.8qole.mongodb.net/dando-database?retryWrites=true&w=majority",
    collection: 'sessions'
});

router.use(session({
    secret: 'the secret',
    cookie: {maxAge: 2000 * 60},
    store: store,
    resave: true,
    saveUninitialized: true
}));

passport.use(new LocalStrategy(
    function(username, password, done){
        try{
            mongoose.connect("mongodb+srv://fisocodes:sotooscar1@dandocluster.8qole.mongodb.net/dando-database?retryWrites=true&w=majority", {useNewUrlParser: true}, () => {
                User.findOne({'username' : username}, function(e, user){
                    if(e){
                        return done(e);
                    }
                    
                    if(!user){
                        return done(null, false, { message : 'User does not exists'})
                    }

                    return done(null, user);
                });
            });        
        }
        catch(e) {
            console.log(e.message);
            res.status(500).send(e.message);
        }
    }
));

router.use(passport.initialize());
router.use(passport.session());

router.use(express.json());


router.post('/authenticate', function(req, res, next){
    
    console.log(req.session);

    if(req.session.user)
    {
        res.send({message: `Welcome back ${req.session.user.username}!`, user: req.session.user});
    }
    else{
        passport.authenticate('local', {session: false}, function(e, user, info){
            if(e){
                res.send(e.message);
            }
    
            if(!user){
                res.status(500).send({message: 'User does not exist', user: null});
            }
            else{
                bcrypt.compare(req.body.password, user.password, function(err, result){
                    if(result){
                        req.session.user = user;
                        res.send({message: 'User authenticated', user: user});
                    }
                    else
                    res.status(500).send({message: 'Wrong password', user: null});
                });
            }
            
        })(req, res, next);
    }
});

router.post('/create', function(req, res){

    if(req.body.token !== "0420"){
        res.status(500).send("Not a valid token");
    }
    else{
        console.log(req.body.username.match(/^[A-Za-z0-9_]$/));
        console.log(req.body.password.match(/^[A-Za-z0-9_]$/));

        if(req.body.username.match(/^[A-Za-z0-9_]+$/) === null){
            res.status(500).send("Username is not valid");
        }
        else if(req.body.password.match(/^[A-Za-z0-9_]+$/) === null){
            res.status(500).send("Password is not valid");
        }
        else{

            bcrypt.hash(req.body.password, 14, (e, hash) => {
                req.body.password = hash
                
                try{
                    mongoose.connect("mongodb+srv://fisocodes:sotooscar1@dandocluster.8qole.mongodb.net/dando-database?retryWrites=true&w=majority", {useNewUrlParser: true}, () => {
                        const user = new User(req.body);
                        user.save(e => {
                            if(e){
                                console.log(e);
                                res.status(500).send(e.message);
                            }
                            else
                                res.status(201).send("User created succesfully");
                        }); 
                    });        
                }
                catch(e) {
                    console.log(e.message);
                    res.status(500).send(e.message);
                }
            });
        }
    }
});

router.put('/update', function(req, res){
    res.send('Update user');
});

router.delete('/delete', function(req, res){
    res.send('Delete user');
});

module.exports = router;