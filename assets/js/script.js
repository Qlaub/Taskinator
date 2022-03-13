const formEl = document.querySelector("#task-form");
const pageContentEl = document.getElementById('page-content');
const tasksToDoEl = document.querySelector("#tasks-to-do");
const tasksInProgressEl = document.querySelector('#tasks-in-progress');
const tasksCompletedEl = document.querySelector('#tasks-completed');
let taskIdCounter = 0;
let tasks = [];

const taskFormHandler = function(event) {
  //prevent reload page
  event.preventDefault()

  const taskNameInput = document.querySelector("input[name='task-name']").value;
  const taskTypeInput = document.querySelector("select[name='task-type']").value;

  //validate inputs
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!")
    return false;
  }

  //returns form values to original state
  formEl.reset();

  //object to be passed to our HTML creation function
  const taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
  };

  const isEdit = formEl.hasAttribute('data-task-id');

  if (isEdit) {
    const taskId = formEl.getAttribute('data-task-id');
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    const taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: 'to do',
    };

    createTaskEl(taskDataObj);
  }
}

const createTaskEl = function(taskDataObj) {

  // create list item
  const listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  const taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  const taskActionsEl = createTaskActions(taskIdCounter);

  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;
}

const createTaskActions = function(taskId) {
  const actionContainerEl = document.createElement('div');
  actionContainerEl.className = 'task-actions';

  //create edit button
  const editButtonsEl = document.createElement('button');
  editButtonsEl.textContent = 'Edit';
  editButtonsEl.className = 'btn edit-btn';
  editButtonsEl.setAttribute('data-task-id', taskId);

  actionContainerEl.appendChild(editButtonsEl);

  //create delete button
  const deleteButtonEl = document.createElement('button');
  deleteButtonEl.textContent = 'Delete';
  deleteButtonEl.className = 'btn delete-btn';
  deleteButtonEl.setAttribute('data-task-id', taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  const statusSelectEl = document.createElement('select');
  statusSelectEl.className = 'select-status';
  statusSelectEl.setAttribute('name', 'status-change');
  statusSelectEl.setAttribute('data-task-id', taskId);

  actionContainerEl.appendChild(statusSelectEl);

  let statusChoices = ['To Do', 'In Progress', 'Completed'];

  for (var i=0; i < statusChoices.length; i++) {
    //create option element
    const statusOptionEl = document.createElement('option');
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute('value', statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
}

const taskButtonHandler = function(event) {
  const targetEl = event.target;
  const taskId = targetEl.getAttribute('data-task-id');

  if (event.target.matches(".delete-btn")) {
    deleteTask(taskId);
  } else if (event.target.matches('.edit-btn')) {
    editTask(taskId);
  }
}

const deleteTask = function(taskId) {
  const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks.splice(1, i);
    }
  }

  saveTasks();
}

const editTask = function(taskId) {
  const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  const taskName = taskSelected.querySelector('h3.task-name').textContent;
  const taskType = taskSelected.querySelector('span.task-type').textContent;

  //update "Add Task" form to become an editor for the current task selected
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = 'Save Task';

  //save the id of the currently edited task so we can save those changes to the correct element
  formEl.setAttribute('data-task-id', taskId);
}

const completeEditTask = function(taskName, taskType, taskId) {
  //finds matching task list item
  const taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
  
  //updates values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  saveTasks();

  alert("Task Updated!");

  formEl.removeAttribute('data-task-id');
  document.querySelector('#save-task').textContent = "Add Task";
}

const taskStatusChangeHandler = function(event) {
  const taskId = event.target.getAttribute('data-task-id')

  const statusValue = event.target.value.toLowerCase();

  const taskSelected = document.querySelector(`.task-item[data-task-id="${taskId}"`);

  if(statusValue === 'to do') {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === 'in progress') {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === 'completed') {
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  saveTasks();
}

const saveTasks = function() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasks = function() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (!savedTasks) {
    return false;
  }

  for (let i=0; i < savedTasks.length; i++) {
    createTaskEl(savedTasks[i]);
  }
}

loadTasks();

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);

