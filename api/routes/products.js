const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');
//const Product = require('../models/product');
//const mongoose = require('mongoose');


//------------ Uplaoding file setup----------------- FROM ---------------------
//-----------------------------------------------------------------------------
const multer = require('multer');
/*const storage = multer.diskStorage({
    destination: function(res, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpge' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }else{
        cb(null,false);
    }   
};
//const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
}); 
 */
const upload = multer({dest: 'uploads/'});
//------------------------------------------------------------------------------
//------------------- Uplaoding file setup --------------- TO ------------------


router.get('/',checkAuth, ProductController.products_get_all);

// "body parser" is used to get submited json format data not url from body 
// as post request 
// "multer is also package that is used to manage storage"

router.post('/', checkAuth, upload.single('productImage'), ProductController.create_product);
//search
router.get('/:productId',checkAuth, ProductController.products_get_products);
//update
router.patch('/:productId',checkAuth, ProductController.products_update_products);
//Delete
router.delete('/:productId', checkAuth,ProductController.products_delete_products );

module.exports=router;