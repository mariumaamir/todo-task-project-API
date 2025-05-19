const express = require("express");
const setupRoutes = require("./server");

const todoApp = express();
const PORT = 5500;

todoApp.use(express.json());

setupRoutes(todoApp);

todoApp.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
