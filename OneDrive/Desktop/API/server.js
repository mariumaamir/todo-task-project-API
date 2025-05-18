// const http = require("http");
// const tasks = require("./task.js");
// const PORT = 5500;

// function creatingAPI(req, res) {
//   if (req.url === "/tasks" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify(tasks));
//   } else {
//     res.writeHead(404, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ massage: "Not Found" }));
//   }
// }

// const server = http.createServer(creatingAPI);
// server.listen(PORT, () => {
//   console.log("The server is at this port", PORT);
// });

const tasks = require("./tasks.js");

const express = require("express");
const todoApp = express();
const PORT = 5500;

todoApp.use(express.json());
todoApp.get("/tasks", (req, res) => {
  res.json(tasks);
});

todoApp.post("/tasks", (req, res) => {
  const newTask = req.body;

  const validation = validateTask(newTask, tasks);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (newTask.completed === undefined) {
    newTask.completed = false;
  }

  newTask.id = Date.now();
  tasks.push(newTask);

  res.status(201).json(newTask);
});

todoApp.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const findIndex = tasks.findIndex((task) => task.id === id);

  if (findIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  const deletedTask = tasks.splice(findIndex, 1)[0];

  res.json({ message: "Task deleted", task: deletedTask });
});

todoApp.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTask = {
    title: req.body.title !== undefined ? req.body.title : task.title,
    completed:
      req.body.completed !== undefined ? req.body.completed : task.completed,
  };

  const validation = validateTask(updatedTask, tasks, id);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  task.title = updatedTask.title;
  task.completed = updatedTask.completed;

  res.json({ message: "Task updated", task });
});

todoApp.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});

function validateTask(task, tasks, currentTaskId = null) {
  // Check title exists
  if (task.title === undefined) {
    return { valid: false, error: "Title is required" };
  }

  // Check title type string
  if (typeof task.title !== "string") {
    return { valid: false, error: "Title must be a string" };
  }

  // Check title non-empty
  if (task.title.trim() === "") {
    return { valid: false, error: "Title cannot be empty" };
  }

  // Check title format
  if (!isValidTitle(task.title)) {
    return {
      valid: false,
      error: "Title must only contain letters and spaces",
    };
  }

  // Check duplicate title
  if (isDuplicateTitle(task.title, tasks, currentTaskId)) {
    return { valid: false, error: "Duplicate title not allowed" };
  }

  // Check completed field only if defined
  if (task.completed !== undefined && typeof task.completed !== "boolean") {
    return { valid: false, error: "Completed must be true or false" };
  }



  return { valid: true };
}

function isDuplicateTitle(title, tasks, currentTaskId = null) {
  const lowerTitle = title.trim().toLowerCase();
  return tasks.some(
    (task) =>
      task.title.trim().toLowerCase() === lowerTitle &&
      task.id !== currentTaskId
  );
}

function isValidTitle(title) {
  const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
  return onlyLettersAndSpaces.test(title.trim());
}
