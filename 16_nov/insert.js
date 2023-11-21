const dbConnect=require('./mongo')

const insert=async ()=>{
    const data=await dbConnect();
    const result= await data.insertMany([{
        EmpID : "7",
        FirstName : "Shivam",
        LastName : "xyzy",
        Title : "Engg",
        Phone : "1123455"
    },
    {
        EmpID : "8",
        FirstName : "Shivam",
        LastName : "xyzy",
        Title : "Engg",
        Phone : "1123455"
    },
    {
        EmpID : "9",
        FirstName : "Shivam",
        LastName : "xyzy",
        Title : "Engg",
        Phone : "1123455"
    }])
}

insert()