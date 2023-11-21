let a =10;
let b =0;

let Data= new Promise((resolve, reject)=>{
    setTimeout((c)=>{
        resolve(40);
    },2000)
})

Data.then((c)=>{
    console.log(a+c);
})