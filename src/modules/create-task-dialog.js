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
    dueDate.classList.add("date");
    const input = dueDate.firstChild;
    
    const dueDateInputText = helper.newDiv();
    dueDate.prepend(dueDateInputText);
    dueDateInputText.textContent = "Add Due Date";
    
    input.value = task.getDueDate();
    input.onchange = receiveDateInput;

    input.onmouseenter = startDateHover;
    input.onmouseleave = endDateHover;

    if (task.getDueDate()) {
        const date = helper.parseDate(task.getDueDate());
        dueDateInputText.textContent = "Due " + helper.format(date, "E, MMM do, y");
        dueDateInputText.classList.add("has-date");

        const compared = helper.compareAsc(date,helper.startOfToday());
        if (compared === -1) {
            dueDateInputText.classList.add("past-due");
        } else if (compared === 0) {
            dueDateInputText.classList.add("due-today");
        }

        input.classList.add("has-date");

        const x_Date = helper.newDiv("id","x-date");
        const x = helper.newDiv();
        x.textContent = "+";
        x_Date.appendChild(x);
        dueDate.appendChild(x_Date);
        
        x_Date.addEventListener("click", function (event) {
            task.setDueDate(false);
            helper.updateTasks();
        });
        
    }
    return dueDate;
}
function createNotesEditField () {
    const notesEditField = document.createElement("textarea");
    notesEditField.id = "notes-edit-field";
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
    element.style.height = (element.scrollHeight-19) + "px";
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