const dbConnect=require('./mongo')

const deleteData = async()=>{
    const data=await dbConnect();
    const result=data.deleteMany({EmpID:"7"})

}
deleteData();