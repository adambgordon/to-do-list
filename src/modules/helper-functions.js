const newDiv = function (type, value) {
    const div = document.createElement("div");
    if (type && value) {
        if (type === "id") {
            div.id = value;
        } else if (type === "class") {
            div.classList.add(value);
        }
    }
    return div;
}

const newIcon = function(fontAwesomeString) {
    const classes = fontAwesomeString.split(" ");
    const icon = document.createElement("i");
    classes.forEach(element => {
        icon.classList.add(element);
    });
    return icon;
}

export {newDiv, newIcon};