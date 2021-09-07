const list = require("./list.js");
// import { add } from "date-fns";
import format from "date-fns/format";


function newDiv (type, value) {
    const div = document.createElement("div");
    if (type && value) {
        type === "id" ? div.id = value
            : type === "class" ? div.classList.add(value)
            : null;
    }
    return div;
}

function newIcon (fontAwesomeString) {
    const classes = fontAwesomeString.split(" ");
    const icon = document.createElement("i");
    classes.forEach(element => { icon.classList.add(element); });
    return icon;
}

function updateFolders (newFolder) {
    const folders = document.querySelector("#folders");
    removeAllChildren(folders);
    addFoldersFromList();
    (newFolder ? folders.lastChild : folders.firstChild).classList.add("active");
    updateTasks();
}

function addFoldersFromList () {
    list.getFolders().forEach( (element) => {
        const folder = newDiv("class","folder");
        folder.id = element.getID();
        folder.appendChild(createName("folder",element.getName()));
        if (element.getName() !== "All Tasks" && element.getName() !== "Starred") {
            const trash = createTrashButton();
            trash.onclick = trashTheFolder;
            folder.appendChild(trash);
        }
        folders.appendChild(folder);
    });
}

function updateTasks (activeID) {
    const tasks = document.querySelector("#tasks");
    removeAllChildren(tasks);
    addTasksFromList();
    if (activeID) {
        const task = document.querySelector(`[id="${activeID}"`);
        task.classList.add("active");
    }
    updateTaskDialog();
}

function addTasksFromList() {
    list.getTasks(list.getFolder(document.querySelector(".active.folder").id)).forEach( (element) => {
        const task = newDiv("id",element.getID());
        task.classList.add("task");
        task.appendChild(createName("task",element.getName()));
        task.appendChild(createStarButton(element.isStarred()));
        tasks.appendChild(task);
    });
}

function updateTaskDialog () {
    const taskDialog = document.querySelector("#task-dialog");
    removeAllChildren(taskDialog);
    addDialogFromTask();   
}

function addDialogFromTask () {
    const active = document.querySelector(".active.task");
    if (!active) return;
    const taskDialog = document.querySelector("#task-dialog");
    const task = list.getTask(active.id);

    const input = createInput();
    initDialogNameInput(input.firstChild);
    input.firstChild.value = task.getName();

    const dateAdded = newDiv("class","date-added");
    dateAdded.textContent = "Created " + format(parseInt(task.getID()), "E, MMM do");

    taskDialog.appendChild(input);
    taskDialog.appendChild(dateAdded);
}

function initDialogNameInput (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setName(input.value.trim());
            input.value = "";
            updateTasks(task.getID());
        }
    });
}

function removeAllChildren (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createName (type,nameText) {
    const name = newDiv("class","name");
    name.textContent = nameText;
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains("active")) return;
        const currentActive = document.querySelector(".active."+type);
        if (currentActive) {
            currentActive.classList.remove("active");
        }
        this.parentElement.classList.add("active");
        type === "folder" ? updateTasks()
            : type === "task" ? updateTaskDialog()
            : null;
    });
    return name;
}

function createStarButton (isStarred) {
    const star = newDiv("class","star");
    const fontAwesomeString =  ("fa-star").concat(" ",isStarred ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    star.onclick = () => { toggleStar(star); }
    return star;
}

function toggleStar (star) {
    list.toggleTaskStar(list.getTask(star.parentElement.id));
    star.firstChild.setAttribute("data-prefix", star.firstChild.getAttribute("data-prefix") ? "far" : "fas");
    updateTasks();
}

function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}

function trashTheFolder() {
    list.deleteFolder(list.getFolder(this.parentElement.id));
    updateFolders();
}

function createInput () {
    const input = document.createElement("input");
    input.type = "text";
    const inputWrapper = newDiv("class","input-wrapper");
    inputWrapper.appendChild(input);
    return inputWrapper;
}

export {
    newDiv,
    updateFolders,
    updateTasks,
    updateTaskDialog,
    createInput
};
