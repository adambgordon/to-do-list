const list = require("./list.js");
import taskFactory from "./task.js";
import {newDiv, newIcon} from "./helper-functions.js"
import '@fortawesome/fontawesome-free/js/all';


export {createTasks, updateTasks};

function createTasks () {
    const taskInput = createInput();
    const taskWrapper = newDiv("id","task-wrapper");
    const tasks = newDiv("id","tasks");
    taskWrapper.appendChild(taskInput);
    taskWrapper.appendChild(tasks);
    return taskWrapper;
}

function createInput () {
    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            console.log(this);
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
    });
    const inputWrapper = newDiv("class","input-wrapper");
    inputWrapper.appendChild(input);
    return inputWrapper;
}

function updateTasks () {
    const tasks = document.querySelector("#tasks");
    while (tasks.firstChild) {
        tasks.removeChild(tasks.firstChild);
    }
    list.getTasks(list.getFolder(document.querySelector(".active-folder").id)).forEach( (element) => {
        const task = newDiv("id",element.getID());
        task.classList.add("task");
        task.appendChild(createName(element.getName()));
        task.appendChild(createStarButton(element.isStarred()));
        tasks.appendChild(task);
    });
}

function createName (nameText) {
    const name = newDiv("class","name");
    name.textContent = nameText;
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains(".active-task")) return;
        const currentActive = document.querySelector(".active-task");
        if (currentActive) {
            currentActive.classList.remove("active-task");
        }
        this.parentElement.classList.add("active-task");
        // display editing features
    });
    return name;
}

function createStarButton (isStarred) {
    const star = newDiv("class","star");
    const fontAwesomeString =  ("fa-star").concat(" ",isStarred ? "fas" : "far");
    star.appendChild(newIcon(fontAwesomeString));
    star.addEventListener("click", function (event) {
        toggleStar(star);
        updateTasks();
    });
    return star;
}

function toggleStar(star) {
    list.toggleTaskStar(list.getTask(star.parentElement.id));
    star.firstChild.setAttribute("data-prefix", star.firstChild.getAttribute("data-prefix") ? "far" : "fas");
}