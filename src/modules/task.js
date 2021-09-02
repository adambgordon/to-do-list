const taskFactory = function (_name, _dateAdded) {

    let _folderID = "";
    let _completed = false;
    let _starred = false;
    let _dueDate = false;
    let _notes = "";

    const getName = function () {
        return _name;
    }
    const setName = function (name) {
        _name = name;
    }
    const getDateAdded = function () {
        return _dateAdded;
    }
    const getFolderID = function () {
        return _folderID;
    }
    const setFolderID = function (id) {
        _folderID = id;
    }
    const isCompleted = function () {
        return _completed;
    }
    const setCompletedAs = function (completed) {
        _completed = completed;
    }
    const isStarred = function () {
        return _starred;
    }
    const setStarredAs = function (starred) {
        _starred = starred;
    }
    const getDueDate = function () {
        return _dueDate;
    }
    const setDueDate = function (dueDate) {
        _dueDate = dueDate;
    }
    const getNotes = function () {
        return _notes;
    }
    const setNotes = function (notes) {
        _notes = notes;
    }

    return {
        getName,
        setName,
        getDateAdded,
        getFolderID,
        setFolderID,
        isCompleted,
        setCompletedAs,
        isStarred,
        setStarredAs,
        getDueDate,
        setDueDate,
        getNotes,
        setNotes,
    };
};

export default taskFactory;