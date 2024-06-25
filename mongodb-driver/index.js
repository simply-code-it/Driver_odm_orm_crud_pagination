const express = require("express");
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const app = express();

const database = require("./db");

let collection;

app.use(async (req, res, next) => {
  try {
    if (!collection) {
      const client = await database.connect();
      const db =  client.db('node');
      collection =  db.collection("todos");
    }
    next();
  } catch (err) {
    console.log(err);
  }
});
app.use(bodyParser.json());


app.get("/todos", async (req, res) => {
    console.log('here')
  let result = await collection.find({}).toArray();
  res.json({ result });
});

app.post('/todos', async(req, res)=>{
    console.log(req);
    console.log('reaching here');
    let result = await collection.insertOne(req.body);
    res.json({result});
})

app.put('/todos/:id', async(req, res)=>{
    let result = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: req.body});
    res.json({result});
})

app.delete('/todos/:id', async(req, res)=>{
    let result = await collection.deleteOne({_id: new ObjectId(req.params.id)});
    res.json({result})
})

app.patch('/todos/:id', async(req, res)=>{
    let result = await collection.updateOne({_id: new ObjectId(req.params.id)}, {$set: {...req.body}});
    res.json({result});
})

app.listen(3000);
