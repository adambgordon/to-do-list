const list = require("./list.js");
import folderFactory from "./folder.js";
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders};

function createFolders () {
    const folderInput = helper.createInput("text");
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    initInput(folderInput.firstChild);
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

function initInput (input) {
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const folder = folderFactory(input.value.trim(), Date.now().toString());
            input.value = "";
            list.addFolder(folder);
            helper.updateFolders("new folder");
        }
    });
}