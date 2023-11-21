const express=require('express')
const app=express()

app.get('',(req,resp)=>{
    resp.send("Welcome, I am Home Page")
})

app.get('/about',(req,resp)=>{
    resp.send("I am about Page")
})

app.get('/help',(req,resp)=>{
    resp.send("I am help Page")
})

app.get('/experiences',(req,resp)=>{
    resp.send("I am experience Page")
})

app.get('/careers',(req,resp)=>{
    resp.send("I am careers Page")
})



app.listen(5400);