const list = require("./list.js");
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
        folder.appendChild(createName(element));
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
        taskElement.appendChild(createCheckBox(task));
        taskElement.appendChild(createName(task));
        taskElement.appendChild(createDueDate(task));
        taskElement.appendChild(createStarButton(task));
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

    const notesSpacer = newDiv();
    notesSpacer.textContent = "Notes";

    const name = initDialogName(task);
    const star = createStarButton(task);
    const dueDate = initDialogDueDate(task);
    const notes = initDialogNotes(task);
    const dateAdded = initDialogDateAdded(task);
    const trash = initDialogTrash(task);

    
    taskDialog.appendChild(name);
    taskDialog.appendChild(star);
    taskDialog.appendChild(dueDate);
    taskDialog.appendChild(notesSpacer);
    taskDialog.appendChild(notes);
    taskDialog.appendChild(dateAdded);
    taskDialog.appendChild(trash);
}

function initDialogName (task) {
    const name = createInput("text");
    const input = name.firstChild;
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setName(input.value.trim());
            input.value = "";
            updateTasks(task.getID());
        }
    });
    input.value = task.getName();
    return name;
}
function initDialogDueDate (task) {
    const dueDate = createInput("date");
    const input = dueDate.firstChild;
    input.addEventListener("change", function (event) {
        const task = list.getTask(document.querySelector(".active.task").id);
        task.setDueDate(input.value);
        updateTasks(task.getID());
    });
    input.value = task.getDueDate();
    return dueDate;
}
function initDialogNotes (task) {
    const notes = createInput("text");
    const input = notes.firstChild;
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const task = list.getTask(document.querySelector(".active.task").id);
            task.setNotes(input.value.trim());
            input.value = "";
            updateTasks(task.getID());
        }
    });
    input.value = task.getNotes();
    return notes;
}
function initDialogDateAdded (task) {
    const dateAdded = newDiv("class","date-added");
    dateAdded.textContent = "Created " + format(parseInt(task.getID()), "E, MMM do");
    return dateAdded;
}
function initDialogTrash (task) {
    const trash = createTrashButton();
    trash.addEventListener("click", function (event) {
        trashTheTask(task.getID());
    });
    return trash;
}

function removeAllChildren (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createName (item) {
    const name = newDiv("class","name");
    name.textContent = item.getName();
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains("active")) return;
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

function createDueDate (task) {
    const dueDate = newDiv("class","due-date");
    if (!task.getDueDate()) {
        dueDate.textContent = "";
    } else {
        const date = task.getDueDate().split("-");
        dueDate.textContent = format(new Date (date[0],date[1]-1,date[2]), "E, MMM do");
    }
    return dueDate;
}

function createCheckBox (task) {
    const checkBox = newDiv("class","check-box");
    const fontAwesomeString =  task.isCompleted() ? "fas fa-check-square" : "far fa-square";
    checkBox.appendChild(newIcon(fontAwesomeString));
    checkBox.onclick = () => { 
        task.toggleCompleted();
        updateTasks();
    }
    return checkBox;
}

function createStarButton (task) {
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
        const activeTask = document.querySelector(".task.active");
        const activeFolder = document.querySelector(".folder.active");
        if (activeTask && activeTask.id === task.getID()) {
            activeID = activeTask.id;
            if (!task.isStarred() && list.getFolder(activeFolder.id).getName() === "Starred") {
                activeID = null;
            }
        }
        updateTasks(activeID);
    }
}
// if current task is active task > pass thru active id
//    but if now being unstarred and current folder is starred > pass null


function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    return trash;
}

function trashTheFolder() {
    list.deleteFolder(list.getFolder(this.parentElement.id));
    updateFolders();
}

function trashTheTask(taskID) {
    console.log("trashing");
    list.deleteTask(list.getTask(taskID));
    updateTasks();
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
