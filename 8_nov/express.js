const express=require('express')
const app=express();

app.get('',(req,resp)=>{
    resp.send("Heloo, I am home page")
})
app.get('/help',(req,resp)=>{
    resp.send("Heloo, I am help page")
})
app.get('/about',(req,resp)=>{
    resp.send("Heloo, I am about page")
})
app.get('/careers',(req,resp)=>{
    resp.send("Heloo, I am careers page")
})
app.get('/post',(req,resp)=>{
    resp.send("Heloo, I am post page")
})
app.listen(3400)