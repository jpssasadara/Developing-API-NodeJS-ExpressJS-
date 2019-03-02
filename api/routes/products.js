const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        massage:'Handling GET request to /products'
    });
});

router.post('/',(req,res,next)=>{
   /* const product = {
        name: req.body.name,
        price: req.body.price
    }; */
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result =>{
        console.log(result);
    })
    .catch(err => console.log(err));
    res.status(201).json({
        massage:'Handling post request to /products',
        createdproduct: product
    });
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
   /* if(id === 'special'){
        res.status(200).json({
           massage:'You discovered the special ID',
           id: id 
        });
    }else{
        res.status(200).json({
            massage:'You passed an ID'
        });
    } */
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From DataBase" ,doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    });
});

router.patch('/:productId',(req,res,next)=>{
    res.status(200).json({
        massage: 'Update product !'
    });
});

router.delete('/:productId',(req,res,next)=>{
    res.status(200).json({
        massage: 'Delete product !'
    });
});

module.exports=router;