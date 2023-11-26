let msyql = require('mysql'); 

let connection = msyql.createConnection({
    host: 'localhost',
    user: 'root',
    user: 'root',
    password: '',
    database: 'uas_kelompok'
});

connection.connect(function (error) {
    if(!!error) {
        console.log(error)
    }else{
        console.log('Koneksi berhasil');
    }
} )    
module.exports = connection;
