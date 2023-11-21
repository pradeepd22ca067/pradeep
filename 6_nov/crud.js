const fs=require('fs')
const path=require('path')

const dirPath=path.join(__dirname,"CRUD")
const filePath=`${dirPath}/trial.txt`

//C - create
fs.writeFileSync(filePath, "I am your first file")

//R - Read
fs.readFile(filePath,'utf8',(err,item)=>{
    console.log(item)
})

//U - Update
fs.appendFile(filePath,"and I am updated file",(err)=>{
    if(!err) console.log(err)
})

//D - Delete
fs.unlinkSync(filePath)
