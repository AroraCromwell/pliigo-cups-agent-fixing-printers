/**
 * Created by johannespichler on 01.02.16.
 */
'use strict'



//var printer = require("printer");

//console.log(printer.getPrinter("Canon_ImageRunner_C5045i"));
//console.log(printer.getPrinterDriverOptions("Canon_ImageRunner_C5045i"))

//process.exit(0);
// require the needed libraries
const PrinterManager = require("../PrinterManager");
const _ = require("lodash");
const clc = require("cli-color");
const inquirer = require('inquirer-question');
const windowText = require('./cli-helper').initializeCliWindowWithText;
windowText(" pliigo-cups-agent list");

// instantiate the print manager class object
var pm = new PrinterManager();

// set the indicator properties
var spinner = require('./cli-helper').spinner();

// write an initial message to the cli

console.log(clc.green("listing installed printers"));

// start the spinner to indicate searching
//spinner.start();
//spinner.stop();

pm.getInstalledPrinters((error, data)=>{

    let choices = [];
    _.forEach(data, (printer, index)=>{
        //choices.push({
        //    name: printer['_queue'],
        //    value: printer
        //})
        console.log(clc.blue(printer['_queue']));
    })
    //inquirer.prompt({
    //    name:"printer",
    //    message: "What printer queue do you want to manage?",
    //    type: "list",
    //    choices: choices
    //
    //}).then((answer)=>{
    //
    //    //answer["printer"].getOptionsForPrinter((err, optionsData)=> {
    //    //    var util = require('util');
    //    //
    //    //        console.log(util.inspect(optionsData, true ,false));
    //    //});
    //
    //    console.log("you selected printer "+answer.printer._queue);
    //    //console.log(answer["printer"].uninstall());
    //
    //})

});