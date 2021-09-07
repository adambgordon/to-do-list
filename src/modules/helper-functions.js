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
        const task = document.querySelector(`[id="${activeID}"]`);
        task.classList.add("active");
    }
    updateTaskDialog();
}

function addTasksFromList() {
    list.getTasks(list.getFolder(document.querySelector(".active.folder").id)).forEach( (task) => {
        const taskElement = newDiv("id",task.getID());
        taskElement.classList.add("task");
        taskElement.appendChild(createName("task",task.getName()));
        console.log(task.getDueDate());
        taskElement.appendChild(createDueDate(task.getDueDate()));
        taskElement.appendChild(createStarButton(task.getID()));
        tasks.appendChild(taskElement);
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

    const name = createInput("text");
    initDialogName(name.firstChild);
    name.firstChild.value = task.getName();

    const star = createStarButton(active.id);

    const dueDate = createInput("date");
    initDialogDueDate(dueDate.firstChild);
    dueDate.firstChild.value = task.getDueDate();


    const notes = createInput("text");
    initDialogNotes(notes.firstChild);
    notes.firstChild.value = task.getNotes();

    const dateAdded = newDiv("class","date-added");
    dateAdded.textContent = "Created " + format(parseInt(task.getID()), "E, MMM do");

    const notesSpacer = newDiv();
    notesSpacer.textContent = "Notes";
    
    taskDialog.appendChild(name);
    taskDialog.appendChild(star);
    taskDialog.appendChild(dueDate);
    taskDialog.appendChild(notesSpacer);
    taskDialog.appendChild(notes);
    taskDialog.appendChild(dateAdded);
}

function initDialogName (input) {
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
function initDialogDueDate (input) {
    input.addEventListener("change", function (event) {
        const task = list.getTask(document.querySelector(".active.task").id);
        task.setDueDate(input.value);
        updateTasks(task.getID());
    });
}
function initDialogNotes (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setNotes(input.value.trim());
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

function createDueDate (date) {
    const dueDate = newDiv("class","due-date");
    if (!date) {
        dueDate.textContent = "";
    } else {
        date = date.split("-");
        dueDate.textContent = "Due " + format(new Date (date[0],date[1]-1,date[2]), "E, MMM do");
    }
    return dueDate;
}

function createStarButton (taskID) {
    const star = newDiv("class","star");
    const fontAwesomeString =  ("fa-star").concat(" ",list.getTask(taskID).isStarred() ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    star.onclick = () => { toggleStar(star,taskID); }
    return star;
}

function toggleStar (star, taskID) {
    list.toggleTaskStar(list.getTask(taskID));
    star.firstChild.setAttribute("data-prefix", star.firstChild.getAttribute("data-prefix") ? "far" : "fas");
    const activeID = document.querySelector(`[id="${taskID}"]`).classList.contains("active") ? taskID : null;
    updateTasks(activeID);
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

function createInput (type) {
    const input = document.createElement("input");
    input.type = type;
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
