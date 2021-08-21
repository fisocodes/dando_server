const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://fisocodes:sotooscar1@dandocluster.8qole.mongodb.net/dando-database?retryWrites=true&w=majority'
const client = new MongoClient(uri);

async function connect(cb) {
    try {
        await client.connect(); 
        await cb(null, client.db());
    }catch (e){
        console.log(`Failed to connect to the databse: ${e.message}`);
        cb(e, null);
    }finally{
        client.close();
    }
}

let createUser = function(user, cb){
    connect( async (e, db) => {
        if(e)
            cb(e);
        else{
            await db.collection('users').insertOne(user);
            cb("User created succesfully");
        }
    });
}

let updateUser = function(user){
    
}

let deleteUser = function(userId){
    
}

module.exports.connect = connect;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;