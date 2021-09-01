const taskFactory = function (name) {
    const getName = function () {
        return name;
    }
    const setName = function (newName) {
        name = newName;
    }

    return {
        getName,
        setName
    };
};

export default taskFactory;