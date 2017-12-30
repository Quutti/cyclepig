const manager = require("qruut/dist/style-variables");
const theme = [];

// Set override variables
const primaryColor1 = "#4e7494";

manager.setVariable("primary-color-1", primaryColor1);

const variables = manager.getVariables();

// Add qruut default styles
theme.push(variables);

theme.push({
    "body-bg": "#ddd",
    "font-size-base": "14px",
    "font-color-base": "#333",
    "font-family-base": "Roboto",
    "border-radius-base": "3px",
})

theme.push({
    "navigation-bar-height": "52px",
    "navigation-bar-bg": variables["primary-color-1"]
});

theme.push({
    "success-color": "#8de057",
    "error-color": "#e05757"
});

module.exports = Object.assign({}, ...theme);