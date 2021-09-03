const listFactory = function () {
    let _folders = [];
    let _tasks = [];

    const getFolder = function (folderDateAdded) {
        for (let i = 0; i < _folders.length; i++) {
            if (_folders[i].getDateAdded().toString() === folderDateAdded) {
                return _folders[i];
            }
        }
    }
    const getFolders = function () {
        return _folders;
    }
    const addFolder = function (folder) {
        _folders.push(folder);
    }
    const deleteFolder = function (dateAddedString) {
        _tasks = _tasks.filter ( (task) => {
            return task.getFolderID() !== dateAddedString;
        });
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
    const getTask = function (taskDateAdded) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i].getDateAdded().toString() === taskDateAdded) {
                return _tasks[i];
            }
        }
    }
    const getTasks = function (folderParameter) {
        return _tasks.filter ( (task) => {
            if (folderParameter === "All Tasks") {
                return true;
            } else if (folderParameter === "Starred") {
                return task.isStarred();
            } else {
                return task.getFolderID() === folderParameter;
            }
        });
    }
    const addTask = function (task) {
        _tasks.unshift(task);
    }
    const deleteTask = function (dateAddedString) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i].getDateAdded().toString() === dateAddedString) return _tasks.splice(i,1)[0];
        }
    }
    const toggleTaskStar = function (task) {
        task.setStarredAs( task.isStarred() ? false : true );
        if (task.isStarred()) {
            _tasks.unshift(deleteTask(task.getDateAdded().toString()));
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
        getFolder,
        getFolders,
        deleteFolder,
        printFolders,
        getTask,
        getTasks,
        addTask,
        deleteTask,
        toggleTaskStar,
        printTasks,
        sortStarredFirst
    };
};

export default listFactory;