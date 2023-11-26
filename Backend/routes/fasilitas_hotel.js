const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

const authenticateToken = require('../routes/auth/midleware/authenticateToken')

router.get('/', authenticateToken, function (req, res) {
    connection.query('select * from fasilitas_hotel', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data fasilitas_hotel',
                data: rows
            })
        }
    });
});

// untuk membuat data baru fasilitas
router.post('/store', authenticateToken, [
    body('nama_fasilitas').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        nama_fasilitas: req.body.nama_fasilitas,
    }
    connection.query('insert into fasilitas_hotel set ?', Data, function(err, rows) {
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
    connection.query(`select * from fasilitas_hotel where id_fasilitas = ${id}`, function (err, rows) {
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
                message: 'Data fasilitas_hotel',
                data: rows[0]
            })
        }
    })
})


// untuk mengubah data alat tangkap
router.patch('/update/:id', authenticateToken, [
    body('nama_fasilitas').notEmpty(),

], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        nama_fasilitas: req.body.nama_fasilitas,
    }
    connection.query(`update fasilitas_hotel set ? where id_fasilitas = ${id}`, Data, function (err, rows) {
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


// untuk menghapus data dpi
router.delete('/delete/(:id)',authenticateToken, function(req, res){
    let id = req.params.id;
    connection.query(`delete from fasilitas_hotel where id_fasilitas = ${id}`, function (err, rows) {
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