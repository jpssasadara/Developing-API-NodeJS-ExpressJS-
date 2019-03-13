const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest: '/uploads'});

const Product = require('../models/product');

router.get('/',(req,res1,next)=>{
    /*res.status(200).json({
        massage:'Handling GET request to /products'
    });*/
        Product.find()
        .select('name price _id') // <<== Selecting fields
        .exec()
        .then(docs =>{
            console.log(docs);
            const response = {
                countOfList: docs.length,
               // products: docs
                products: docs.map(doc =>{
                    return{
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request:{
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
           // if(docs.length >=0){
                res1.status(200).json(response);
           // }else{
           //     res.status(404).json({
           //     message: 'No entries found'
           //     });
           // }
        })
        .catch(err => {
            res1.status(500).json({
                error: err
            });
        });
});

// "body parser" is used to get submited json format data not url from body 
// as post request 
// "multer is also package like that"
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
        res.status(201).json({
            massage:'Handling post request to /products',
            createdproduct: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error: err 
        })
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
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log("From DataBase" ,doc);
        if(doc){
           // res.status(200).json(doc);  // <<= shall we modify this as bellow
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost/products'
                }
            })
        }else{
            res.status(404).json({message: "No valid entry here"})
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    });
});
      //update
router.patch('/:productId',(req,res,next)=>{
   /* res.status(200).json({
        massage: 'Update product !'
    }); */
    const id = req.params.productId;
    //Product.update({_id: id},{$set:{name: req.body.newName,price: req.body.newPrice}})
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id},{$set:updateOps})
        .exec()
        .then(result =>{
            console.log(result);
           // res.status(200).json(result);  //<<= shall we modify this as below
            res.status(200).json({
                massage: 'Product updated', 
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/product/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error:err
            });
        })
        
       
});

router.delete('/:productId',(req,res,next)=>{
   /* res.status(200).json({
        massage: 'Delete product !'
    });*/
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result =>{
        //res.status(200).json(result);
        res.status(200).json({
            massage: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                data: {name: 'String', price: 'Number'} 
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports=router;