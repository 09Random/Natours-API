// ***************************************************************************
//Documentation:  https://documenter.getpostman.com/view/23709148/2s8ZDYY2db 
// ***************************************************************************
const mongoose=require('mongoose');
const dotenv=require('dotenv');

const app=require('./app');
dotenv.config({path:'./config.env'});

mongoose.set('strictQuery', true);// for not having warning
mongoose.connect(
    process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD),
    {
        useNewURLParser: true,
        // useCreateIndex: true,
        // useFindandModify:false
    }
).then(con=>{
    console.log('connection to database successful!')
    // console.log(con.connections)
});


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Ladies and gentlemen, the server is live...`);

});

