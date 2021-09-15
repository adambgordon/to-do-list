const list = require("./list.js");
import "@fortawesome/fontawesome-free/js/all";
import format from "date-fns/format";
import compareAsc from "date-fns/compareAsc";
import startOfToday from "date-fns/startOfToday";
import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import {createTasks, updateTasks} from "./create-tasks.js";
import {createFolders, buildFolders, updateFolders} from "./create-folders.js"
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

        if (getActiveTaskElement() === document.getElementById(task.getID())
        && !task.isStarred()
        && list.getFolder(document.querySelector(".folder.active").id).getName() === "Starred") {
            deactivateActiveTaskElement();
        }
        updateTasks();
    }
}
// if current task is active task > pass thru active id
//    but if now being unstarred and current folder is starred > pass null

export function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}

export function createInput (type,fontAwesomeString) {
    const input = document.createElement("input");
    input.type = type;
    const inputWrapper = newDiv("class","input-wrapper");
    if (fontAwesomeString) {
        const wrapper = newDiv();
        const wrapper2 = newDiv();
        if (fontAwesomeString === "fas fa-plus") wrapper.classList.add("plus");
        const icon = newIcon(fontAwesomeString);
        wrapper.appendChild(wrapper2);
        wrapper2.appendChild(icon);
        inputWrapper.appendChild(wrapper);
    }
    inputWrapper.appendChild(input);
    return inputWrapper;
}

export function initWindowListener () {
    window.onclick = function (event) {
        const activeTask = getActiveTaskElement();
        const activeFolder = getActiveFolderElement();
        const notesEditField = document.querySelector("#notes-edit-field");
        if (notesEditField && event.target !== notesEditField) {
            list.getTask(activeTask.id).setNotes(notesEditField.value);
        }
        const folderEditField = document.querySelector("#folder-edit-field");
        if (folderEditField && event.target !== folderEditField) {
            updateFolders();
        }
        if (activeTask
            && (event.target.tagName === "HTML"
            || event.target.id === "content"
            || event.target.classList.contains("content-box")
            || event.target.id === "task-wrapper")) {
            deactivateActiveTaskElement();
            updateTaskDialog();
        }
        if (event.target.classList.contains("name")) {
            if (event.target.parentElement.classList.contains("task")) {
                deactivateActiveTaskElement();
                if (activeTask !== event.target.parentElement) {
                    activateElementByID(event.target.parentElement.id);
                }
                updateTaskDialog();
            } else if (event.target.parentElement.classList.contains("folder")) {
                if (activeFolder !== event.target.parentElement) {
                    deactivateActiveTaskElement();
                    deactivateActiveFolderElement();
                    activateElementByID(event.target.parentElement.id)
                    updateTasks();
                }
            }
        }
    }
    window.addEventListener("dblclick", function (event) {
        const activeFolder = getActiveFolderElement();
        if (event.target.classList.contains("name")
            && event.target.parentElement === activeFolder
            && activeFolder.textContent !== "All Tasks"
            && activeFolder.textContent !== "Starred") {
                
            const folder = list.getFolder(activeFolder.id);
            while (!activeFolder.lastChild.classList.contains("folder-icon")) {
                activeFolder.lastChild.remove()
            }
            const input = document.createElement("input");
            activeFolder.appendChild(input);
            input.id = "folder-edit-field"
            input.type = "text";
            input.value = folder.getName();
            input.addEventListener("keydown", function (event2) {
                if (event2.key === "Enter") {
                    if (!input.value || input.value.trim() === "") return;
                    folder.setName(input.value.trim());
                    input.remove();
                    updateFolders();
                } else if (event2.key === "Escape") {
                    input.remove();
                    updateFolders();
                }
            });
            input.focus();
        }
    });
}

export function getActiveTaskElement () {
    const activeTask = document.querySelector(".active.task");
    return  activeTask ? activeTask : null;
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

export function deactivateActiveFolderElement () {
    const activeFolder = getActiveFolderElement();
    if (activeFolder) activeFolder.classList.remove("active");
}