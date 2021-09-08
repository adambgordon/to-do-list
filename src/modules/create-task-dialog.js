const list = require("./list.js");
import *  as helper from "./helper-functions.js";

export {createTaskDialog, updateTaskDialog};

function createTaskDialog (list) {
    const taskDialog = helper.newDiv("id","task-dialog");
    return taskDialog;
}

function updateTaskDialog () {
    const taskDialog = document.querySelector("#task-dialog");
    helper.removeAllChildren(taskDialog);
    addDialogFromTask();
}

function addDialogFromTask () {
    const active = document.querySelector(".active.task");
    if (!active) return;
    const taskDialog = document.querySelector("#task-dialog");
    const task = list.getTask(active.id);

    const notesSpacer = helper.newDiv();
    notesSpacer.textContent = "Notes";

    const name = initName(task);
    const star = helper.createStarButton(task);
    const dueDate = initDueDate(task);
    const notes = initNotes(task);
    const dateAdded = initDateAdded(task);
    const trash = initTrash(task);
    
    taskDialog.appendChild(name);
    taskDialog.appendChild(star);
    taskDialog.appendChild(dueDate);
    taskDialog.appendChild(notesSpacer);
    taskDialog.appendChild(notes);
    taskDialog.appendChild(dateAdded);
    taskDialog.appendChild(trash);
}

function initName (task) {
    const name = helper.createInput("text");
    const input = name.firstChild;
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setName(input.value.trim());
            input.value = "";
            helper.updateTasks(task.getID());
        }
    });
    input.value = task.getName();
    return name;
}
function initDueDate (task) {
    const dueDate = helper.createInput("date");
    const input = dueDate.firstChild;
    input.addEventListener("change", function (event) {
        const task = list.getTask(document.querySelector(".active.task").id);
        task.setDueDate(input.value);
        helper.updateTasks(task.getID());
    });
    input.value = task.getDueDate();
    return dueDate;
}
function initNotes (task) {
    const notes = helper.createInput("text");
    const input = notes.firstChild;
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setNotes(input.value.trim());
            input.value = "";
            helper.updateTasks(task.getID());
        }
    });
    input.value = task.getNotes();
    return notes;
}
function initDateAdded (task) {
    const dateAdded = helper.newDiv("class","date-added");
    dateAdded.textContent = "Created " + helper.format(parseInt(task.getID()), "E, MMM do");
    return dateAdded;
}
function initTrash (task) {
    const trash = helper.createTrashButton();
    trash.addEventListener("click", function (event) {
        trashTask(task.getID());
    });
    return trash;
}

function trashTask(taskID) {
    console.log("trashing");
    list.deleteTask(list.getTask(taskID));
    helper.updateTasks();
}