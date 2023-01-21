const { json } = require('express');
const {promisify}=require('util');
const User=require('./../models/userModel');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { nextTick } = require('process');
const { decode } = require('punycode');

function signToken(id){
    return jwt.sign({id: id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRY});
}

exports.signup= async (req,res)=>{
    try{
        const user=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
            roles:req.body.roles
        });
        const token=signToken(user._id);
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRY*24*60*60*1000),
            // secure:true, //use in prod
            httpOnly:true
        });
        user.password=undefined;
        return res.status(201).json({
            status:'success',
            token,
            data:{
                user:user
            }
        });
    }catch (err){
        res.status(404).json({
            status:'fail',
            message: err.message
        });
    }
};

exports.login= async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        if(!email||!password){
            throw Error('Email and password are required!')
        }
        const user= await User.findOne({email:email}).select('+password');
        if(!user||!(await bcrypt.compare(password,user.password))){
            throw Error('Email or Password incorrect!')
        }

        const token=signToken(user._id);
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRY*24*60*60*1000),
            // secure:true, //use in prod
            httpOnly:true
        });
        return res.status(200).json({
            status:'success',
            token:token
        })
    }catch(err){
        return res.status(400).json({
            status:'fail',
            message: err.message
        });
    }
}

exports.protect= async(req,res,next)=>{
    try{
        let token=null;
        //getting token
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1];
        }
        if(!token){
            throw Error('No token!');
        }

        //verifying token
        let decodedId=null;
        await jwt.verify(token,process.env.JWT_SECRET,function(err,decoded){
            if(err){throw Error(err.message)};
            // console.log(decoded);
            decodedId=decoded.id
        });

        //checking if the token is still valid( may be of deleted user or user changed password after token)
        const freshUser=await User.findById(decodedId);
        if(!freshUser)throw Error('User belonging to this token no longer exists!');
        
        // <<user changing password after token not implemented yet>>
        req.user=freshUser;
        next();
        
    }catch(err){
        return res.status(401).json({
            status:'fail',
            message: err.message
        });
    }
}

exports.restrictTo=(...roles)=>{
    return (req,res,next)=>{
        try{
            if(!roles.includes(req.user.roles))throw Error('Not authorised to delete tour!');
            next();
        }catch(err){
            res.status(403).json({
                status:'fail',
                message:err.message
            })
        }
    }
}

exports.updatePassword= async(req,res,next)=>{
    try{
        //getting user from collection
        user=await User.findById(req.user.id).select('+password');
        // checking if password is correct
        if( !await bcrypt.compare(req.body.passwordCurrent,user.password)){
            throw Error('Incorrect Password entered!')
        }
        //updating password
        user.password=req.body.password;
        user.confirmPassword=req.body.confirmPassword
        await user.save()
        //login and send token
        const token=signToken(user._id);
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRY*24*60*60*1000),
            // secure:true, //use in prod
            httpOnly:true
        });
        return res.status(200).json({
            status:'success',
            token:token
        })

    }catch(err){
        res.status(401).json({
            status:'fail',
            message:err.message
        })
    }

}