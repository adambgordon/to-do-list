const list = require("./list.js");
import "@fortawesome/fontawesome-free/js/all";
import format from "date-fns/format";
import compareAsc from "date-fns/compareAsc";
import startOfToday from "date-fns/startOfToday";
import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import {createTasks, updateTasks} from "./create-tasks.js";
import {createFolders, buildFolders} from "./create-folders.js"
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

export function newDiv (type, value) {
    const div = document.createElement("div");
    if (type && value) {
        type === "id" ? div.id = value
            : type === "class" ? div.classList.add(value)
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

export function createName (item) {
    const name = newDiv("class","name");
    name.textContent = item.getName();
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains("active")) {
            if (item.getItemType() === "folder") return;
            this.parentElement.classList.remove("active");
            updateTasks();
        }
        const currentActive = document.querySelector(".active."+item.getItemType());
        if (currentActive) {
            currentActive.classList.remove("active");
        }
        this.parentElement.classList.add("active");
        item.getItemType() === "folder" ? updateTasks()
            : item.getItemType() === "task" ? updateTaskDialog()
            : null;
    });
    return name;
}

export function createStarButton (task) {
    const star = newDiv("class","star");
    const fontAwesomeString =  ("fa-star").concat(" ",task.isStarred() ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    addStarListener(star,task);
    return star;
}

function addStarListener (star, task) {
    star.onclick = () => {
        task.toggleStar();
        if(task.isStarred()) list.bumpTaskToTop(task);

        let activeID = null;
        if (getActiveTaskID() === task.getID()) {
            activeID = getActiveTaskID();
            if (!task.isStarred() && list.getFolder(document.querySelector(".folder.active").id).getName() === "Starred") {
                activeID = null;
            }
        }
        updateTasks(activeID);
    }
}
// if current task is active task > pass thru active id
//    but if now being unstarred and current folder is starred > pass null

export function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}

export function createInput (type) {
    const plus = newIcon("fas fa-plus");
    const input = document.createElement("input");
    input.type = type;
    const inputWrapper = newDiv("class","input-wrapper");
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
    return inputWrapper;
}

export function getActiveTaskID() {
    const activeTask = document.querySelector(".active.task");
    return  activeTask ? activeTask.id : null;
}