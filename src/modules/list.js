const list = function () {
    let _folders = [];
    let _tasks = [];

    const getFolder = function (folderID) {
        for (let i = 0; i < _folders.length; i++) {
            if (_folders[i].getID() === folderID) return _folders[i];
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
    const getTask = function (taskID) {
        for (let i = 0; i < _tasks.length; i++) {
            if (_tasks[i].getID() === taskID) return _tasks[i];
        }
    }
    const getTasksByFolder = function (folder) {
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
    const sortTasksByCompleted = function () {
        _tasks.sort(function(a,b) {
            if (!a.isCompleted() && b.isCompleted()) return -1;
            if (a.isCompleted() && !b.isCompleted()) return 1;
            return 0;
        });
    }
    const sortTasksByName = function () {
        _tasks.sort(function(a,b) {
            if (a.isCompleted() || b.isCompleted()) return 0;
            const nameA = a.getName().toUpperCase();
            const nameB = b.getName().toUpperCase();
            if(nameA < nameB) return -1;
            if(nameA > nameB) return 1;
            return 0;
        });
    }
    const sortTasksByStar = function () {
        _tasks.sort(function(a,b) {
            if (a.isCompleted() || b.isCompleted()) return 0;
            if(a.isStarred() && !b.isStarred()) return -1;
            if(!a.isStarred() && b.isStarred()) return 1;
            return 0;
        });
    }
    const sortTasksByDueDate = function () {
        _tasks.sort(function(a,b) {
            if (a.isCompleted() || b.isCompleted()) return 0;
            const dueDateA = a.getDueDate();
            const dueDateB = b.getDueDate();
            if (dueDateA && dueDateB) {
                if (dueDateA < dueDateB) return -1;
                if (dueDateA > dueDateB) return 1;
                return 0;
            }
            if (dueDateA && !dueDateB) return -1;
            if (!dueDateA && dueDateB) return 1;
            return 0;
        });
    }
    const sortTasksByDateAdded = function () {
        _tasks.sort(function(a,b) {
            if (a.isCompleted() || b.isCompleted()) return 0;
            const dateAddedA = a.getID();
            const dateAddedB = b.getID();
            if (dateAddedB < dateAddedA) return -1;
            if (dateAddedB > dateAddedA) return 1;
            return 0;
        });
    }
    return {
        addFolder,
        getFolder,
        getFolders,
        deleteFolder,
        printFolders,
        getTask,
        getTasksByFolder,
        addTask,
        deleteTask,
        bumpTaskToTop,
        printTasks,
        sortTasksByCompleted,
        sortTasksByName,
        sortTasksByStar,
        sortTasksByDueDate,
        sortTasksByDateAdded
    };
}();

module.exports = list;