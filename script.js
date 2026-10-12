const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");
const clearCompletedButton = document.getElementById("clearCompleted");

const STORAGE_KEY = "studentTodoTasks";
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    showMessage("Could not save tasks in this browser.");
  }
}

function showMessage(text = "") {
  message.textContent = text;
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    showMessage("Please enter a task first.");
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text,
    completed: false
  });

  taskInput.value = "";
  showMessage();
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id, completed) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed } : task);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as completed`);
    checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked));

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, taskText, deleteButton);
    taskList.append(item);
  });

  const completed = tasks.filter(task => task.completed).length;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  completedCount.textContent = `${completed} completed`;
  emptyState.hidden = tasks.length > 0;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.style.opacity = completed === 0 ? "0.45" : "1";
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});
clearCompletedButton.addEventListener("click", clearCompleted);

renderTasks();
