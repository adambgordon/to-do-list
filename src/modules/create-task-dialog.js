const list = require("./list.js");
import *  as helper from "./helper-functions.js";

export {createTaskDialog, updateTaskDialog};

function createTaskDialog () {
    const taskDialog = helper.newDiv("id","task-dialog");
    return taskDialog;
}

function updateTaskDialog () {
    const taskDialog = document.getElementById("task-dialog");
    helper.removeAllChildren(taskDialog);
    addDialogFromTask();
}

function addDialogFromTask () {
    const activeID = helper.getActiveTaskId();
    if (!activeID) return;
    const taskDialog = document.getElementById("task-dialog");
    const task = list.getTask(activeID);

    const name = createName(task);
    const star = helper.createStarButton(task);
    const dueDate = createDueDate(task);
    const notes = createNotes(task);
    const bottomRow = helper.newDiv("class","bottom-row")
    const dateAdded = createDateAdded(task);
    const trash = createTrash(task);
    
    name.appendChild(star)
    bottomRow.appendChild(dateAdded);
    bottomRow.appendChild(trash);
    taskDialog.appendChild(name);
    taskDialog.appendChild(dueDate);
    taskDialog.appendChild(notes);
    taskDialog.appendChild(bottomRow);

    if (task.isCompleted()) {
        taskDialog.firstChild.style.textDecoration = "line-through";
        for (let i = 0; i < taskDialog.children.length; i++) {
            taskDialog.children[i].style.backgroundColor = "rgba(255,255,255,75%)";
            taskDialog.children[i].style.backdropFilter = "blur(3px)";
        }
    }
}

function createName (task) {
    const name = createInput("text");
    const input = name.firstChild;
    input.value = task.getName();
    input.onkeydown = receiveNameInput;
    return name;
}

function createInput(type) {
    const input = document.createElement("input");
    input.type = type;
    const inputWrapper = helper.newDiv("class","input-wrapper");
    inputWrapper.appendChild(input);
    return inputWrapper;
}

function receiveNameInput () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        const task = list.getTask(helper.getActiveTaskId());
        task.setName(this.value.trim());
        this.value = "";
        helper.updateTasks();
    }
}
function receiveDateInput () {
    const task = list.getTask(helper.getActiveTaskId());
    task.setDueDate(this.value);
    helper.updateTasks();
}
function startDateHover () {
    this.parentElement.firstChild.classList.add("date-hover");
}
function endDateHover () {
    this.parentElement.firstChild.classList.remove("date-hover");
}
function createDueDate (task) {
    const dueDate = createInput("date");
    const input = dueDate.firstChild;
    const dueDateInputText = helper.newDiv();

    dueDate.classList.add("date");
    dueDate.prepend(dueDateInputText);
    dueDateInputText.textContent = "Add Due Date";

    input.value = task.getDueDate();
    input.onchange = receiveDateInput;
    input.onmouseenter = startDateHover;
    input.onmouseleave = endDateHover;

    if (task.getDueDate()) {
        updateDueDateInputText(dueDateInputText,task.getDueDate());
        input.classList.add("has-date");
        dueDate.appendChild(createX());
    }
    return dueDate;
}

function updateDueDateInputText(text,unformattedDate) {
    const date = helper.parseDate(unformattedDate);
    text.textContent = "Due " + helper.format(date, "E, MMM do, y");
    text.classList.add("has-date");
    const compared = helper.compareAsc(date,helper.startOfToday());
    if (compared === -1) {
        text.classList.add("past-due");
    } else if (compared === 0) {
        text.classList.add("due-today");
    }
}
function createX () {
    const x_outer = helper.newDiv("id","x-date");
    const x_inner = helper.newDiv();
    const x = helper.newDiv();
    x.textContent = "+";
    x_inner.append(x);
    x_outer.appendChild(x_inner);
    x_outer.onclick = clearDueDate;
    return x_outer;
}
function clearDueDate () {
    list.getTask(helper.getActiveTaskId()).setDueDate(false);
    helper.updateTasks();
}
function createNotesEditField () {
    const notesEditField = document.createElement("textarea");
    notesEditField.placeholder = "Notes";
    return notesEditField;
}
function createNotes (task) {
    const notesWrapper = helper.newDiv("id","notes-wrapper","class","input-wrapper");
    const notesEditField = createNotesEditField();
    notesEditField.value = task.getNotes();
    notesEditField.oninput = resize;
    setTimeout(function() {setProperHeight(notesEditField);},0);
    notesWrapper.appendChild(notesEditField);
    return notesWrapper;
}
function resize () {
    this.style.height = "auto";
    setProperHeight(this);
}
function setProperHeight (element) {
    element.style.height = (element.scrollHeight-27) + "px";
}
function createDateAdded (task) {
    const dateAdded = helper.newDiv("class","date-added");
    dateAdded.textContent = "Created " + helper.format(parseInt(task.getID()), "E, MMM do, y");
    return dateAdded;
}
function createTrash (task) {
    const trash = helper.createTrashButton();
    trash.onclick = trashTask;
    return trash;
}

function trashTask() {
    list.deleteTask(list.getTask(helper.getActiveTaskId()));
    helper.deactivateActiveTaskElement();
    helper.updateTasks();
}