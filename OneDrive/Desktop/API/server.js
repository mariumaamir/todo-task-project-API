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

// const tasks = require("./tasks.js");
// const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
// const fsPromises = require("fs").promises;
// const express = require("express");

// const filePath = "tasks.json";
// const todoApp = express();
// const PORT = 5500;

// todoApp.use(express.json());

// ensureFileExists();
// let tasks = loadTasksFromFile();
// todoApp.get("/tasks", (req, res) => {
//   res.json(tasks);
// });

// todoApp.post("/tasks", (req, res) => {
//   const newTask = req.body;

//   const validation = validateTask(newTask, tasks);
//   if (!validation.valid) {
//     return res.status(400).json({ error: validation.error });
//   }

//   if (newTask.completed === undefined) {
//     newTask.completed = false;
//   }

//   newTask.id = uuidv4();

//   tasks.push(newTask);
//   saveTasksToFile(tasks);
//   res.status(201).json(newTask);
//   console.log(`✅ Task Added → ID: ${newTask.id}, Title: "${newTask.title}", Completed: ${newTask.completed}`);


// });

// todoApp.delete("/tasks/:id", (req, res) => {
//   const id = req.params.id;
//   const findIndex = tasks.findIndex((task) => task.id === id);

//   if (findIndex === -1) {
//     return res.status(404).json({ error: "Task not found" });
//   }
//   const deletedTask = tasks.splice(findIndex, 1)[0];
//   saveTasksToFile(tasks);  
//   res.json({ message: "Task deleted", task: deletedTask });
//  console.log(`🗑️ Task Deleted → ID: ${deletedTask.id}, Title: "${deletedTask.title}"`);


// });

// todoApp.put("/tasks/:id", (req, res) => {
//   const id = req.params.id;
//   const task = tasks.find((t) => t.id === id);

//   if (!task) {
//     return res.status(404).json({ error: "Task not found" });
//   }

//   const updatedTask = {
//     title: req.body.title !== undefined ? req.body.title : task.title,
//     completed:
//       req.body.completed !== undefined ? req.body.completed : task.completed,
//   };

//   const validation = validateTask(updatedTask, tasks, id);
//   if (!validation.valid) {
//     return res.status(400).json({ error: validation.error });
//   }

//   task.title = updatedTask.title;
//   task.completed = updatedTask.completed;
//     saveTasksToFile(tasks);

//   res.json({ message: "Task updated", task });
// console.log(`✏️ Task Updated → ID: ${task.id}, New Title: "${task.title}", Completed: ${task.completed}`);


// });

// todoApp.listen(PORT, () => {
//   console.log("Server is running on ", PORT);
// });

// function validateTask(taskData, existingTasks, taskIdToIgnore = null) {
//   // Check title exists
//   if (taskData.title === undefined) {
//     return { valid: false, error: "Title is required" };
//   }

//   // Check title type string
//   if (typeof taskData.title !== "string") {
//     return { valid: false, error: "Title must be a string" };
//   }

//   // Check title non-empty
//   if (taskData.title.trim() === "") {
//     return { valid: false, error: "Title cannot be empty" };
//   }

//   // Check title format
//   if (!isValidTitle(taskData.title)) {
//     return {
//       valid: false,
//       error: "Title must only contain letters and spaces",
//     };
//   }

//   // Check duplicate title
//   if (isDuplicateTitle(taskData.title, existingTasks, taskIdToIgnore)) {
//     return { valid: false, error: "Duplicate title not allowed" };
//   }


//   if (
//     taskData.completed !== undefined &&
//     typeof taskData.completed !== "boolean"
//   ) {
//     return { valid: false, error: "Completed must be true or false" };
//   }

//   return { valid: true };
// }


// function isDuplicateTitle(title, tasks, currentTaskId = null) {
//   const lowerTitle = title.trim().toLowerCase();
//   return tasks.some(
//     (task) =>
//       task.title.trim().toLowerCase() === lowerTitle &&
//       task.id !== currentTaskId
//   );
// }



// function ensureFileExists() {
//   if (!fs.existsSync(filePath)) {
//     fs.writeFileSync(filePath, "[]");
//     console.log(`${filePath} was missing and has been created.`);
//   }

//   const content = fs.readFileSync(filePath, "utf8").trim();
//   if (content === "") {
//     fs.writeFileSync(filePath, "[]");
//     console.log(`${filePath} was empty.`);
//   }
// }

// ensureFileExists();

// function loadTasksFromFile() {
//   try {
//     ensureFileExists();
//     const data = fs.readFileSync(filePath, "utf8");
//     const tasks = JSON.parse(data);

  

//     return tasks;
//   } catch (error) {
//     console.error("Error loading tasks:", error);
//     return [];
//   }
// }

// function saveTasksToFile(tasks) {
//   if (!Array.isArray(tasks)) {
//     console.error("saveTasksToFile expected an array but got:", typeof tasks);
//     return;
//   }

//   try {
//     fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
//   } catch (error) {
//     console.error("Error saving tasks:", error);
//   }
// }





// function isValidTitle(title) {
//   const onlyLettersAndSpaces = /^[A-Za-z\s]+$/;
//   return onlyLettersAndSpaces.test(title.trim());
// }




const { v4: uuidv4 } = require("uuid");

const {
  ensureFileExists,
  loadTasksFromFile,
  saveTasksToFile,
} = require("./fileHandler");
const { validateTask } = require("./validator");


function setupRoutes(app) {
  ensureFileExists();
  let tasks = loadTasksFromFile();

 app.get("/tasks/:id", (req, res) => {
  const id = req.params.id;

  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  res.json(task);
});

  app.post("/tasks", (req, res) => {
    const newTask = req.body;

    const validation = validateTask(newTask, tasks);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    if (newTask.completed === undefined) {
      newTask.completed = false;
    }

    newTask.id = uuidv4();

    tasks.push(newTask);
    saveTasksToFile(tasks);

    res.status(201).json(newTask);
    console.log(`✅ Task Added → ID: ${newTask.id}, Title: "${newTask.title}", Completed: ${newTask.completed}`);
  });

  app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const findIndex = tasks.findIndex((task) => task.id === id);

    if (findIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }
    const deletedTask = tasks.splice(findIndex, 1)[0];
    saveTasksToFile(tasks);
    res.json({ message: "Task deleted", task: deletedTask });
    console.log(`🗑️  Task Deleted → ID: ${deletedTask.id}, Title: "${deletedTask.title}"`);
  });

  app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updatedTask = {
      title: req.body.title !== undefined ? req.body.title : task.title,
      completed: req.body.completed !== undefined ? req.body.completed : task.completed,
    };

    const validation = validateTask(updatedTask, tasks, id);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    task.title = updatedTask.title;
    task.completed = updatedTask.completed;

    saveTasksToFile(tasks);

    res.json({ message: "Task updated", task });
    console.log(`✏️ Task Updated → ID: ${task.id}, New Title: "${task.title}", Completed: ${task.completed}`);
  });
}

module.exports = setupRoutes;
