function validateTask(taskData, existingTasks, taskIdToIgnore = null) {
  if (taskData.title === undefined) {
    return { valid: false, error: "Title is required" };
  }

  if (typeof taskData.title !== "string") {
    return { valid: false, error: "Title must be a string" };
  }

  if (taskData.title.trim() === "") {
    return { valid: false, error: "Title cannot be empty" };
  }

  if (!isValidTitle(taskData.title)) {
    return { valid: false, error: "Title must only contain letters and spaces" };
  }

  if (isDuplicateTitle(taskData.title, existingTasks, taskIdToIgnore)) {
    return { valid: false, error: "Duplicate title not allowed" };
  }

  if (taskData.completed !== undefined && typeof taskData.completed !== "boolean") {
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

module.exports = {
  validateTask,
  isDuplicateTitle,
  isValidTitle,
};
