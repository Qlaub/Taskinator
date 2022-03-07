const buttonEl = document.querySelector("#save-task");
const tasksToDoEl = document.querySelector("#tasks-to-do")

const createTaskHandler = function() {
  const taskItemEl = document.createElement("li");
  //i suspect below will be an event listener callback function
  taskItemEl.textContent = "This is a new task.";
  taskItemEl.className = "task-item"
  tasksToDoEl.appendChild(taskItemEl);
}

buttonEl.addEventListener("click", createTaskHandler)
