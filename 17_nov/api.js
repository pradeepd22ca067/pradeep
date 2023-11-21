const express=require('express')

const dbConnect=require('./mongo')
const app=express();
app.use(express.json())

app.get('/',async (req,resp)=>{
    let data=await dbConnect();
    data=await data.find().toArray();
    resp.send(data);
})

app.post('/',async (req,resp)=>{
    let data=await dbConnect();
    let result = await data.insertOne(req.body)
    resp.send(result)
})

app.put('/', async(req,resp)=>{
    let data=await dbConnect();
    let result= await data.updateOne({EmpID:"3"},{
        $set :{Title:"Engineer"}
    })
    resp.send("done")
})

app.delete('/', async(req,resp)=>{
    let data=await dbConnect();
    let result=await data.deleteOne({EmpID:"3"})
    resp.send("delete done")

})

app.listen(5000);