/*
create-task-dialog.js creates all task dialog related DOM elements as well as
all functions required to manipulate and access details for any given task both in
the DOM and in the list module
*/

const list = require("./list.js");
import *  as helper from "./helper-functions.js";

export {createTaskDialog, updateTaskDialog};

// creates and returns the task dialog element
// note: does not initialize child elements because task dialog is
// not always displayed; it is called dynamically
function createTaskDialog () {
    const taskDialog = helper.newDiv("id","task-dialog");
    return taskDialog;
}
// updates task dialog elements in the DOM by removing the curent elements
// and adding the updated task detail elements from the list module
function updateTaskDialog () {
    const taskDialog = document.getElementById("task-dialog");
    helper.removeAllChildren(taskDialog);
    addDialogFromTask();
}
// creates and appends task dialog elements from list module
function addDialogFromTask () {

    const activeID = helper.getActiveTaskId();
    const taskDialog = document.getElementById("task-dialog");
    if (!activeID) {
        taskDialog.classList.remove("fade-in");
        return;
    }
    setTimeout(() => {taskDialog.classList.add("fade-in");}, 0);

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

    // updated dialog classlist for proper styling based on if task is already completed
    task.isCompleted() ? taskDialog.classList.add("completed") : taskDialog.classList.remove("completed");
}
// create and initialize task name input
function createName (task) {
    const name = createInput("text");
    const input = name.firstChild;
    input.value = task.getName();
    input.onkeydown = receiveNameInput;
    input.addEventListener("blur", receiveNameInput);
    return name;
}
// dynamically create and return and input wrapper and input of specified type, e.g. text, date, etc.
function createInput(type) {
    const input = document.createElement("input");
    input.type = type;
    const inputWrapper = helper.newDiv("class","input-wrapper");
    inputWrapper.appendChild(input);
    return inputWrapper;
}
// event handler to save and update the name of task in the dialog input
function receiveNameInput (event) {
    if (event.key === "Enter" || event.key === "Escape" || event.type === "blur") {
        if (event.type !== "blur") this.removeEventListener("blur",receiveNameInput); // prevent blur from being triggered
        if (!this.value || this.value.trim() === "") return;
        const task = list.getTask(helper.getActiveTaskId());
        task.setName(this.value.trim());
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
    document.getElementById("due-date-hover-background").classList.add("date-hover");
}
function endDateHover () {
    this.parentElement.firstChild.classList.remove("date-hover");
    document.getElementById("due-date-hover-background").classList.remove("date-hover");
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

    const hoverBackground = helper.newDiv("id","due-date-hover-background"); // resume here
    dueDate.appendChild(hoverBackground);

    if (task.getDueDate()) {
        updateDueDateInputText(dueDateInputText,task.getDueDate());
        input.classList.add("has-date");
        hoverBackground.classList.add("has-date");
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
    notesEditField.onblur = saveNotes; // change!!!!????
    setTimeout(function() {setProperHeight(notesEditField);},0);
    notesWrapper.appendChild(notesEditField);
    return notesWrapper;
}
function resize () {
    this.style.height = "auto";
    setProperHeight(this);
}
function saveNotes () {
    list.getTask(helper.getActiveTaskId()).setNotes(this.value);
}
function setProperHeight (element) {
    element.style.height = (element.scrollHeight-27) + "px";
}
function createDateAdded (task) {
    const dateAdded = helper.newDiv("class","date-added");
    dateAdded.textContent = "Created " + helper.format(parseInt(task.getID()), "E, MMM do, y");
    return dateAdded;
}
function createTrash () {
    const trash = helper.createTrashButton();
    trash.onclick = prompt;
    return trash;
}
function prompt () {
    const modal = helper.createTrashModal();
    modal.lastChild.onclick = trashTask;
    this.parentElement.parentElement.insertBefore(modal,this.parentElement);
    setTimeout(() => {modal.classList.add("fade-in");}, 0);
}
function trashTask() {
    list.deleteTask(list.getTask(helper.getActiveTaskId()));
    helper.deactivateActiveTaskElement();
    helper.updateTasks();
}