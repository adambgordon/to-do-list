const list = require("./list.js");
import *  as helper from "./helper-functions.js";

export {createTaskDialog};

/* 
_name
_dateAdded
_folderID
_completed = false;
_starred = false;
_dueDate = false;
_notes = "";
 */

function createTaskDialog (list) {
    const taskDialog = helper.newDiv("id","task-dialog");
    return taskDialog;
}