const list = require("./list.js");
import taskFactory from "./task.js";
import * as helper from "./helper-functions.js"
import '@fortawesome/fontawesome-free/js/all';

export {createTasks};

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
            const task = taskFactory(
                input.value,
                Date.now().toString(),
                folder.getName() === "Starred" ? parseInt(folder.getID())-1 : folder.getID());
            if (folder.getName() === "Starred") task.setStarredAs(true);
            input.value = "";
            list.addTask(task);
            helper.updateTasks();
        }
    });
}