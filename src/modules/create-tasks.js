/*
create-tasks.js creates all task related DOM elements (excluding the detailed task dialog)
as wells as all functions required to manipulate and access task items both in
the DOM and in the list module
*/

const list = require("./list.js");
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

// creates the main structure for task elements
function createTasks () {
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const tasks = helper.newDiv("id","tasks");
    taskWrapper.appendChild(createMenu());
    taskWrapper.appendChild(tasks);
    taskWrapper.appendChild(createInputWrapper());
    initScrollShadows(taskWrapper);
    return taskWrapper;
}
// creates and initializes shadows for scroll/overflow indication
function initScrollShadows (taskWrapper) {
    const shadow1 = helper.newDiv("class","scroll-shadow","class","top");
    const shadow2 = helper.newDiv("class","scroll-shadow","class","bottom");
    const shadow3 = helper.newDiv("class","scroll-shadow","class","top");
    const shadow4 = helper.newDiv("class","scroll-shadow","class","bottom");
    shadow1.classList.add("tasks");
    shadow2.classList.add("tasks");
    shadow3.classList.add("completed-tasks");
    shadow4.classList.add("completed-tasks");
    taskWrapper.appendChild(shadow1);
    taskWrapper.appendChild(shadow2);
    taskWrapper.appendChild(shadow3);
    taskWrapper.appendChild(shadow4);
}
// intializes and returns the task-add input wrapper
function createInputWrapper () {
    const inputWrapper = helper.newDiv("class","input-wrapper");
    const plus = helper.createPlus();
    const input = createInput();
    plus.onclick = receiveClick;
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
    input.onkeydown = receiveInput;
    return inputWrapper;
}
// click event handler for the "plus"
function receiveClick (event) {
    const input = this.nextSibling;
    // if input is empty, focus
    if (input.value.trim() === "") {
        input.focus();
        return;
    }
    // otherwise add the task and maintain focus
    input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}));
    input.focus();
}
// keyboard event handler for task-add input
function receiveInput (event) {
    // if enter, add the task
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
        // if escape, clear the input and remove focus
    } else if (event.key === "Escape") {
        this.value = "";
        this.blur();
    }
}
// returns a text input
function createInput () {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add Task";
    return input;
}
// initializes and returns the manu for task management
function createMenu () {
    const menu = helper.newDiv("id","menu");
    menu.appendChild(createCompletedButton());
    menu.appendChild(createSortButton("name","A-Z"));
    menu.appendChild(createSortButton("star","Starred"));
    menu.appendChild(createSortButton("dueDate","Due Date"));
    menu.appendChild(createSortButton("dateAdded","Date Added"));
    return menu;
}
// initializes and returns the button to show/hide completed tasks
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
// intializes and returns a sort button based on the prescribed sort method
// and button display text
function createSortButton (sortMethod,buttonText) {
    const button = helper.newDiv("class","sort");
    const text = helper.newDiv();
    const arrows = helper.newDiv("class","arrows");
    const arrowsIcon = helper.newIcon("fas fas fa-exchange-alt");
    arrows.appendChild(arrowsIcon);
    button.appendChild(arrows);
    button.appendChild(text);
    text.textContent = buttonText;
    button.dataset.sortMethod = sortMethod;
    button.onclick = sort;
    return button;
}
// event handler for the sort butons (uses a custom DOM data key in order
// to allow for one handler here to by called and thereby dynamically calling
// the appropriate sort function in the list module)
function sort (event) {
    const arrows = this.getElementsByClassName("arrows")[0];
    arrows.addEventListener("transitionend", resetAnimation);
    arrows.classList.add("on");
    let sortMethod = this.dataset.sortMethod;
    sortMethod = sortMethod[0].toUpperCase() + sortMethod.slice(1); // build dynamic fn name
    list["sortTasksBy"+sortMethod](); // sort tasks in the list module accordingly
    updateTasks();
}
// event handler for transition end to allow animation to infinitely be called again with each click
function resetAnimation () {
    this.classList.remove("on");
}
// event handler to show/hide completed tasks
function toggleCompleted (event) {
    const taskWrapper = document.getElementById("task-wrapper");
    const caret = this.getElementsByClassName("caret")[0];
    let completedTasks = document.getElementById("completed-tasks");
    if (completedTasks) { // if completed tasks are already present, remove
        completedTasks.remove();
        caret.classList.remove("rotated-90");
    } else {
        // otherwise create and add
        completedTasks = helper.newDiv("id","completed-tasks");
        taskWrapper.appendChild(completedTasks);
        caret.classList.add("rotated-90");
    }
    updateTasks();
}
// updates tasks in the DOM by removing the curent task elements
// and adding the updated list of tasks from the list module
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
// event handler to adjust padding, margins, positioning, and visibility of tasks lists and associated
// scroll shadows to account for appropriate cutoff and spillover of the active task if applicable
function adjustPositioning () {
    if (!this) return;
    if (this.id === "tasks" && !document.getElementById("completed-tasks")) {
        const completedShadows = document.getElementsByClassName("scroll-shadow completed-tasks");
        completedShadows[0].style.visibility = "hidden";
        completedShadows[1].style.visibility = "hidden";
    }
    // get shadow elemenets for this list (tasks or completed tasks)
    const topShadow = document.querySelector(".scroll-shadow.top."+this.id);
    const bottomShadow = document.querySelector(".scroll-shadow.bottom."+this.id);
    const paddingTop = parseInt(window.getComputedStyle(this).paddingTop.slice(0,-2));
    const paddingBottom = parseInt(window.getComputedStyle(this).paddingBottom.slice(0,-2));

    if (this.scrollTop === 0 && paddingTop !== 12) {
        // if scrolled up to top
        this.style.paddingTop = "12px";
        this.style.marginTop = "-12px";
        topShadow.style.visibility = "hidden";
        
    } else if (this.scrollTop !== 0 && paddingTop !== 0) { 
        // if not scrolled up to top
        this.style.paddingTop = "0px";
        this.style.marginTop = "0px";
        topShadow.style.visibility = "visible";
    }
    if (this.scrollHeight === this.clientHeight + this.scrollTop && paddingBottom !== 12) {
        // if scrolled down to bottom
        this.style.paddingBottom = "12px";
        this.style.marginBottom = "-12px";
        bottomShadow.style.visibility = "hidden";
        if (this.id === "completed-tasks") topShadow.style.bottom = "26.25rem";
    } else if (this.scrollHeight !== this.clientHeight + this.scrollTop && paddingBottom !== 0) {
        // if not scrolled down to bottom
        this.style.paddingBottom = "0px";
        this.style.marginBottom = "0px";
        bottomShadow.style.visibility = "visible";
        if (this.id === "completed-tasks") topShadow.style.bottom = "25.5rem";
    }
}
// creates and appends task elements from list module and into regular or completed list
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

    // adjust positioning right away
    adjustPositioning.call(tasks);
    adjustPositioning.call(completedTasks);

    // add listeners to adjust position for any scrolling thereafter
    tasks.onscroll = adjustPositioning;
    if (completedTasks) completedTasks.onscroll = adjustPositioning;
}

function createName (task) {
    const name = helper.newDiv("class","name");
    name.textContent = task.getName();
    name.ondblclick = editName;
    return name;
}
function editName () {
    const taskElement = this.parentElement;
    const task = list.getTask(taskElement.id);
    this.remove();
    const input = document.createElement("input");
    taskElement.insertBefore(input,taskElement.firstChild.nextSibling);
    input.type = "text";
    input.value = task.getName();
    input.onkeydown = receiveEdit;
    input.onblur = receiveEdit;
    input.focus();
    input.select();
}
async function receiveEdit () {
    if (event.key === "Enter" || event.type === "blur") {
        if (!this.value || this.value.trim() === "") return;
        list.getTask(this.parentElement.id).setName(this.value.trim());
        helper.updateTaskDialog();
        setTimeout(() => {updateTasks();}, 0);
    } else if (event.key === "Escape") {
        this.onblur = () => null;
        updateTasks();
    }
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