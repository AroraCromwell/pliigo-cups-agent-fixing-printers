/**
 * Created by johannespichler on 01.02.16.
 */
'use strict'


const clc = require("cli-color");
const LoadingIndicator = require('loading-indicator');

/**
 *
 * @param text
 * @returns {string}
 */
let lineText = (text) => {
    var windowSize = process.stdout.getWindowSize();
    var sep = "";
    for (var i = 0; i < windowSize[0] - text.length; i++) {
        sep += " ";
    }

    return text + sep;
}


/**
 *
 * @returns {string}
 */
let emptyLine = () => {
    var windowSize = process.stdout.getWindowSize();
    var sep = "";
    for (var i = 0; i < windowSize[0]; i++) {
        sep += " ";
    }

    return sep;
}


/**
 *
 * @param text
 */
let initializeCliWindowWithText = (text) =>{

    console.log("\u001b[2J\u001b[0;0H");
    console.log(clc.black.bgWhite(emptyLine()));
    console.log(clc.black.bgWhite(lineText(text)));
    console.log(clc.black.bgWhite(emptyLine()));

}

/**
 *
 * @returns {*|exports|module.exports}
 */
let spinner = function(){

    return new LoadingIndicator({
        preset: "dots",
        suffix: " searching for locale and network printers",
        prefix: "! CUPS Printers: ",
        sequence: [
            clc.blue("⠋"),
            clc.green("⠙"),
            clc.blue("⠹"),
            clc.green('⠸'),
            clc.blue("⠼"),
            clc.green("⠴"),
            clc.blue("⠦"),
            clc.green('⠧'),
            clc.blue("⠇"),
            clc.green('⠏')
        ]
    });

}


/**
 * all exports come here
 */

exports.lineText = lineText;
exports.emptyLine = emptyLine;
exports.initializeCliWindowWithText = initializeCliWindowWithText;
exports.spinner = spinner;