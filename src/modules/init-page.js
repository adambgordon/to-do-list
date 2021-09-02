import format from "date-fns/format";
import taskFactory from "./task.js";
import createFolders from "./create-folders.js";

function initPage () {
    const content = createContent();
    const folderSection = createFolders();
    content.appendChild(folderSection);
    document.body.appendChild(content);
}

export default initPage;

function createContent () {
    const content = document.createElement("div");
    content.id = "content";
    return content;
}



 // const task = taskFactory("Walk Frankie", Date.now());
    // const folder = folderFactory("Main List", Date.now());
    // const list = listFactory();

    // folder.getTasks().push(task);
    // console.log(folder.getTasks().map( (element) => {
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