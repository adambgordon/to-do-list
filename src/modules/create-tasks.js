import taskFactory from "./task.js";

import '@fortawesome/fontawesome-free/js/all';

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
        task.appendChild(createStarButton(list,element.isStarred()));
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
        const currentActive = document.querySelector(".active-task");
        if (currentActive) {
            currentActive.classList.remove("active-task");
        }
        this.parentElement.classList.add("active-task");
        // display editing features
    }
    return name;
}

function createStarButton (list,isStarred) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.addEventListener("click", function (event) {
        const task = list.getTask(star.parentElement.id);
        task.setStarredAs( task.isStarred() ? false : true );
        star.firstChild.setAttribute("data-prefix", task.isStarred ? "far" : "fas");
        updateTasks(list);
    });
    const icon = document.createElement("i");
    icon.classList.add( (isStarred? "fas" : "far" ) );
    icon.classList.add("fa-star");
    star.appendChild(icon);
    return star;
}

function createTrashButton (list) {
    const trash = document.createElement("div");
    trash.classList.add("trash");
    trash.addEventListener("click", function (event) {
        list.deleteTask(trash.parentElement.id);
        updateTasks(list);
    });
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-trash-alt");
    trash.appendChild(icon);
    return trash;
}