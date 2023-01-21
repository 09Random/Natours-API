const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const { default: isEmail } = require('validator/lib/isemail');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Please tell us your name!'],
        trim:true,
        min:[3,'A name must be atleast 3 characters long!'],
        max:[30,'A name must be less than 30 characters long!']

    },
    email:{
        type:String,
        unique:[true,'User with this email already exists!'],
        required:[true,'An Email is required!'],
        validate:[
            validator.isEmail,'Please provide a valid email id!'
        ]
    },
    photo:String,
    roles:{
        type:String,
        default:'user',
        enum:["admin","lead-guide","guide","user"]
    },
    password:{
        type: String,
        required:[true,'Please type in the password!'],
        min:[5,'A password must atleast have 5 characters'],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please type in the confirmed password!'],
        min:[5,'A password must atleast have 5 characters'],
        validate:{
            validator: function (val){
                return this.password===val
            },
            message:"Confirmed password doesn't match the password!"
        }
    },
    active:{
        type:Boolean,
        default:true
    }
});

userSchema.pre(/^find/,async function(next){
    this.find({active: {$ne: false}});
    next();
})
userSchema.pre('save',async function (next){
    if(!this.isModified("password"))return next();
    this.password= await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
});

module.exports= User=mongoose.model('User',userSchema);
