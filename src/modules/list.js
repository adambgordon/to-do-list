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
        return;
    }
    const printFolders = function () {
        console.log(_folders.map( (element) => {
            return element.getName();
        }));
    }

    const getTasks = function () {
        return _tasks;
    }
    const deleteTask = function () {
        return;
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
        deleteTask,
        sortStarredFirst
    };
};

export default listFactory;