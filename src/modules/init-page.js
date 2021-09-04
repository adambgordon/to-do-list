const list = require("./list.js");
import format from "date-fns/format";
import {createFolders, buildFolders} from "./create-folders.js";
import {createTasks} from "./create-tasks.js";
import {createTaskDialog} from "./create-task-dialog.js";
import * as helper from "./helper-functions.js";

export default initPage;

function initPage () {
    const content = helper.newDiv("id","content");
    const folderSection = createFolders();
    const taskSection = createTasks();
    const taskDialogSection = createTaskDialog();

    content.appendChild(folderSection);
    content.appendChild(taskSection);
    content.appendChild(taskDialogSection);
    document.body.appendChild(content);

    buildFolders(list);
}

// task.setDueDate(Date.now());
// console.log(format(task.getDueDate(), "E, MMMM do"));
// task.setDueDate(false);