const express = require('express');
const router = express.Router();
const {body, validationResult } = require('express-validator');
const connection = require('../config/db');

const authenticateToken = require('../routes/auth/midleware/authenticateToken')

router.get('/', authenticateToken, function (req, res) {
    connection.query('select * from tamu ', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Server Failed',
            })
        }else{
            return res.status(200).json({
                status:true,
                message: 'Data tamu',
                data: rows
            })
        }
    });
});

// untuk membuat data baru tamu kapal
router.post('/store', authenticateToken, [
    body('Nama_tamu').notEmpty(),
    body('Alamat_tamu').notEmpty(),
    body('Email').notEmpty(),
    body('No_Tlp').notEmpty(),
],(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let Data = {
        Nama_tamu: req.body.Nama_tamu,
        Alamat_tamu: req.body.Alamat_tamu,
        Email: req.body.Email,
        No_Tlp: req.body.No_Tlp,
    }
    connection.query('insert into tamu  set ?', Data, function(err, rows) {
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
    connection.query(`select * from tamu  where id_tamu  = ${id}`, function (err, rows) {
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
                message: 'Data tamu ',
                data: rows[0]
            })
        }
    })
})


// untuk mengubah data tamu data
router.patch('/update/:id', authenticateToken, [
    body('Nama_tamu').notEmpty(),
    body('Alamat_tamu').notEmpty(),
    body('Email').notEmpty(),
    body('No_Tlp').notEmpty(),

], (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        });
    }
    let id = req.params.id;
    let Data = {
        Nama_tamu: req.body.Nama_tamu,
        Alamat_tamu: req.body.Alamat_tamu,
        Email: req.body.Email,
        No_Tlp: req.body.No_Tlp,
    }
    connection.query(`update tamu  set ? where id_tamu  = ${id}`, Data, function (err, rows) {
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


// untuk menghapus data tamu 
router.delete('/delete/(:id)', authenticateToken, function(req, res){
    let id = req.params.id;
    connection.query(`delete from tamu where id_tamu  = ${id}`, function (err, rows) {
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