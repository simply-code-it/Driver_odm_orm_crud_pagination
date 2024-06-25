const express = require("express");
const bodyParser = require("body-parser");
const Todo = require("./model/todo");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/todos", async (req, res) => {
  const result = await Todo.findAll();
  res.json({ result });
});

app.post("/todos", async (req, res) => {
  const result = await Todo.create(req.body);
  res.json({ result });
});

app.put("/todos/:id", async (req, res) => {
  const result = await Todo.update(req.body, {where:{ id: req.params.id }});
  res.json({ result });
});

app.patch("/todos/:id", async (req, res) => {
  const result = await Todo.update(req.body, {where: { id: req.params.id }});
  res.json({result});
});

app.delete("/todos/:id", async (req, res) => {
  const result = await Todo.destroy({where: { id: req.params.id }});
  res.json({ result });
});

app.get("/paginated", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;

  const skip = Math.ceil((page - 1) * limit);

  const result = await Todo.findAll({
    limit: limit,
    offset: skip,
  });

  res.json({ result });
});

app.listen(3000, () => {
  console.log("server is live at port ", 3000);
});
