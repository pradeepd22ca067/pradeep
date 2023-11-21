const dbConnect=require('./mongo')

const updateData= async()=>{
    const data=await dbConnect();
    let result = await data.updateOne({EmpID:"1"},{$set:{FirstName : "Neha", LastName : "Garg"}})
}

updateData();