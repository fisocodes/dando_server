const express = require('express');
const router = express.Router();
const bcrypt =  require('bcrypt');
const mongoose = require('mongoose');

const User = require('../database/Models/user');

router.use(express.json());


router.post('/authenticate', function(req, res){
    res.send('Authenticate user');
});

router.post('/create', function(req, res){

    bcrypt.hash(req.body.password, 14, (e, hash) => {
        req.body.password = hash
        
        try{
            mongoose.connect("mongodb+srv://fisocodes:sotooscar1@dandocluster.8qole.mongodb.net/dando-database?retryWrites=true&w=majority", {useNewUrlParser: true}, () => {
                const user = new User(req.body);
                user.save(e => {
                    if(e)
                        res.status(500).send(e.message);
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
});

router.put('/update', function(req, res){
    res.send('Update user');
});

router.delete('/delete', function(req, res){
    res.send('Delete user');
});

module.exports = router;