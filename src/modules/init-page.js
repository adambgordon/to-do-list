const list = require("./list.js");
import * as helper from "./helper-functions.js";

export default initPage;

function initPage () {
    const content = helper.newDiv("id","content");
    const folderSection = helper.createFolders();
    const taskSection = helper.createTasks();
    const taskDialogSection = helper.createTaskDialog();

    content.appendChild(folderSection);
    content.appendChild(taskSection);
    content.appendChild(taskDialogSection);
    document.body.appendChild(content);

    helper.buildFolders(list);
}
