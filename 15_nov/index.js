const { response } = require("express")
const {MongoClient}= require("mongodb")
const url='mongobd://localhost:27017'
const Client= new MongoClient(url)

const dbname="ruddo"
const collectionname="pradeep"

async function getData()
{
    let result=await Client.connect();
    let db= result.db(dbname)
    let connection= db.collection(collectionname)
    let response= await connection.find{{}}.toArray{};
    console.log(response)
}

getData()