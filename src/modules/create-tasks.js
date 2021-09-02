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
            task.setNotes(document.querySelector(".active-folder").firstChild.textContent);
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
        task.classList.add("task");
        task.id = element.getDateAdded();

        task.appendChild(createName(list, element.getName()));
        task.appendChild(createTrashButton(list));
        tasks.appendChild(task);
    });
}

function createName (list, nameText) {
    const name = document.createElement("div");
    name.classList.add("name");
    name.textContent = nameText;
    name.onclick = function (event) {
        if (this.parentElement.classList.contains(".active-task")) return;
        document.querySelector(".active-task").classList.remove("active-task");
        this.parentElement.classList.add("active-task");
        // display editing features
    }
    return name;
}

function createTrashButton (list) {
    const trash = document.createElement("div");
    trash.textContent = "x";
    trash.classList.add("trash");
    trash.onclick = function (event) {
        list.deleteTask(trash.parentElement.id);
        updateTasks(list);
    }
    return trash;
}