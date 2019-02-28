const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

/*app.use((req,res,next)=>{
    res.status(200).json({
        message: 'It works !'
    });
});*/

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

// for handling invalied URLs------------>>FROM
app.use((req,res,next)=>{
    const error = new Error('Not found OOOH');
    error.status = 404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});
//------------------------------------------ TO

module.exports = app; 