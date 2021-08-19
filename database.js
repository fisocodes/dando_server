const sqlite3 = require('sqlite3');

let connect = function(mode){
    let db = new sqlite3.Database('./databases/dando.db', mode, function(e){
        if(e)
            console.error(e.message);
        
        console.log('Connected to the dando database.');
    
    });
    return db;
}

let createUser = function(username, password, name, surname, dob, photo, cb){
    db = connect(sqlite3.OPEN_READWRITE);

    const sql = `INSERT INTO users(username, password, name, surname, dob, photo) VALUES(?, ?, ?, ?, ?, ?)`;
    db.run(sql, [username, password, name, surname, dob, photo], function(e){
           cb(e ? `Error creating user: ${e.message}` : 'User created succesfully');
    });
}

let updateUser = function(username, password, name, surname, dob, photo, id){
    db = connect(sqlite3.OPEN_READWRITE);

    const sql = `UPDATE users SET username = ?, password = ?, name = ?, surname = ?, dob = ?, photo = ? WHERE id = ?`;
    db.run(sql, [username, password, name, surname, dob, photo, id], function(e){
        if(e)
            return console.log(e.message);
        console.log(`User updated. Changes: ${this.changes}`);
    });
}

let deleteUser = function(id){
    db = connect(sqlite3.OPEN_READWRITE);

    const sql = `DELETE FROM users where id = ?`;
    db.run(sql, [id], function(e){
        if(e)
            return console.log(e.message);
        console.log(`User deleted. Changes: ${this.changes}`);
    });
}

module.exports.connect = connect;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;