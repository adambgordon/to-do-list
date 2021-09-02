const folderFactory = function (_name, _dateAdded) {
    let _tasks = [];

    const getName = function () {
        return _name;
    }
    const setName = function (name) {
        _name = name;
    }
    const getDateAdded = function () {
        return _dateAdded;
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
        getName,
        setName,
        getDateAdded,
        getTasks,
        deleteTask,
        sortStarredFirst,
    };
};

export default folderFactory;