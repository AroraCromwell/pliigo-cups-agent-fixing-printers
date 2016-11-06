/**
 * Created by johannespichler on 31.01.16.
 */

// require the needed libraries
const PrinterManager = require("../PrinterManager");
const _ = require("lodash");
const clc = require("cli-color");
const windowText = require('./cli-helper').initializeCliWindowWithText;
windowText(" pliigo-cups-agent find");
// instantiate the print manager class object
var pm = new PrinterManager();

// set the indicator properties
var spinner = require('./cli-helper').spinner();

// write an initial message to the cli

console.log(clc.green("start searching locale and network printer(s)..."));

// start the spinner to indicate searching
spinner.start();

// call the search method
pm.searchPrinters((err, objPrinters)=> {
    // callback called, so searching finished
    // stop the spinner
    spinner.stop();
    // write to the cli that searching has finished
    console.log(clc.green.bold("finished searching.\n"));

    // break in case of error
    if (err) {
        console.log(err.message);
        return;
    }

    // loop over the connection types
    var index = 0;
    _.forEach(objPrinters, (obj, groupKey)=> {
        // write connection type group to the cli
        console.log((index > 0 ? "\n" : "") + clc.blue.bold("CONNECTION: ") + obj.length + "x " + groupKey + " connection");
        // loop over printers in connection group
        var length = obj.length;
        _.forEach(obj, (printer, printerKey)=> {
            // write printer to the cli
            console.log((printerKey > 0 ? "│\n" : "") + (printerKey < length - 1 ? "├" : "├") + "─ " + printer._description + " (" + clc.blue(printer._protocol.toUpperCase()) + ")" + "\n" + (printerKey < length - 1 ? "├" : "└") + "─ " + clc.red(printer._uri_pretty) + "");



        })
        // increase group index
        index++;
    })

    console.log("\n"+clc.green("If you want to install one of these, please type: ")+clc.red.bold("pliigo-cups-agent install")+clc.green(" into your shell"));
});