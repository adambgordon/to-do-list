const list = function () {
    let _folders = [];
    let _tasks = [];

    const getFolder = function (ID) {
        for (let i = 0; i < _folders.length; i++) {
            if (_folders[i].getID() === ID) return _folders[i];
        }
    }
    const getFolders = function () { return _folders; }

    const addFolder = function (folder) { _folders.push(folder); }
    
    const deleteFolder = function (folder) {
        _tasks = _tasks.filter ( (task) => { return task.getHomeFolderID() !== folder.getID(); });
        for (let i = 0; i < _folders.length; i++) {
            if (_folders[i] === folder) { return _folders.splice(i,1)[0]; }
        }
    }
    const printFolders = function () {
        console.log(_folders.map( (folder) => { return folder.getName(); }));
    }
    const getTask = function (ID) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i].getID() === ID) return _tasks[i];
        }
    }
    const getTasks = function (folder) {
        return _tasks.filter ( (task) => {
            return folder.getName() === "All Tasks" ? true
                : folder.getName() === "Starred" ? task.isStarred()
                : task.getHomeFolderID() === folder.getID();
        });
    }
    const addTask = function (task) { _tasks.unshift(task); }
    
    const deleteTask = function (task) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i] === task) return _tasks.splice(i,1)[0];
        }
    }
    const bumpTaskToTop = function (task) {
        _tasks.unshift(deleteTask(task));
    }
    const printTasks = function () {
        console.log(_tasks.map( (element) => { return element.getName(); }));
    }
    const sortStarredFirst = function () {
        return;
    }
    return {
        addFolder,
        getFolder,
        getFolders,
        deleteFolder,
        printFolders,
        getTask,
        getTasks,
        addTask,
        deleteTask,
        bumpTaskToTop,
        printTasks,
        sortStarredFirst
    };
}();

module.exports = list;