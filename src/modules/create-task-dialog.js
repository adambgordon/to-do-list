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

    const name = initName(task);
    const star = helper.createStarButton(task);
    const dueDate = initDueDate(task);
    const notes = initNotes(task);
    const bottomRow = helper.newDiv("class","bottom-row")
    const dateAdded = initDateAdded(task);
    const trash = initTrash(task);
    
    name.appendChild(star)
    bottomRow.appendChild(dateAdded);
    bottomRow.appendChild(trash);
    taskDialog.appendChild(name);
    taskDialog.appendChild(dueDate);
    taskDialog.appendChild(notes);
    taskDialog.appendChild(bottomRow);
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
    dueDate.id = "due-date-input-wrapper";
    const input = dueDate.getElementsByTagName("input")[0];
    const dueDateInputText = helper.newDiv("class","due-date-input-text");
    dueDate.prepend(dueDateInputText);
    dueDateInputText.textContent = "Add Due Date";
    input.addEventListener("change", function (event) {
        const task = list.getTask(helper.getActiveTaskElement().id);
        task.setDueDate(input.value);
        helper.updateTasks();
    });
    input.value = task.getDueDate();

    let dateColor = "rgb(80,80,80)";
    let dateColorHover = "rgb(160,160,160";

    if (task.getDueDate()) {
        let date = task.getDueDate().split("-");
        date = new Date (date[0],date[1]-1,date[2]);
        dueDateInputText.textContent = "Due " + helper.format(date, "E, MMM do, y");
        
        if (helper.compareAsc(date,helper.startOfToday()) === -1) {
            dateColor = "red";
            dateColorHover = "rgb(255,120,120)";
        }

        dueDate.style.setProperty("--due-date-input-text-color",dateColor);
        dueDate.style.setProperty("--due-date-input-text-hover-color",dateColorHover);

        input.style.setProperty("--calendar-picker-indicator-filter","opacity(0%)");
        input.style.setProperty("--calendar-picker-indicator-hover-filter","opacity(0%)");
        const x_Date = helper.newDiv("id","x-date");
        const x = helper.newDiv();
        x.textContent = "+";
        x_Date.appendChild(x);
        dueDate.appendChild(x_Date);
        x_Date.addEventListener("mouseenter", function(event) {
            dueDate.style.setProperty("--due-date-input-text-hover-color",dateColor);
        });
        x_Date.addEventListener("mouseleave", function(event) {
            dueDate.style.setProperty("--due-date-input-text-hover-color",dateColorHover);
        });
        x_Date.addEventListener("click", function (event) {
            task.setDueDate(false);
            helper.updateTasks();
        });
        
    }
    return dueDate;
}
function initNotes (task) {
    const notesWrapper = helper.newDiv("class","input-wrapper");
    notesWrapper.id = "notes-wrapper";

    const notesEditField = document.createElement("textarea");
    notesEditField.id = "notes-edit-field";
    notesWrapper.appendChild(notesEditField);
    notesEditField.placeholder = "Notes";
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
    dateAdded.textContent = "Created " + helper.format(parseInt(task.getID()), "E, MMM do, y");
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
    list.deleteTask(list.getTask(taskID));
    helper.deactivateActiveTaskElement();
    helper.updateTasks();
}