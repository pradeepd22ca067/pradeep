const http=require('http')

// simple function to add two number

function add(x,y){
    console.log(x+y)
}
add(3,6)

// Arrow function to add two number

const addition =(x,y)=>x+y
console.log(addition(2,3))


//simple function 
// function data(req,resp){
//     resp.write("Hello, I am simple Function")
//     resp.end();
// }

// http.createServer(data).listen(5555)


//Arrow function

http.createServer((req,resp)=>{
    resp.write("Hello, I am simple Function")
    resp.end();
}).listen(5555)