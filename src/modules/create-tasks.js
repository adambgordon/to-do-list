const list = require("./list.js");
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

function createTasks () {
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const taskInputWrapper = helper.newDiv("class","input-wrapper");
    const tasks = helper.newDiv("id","tasks");
    const showCompleted = helper.newDiv("id","show-completed");
    initInputWrapper(taskInputWrapper);
    initCompleted(showCompleted);
    taskWrapper.appendChild(taskInputWrapper);
    taskWrapper.appendChild(tasks);
    taskWrapper.appendChild(showCompleted);
    return taskWrapper;
}

function initInputWrapper (inputWrapper) {
    const plus = helper.createPlus();
    const input = createInput();
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);

    input.onkeydown = receiveInput;
}
function receiveInput () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        const folder = list.getFolder(helper.getActiveFolderID());
        const task = helper.taskFactory(
            this.value.trim(),
            Date.now().toString(),
            folder.getName() === "Starred" ? parseInt(folder.getID())-1 : folder.getID());
        if (folder.getName() === "Starred") task.toggleStar();
        this.value = "";
        list.addTask(task);
        updateTasks();
    }
}

function createInput () {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add Task";
    return input;
}

function initCompleted (button) {
    const text = helper.newDiv();
    text.textContent = "Completed";
    const arrow = helper.newDiv("class","arrow");
    const arrowIcon = helper.newIcon("fas fa-caret-right")
    arrow.appendChild(arrowIcon);
    button.appendChild(text);
    button.appendChild(arrow);
    button.onclick = toggleCompleted;
}

function toggleCompleted () {
    const taskWrapper = document.querySelector("#task-wrapper");
    const arrow = this.getElementsByClassName("arrow")[0];
    let completedTasks = document.querySelector("#completed-tasks");
    if (completedTasks) {
        completedTasks.remove();
        arrow.classList.remove("rotated-90");
    } else {
        completedTasks = helper.newDiv("id","completed-tasks");
        taskWrapper.appendChild(completedTasks);
        arrow.classList.add("rotated-90");
    }
    updateTasks();
}

function updateTasks () {
    const activeID = helper.getActiveTaskID();
    const tasks = document.querySelector("#tasks");
    const completedTasks = document.querySelector("#completed-tasks")
    helper.removeAllChildren(tasks);
    helper.removeAllChildren(completedTasks);
    addTasksFromList();
    if (activeID) helper.activateElementByID(activeID);
    helper.updateTaskDialog();
}

function addTasksFromList() {
    const tasks = document.querySelector("#tasks");
    const completedTasks = document.querySelector("#completed-tasks");
    list.getTasksByFolder(list.getFolder(helper.getActiveFolderID())).forEach( (task) => {
        const taskElement = helper.newDiv("id",task.getID(),"class","task");
        taskElement.appendChild(createCheckBox(task));
        taskElement.appendChild(createName(task));
        taskElement.appendChild(createDueDate(task));
        taskElement.appendChild(helper.createStarButton(task));
        if (!task.isCompleted()) {
            tasks.appendChild(taskElement);
        } else if (completedTasks) {{
            completedTasks.appendChild(taskElement);
        }}
    });
}

function createName (task) {
    const name = helper.newDiv("class","name");
    name.textContent = task.getName();
    return name;
}

function createDueDate (task) {
    const dueDate = helper.newDiv("class","due-date");
    if (!task.getDueDate()) {
        dueDate.textContent = "";
    } else {
        const date = helper.parseDate(task.getDueDate());
        dueDate.textContent = helper.format(date, "E, MMM do");
        const compared = helper.compareAsc(date,helper.startOfToday());
        if (compared === -1) {
            dueDate.style.color = "red";
        } else if (compared === 0) {
            dueDate.style.color = "rgb(255,123,0)";
        }
    }
    return dueDate;
}

function createCheckBox (task) {
    const fontAwesomeString =  task.isCompleted() ? "fas fa-check-square" : "far fa-square";
    const leftHandIconContainer = helper.createLeftHandIconContainer(fontAwesomeString);
    const checkBox = leftHandIconContainer.firstChild;
    checkBox.classList.add("check-box");
    checkBox.onclick = completeTask;
    return leftHandIconContainer;
}

function completeTask() {
    const task = list.getTask(this.parentElement.parentElement.id);
    task.toggleCompleted();
    const activeTaskID = helper.getActiveTaskID()
    if (activeTaskID === task.getID() && task.isCompleted()){
        helper.deactivateActiveTaskElement();
    }
    updateTasks();
}