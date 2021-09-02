import format from "date-fns/format";
import listFactory from "./list.js";
import {createFolders, buildFolders} from "./create-folders.js";
import {createTasks} from "./create-tasks.js";

export default initPage;

function createContent () {
    const content = document.createElement("div");
    content.id = "content";
    return content;
}
function initPage () {
    const content = createContent();
    const list = listFactory();
    const folderSection = createFolders(list);
    const taskSection = createTasks(list);

    content.appendChild(folderSection);
    content.appendChild(taskSection);
    document.body.appendChild(content);

    buildFolders(list);

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