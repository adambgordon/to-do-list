const list = require("./list.js");
import "@fortawesome/fontawesome-free/js/all";
import format from "date-fns/format";
import compareAsc from "date-fns/compareAsc";
import startOfToday from "date-fns/startOfToday";
import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import {createTasks, updateTasks} from "./create-tasks.js";
import {createFolders, buildFolders, updateFolders, toggleExpanded} from "./create-folders.js"
import {createTaskDialog, updateTaskDialog} from "./create-task-dialog.js";

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
export function newIcon (fontAwesomeString) {
    const classes = fontAwesomeString.split(" ");
    const icon = document.createElement("i");
    classes.forEach(element => { icon.classList.add(element); });
    return icon;
}
export function removeAllChildren (element) {
    if (!element) return;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
export function createStarButton (task) {
    const star = newDiv("class","star");
    const fontAwesomeString =  ("fa-star").concat(" ",task.isStarred() ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    star.onclick = toggleStar;
    return star;
}
// if task is being destarred && current folder is "Starred" && this task is the active task, then deactivate
function toggleStar () {
    const task = list.getTask(this.parentElement.classList.contains("task") ? this.parentElement.id : getActiveTaskId());
    task.toggleStar();
    if(task.isStarred()) list.bumpTaskToTop(task);
    if (!task.isStarred()
        && list.getFolder(getActiveFolderId()).getName() === "Starred"
        && ( getActiveTaskElement() === this.parentElement || document.getElementById("task-dialog").contains(this)))
    {
        deactivateActiveTaskElement();
    }
    updateTasks();
}
export function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}
export function createLeftHandIconContainer (fontAwesomeString) {
    const leftHandIconContainer = newDiv("class","left-hand-icon-container");
    const innerWrapper = newDiv();
    const icon = newIcon(fontAwesomeString);
    leftHandIconContainer.append(innerWrapper);
    innerWrapper.appendChild(icon);
    return leftHandIconContainer;
}
export function initWindowListener () {
    window.onclick = windowActions;
}
export function getActiveTaskElement () {
    const activeTask = document.querySelector(".active.task");
    return  activeTask ? activeTask : null;
}
export function getActiveTaskId () {
    const activeTask = getActiveTaskElement();
    return activeTask ? activeTask.id : null;
}
export function deactivateActiveTaskElement () {
    const activeTask = getActiveTaskElement();
    if (activeTask) activeTask.classList.remove("active");
}
export function activateElementByID (id) {
    document.getElementById(id).classList.add("active");
}
export function getActiveFolderElement () {
    const activeFolder = document.querySelector(".active.folder");
    return activeFolder ? activeFolder : null;
}
export function getActiveFolderId () {
    const activeFolder = getActiveFolderElement();
    return activeFolder ? activeFolder.id : null;
}
export function deactivateActiveFolderElement () {
    const activeFolder = getActiveFolderElement();
    if (activeFolder) activeFolder.classList.remove("active");
}
export function createPlus() {
    const plus = createLeftHandIconContainer("fas fa-plus");
    plus.classList.add("plus");
    return plus;
}
export function parseDate(date) {
    let parsed = date.split("-");
    parsed = new Date (parsed[0],parsed[1]-1,parsed[2]);
    return parsed;
}
function windowActions () {
    clickOnTask(event);
    clickOnFolder(event);
    clickAwayFromNotes(event);
    clickAwayFromFolderAdd(event);
    clickAwayFromFolderEdit(event);
    clickAwayFromActiveTask(event);
}
function clickOnTask (event) {
    const activeTask = getActiveTaskElement();
    if (event.target.classList.contains("name") && event.target.parentElement.classList.contains("task")) {
        deactivateActiveTaskElement();
        if (activeTask !== event.target.parentElement) {
            activateElementByID(event.target.parentElement.id);
        }
        updateTaskDialog();
    }
}
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
function clickAwayFromNotes (event) {
    const notes = document.getElementsByTagName("textarea")[0];
    if (notes && event.target !== notes) {
        list.getTask(getActiveTaskId()).setNotes(notes.value);
    }
}
function clickAwayFromFolderAdd (event) {
    const folderInputWrapper = document.querySelector("#folder-wrapper .input-wrapper.expanded")
    if (folderInputWrapper && !folderInputWrapper.contains(event.target)) {
        toggleExpanded(folderInputWrapper.firstChild);
    }
}
function clickAwayFromFolderEdit (event) {
    const folderEditField = document.querySelector("#folders input");
    if (folderEditField && event.target !== folderEditField) {
        updateFolders();
    }
}
function clickAwayFromActiveTask (event) {
    const activeTask = getActiveTaskElement();
    if (activeTask && (event.target.tagName === "HTML" 
                        || event.target.id === "content"
                        || event.target.classList.contains("content-box")
                        || event.target.id === "task-wrapper"))
    {
        deactivateActiveTaskElement();
        updateTaskDialog();
    }
}