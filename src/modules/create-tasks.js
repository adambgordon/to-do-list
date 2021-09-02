import taskFactory from "./task.js";

export default createTasks;

function createTasks(list) {
    const taskWrapper = document.createElement("div");
    taskWrapper.id = "task-wrapper";
    const tasks = document.createElement("div");
    tasks.id = "tasks";
    taskWrapper.appendChild(tasks);
    return taskWrapper;
}
