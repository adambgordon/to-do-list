const listFactory = function () {
    let _folders = [];
    let _tasks = [];

    const getFolders = function () {
        return _folders;
    }
    const addFolder = function (folder) {
        _folders.push(folder);
    }
    const deleteFolder = function (dateAddedString) {
        for (let i = 0; i < _folders.length; i++) {
            if (_folders[i].getDateAdded().toString() === dateAddedString) {
                const deleted = _folders.splice(i,1);
                break;
            }
        }
    }
    const printFolders = function () {
        console.log(_folders.map( (element) => {
            return element.getName();
        }));
    }
    const getTasks = function () {
        return _tasks;
    }
    const addTask = function (task) {
        _tasks.push(task);
    }
    const deleteTask = function (dateAddedString) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i].getDateAdded().toString() === dateAddedString) {
                const deleted = _tasks.splice(i,1);
                break;
            }
        }
    }
    const printTasks = function () {
        console.log(_tasks.map( (element) => {
            return element.getName();
        }));
    }
    const sortStarredFirst = function () {
        return;
    }
    return {
        addFolder,
        getFolders,
        deleteFolder,
        printFolders,
        getTasks,
        addTask,
        deleteTask,
        printTasks,
        sortStarredFirst
    };
};

export default listFactory;