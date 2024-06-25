const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.json());


// db.execute() function works fine for simple queries
// db.query() works fine with complex or prepared sql statements
app.get("/todos", async (req, res) => {
  let result = await db.query("SELECT * FROM todo");
  res.json({ result });
});

app.post("/todos", async (req, res) => {
  const { title, status, description } = req.body;
  console.log(req.body);
  let result = await db.execute(
    "INSERT INTO todo (title, status, description) VALUES (?, ?, ?)",
    [title, status, description]
  );
  console.log(result);
  res.json({ result });
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status, description } = req.body;
  const result = await db.execute(
    "UPDATE todo SET title = ?, status = ?, description=? WHERE id = ?",
    [title, status, description, id]
  );
  res.json({ result });
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status, description } = req.body;

  // Build dynamic query
  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title = ?");
    values.push(title);
  }
  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    values.push(description);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(id);
  const sql = `UPDATE todo SET ${fields.join(", ")} WHERE id = ?`;

  try {
    const [result] = await db.execute(sql, values);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.execute("DELETE FROM todo WHERE id = ?", [id]);
  res.json({ result });
});

app.get("/paginated", async (req, res) => {
  let page = req.query.page ? parseInt(req.query.page, 10) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
  console.log(page, limit);
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({ error: "Invalid page or limit values" });
  }

  let skip = (page - 1) * limit;

  const query = "SELECT * FROM todo LIMIT ? OFFSET ?";
  const result = await db.query(query, [limit, skip]);
  res.json({ result });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
