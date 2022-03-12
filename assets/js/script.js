const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const pageContentEl = document.getElementById('page-content');
let taskIdCounter = 0;

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
      type: taskTypeInput
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

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

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

  alert("Task Updated!");

  formEl.removeAttribute('data-task-id');
  document.querySelector('#save-task').textContent = "Add Task";
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);