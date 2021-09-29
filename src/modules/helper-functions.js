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
    if(task.isStarred() && !task.isCompleted()) list.bumpTaskToTop(task);
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
export function createTitle() {
    const title = newDiv("id","title");
    title.textContent = "To Do List";
    title.onclick = refresh;
    return title;
}
function refresh () {
    window.location.reload();
}
export function createFooter () {
    const footer = document.createElement("div");
    footer.id = "footer";
    // links to github page for this repo
    const link = document.createElement("a");
    link.onclick = () => {window.open("https://github.com/adambgordon/to-do-list","_blank");};
    const copyright = document.createElement("div");
    copyright.textContent = "© 2021 Adam Gordon"
    const github_icon = newIcon("fab fa-github");
    link.appendChild(copyright);
    link.appendChild(github_icon);
    footer.appendChild(link);
    return footer;
}
export function initWindowListeners () {
    window.onclick = windowClickActions;
    window.onkeydown = windowKeyActions;

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
    const element = document.getElementById(id);
    element.classList.add("active");
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
function windowClickActions () {
    clickOnTask(event);
    clickOnFolder(event);
    clickAwayFromFolderAdd(event);
    clickAwayFromActiveTask(event);
    clickAwayFromModalDialog(event);
    clickAwayFromMobileTaskDialog(event);
}
function windowKeyActions () {
    keyInputOnModalDialog(event);
}
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
// function clickAwayFromNotes (event) {
//     const notes = document.getElementsByTagName("textarea")[0];
//     if (notes && event.target !== notes) {
//         list.getTask(getActiveTaskId()).setNotes(notes.value);
//     }
// }
function clickAwayFromFolderAdd (event) {
    const folderInputWrapper = document.querySelector("#folder-wrapper .input-wrapper.expanded")
    if (folderInputWrapper && !folderInputWrapper.contains(event.target)) {
        toggleExpanded(folderInputWrapper.firstChild);
    }
}
// function clickAwayFromFolderEdit (event) {
//     const folderEditField = document.querySelector(".folder > input");
//     if (folderEditField && event.target !== folderEditField) {
//         updateFolders();
//     }
// }
// function clickAwayFromTaskEdit (event) {
//     const taskEditField = document.querySelector(".task > input");
//     if (taskEditField && event.target !== taskEditField) {
//         updateTasks();
//     }
// }
function clickAwayFromActiveTask (event) {
    if (document.querySelector(".task > input")) return;
    const activeTask = getActiveTaskElement();
    if (activeTask && shouldDeactivateTask(event)) {
        deactivateActiveTaskElement();
        updateTaskDialog();
    }
}
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

function clickAwayFromModalDialog (event) {
    const modals = document.querySelectorAll(".modal");
    for (let i = 0; i < modals.length; i++ ) {
        if (modals[i] && !modals[i].contains(event.target) && !modals[i].nextSibling.querySelector(".trash").contains(event.target)) {
            modals[i].remove();
        }
    }
}
function keyInputOnModalDialog (event) {
    const modal = document.querySelector(".modal");
    if (modal) {
        if (event.key === "Escape") modal.remove();
        if (event.key === "Enter") modal.lastChild.dispatchEvent(new Event("click"));
    }
}
function clickAwayFromMobileTaskDialog (event) {
    const taskDialog = document.getElementById("task-dialog");
    const contentBox = taskDialog.parentElement;
    if (screen.width <= 1000 && taskDialog.hasChildNodes()) {
        contentBox.style.height = "100vh";
    } else {
        contentBox.style.height = "0";
    }
}