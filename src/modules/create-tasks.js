const list = require("./list.js");
import * as helper from "./helper-functions.js";

export {createTasks, updateTasks};

function createTasks () {
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const taskInputWrapper = helper.newDiv("class","input-wrapper");
    // const taskInput = helper.createInput("text","fas fa-plus");
    const tasks = helper.newDiv("id","tasks");
    const showCompleted = helper.newDiv("id","show-completed");

    initInputWrapper(taskInputWrapper);
    initCompleted(showCompleted);

    taskWrapper.appendChild(taskInputWrapper);
    taskWrapper.appendChild(tasks);
    taskWrapper.appendChild(showCompleted);

    return taskWrapper;
}

function initInputWrapper (inputWrapper) {
    const leftHandIconContainer = helper.createLeftHandIconContainer("fas fa-plus");
    const plus = leftHandIconContainer.firstChild;
    plus.classList.add("plus");
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add Task";

    inputWrapper.appendChild(leftHandIconContainer);
    inputWrapper.appendChild(input);

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
    const text = helper.newDiv();
    text.textContent = "Completed";
    const arrow = helper.newDiv("class","arrow");
    const arrowIcon = helper.newIcon("fas fa-caret-right")
    arrow.appendChild(arrowIcon);
    button.appendChild(text);
    button.appendChild(arrow);
    button.onclick = () => {
        const taskWrapper = document.querySelector("#task-wrapper");
        let completedTasks = document.querySelector("#completed-tasks");
        if (completedTasks) {
            completedTasks.remove();
            arrow.classList.remove("rotated-90");
        } else {
            completedTasks = helper.newDiv("id","completed-tasks");
            taskWrapper.appendChild(completedTasks);
            arrow.classList.add("rotated-90");
        }
        updateTasks();
    }
}

function updateTasks () {
    const activeID = helper.getActiveTaskElement() ? helper.getActiveTaskElement().id : null;
    const tasks = document.querySelector("#tasks");
    const completedTasks = document.querySelector("#completed-tasks")
    helper.removeAllChildren(tasks);
    helper.removeAllChildren(completedTasks);
    addTasksFromList();
    if (activeID) {
        helper.activateElementByID(activeID);
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
        taskElement.appendChild(createName(task));
        taskElement.appendChild(createDueDate(task));
        taskElement.appendChild(helper.createStarButton(task));
        if (!task.isCompleted()) {
            tasks.appendChild(taskElement);
        } else if (completedTasks) {{
            completedTasks.appendChild(taskElement);
        }}
    });
}

function createName (task) {
    const name = helper.newDiv("class","name");
    name.textContent = task.getName();
    return name;
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
    const fontAwesomeString =  task.isCompleted() ? "fas fa-check-square" : "far fa-square";
    const leftHandIconContainer = helper.createLeftHandIconContainer(fontAwesomeString);
    
    const checkBox = leftHandIconContainer.firstChild;
    checkBox.classList.add("check-box");

    checkBox.onclick = () => { 
        task.toggleCompleted();
        const activeTask = helper.getActiveTaskElement();
        if (activeTask && activeTask.id === task.getID() && task.isCompleted()){
            helper.deactivateActiveTaskElement();
        }
        updateTasks();
    }
    return leftHandIconContainer;
}