const taskFactory = function (name, dateAdded) {
    const getName = function () {
        return name;
    }
    const setName = function (newName) {
        name = newName;
    }
    const getDateAdded = function () {
        return dateAdded;
    }
    const setDateAdded = function (newDateAdded) {
        dateAdded = newDateAdded;
    }

    return {
        getName,
        setName,
        getDateAdded,
        setDateAdded
    };
};

export default taskFactory;