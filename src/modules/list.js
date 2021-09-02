const listFactory = function () {
    let _folders = [];

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
                console.log(deleted);
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

    return {
        addFolder,
        getFolders,
        deleteFolder,
        printFolders
    };
};

export default listFactory;