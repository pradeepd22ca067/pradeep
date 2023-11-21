const {MongoClient}= require("mongodb")

const url='mongodb://localhost:27017'

const client=new MongoClient(url)

const dbname="ruddo"
const collectionname='Neha'

async function dbConnect(){
    let result=await client.connect();
    let db = result.db(dbname)
    let collection= db.collection(collectionname)
    return collection;
}

module.exports=dbConnect