const list = require("./list.js");
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

function createTasks () {
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const taskInputWrapper = helper.newDiv("class","input-wrapper");
    const tasks = helper.newDiv("id","tasks");
    const menuButtons = helper.newDiv("id","menu-buttons");

    initInputWrapper(taskInputWrapper);
    initMenuButtons(menuButtons);

    taskWrapper.appendChild(taskInputWrapper);
    taskWrapper.appendChild(tasks);
    taskWrapper.appendChild(menuButtons);
    return taskWrapper;
}

function initInputWrapper (inputWrapper) {
    const plus = helper.createPlus();
    const input = createInput();
    plus.onclick = directFocus;
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
    input.onkeydown = receiveInput;
}
function directFocus () {
    this.nextSibling.focus();
}
function receiveInput () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        const folder = list.getFolder(helper.getActiveFolderId());
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

function createCompletedButton () {
    const button = helper.newDiv("id","show-completed");
    const text = helper.newDiv();
    text.textContent = "Completed";
    const caret = helper.newDiv("class","caret");
    const caretIcon = helper.newIcon("fas fa-caret-right");
    caret.appendChild(caretIcon);
    button.appendChild(text);
    button.appendChild(caret);
    button.onclick = toggleCompleted;
    return button;
}
function createSortButton (sortMethod,buttonText) {
    const button = helper.newDiv("class","sort");
    const text = helper.newDiv();
    const arrows = helper.newDiv("class","arrows");
    const arrowsIcon = helper.newIcon("fas fas fa-exchange-alt");
    arrows.appendChild(arrowsIcon);
    button.appendChild(text);
    button.appendChild(arrows);
    text.textContent = buttonText;
    button.onclick = () => {sortBy(sortMethod);}
    return button;
}
function sortBy(sortMethod) {
    sortMethod = sortMethod[0].toUpperCase() + sortMethod.slice(1);
    list["sortTasksBy"+sortMethod]();
    updateTasks();
}
function initMenuButtons (menuButtons) {
    const row1 = helper.newDiv();
    const row2 = helper.newDiv();
    row1.appendChild(createSortButton("name","A-Z"));
    row1.appendChild(createSortButton("star","Starred"));
    row1.appendChild(createSortButton("dueDate","Due Date"));
    row1.appendChild(createSortButton("dateAdded","Date Added"));
    row2.appendChild(createCompletedButton());
    menuButtons.appendChild(row1);
    menuButtons.appendChild(row2);
}
function toggleCompleted () {
    const taskWrapper = document.getElementById("task-wrapper");
    const caret = this.getElementsByClassName("caret")[0];
    let completedTasks = document.getElementById("completed-tasks");
    if (completedTasks) {
        completedTasks.remove();
        caret.classList.remove("rotated-90");
    } else {
        completedTasks = helper.newDiv("id","completed-tasks");
        taskWrapper.appendChild(completedTasks);
        caret.classList.add("rotated-90");
    }
    updateTasks();
}
function updateTasks () {
    const activeID = helper.getActiveTaskId();
    const tasks = document.getElementById("tasks");
    const completedTasks = document.getElementById("completed-tasks")
    helper.removeAllChildren(tasks);
    helper.removeAllChildren(completedTasks);
    addTasksFromList();
    if (activeID) helper.activateElementByID(activeID);
    helper.updateTaskDialog();
}

function adjustPositioning () {
    const paddingTop = parseInt(window.getComputedStyle(this).paddingTop.slice(0,-2));
    if (this.scrollTop === 0 && paddingTop !== 8) {
        this.style.paddingTop = "8px";
        this.style.marginTop = "-8px";
    } else if (this.scrollTop !== 0 && paddingTop !== 0) {
        this.style.paddingTop = "0px";
        this.style.marginTop = "0px";
    }
}

function addTasksFromList() {
    const tasks = document.getElementById("tasks");
    const completedTasks = document.getElementById("completed-tasks");
    list.sortTasksByCompleted();
    list.getTasksByFolder(list.getFolder(helper.getActiveFolderId())).forEach( (task) => {
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
    tasks.onscroll = adjustPositioning;
    if (completedTasks) completedTasks.onscroll = adjustPositioning;
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
    checkBox.onclick = checkTask;
    return leftHandIconContainer;
}

function checkTask() {
    const task = list.getTask(this.parentElement.parentElement.id);
    task.toggleCompleted();
    const activeTaskID = helper.getActiveTaskId()
    if (activeTaskID === task.getID() && task.isCompleted()){
        helper.deactivateActiveTaskElement();
    }
    if (!task.isCompleted()) list.bumpTaskToTop(task);
    updateTasks();
}