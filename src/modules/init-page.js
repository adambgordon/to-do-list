const list = require("./list.js");
import format from "date-fns/format";
import {createFolders, buildFolders} from "./create-folders.js";
import {createTasks} from "./create-tasks.js";
import {newDiv} from "./helper-functions.js";

export default initPage;

function initPage () {
    const content = newDiv("id","content");
    const folderSection = createFolders();
    const taskSection = createTasks();

    content.appendChild(folderSection);
    content.appendChild(taskSection);
    document.body.appendChild(content);

    buildFolders(list);
}

// task.setDueDate(Date.now());
// console.log(format(task.getDueDate(), "E, MMMM do"));
// task.setDueDate(false);