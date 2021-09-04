const list = require("./list.js");
import folderFactory from "./folder.js";
import taskFactory from "./task.js";

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

// const updateTaskDialog

function updateFolders (newFolder) {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
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
    (newFolder ? folders.lastChild : folders.firstChild).classList.add("active-folder");
    updateTasks();
}

function updateTasks () {
    const tasks = document.querySelector("#tasks");
    while (tasks.firstChild) {
        tasks.removeChild(tasks.firstChild);
    }
    list.getTasks(list.getFolder(document.querySelector(".active-folder").id)).forEach( (element) => {
        const task = newDiv("id",element.getID());
        task.classList.add("task");
        task.appendChild(createName("task",element.getName()));
        task.appendChild(createStarButton(element.isStarred()));
        tasks.appendChild(task);
    });
    const active = document.querySelector(".active-task");
    if (active) active.classList.remove("active-task");
    updateTaskDialog();
}

function updateTaskDialog () {
    const taskDialog = document.querySelector("#task-dialog");
    while (taskDialog.firstChild) {
        taskDialog.removeChild(taskDialog.firstChild);
    }
    const active = document.querySelector(".active-task");
    if (!active) return;
    const task = list.getTask(active.id);
    const tempData = newDiv();
    tempData.textContent = task.getName();
    taskDialog.appendChild(tempData);
}

function createName (type,nameText) {
    const name = newDiv("class","name");
    name.textContent = nameText;
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains(".active-"+type)) return;
        const currentActive = document.querySelector(".active-"+type);
        if (currentActive) {
            currentActive.classList.remove("active-"+type);
        }
        this.parentElement.classList.add("active-"+type);
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

function createInput (type) {
    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value) return;
            if (type === "folder") {
                const folder = folderFactory(input.value, Date.now().toString());
                input.value = "";
                list.addFolder(folder);
                updateFolders("new");
            } else if (type === "task") {
                const folder = list.getFolder(document.querySelector(".active-folder").id);
                const task = taskFactory(
                    input.value,
                    Date.now().toString(),
                    folder.getName() === "Starred" ? parseInt(folder.getID())-1 : folder.getID());
                if (folder.getName() === "Starred") task.setStarredAs(true);
                input.value = "";
                list.addTask(task);
                updateTasks();
            }
        }
    });
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