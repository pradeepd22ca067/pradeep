const  dbConnect  = require('./mongo');

const getData= async ()=>{
    let data=await dbConnect();
    data=await data.find({}).toArray();
    console.log(data)
}

getData()