const list = require("./list.js");
import folderFactory from "./folder.js";
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders};

function createFolders () {
    const folderInput = helper.createInput("folder");
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    return folderWrapper;
}

function buildFolders() {
    const now = Date.now();
    const all = folderFactory("All Tasks",now.toString());
    const starred = folderFactory("Starred",(now+1).toString());
    list.addFolder(all);
    list.addFolder(starred);
    helper.updateFolders();
}