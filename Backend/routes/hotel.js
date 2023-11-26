const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

const authenticateToken = require('../routes/auth/midleware/authenticateToken')

router.get('/', authenticateToken, function (req, res) {
    connection.query('SELECT b.nama_hotel, b.alamat_hotel, p.Nomor_Kamar, a.nama_fasilitas, c.nama_pesanan, d.Nama_tamu FROM hotel b JOIN kamar p ON b.id_Kamar = p.id_Kamar JOIN fasilitas_hotel a ON b.id_fasilitas = a.id_fasilitas JOIN pemesanan c ON b.id_pemesanan = c.id_pemesanan JOIN tamu d ON b.id_tamu = d.id_tamu', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data hotel',
                data: rows
            })
        }
    });
});

// untuk membuat data baru Hotel 
router.post('/store', authenticateToken, [
    body('id_Kamar').notEmpty(),
    body('id_fasilitas').notEmpty(),
    body('id_pemesanan').notEmpty(),
    body('id_tamu').notEmpty(),
    body('nama_hotel').notEmpty(),
    body('alamat_hotel').notEmpty(),
    body('nik').notEmpty(),
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
        id_pemesanan: req.body.id_pemesanan,
        id_tamu: req.body.id_tamu,
        nama_hotel: req.body.nama_hotel,
        alamat_hotel: req.body.alamat_hotel,
        nik: req.body.nik,
    }
    connection.query('insert into hotel  set ?', Data, function(err, rows) {
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
    connection.query(`select * from hotel where id_hotel  = ${id}`, function (err, rows) {
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
                message: 'Data hotel ',
                data: rows[0]
            })
        }
    })
})


// untuk mengubah data hotel data
router.patch('/update/:id', authenticateToken, [
    body('id_Kamar').notEmpty(),
    body('id_fasilitas').notEmpty(),
    body('id_pemesanan').notEmpty(),
    body('id_tamu').notEmpty(),
    body('nama_hotel').notEmpty(),
    body('alamat_hotel').notEmpty(),
    body('nik').notEmpty(),
], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        id_Kamar: req.body.id_Kamar,
        id_fasilitas: req.body.id_fasilitas,
        id_pemesanan: req.body.id_pemesanan,
        id_tamu: req.body.id_tamu,
        nama_hotel: req.body.nama_hotel,
        alamat_hotel: req.body.alamat_hotel,
        nik: req.body.nik,
    }
    connection.query(`update hotel  set ? where id_hotel  = ${id}`, Data, function (err, rows) {
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Success..!',
            })
        }
    })
})  


// untuk menghapus data hotel 
router.delete('/delete/(:id)', authenticateToken, function(req, res){
    let id = req.params.id;
    connection.query(`delete from hotel where id_hotel  = ${id}`, function (err, rows) {
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

module.exports = router; // Corrected export statement