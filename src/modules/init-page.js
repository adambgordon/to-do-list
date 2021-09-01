import format from "date-fns/format";

import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import listFactory from "./list.js";

function initPage () {
    const element = document.createElement("div");
    element.textContent = "Hello world!";
    document.body.appendChild(element);

    const task = taskFactory("Walk Frankie", Date.now());
    const folder = folderFactory("Main List", Date.now());
    const list = listFactory();

    // folder.getTasks().push(task);
    // console.log(folder.getTasks().map( (element) => {
    //     return element.getName();
    // }));

    // list.getFolders().push(folder);
    // console.log(list.getFolders().map( (element) => {
    //     return element.getName();
    // }));


    // console.log(task.getDueDate());
    // task.setDueDate(Date.now());
    // console.log(format(task.getDueDate(), "E, MMMM do"));
    // task.setDueDate(false);
    // console.log(task.getDueDate());
    
    // console.log(task.isCompleted());
    // task.setCompletedAs(true);
    // console.log(task.isCompleted());

    // console.log(task.getName());
    // task.setName("Feed Frankie");
    // console.log(task.getName());

}

export default initPage;