const listFactory = function () {
    let _folders = [];

    const getFolders = function () {
        return _folders;
    }
    const deleteFolder = function () {
        return;
    }

    return {
        getFolders,
        deleteFolder
    };
};

export default listFactory;