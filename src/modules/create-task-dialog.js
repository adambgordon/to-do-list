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
    const active = helper.getActiveTaskElement();
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
    const input = name.getElementsByTagName("input")[0];
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(helper.getActiveTaskElement().id);
            task.setName(input.value.trim());
            input.value = "";
            helper.updateTasks();
        }
    });
    input.value = task.getName();
    return name;
}
function initDueDate (task) {
    const dueDate = helper.createInput("date");
    const input = dueDate.firstChild;
    input.addEventListener("change", function (event) {
        const task = list.getTask(helper.getActiveTaskElement().id);
        task.setDueDate(input.value);
        helper.updateTasks();
    });
    input.value = task.getDueDate();
    return dueDate;
}
function initNotes (task) {
    const notesWrapper = helper.newDiv("class","input-wrapper");
    notesWrapper.id = "notes-wrapper";

    const notesEditField = document.createElement("textarea");
    notesEditField.id = "notes-edit-field";
    notesWrapper.appendChild(notesEditField);
    notesEditField.value = task.getNotes();

    setTimeout(function() {
        notesEditField.style.height = (notesEditField.scrollHeight-19) + "px";
    },0);

    notesEditField.addEventListener("input", function (event) {
        notesEditField.style.height = "auto";
        notesEditField.style.height = (notesEditField.scrollHeight-19) + "px";
    });

    
    return notesWrapper;
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
    helper.deactivateActiveTaskElement();
    helper.updateTasks();
}