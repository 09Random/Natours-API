// **** THIs part was only needed when we wanted to play with data from file but now we use mongoose

// const fs = require('fs');
// const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`));


// exports.checkBody= function(req,res,next){
//     if(!req.body.name||!req.body.price){
//         return res.status(400).json({
//             status:'fail',
//             message:'Must include price and name'
//         })
//     }
//     next();
// }

// exports.checkId=function(req,res,next,val){
//     if(val>=tours.length){
//         return res.status(404).send({
//             message: ' invalid tour id'
//         });
//     }
//     next()
// }
const { query } = require('express');
const Tour=require('./../models/tourModel');


exports.getAllTours =async (req,res)=>{
    // console.log(req.requestTime);
    try{
        //querying
        const queryObj={...req.query};
        const excluded=['sort','page','limit','fields']
        excluded.forEach((el)=>{
            delete queryObj[el];
        });

        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)

        let tours=Tour.find(JSON.parse(queryStr));

        //sorting
        if(req.query.sort){
            tours=tours.sort(req.query.sort.split(',').join(' '))
        }
        //field limiting
        if(req.query.fields){
            tours=tours.select(req.query.fields.split(',').join(' '));
        }

        //pagination not implemented

        const finalTours=await tours
        return res.status(200).json({
            status: "successful",
            results: finalTours.length ,
            data: {
                tours: finalTours
            }
        });
    }catch(err){
        return res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
}
exports.getTour= async (req,res)=>{
    try{
        const tour= await Tour.findById(req.params.id);
        if(!tour){
            throw Error('No suchh Tour Found!');
        }
        return res.status(200).json({
            status: 'successful',
            data:{
                tour:tour
                // tour: tours[req.params.id*1]
            }
        });

    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err.message
        })
    }
    
}

exports.addTour= async (req,res)=>{
    // const newID=tours.length;
    // const newTour= Object.assign({id: newID},req.body);
    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/../dev-data/data/tours.json`, JSON.stringify(tours),err=>{
    //     console.log(`Error, could not update file(writefile)`);
    // });
    try{
        const newTour= await Tour.create(req.body);
        
        return res.status(201).json({
            status: "success",
            data:{
                tours: newTour
            }
        });

    }catch(err){
        return res.status(400).json({
            status:'fail',
            message: err.message
        })
    }
}

exports.deleteTour=async (req,res)=>{
    try{
        await Tour.deleteOne({'_id':req.params.id});
        return res.status(204).json({
            status:'success',
            data: null
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err.message
        })

    }
    
}
exports.updateTour = async (req, res) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  