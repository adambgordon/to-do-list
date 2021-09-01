import format from "date-fns/format";

import taskFactory from "./task.js";

function initPage () {
    const element = document.createElement("div");
    element.textContent = "Hello world!";
    document.body.appendChild(element);

    const task1 = taskFactory("Walk Frankie", Date.now());

    // console.log(task1.getDueDate());
    // task1.setDueDate(Date.now());
    // console.log(format(task1.getDueDate(), "E, MMMM do"));
    // task1.setDueDate(false);
    // console.log(task1.getDueDate());
    
    // console.log(task1.isCompleted());
    // task1.setCompletedAs(true);
    // console.log(task1.isCompleted());

    // console.log(task1.getName());
    // task1.setName("Feed Frankie");
    // console.log(task1.getName());

}

export default initPage;