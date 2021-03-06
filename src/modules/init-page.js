/*
init-page.js creates & exports a singl function to create and initialize all page elements
*/

const list = require("./list.js");
import * as helper from "./helper-functions.js";

export default initPage;

function initPage () {
    const content = helper.newDiv("id","content");
    const title = helper.createTitle();
    const folderSection = helper.newDiv("class","content-box");
    const taskSection = helper.newDiv("class","content-box");
    const taskDialogSection = helper.newDiv("class","content-box");
    const footer = helper.createFooter();

    const folders = helper.createFolders();
    const tasks = helper.createTasks();
    const taskDialog = helper.createTaskDialog();

    folderSection.appendChild(title);
    folderSection.appendChild(folders);
    taskSection.appendChild(tasks);
    taskDialogSection.appendChild(taskDialog);

    content.appendChild(folderSection);
    content.appendChild(taskSection);
    content.appendChild(taskDialogSection);

    document.body.appendChild(content);
    document.body.appendChild(footer);

    helper.buildFolders();
    helper.buildTasks();
    helper.initWindowListeners();
}
