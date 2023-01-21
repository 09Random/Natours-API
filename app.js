//App working
const express = require('express');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

//security
const rateLimit=require('express-rate-limit')
const helmet=require('helmet');
//data sanitisation & parameter pollution not implemented

//other
const morgan = require('morgan');


const app= express();
//security
app.use(helmet());
//additional insights for dev data
app.use(morgan('dev'));
//body parser for req.body to json
app.use(express.json({limit:'10kb'}));

// app.use((req,res,next)=>{
//     req.requestTime= new Date().toISOString();
//     next();
// });

//Rate limiter to limit req limit per hour
const limiter= rateLimit({
    max:250,
    windowms:60*60*1000,
    message:"Too many requests from this IP!try again in one hour!!"
});
app.use('/api',limiter);

//Router middleware
app.use(`/api/v1/tours`,tourRouter);
app.use(`/api/v1/users`,userRouter);
app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:'fail',
        message:` Couldn't find ${req.originalUrl} !`
    })
})

module.exports =app;