/*
Helper-functions.js is designed for two purposes:
1. Create & export functions that have repeated utility across multiple modules
2. Serve as the universal conduit to import functions and re-export them to other modules

This allows for all other modules to only need to import list.js and helper-function.js
and still get full cross-functional access.
 */

const list = require("./list.js");
import "@fortawesome/fontawesome-free/js/all";
import format from "date-fns/format";
import compareAsc from "date-fns/compareAsc";
import startOfToday from "date-fns/startOfToday";
import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import {createTasks, updateTasks} from "./create-tasks.js";
import {createFolders, buildFolders, collapseInputField} from "./create-folders.js"
import {createTaskDialog, updateTaskDialog} from "./create-task-dialog.js";

// fn's below are imported fn's being re-exported
export {
    format,
    compareAsc,
    startOfToday,
    taskFactory,
    folderFactory,
    createTasks,
    updateTasks,
    createFolders,
    buildFolders,
    createTaskDialog,
    updateTaskDialog
};

// creates a div DOM element and assigns id's and/or classes if desired
// (parameters not required)
export function newDiv (type1, value1, type2, value2) {
    const div = document.createElement("div");
    if (type1 && value1) {
        type1 === "id" ? div.id = value1
            : type1 === "class" ? div.classList.add(value1)
            : null;
    }
    if (type2 && value2) {
        type2 === "id" ? div.id = value2
            : type2 === "class" ? div.classList.add(value2)
            : null;
    }
    return div;
}
// creates an i (icon) DOM element and assigns font awesome classes based on string param
export function newIcon (fontAwesomeString) {
    const classes = fontAwesomeString.split(" ");
    const icon = document.createElement("i");
    classes.forEach(element => { icon.classList.add(element); });
    return icon;
}
// removes all children for a given DOM element
export function removeAllChildren (element) {
    if (!element) return;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// returns element for active task or null if element does not exist
export function getActiveTaskElement () {
    const activeTask = document.querySelector(".active.task");
    return  activeTask ? activeTask : null;
}
// returns id for active task element or null if element does not exist
export function getActiveTaskId () {
    const activeTask = getActiveTaskElement();
    return activeTask ? activeTask.id : null;
}
// deactivates active element if it exists
export function deactivateActiveTaskElement () {
    const activeTask = getActiveTaskElement();
    if (activeTask) activeTask.classList.remove("active");
}
// returns element for active folder or null if element does not exist
export function getActiveFolderElement () {
    const activeFolder = document.querySelector(".active.folder");
    return activeFolder ? activeFolder : null;
}
// returns id for active folder element or null if element does not exist
export function getActiveFolderId () {
    const activeFolder = getActiveFolderElement();
    return activeFolder ? activeFolder.id : null;
}
// deactivates active element if it exists
export function deactivateActiveFolderElement () {
    const activeFolder = getActiveFolderElement();
    if (activeFolder) activeFolder.classList.remove("active");
}
// activates element based on element id
export function activateElementByID (id) {
    const element = document.getElementById(id);
    element.classList.add("active");
}
// initializes window event listeners
export function initWindowListeners () {
    window.onclick = windowClickActions;
    window.onkeydown = windowKeyActions;
}
// creates and returns the title element
export function createTitle() {
    const title = newDiv("id","title");
    title.textContent = "To Do List";
    title.onclick = refresh;
    return title;
}
// event handler for title click
function refresh () {
    window.location.reload();
}
// creates and return the footer element: includes copyright, github icon, and link to this repo
export function createFooter () {
    const footer = document.createElement("div");
    const link = document.createElement("a");
    const copyright = document.createElement("div");
    const github_icon = newIcon("fab fa-github");

    footer.id = "footer";
    link.onclick = () => {window.open("https://github.com/adambgordon/to-do-list","_blank");};
    copyright.textContent = "© 2021 Adam Gordon"

    link.appendChild(copyright);
    link.appendChild(github_icon);
    footer.appendChild(link);
    return footer;
}
// creates and returns a div with a star icon based on task param
export function createStarButton (task) {
    const star = newDiv("class","star");
    // star icon is either an star outline or a filled in star based on task completion
    const fontAwesomeString =  ("fa-star").concat(" ",task.isStarred() ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    star.onclick = toggleStar;
    return star;
}
// event handler for a star being clicked/toggled
// if task is being destarred && current folder is "Starred" && this task is the active task, then deactivate
function toggleStar () {
    // get task element being destarred based on whether star is child of task element or task dialog element
    const task = list.getTask(this.parentElement.classList.contains("task") ? this.parentElement.id : getActiveTaskId());
    task.toggleStar();
    // move task to top of list if star is being added and is not in the completed section
    if(task.isStarred() && !task.isCompleted()) list.bumpTaskToTop(task);
    // deactivate task if being destarred && current folder is "Starred" && the task being de-starred is the active task
    if (!task.isStarred()
        && list.getFolder(getActiveFolderId()).getName() === "Starred"
        && (getActiveTaskElement() === this.parentElement || document.getElementById("task-dialog").contains(this)))
    {
        deactivateActiveTaskElement();
    }
    updateTasks();
}
// creates and returns a div with a trash icon
export function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}
// creates and returns a div with a div wrapper for icon
export function createLeftHandIconContainer (fontAwesomeString) {
    const leftHandIconContainer = newDiv("class","left-hand-icon-container");
    const innerWrapper = newDiv();
    const icon = newIcon(fontAwesomeString);
    leftHandIconContainer.append(innerWrapper);
    innerWrapper.appendChild(icon);
    return leftHandIconContainer;
}
// creates and return left-hand-icon-container, specifically with a plus icon
export function createPlus() {
    const plus = createLeftHandIconContainer("fas fa-plus");
    plus.classList.add("plus");
    return plus;
}
// parses a date string ("YYYY-MM-DD") and returns date object
export function parseDate(date) {
    let parsed = date.split("-");
    parsed = new Date (parsed[0],parsed[1]-1,parsed[2]);
    return parsed;
}
// creates and return modal dialog for trashing/deleting a folder/task
export function createTrashModal () {
    const modal = newDiv("class","modal");
    const warning = newDiv();
    const confirm = newDiv();
    warning.textContent = "You cannot\r\nundo this action";
    confirm.textContent = "Confirm delete";
    modal.appendChild(warning);
    modal.appendChild(confirm);
    return modal;
}
// window click event handler that calls subsiary window click event handlers
function windowClickActions (event) {
    clickOnTask(event);
    clickOnFolder(event);
    clickAwayFromFolderAdd(event);
    clickAwayFromActiveTask(event);
    clickAwayFromModalDialog(event);
    createTaskDialogForMobile();
}
// window keyboard event handler that calls subsiary window keyboard event handlers
function windowKeyActions (event) {
    keyInputOnModalDialog(event);
}
// activates/deactivates/updates tasks based on task status & click target
function clickOnTask (event) {
    const activeTask = getActiveTaskElement();
    if ((event.target.classList.contains("name") || event.target.classList.contains("due-date"))
        && event.target.parentElement.classList.contains("task")
        && activeTask !== event.target.parentElement)
    {
        deactivateActiveTaskElement();
        activateElementByID(event.target.parentElement.id);
        updateTaskDialog();
    }
}
// activates/deactivates/updates folders based on folder status & click target
function clickOnFolder (event) {
    const folders = document.getElementById("folders");
    if (folders.contains(event.target)) {
        const activeFolder = getActiveFolderElement();
        if (activeFolder.contains(event.target)) return;
        const leftHandIconContainer = event.target.closest(".left-hand-icon-container");
        if (event.target.classList.contains("name") || leftHandIconContainer) {
            deactivateActiveTaskElement();
            deactivateActiveFolderElement();
            activateElementByID(event.target.closest(".folder").id);
            updateTasks();
        }
    }
}
// fix this -- switch to blur event
function clickAwayFromFolderAdd (event) {
    const folderInputWrapper = document.querySelector("#folder-wrapper .input-wrapper.expanded")
    if (folderInputWrapper && !folderInputWrapper.contains(event.target)) {
        collapseInputField(folderInputWrapper);
    }
}
// deactivates task based on click location (blur event not used because div is not being focused)
function clickAwayFromActiveTask (event) {
    if (document.querySelector(".task > input")) return;
    const activeTask = getActiveTaskElement();
    if (activeTask && shouldDeactivateTask(event)) {
        deactivateActiveTaskElement();
        updateTaskDialog();
    }
}
// boolean function to evaluate if click location should result in task deactivation
function shouldDeactivateTask (event) {
    if (event.target.tagName.toLowerCase() === "html") return true;
    if (event.target.tagName.toLowerCase() === "body") return true;
    if (event.target.id === "content") return true;
    if (event.target.id === "folder-wrapper") return true;
    if (event.target.id === "task-wrapper") return true;
    if (event.target.id === "tasks") return true;
    if (event.target.id === "footer") return true;
    if (event.target.classList.contains("content-box")) return true;
    return false;
}
// clears modal dialog based on click location (blur event not used because div is not being focused)
function clickAwayFromModalDialog (event) {
    const modals = document.querySelectorAll(".modal");
    for (let i = 0; i < modals.length; i++ ) {
        if (modals[i] && !modals[i].contains(event.target) && !modals[i].nextSibling.querySelector(".trash").contains(event.target)) {
            modals[i].remove();
        }
    }
}
// clears modal dialog or deletes task/folder based on key input
function keyInputOnModalDialog (event) {
    const modal = document.querySelector(".modal");
    if (modal) {
        if (event.key === "Escape") modal.remove();
        if (event.key === "Enter") modal.lastChild.dispatchEvent(new Event("click"));
    }
}
// reformats task dialog's content box to convert task dialog to modal dialog
function createTaskDialogForMobile () {
    const taskDialog = document.getElementById("task-dialog");
    const contentBox = taskDialog.parentElement;
    // if mobile screen width and task dialog is present,
    // set task dialog's content box to cover entire window,
    if (screen.width <= 1000 && taskDialog.hasChildNodes()) {
        contentBox.style.height = "100vh";
    } else {
        contentBox.style.height = "0";
    }
}