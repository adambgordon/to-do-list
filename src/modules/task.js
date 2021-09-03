const taskFactory = function (_name, _ID, _homeFolderID) {

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
    const getID = function () {
        return _ID;
    }
    const getHomeFolderID = function () {
        return _homeFolderID;
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
    const print = function () {
        console.log([
            ["_name", _name],
            ["_ID", _ID],
            ["_homeFolderID", _homeFolderID],
            ["_completed", _completed],
            ["_starred", _starred],
            ["_dueDate", _dueDate],
            ["_notes", _notes]
        ]);
    }

    return {
        getName,
        setName,
        getID,
        getHomeFolderID,
        isCompleted,
        setCompletedAs,
        isStarred,
        setStarredAs,
        getDueDate,
        setDueDate,
        getNotes,
        setNotes,
        print
    };
};

export default taskFactory;