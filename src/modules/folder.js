/*
folder.js creates and exports the factory function for creating folder objects
*/

const folderFactory = function (_name, _ID) {
    const _itemType = "folder";
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
    return {
        getName,
        setName,
        getID,
        getItemType
    };
};

export default folderFactory;