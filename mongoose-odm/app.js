const express = require("express");
const getDb = require("./db");
const Todo = require("./todo");

const app = express();

app.use(express.json());

//get
app.get("/todos", async (req, res) => {
  let result = await Todo.find();
  res.json({ result });
});

//post
app.post("/todos", async (req, res, next) => {
    try{
        let todo = new Todo(req.body);
        let result = await todo.save();
        res.json({ result });
    }catch(err){
        next(err);
    }
});

//put

app.put("/todos/:id", async (req, res) => {
  let result = await Todo.updateOne({ _id: req.params.id }, { $set: req.body });
  res.json({ result });
});

//patch
app.patch('/todos/:id', async(req, res)=>{
    let result = await Todo.updateOne({_id: req.params.id}, {$set: req.body})
    res.json({result});
})
//delete

app.delete('/todos/:id', async(req, res)=>{
    let result = await Todo.deleteOne({_id: req.params.id});
    res.json({result});
})

//pagination
app.get('/paginated', async(req, res)=>{
    let page = req.query.page || 1;
    let limit = req.query.limit || 2;
    let skip = (page-1)*limit;
    let result = await Todo.find().skip(skip).limit(limit);
    res.json({result});
})

app.use((err, req, res, next)=>{
    res.status(500).json({error:err||"Internal server error"});
})

app.listen(3000, () => {
  getDb("mongodb://localhost:27017/nodeNmongoose")
    .then((res) => {
      console.log("connected successfully!");
    })
    .catch((err) => console.log(err));
});
