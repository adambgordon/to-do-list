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

    return {
        getName,
        setName,
        getDateAdded,
        getTasks
    };
};

export default folderFactory;