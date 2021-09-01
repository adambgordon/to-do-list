import format from "date-fns/format";

import taskFactory from "./task.js";

function initPage () {
    const element = document.createElement("div");
    element.textContent = "Hello world!";
    document.body.appendChild(element);

    const task1 = taskFactory("Walk Frankie", Date.now());

    console.log(format(task1.getDateAdded(), "E, MMMM do"));
    // console.log(task1.getName());
    // task1.setName("Feed Frankie");
    // console.log(task1.getName());



}

export default initPage;