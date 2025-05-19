const fs = require("fs");
const filePath = "tasks.json";

function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
    console.log(`${filePath} was missing and has been created.`);
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  if (content === "") {
    fs.writeFileSync(filePath, "[]");
    console.log(`${filePath} was empty.`);
  }
}

function loadTasksFromFile() {
  try {
    ensureFileExists();
    const data = fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(data);
    return tasks;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

function saveTasksToFile(tasks) {
  if (!Array.isArray(tasks)) {
    console.error("saveTasksToFile expected an array but got:", typeof tasks);
    return;
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

module.exports = {
  ensureFileExists,
  loadTasksFromFile,
  saveTasksToFile,
};
