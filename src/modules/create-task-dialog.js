/*
create-task-dialog.js creates all task dialog related DOM elements as well as
all functions required to manipulate and access details for any given task both in
the DOM and in the list module
*/

const list = require("./list.js");
import *  as helper from "./helper-functions.js";
export {createTaskDialog, updateTaskDialog};


/* MAIN TASK DIALOG FUNCTIONS */

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

    // remove touch listener if present, will be added if task dialog continue on to be constructed
    taskDialog.parentElement.removeEventListener("touchstart",touchAwayFromTaskDialog);
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

    // clears task dialog on mobile
    taskDialog.parentElement.addEventListener("touchstart",touchAwayFromTaskDialog);
}

// event handler for touch on background behind the task dialog
function touchAwayFromTaskDialog (event) {

    // if touch is on the background behind the task dialog (on mobile)
    if (event.target === this) {
        event.stopPropagation();
        const taskDialog = this.firstChild;
        const input = taskDialog.querySelector("input[type=text]");
        const notes = taskDialog.querySelector("textarea");

        // remove blur events to prevent them from triggering
        input.removeEventListener("blur",receiveNameInput);
        notes.removeEventListener("blur",saveNotes);

        // save updated task name and task notes
        saveNotes.call(notes);
        input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}));
    }
}

/* TASK NAME FUNCTIONS */

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

        // prevent blur from being triggered
        if (event.type !== "blur") this.removeEventListener("blur",receiveNameInput);
        if (!this.value || this.value.trim() === "") return;
        const task = list.getTask(helper.getActiveTaskId());
        task.setName(this.value.trim());
        helper.updateTasksInStorage();
        helper.updateTasks();
    }
}


/* DUE DATE FUNCTIONS */

// initializes and returns a group of elements for the due date
function createDueDate (task) {

    const dueDate = createInput("date");
    const input = dueDate.firstChild; // actual date input element
    const dueDateInputText = helper.newDiv(); // custom formatted display text for the due date

    dueDate.classList.add("date");
    dueDate.prepend(dueDateInputText);
    dueDateInputText.textContent = "Add Due Date";

    input.value = task.getDueDate();
    input.onchange = receiveDateInput;
    input.onmouseenter = startDateHover;
    input.onmouseleave = endDateHover;

    const hoverBackground = helper.newDiv("id","due-date-hover-background"); // separate box for shading on hover
    dueDate.appendChild(hoverBackground);

    if (task.getDueDate()) {
        updateDueDateInputText(dueDateInputText,task.getDueDate());
        input.classList.add("has-date");
        hoverBackground.classList.add("has-date");
        dueDate.appendChild(createX());
    }
    return dueDate;
}

// formats and updates the display text for the due date
function updateDueDateInputText(text,unformattedDate) {
    const date = helper.parseDate(unformattedDate);
    text.textContent = "Due " + helper.format(date, "E, MMM do, y");
    text.classList.add("has-date");
    const compared = helper.compareAsc(date,helper.startOfToday());
    if (compared === -1) {
        text.classList.add("past-due"); // add class if due date is earlier than today
    } else if (compared === 0) {
        text.classList.add("due-today"); // add class if due day is today
    }
}

// event handler to save and update the due date
function receiveDateInput (event) {
    const task = list.getTask(helper.getActiveTaskId());
    task.setDueDate(this.value);
    helper.updateTasksInStorage();
    helper.updateTasks();
}

// mouse movement event handler to trigger when the due date starts being hovered over
// (the date picker integrated into input[type=date] must be separate from custom
// display text, so hover for one needs to trigger the other)
function startDateHover (event) {
    this.parentElement.firstChild.classList.add("date-hover");
    document.getElementById("due-date-hover-background").classList.add("date-hover");
}

// mouse movement event handler to trigger when the due date stops being hovered over
function endDateHover (event) {
    this.parentElement.firstChild.classList.remove("date-hover");
    document.getElementById("due-date-hover-background").classList.remove("date-hover");
}

// initializes and returns a group of elements that collectively
// make up the "X" to clear the due date
function createX () {
    const x_outer = helper.newDiv("id","x-date");
    const x_inner = helper.newDiv();
    const x = helper.newDiv();
    x.textContent = "+"; // the "X" is a "+" rotated 45deg
    x_inner.append(x);
    x_outer.appendChild(x_inner);
    x_outer.onclick = clearDueDate;
    return x_outer;
}

// click event handler to clear the due date and update the tasks (and thereby task dialog)
function clearDueDate (event) {
    list.getTask(helper.getActiveTaskId()).setDueDate(false);
    helper.updateTasksInStorage();
    helper.updateTasks();
}


/* NOTES FUNCTIONS */

// initializes and returns a group of elements for the notes section of the task dialog
function createNotes (task) {
    const notesWrapper = helper.newDiv("id","notes-wrapper","class","input-wrapper");
    const notesEditField = createNotesEditField();
    notesEditField.value = task.getNotes();

    // continually adjust size as characters are added/removed
    notesEditField.oninput = resize;

    // save notes any time focus is lost
    notesEditField.addEventListener("blur",saveNotes);

    // timeout allows for accurate height calculation
    setTimeout(function() {setProperHeight(notesEditField);},0); 
    notesWrapper.appendChild(notesEditField);
    return notesWrapper;
}

// returns a textarea element for the task notes
function createNotesEditField () {
    const notesEditField = document.createElement("textarea");
    notesEditField.placeholder = "Notes";
    return notesEditField;
}

// input event handler to adjust size of the notes textarea
function resize (event) {
    this.style.height = "auto";
    setProperHeight(this);
}

// blur event handler to save the notes to the task in the list module
function saveNotes (event) {
    list.getTask(helper.getActiveTaskId()).setNotes(this.value);
    helper.updateTasksInStorage();
}

// calculates and sets proper height for the notes textarea
function setProperHeight (element) {
    element.style.height = (element.scrollHeight-27) + "px";
}


/* DATE ADDED & TRASH FUNCTIONS */

// initializes and returns the element for the date the task was added 
function createDateAdded (task) {
    const dateAdded = helper.newDiv("class","date-added");
    dateAdded.textContent = "Created " + helper.format(parseInt(task.getID()), "E, MMM do, y");
    return dateAdded;
}

// initializes and returns the trash element (for deleting the task) on the task dialog
function createTrash () {
    const trash = helper.createTrashButton();
    trash.onclick = prompt;
    return trash;
}
// event handler to prompt user for folder delete confirmation
function prompt (event) {
    const modal = helper.createTrashModal();
    modal.lastChild.onclick = trashTask;
    this.parentElement.parentElement.insertBefore(modal,this.parentElement);
    setTimeout(() => {modal.classList.add("fade-in");}, 0);
}
// event handler to actually delete the task, remvoing it from the list module and the DOM
function trashTask() {
    list.deleteTask(list.getTask(helper.getActiveTaskId()));
    helper.deactivateActiveTaskElement();
    helper.updateTasksInStorage();
    helper.updateTasks();
}