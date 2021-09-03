const list = require("./list.js");
import * as helper from "./helper-functions.js"
import '@fortawesome/fontawesome-free/js/all';

export {createTasks};

function createTasks () {
    const taskInput = helper.createInput("task");
    const taskWrapper = helper.newDiv("id","task-wrapper");
    const tasks = helper.newDiv("id","tasks");
    taskWrapper.appendChild(taskInput);
    taskWrapper.appendChild(tasks);
    return taskWrapper;
}


