const listFactory = function () {
    let _folders = [];

    const getFolders = function () {
        return _folders;
    }
    const addFolder = function (folder) {
        _folders.push(folder);
    }

    const deleteFolder = function () {
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