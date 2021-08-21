const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt =  require('bcrypt');

const database = require('./database');

router.use(express.json());
router.use(passport.initialize());

passport.use(new LocalStrategy(
    function(username, password, done){
        const db = database.connect(sqlite3.OPEN_READONLY);

        const sql = `SELECT * from users WHERE username=? AND password=?`;

        db.get(sql, [username, password], function(e, user){

            if(!user){
                return done(null, false);
            }

            return done(null, user);
        }).close();
    }
));

router.post('/authenticate', passport.authenticate('local', {session: false}), function(req, res){
    res.send(req.user);
});

router.post('/create', function(req, res){

    bcrypt.hash(req.body.password, 14, (e, hash) => {
        req.body.password = hash
        database.createUser(req.body, (message) => {
            res.send(message);
        });
    });
});

router.put('/update', function(req, res){
    database.updateUser(req.body);
    res.send('Update user');
});

router.delete('/delete', function(req, res){
    database.delUser(req.body.id);
    res.send('Delete user');
});

module.exports = router;