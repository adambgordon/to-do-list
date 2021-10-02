/*
folder.js creates and exports the factory function for creating folder objects
*/

const folderFactory = function (_name, _ID) {
    const getName = function () {
        return _name;
    }
    const setName = function (name) {
        _name = name;
    }
    const getID = function () {
        return _ID;
    }
    
    return {
        getName,
        setName,
        getID,
    };
};

export default folderFactory;