const list = require("./list.js");
import compareAsc from "date-fns/compareAsc";
import endOfToday from "date-fns/endOfToday";
import startOfTomorrow from "date-fns/startOfTomorrow";
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

function createTasks () {
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const taskInput = helper.createInput("text");
    const tasks = helper.newDiv("id","tasks");
    const showCompleted = helper.newDiv("id","show-completed");

    initInput(taskInput.childNodes[1]);
    initCompleted(showCompleted);
    initWindowListener();

    taskWrapper.appendChild(taskInput);
    taskWrapper.appendChild(tasks);
    taskWrapper.appendChild(showCompleted);

    return taskWrapper;
}

function initWindowListener () {
    window.onclick = function (event) {
        if (event.target.tagName === "HTML" && helper.getActiveTaskID() !== null) updateTasks();
    }
}

function initInput (input) {
    input.placeholder = "Add Task";
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

function initCompleted (button) {
    button.textContent = "Show Completed";
    button.onclick = () => {
        const taskWrapper = document.querySelector("#task-wrapper");
        let completedTasks = document.querySelector("#completed-tasks");
        if (completedTasks) {
            completedTasks.remove();
        } else {
            completedTasks = helper.newDiv("id","completed-tasks");
            taskWrapper.appendChild(completedTasks);
        }
        updateTasks(helper.getActiveTaskID());
    }
}

function updateTasks (activeID) {
    const tasks = document.querySelector("#tasks");
    const completedTasks = document.querySelector("#completed-tasks")
    helper.removeAllChildren(tasks);
    helper.removeAllChildren(completedTasks);
    addTasksFromList();
    if (activeID) {
        const task = document.querySelector(`[id="${activeID}"]`);
        task.classList.add("active");
    }
    helper.updateTaskDialog();
}

function addTasksFromList() {
    const tasks = document.querySelector("#tasks");
    const completedTasks = document.querySelector("#completed-tasks");
    list.getTasksByFolder(list.getFolder(document.querySelector(".active.folder").id)).forEach( (task) => {
        const taskElement = helper.newDiv("id",task.getID());
        taskElement.classList.add("task");
        taskElement.appendChild(createCheckBox(task));
        taskElement.appendChild(helper.createName(task));
        taskElement.appendChild(createDueDate(task));
        taskElement.appendChild(helper.createStarButton(task));
        if (!task.isCompleted()) {
            tasks.appendChild(taskElement);
        } else if (completedTasks) {{
            completedTasks.appendChild(taskElement);
        }}
    });
}

function createDueDate (task) {
    const dueDate = helper.newDiv("class","due-date");
    if (!task.getDueDate()) {
        dueDate.textContent = "";
    } else {
        let date = task.getDueDate().split("-");
        date = new Date (date[0],date[1]-1,date[2]);
        dueDate.textContent = helper.format(date, "E, MMM do");
        if (helper.compareAsc(date,helper.startOfToday()) === -1) dueDate.style.color = "red";
    }
    return dueDate;
}

function createCheckBox (task) {
    const checkBox = helper.newDiv("class","check-box");
    const fontAwesomeString =  task.isCompleted() ? "fas fa-check-square" : "far fa-square";
    checkBox.appendChild(helper.newIcon(fontAwesomeString));
    checkBox.onclick = () => { 
        task.toggleCompleted();
        let activeID = null;
        if (helper.getActiveTaskID() === task.getID() && task.isCompleted()){
            activeID = null;
        } else {
            activeID = helper.getActiveTaskID();
        }
        updateTasks(activeID);
    }
    return checkBox;
}