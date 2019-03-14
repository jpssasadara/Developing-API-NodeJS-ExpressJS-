const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
    //checking whether email address is exist or not
    User.find({email: req.body.email })
        .exec()
        .then(user => {
            if (user.length>=1) {
                 res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                // hashing password --> https://github.com/kelektiv/node.bcrypt.js/
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    // Store hash in your password DB.
                    if (err) { 
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });


}

exports.user_login = (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
       //according to bcrypt github page
       bcrypt.compare(req.body.password, user[0].password, (err,result)=>{
           if(err){
               return res.status(401).json({
                   message: 'Auth failed'
               });
           }
           if(result){
                // shall we fix a token when login - //https://github.com/auth0/node-jsonwebtoken 
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                   message: 'Auth successfull',
                   token: token  // <- token part of nodeJS is very similer to AngularJS RootScope part
               });
           }
           res.status(401).json({
               message: 'Auth failed'
           });
       }); 
    })
    .catch(err =>{
        console.log(err); 
        res.status(500).json({
            error: err
        });
    });
}


exports.user_delete = (req,res,next) =>{
    User.remove({_id: req.params.userId })
    .exec()
    .then(result =>{
        res.status(200).json({
            message: "User deleted"
        });
    }) 
    .catch(err =>{
        console.log(err); 
        res.status(500).json({
            error: err
        });
    });
}