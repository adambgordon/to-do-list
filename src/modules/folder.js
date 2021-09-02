const folderFactory = function (_name, _dateAdded) {

    const getName = function () {
        return _name;
    }
    const setName = function (name) {
        _name = name;
    }
    const getDateAdded = function () {
        return _dateAdded;
    }

    return {
        getName,
        setName,
        getDateAdded
    };
};

export default folderFactory;