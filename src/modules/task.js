/*
task.js creates and exports the factory function for creating task objects
*/

const taskFactory = function (_name, _ID, _homeFolderID) {
    
    const _itemType = "task";
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
    const getItemType = function () {
        return _itemType;
    }
    const getHomeFolderID = function () {
        return _homeFolderID;
    }
    const isCompleted = function () {
        return _completed;
    }
    const toggleCompleted = function () {
        _completed = _completed === false ? true : false;
    }
    const isStarred = function () {
        return _starred;
    }
    const toggleStar = function () {
        _starred = _starred === false ? true : false;
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
    // print fn is for dev & debugging purposes
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
        getItemType,
        getHomeFolderID,
        isCompleted,
        toggleCompleted,
        isStarred,
        toggleStar,
        getDueDate,
        setDueDate,
        getNotes,
        setNotes,
        print,
    };
};

export default taskFactory;