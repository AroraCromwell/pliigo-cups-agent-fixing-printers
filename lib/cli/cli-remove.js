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


// instantiate the print manager class object
var pm = new PrinterManager();

// set the indicator properties
var spinner = require('./cli-helper').spinner();

// write an initial message to the cli
windowText(" pliigo-cups-agent remove");
console.log(clc.green("Listing installed printers that may be removed/uninstalled"));

// start the spinner to indicate searching
//spinner.start();
//spinner.stop();

pm.getInstalledPrinters((error, data)=>{

    let choices = [];
    _.forEach(data, (printer, index)=>{
        choices.push({
            name: printer['_queue'],
            value: printer
        })
    })
    inquirer.prompt({
        name:"printer",
        message: "What printer do you want to remove/uninstall?",
        type: "list",
        choices: choices

    }).then((answer)=>{

        //answer["printer"].getOptionsForPrinter((err, optionsData)=> {
        //    var util = require('util');
        //
        //        console.log(util.inspect(optionsData, true ,false));
        //});


        inquirer.prompt({
            name: "sure",
            message: "Do you really want to delete printer " + clc.red.bold(answer.printer._queue) + "?",
            type: "confirm",
            default: false
        }).then((answer_confirm)=>{
            if(answer_confirm.sure === true) {
                answer.printer.uninstall();
                console.log(clc.green("! ")+"you deleted printer "+clc.red.bold(answer.printer._queue));
            } else {
                console.log(clc.green("! ")+"ok, nothing happend");
            }
        })





    })

});