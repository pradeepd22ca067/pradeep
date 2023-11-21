const http=require('http')

// let obj ={
//     "name" :"pradeep",
//     "gmail" :"xyz@gmail.com",
//     "contact" :"77ye7e"
// }

const obj=require('./data')

http.createServer((req,resp)=>{
    resp.writeHead(200, {'content-Type':'application/json'})
    resp.write(JSON.stringify(obj));
    resp.end();
}).listen(7777)


// JSON Notation