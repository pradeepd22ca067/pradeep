const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/ruddo")

const schema = new mongoose.schema({
    EmpID : Number,
    FirstName : String,
    LastName : String,
    Price : Number
})

const saveInDB = async()=>{
    const ProductModel=mongoose.model('data', ProductSchema)
    console.log(ProductModel)
    let data=new ProductModel({EmpID : "9"})
    let result = await data.save();
    console.log(result);
}

const updateInDB = async()=>{
    const ProductModel=mongoose.model('data', ProductSchema)
    let result = await ProductModel.updateOne({
        EmpID:"4"
    },{
        $set : {FirstName :"Neha"}
    });
}

const deleteInDB = async()=>{
    const ProductModel=mongoose.model('data', ProductSchema)
    let result = await ProductModel.deleteOne({
        EmpID:"4"
    });
}

const findInDB = async()=>{
    const ProductModel=mongoose.model('data', ProductSchema)
    let result = await ProductModel.find({EmpID :"9"});
    console.log(result)
}