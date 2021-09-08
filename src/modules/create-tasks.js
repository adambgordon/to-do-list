const list = require("./list.js");
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

function createTasks () {
    const taskInput = helper.createInput("text");
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const tasks = helper.newDiv("id","tasks");
    taskWrapper.appendChild(taskInput);
    taskWrapper.appendChild(tasks);
    initInput(taskInput.firstChild);
    return taskWrapper;
}

function initInput (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const folder = list.getFolder(document.querySelector(".active.folder").id);
            const task = helper.taskFactory(
                input.value,
                Date.now().toString(),
                folder.getName() === "Starred" ? parseInt(folder.getID())-1 : folder.getID());
            if (folder.getName() === "Starred") task.toggleStar();
            input.value = "";
            list.addTask(task);
            updateTasks();
        }
    });
}

function updateTasks (activeID) {
    const tasks = document.querySelector("#tasks");
    helper.removeAllChildren(tasks);
    addTasksFromList();
    if (activeID) {
        const task = document.querySelector(`[id="${activeID}"]`);
        task.classList.add("active");
    }
    helper.updateTaskDialog();
}

function addTasksFromList() {
    list.getTasks(list.getFolder(document.querySelector(".active.folder").id)).forEach( (task) => {
        const taskElement = helper.newDiv("id",task.getID());
        taskElement.classList.add("task");
        taskElement.appendChild(createCheckBox(task));
        taskElement.appendChild(helper.createName(task));
        taskElement.appendChild(createDueDate(task));
        taskElement.appendChild(helper.createStarButton(task));
        tasks.appendChild(taskElement);
    });
}

function createDueDate (task) {
    const dueDate = helper.newDiv("class","due-date");
    if (!task.getDueDate()) {
        dueDate.textContent = "";
    } else {
        const date = task.getDueDate().split("-");
        dueDate.textContent = helper.format(new Date (date[0],date[1]-1,date[2]), "E, MMM do");
    }
    return dueDate;
}

function createCheckBox (task) {
    const checkBox = helper.newDiv("class","check-box");
    const fontAwesomeString =  task.isCompleted() ? "fas fa-check-square" : "far fa-square";
    checkBox.appendChild(helper.newIcon(fontAwesomeString));
    checkBox.onclick = () => { 
        task.toggleCompleted();
        updateTasks();
    }
    return checkBox;
}