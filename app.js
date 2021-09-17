const express = require('express');
const cors = require('cors');

const users = require('./routes/users');

const app = express();

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

app.use('/users', users);

app.get('/', function(req, res){
    res.send('Dando database');
});


app.listen(process.env.PORT || 8080);
