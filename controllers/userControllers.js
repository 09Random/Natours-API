// const fs=require('fs');
// const users= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));
const User=require('./../models/userModel');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getAllUsers=async (req,res)=>{
    try{
        const users=await User.find();
        return res.status(200).json({
            status: "successful",
            results:users.length,
            data: {
                users:users
            }
        });

    }catch(err){
        return res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}
exports.getUser=async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        return res.status(200).json({
            status: "successful",
            data: {
                user:user
            }
        });
    }catch(err){
        return res.status(404).json({
            status:'fail',
            message: err.message
        });
    }
    
}

exports.updateMe=async (req,res,next)=>{
    try{
        if(req.body.password||req.body.confirmPassword){
            throw Error('Can\'t update password in this url.Go to /updateMyPassword!')
        }

        const filteredBody = filterObj(req.body, 'name', 'email');
        const user= await User.findByIdAndUpdate(req.user.id,filteredBody,{runValidators:true,new:true});
        
        res.status(200).json({
            status:"Successful",
            user
        })
    }catch(err){
        return res.status(400).json({
            status:'fail',
            message: err.message
        });
    }
}
exports.deleteMe=async (req,res,next)=>{
    try{
        const user= await User.findByIdAndUpdate(req.user.id,{active:false});

        res.status(204).json({
            status:"Successful",
            data:null
        })
    }catch(err){
        return res.status(500).json({
            status:'fail',
            message: err.message
        });
    }
}