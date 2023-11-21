const express=require('express')
const app=express();

app.get('',(req,resp)=>{
    resp.send(`
        <h1>Hello from H1</h1>
        <h2>Hello from H2</h2>
    `)
})

app.get('/query',(req,resp)=>{
    resp.send(`Hello from query page ${req,query.name}`);
})

app.get('/about',(req,resp)=>{
    resp.send(`<input></input>
    <button>Click Me</button>`)
})

app.get('/help',(req,resp)=>{
    resp.send({
        name :"Neha",
        profession : "SDE",
        education :"graduated"
    })
})