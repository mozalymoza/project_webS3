const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const connection = require('../config/db');

const authenticateToken = require('../routes/auth/midleware/authenticateToken')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    //mengecek jenis file yg diizinkan (JPEG atau PNG)
    if (file.mimetype === 'image/jpeg'||file.mimetype === 'image/png'){
        cb(null, true); //izinkan file
    }else{
        cb(new Error('Jenis file tidak diizinkan'),false);
    }
}
const upload = multer({storage: storage, fileFilter: fileFilter})

router.get('/', authenticateToken, function (req, res) {
    connection.query('SELECT b.nama_pesanan, b.fasilitas_pesanan, p.Nomor_Kamar, b.gambar, a.nama_fasilitas FROM pemesanan b JOIN kamar p ON b.id_Kamar = p.id_Kamar JOIN fasilitas_hotel a ON b.id_fasilitas = a.id_fasilitas ', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data pesanan',
                data: rows
            })
        }
    });
});

// untuk membuat data baru pemesanan
router.post('/store',authenticateToken , upload.single("gambar"), [
    body('id_Kamar').notEmpty(),
    body('id_fasilitas').notEmpty(),
    body('nama_pesanan').notEmpty(),
    body('fasilitas_pesanan').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        id_Kamar: req.body.id_Kamar,
        id_fasilitas: req.body.id_fasilitas,
        nama_pesanan: req.body.nama_pesanan,
        fasilitas_pesanan: req.body.fasilitas_pesanan,
        gambar: req.file.filename
    }
    connection.query('insert into pemesanan  set ?', Data, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(201).json({
                status: true,
                message: 'Success..!',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function (req, res) {
    let id = req.params.id;
    connection.query(`select * from pemesanan  where id_pemesanan  = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if(rows.lenght <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data pemesanan ',
                data: rows[0]
            })
        }
    })
})


// untuk mengubah data pemesanan data
router.patch('/update/:id', authenticateToken, upload.single("gambar"), [
    body('id_Kamar').notEmpty(),
    body('id_fasilitas').notEmpty(),
    body('nama_pesanan').notEmpty(),
    body('fasilitas_pesanan').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id;
    let gambar = req.file ? req.file.filename : null;
    connection.query(`select * from pemesanan where id_pemesanan = ${id}`, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        const namaFileLama = rows[0].gambar;

        //Hapus File Lama Jika ada
        if(namaFileLama && gambar){
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
    let Data = {
        id_Kamar: req.body.id_Kamar,
        id_fasilitas: req.body.id_fasilitas,
        nama_pesanan: req.body.nama_pesanan,
        fasilitas_pesanan: req.body.fasilitas_pesanan,
        gambar: req.file.filename
    }
    connection.query(`update pemesanan set ? where id_pemesanan = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }else{
            return res.status(500).json({
                status: true,
                message: 'Update Success..!'
            })
        }
    })
})

});


// untuk menghapus data pemesanan 
router.delete('/delete/(:id)', authenticateToken, function(req, res){
    let id = req.params.id;
    connection.query(`select * from pemesanan where id_pemesanan = ${id}`, function(err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error'
            })
        }
        if(rows.length ===0){
            return res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        }
        const namaFileLama = rows[0].gambar;

        //Hapus File Lama Jika ada
        if(namaFileLama && gambar){
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
    connection.query(`delete from pemesanan  where id_pemesanan  = ${id}`, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }else{
            return res.status(200).json({
                status: true,
                message: 'Data has been delete !',
            })
         }
        })
    })
})

module.exports = router; // Corrected export statement