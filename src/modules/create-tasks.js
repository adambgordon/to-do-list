import taskFactory from "./task.js";

export {createTasks, updateTasks};

function createTasks (list) {
    const taskInput = createTaskInput(list);
    const taskWrapper = document.createElement("div");
    taskWrapper.id = "task-wrapper";
    const tasks = document.createElement("div");
    tasks.id = "tasks";
    taskWrapper.appendChild(taskInput);
    taskWrapper.appendChild(tasks);
    return taskWrapper;
}

function createTaskInput (list) {
    const input = document.createElement("input");
    input.type = "text";
    input.onkeydown = function (event) {
        if (event.key === "Enter") {
            const folderID = document.querySelector(".active-folder").id;
            const task = taskFactory(input.value,Date.now(),folderID);
            input.value = "";
            list.addTask(task);
            updateTasks(list);
        }
    }
    return input;
}

function updateTasks (list) {
    const tasks = document.querySelector("#tasks");
    while (tasks.firstChild) {
        tasks.removeChild(tasks.firstChild);
    }
    const activeFolder = document.querySelector(".active-folder");
    const folderID = (activeFolder.firstChild.textContent === "All Tasks") ? null : activeFolder.id;
    list.getTasks(folderID).forEach( (element) => {
        const task = document.createElement("div");
        const name = document.createElement("div");

        tasks.classList.add("task");
        task.id = element.getDateAdded();
        name.textContent = element.getName();

        task.appendChild(name);

        const trash = createTrashButton(list);
        task.appendChild(trash);
        tasks.appendChild(task);
    });
}

function createTrashButton (list) {
    const trash = document.createElement("div");
    trash.textContent = "x";
    trash.onclick = function (event) {
        list.deleteTask(trash.parentElement.id);
        updateTasks(list);
    }
    return trash;
}