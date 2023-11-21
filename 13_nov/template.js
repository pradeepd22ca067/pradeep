const express=require('express');
const path=require('path')

const app=express();

const publicPath=path.join(__dirname, 'public')
app.set("view engine","ejs");
app.get('',(req,resp)=>{
    resp.send("Welcome, I am Home Page")
})
app.get('/profile',(req,resp)=>{
    const user={
        "name" : "pradeep",
        "gmail" : "xyz@gmail.com",
        "city" : "chennai",
        "skills" : ['C++','Java',"PHP","HTML","CSS"]
    }

    resp.render('profile',{user})
})

app.listen(3444)