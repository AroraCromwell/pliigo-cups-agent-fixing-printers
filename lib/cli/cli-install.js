/**
 * Created by johannespichler on 31.01.16.
 */
'use strict'

// require the needed libraries
const PrinterManager = require("../PrinterManager"),
    clc = require("cli-color"),
    spinner = require('./cli-helper').spinner(),
    windowText = require('./cli-helper').initializeCliWindowWithText,
    inquirer = require('inquirer-question'),
    _ = require("lodash");


/**
 *
 * The installer class handles the CLI input and output for the installation process
 *
 * workflow:
 *
 * 1.) start
 *          -> find printers
 * 2.) builds printer choices for prompt
 *
 * 3.) PROMPT: select a printer
 *          [or search again -> 1.]
 *
 * 4.) find drivers by printer or search slug
 *
 * 5.) PROMPT: select a driver
 *          [or cancel and go to printers -> 2.]
 *          [or search with own slug -> 4.]
 *
 * 6.) PROMPT: set additional configurations
 *
 * 7.) PROMPT: install [or quit]
 *
 */
class Installer {

    /**
     * installer class constructor
     */
    constructor() {
        this.pm = new PrinterManager();
        this.selectedPrinter = null;
        this.selectedDriver = null;

        this.foundPrinters = [];
        this.foundDrivers = [];

    }

    /**
     * start the installation process for the CLI
     */
    start() {
        this.findPrinters();
    }

    /**
     * find printers within the local network or directly attached to the machine
     * and build a inquirer choices object and call the printer selection prompt
     */
    findPrinters() {

        // clear the current shell window and print app message
        windowText(" pliigo-cups-agent ");

        // check, if printers had already been searched
        if (this.foundPrinters.length > 0) {
            // if so, go on with printer selection
            return this.promptPrinterSelection(this.foundPrinters);
        }

        // start the spinner for indicating searching process
        spinner.start();

        // run search printers and catch callback
        this.pm.searchPrinters((err, searchPrintersResult)=> {

            // printer counter
            let count = 0;

            // quit on error with message
            if (err) {
                return console.log(clc.red.bold("ooops, an error occured..."));
            }

            // stop the spinner, because we are already in the callback
            spinner.stop();

            // clean the window again
            windowText(" pliigo-cups-agent ");

            // distinguish between USB and NETWORK printers
            let network = searchPrintersResult['network'] || [];
            let usb = searchPrintersResult['direct'] || [];

            // set the found printers array to an empty array (in case something was found before)
            this.foundPrinters = [];

            // push a line separator to the found printers array (to distinguish in menu)
            this.foundPrinters.push(new inquirer.Separator(clc.green.bold("------  MENU  ------------------")));

            // add a menu option to search again
            this.foundPrinters.push({
                name: (("Search again")),
                value: "again"
            });

            // add a menu option to quit
            this.foundPrinters.push({
                name: (("quit")),
                value: "cancel"
            });

            if (usb.length > 0) {
                // push a line separator to the found printers array (to distinguish in menu)
                this.foundPrinters.push(new inquirer.Separator(clc.blue.bold("------  USB PRINTERS  -------")));
                // loop over the direct available printers
                _.forEach(usb, (item)=> {

                    count++; //increas printers counter
                    this.foundPrinters.push({
                        name: item._description + " (" + clc.red.italic("USB") + ")",
                        value: item
                    });
                })
            }

            if (network.length > 0) {
                // push a line separator to the found printers array (to distinguish in menu)
                this.foundPrinters.push(new inquirer.Separator(clc.blue.bold("------  NETWORK PRINTERS  ------")));

                // loop over the network available printers
                _.forEach(network, (item)=> {
                    count++; //increas printers counter
                    this.foundPrinters.push({
                        name: item._description + " (" + clc.red.italic("NETWORK") + ")",
                        value: item
                    });
                })
            }


            //promptShouldSearchDriversAgain();
            console.log("\n" + clc.green.bold(`! Found ${count} printer(s).`));


            this.promptPrinterSelection(this.foundPrinters);


        });

    }

    /**
     *
     * @param arrDrivers
     */
    prepareSelectPrinterDriverPromptChoices(arrDrivers) {

        // create a reference to the class for the promise
        let self = this;

        // printer counter
        let count = 0;

        // reset and|or initialize this value
        this.foundDrivers = [];


        // push a line separator to the found printers array (to distinguish in menu)
        this.foundDrivers.push(new inquirer.Separator(clc.green.bold("------  MENU  ------------------")));

        // add a menu option to search with slug
        this.foundDrivers.push({
            name: "Search other driver by custom slug",
            value: "other"
        });

        // add a menu option to cancel
        this.foundDrivers.push({
            name: "Cancel",
            value: "cancel"
        });

        // push a line separator to the found printers array (to distinguish in menu)
        this.foundDrivers.push(new inquirer.Separator(clc.blue.bold("-------  DRIVERS SELECTION  -------")));
        _.forEach(arrDrivers, (driver)=> {
            count++;
            this.foundDrivers.push({
                name: driver['make-and-model'] + " (" + clc.red(driver.id) + ")",
                value: driver
            })
        });

        console.log("\n" + clc.green.bold(`! Found ${count} driver(s).`));
        inquirer
            .prompt({
                type: 'list',
                name: 'selectedDriver',
                message: 'Please select the driver you want to use?',
                choices: this.foundDrivers,
                default: 2
            })
            .then((resultFoundDrivers)=> {
                switch (resultFoundDrivers.selectedDriver) {
                    case "other":
                        return self.promptEnterSearchDriverWithSlug();
                        break;
                    case "cancel":
                        return self.findPrinters();

                        break;
                    default:

                }

                self.selectedDriver = resultFoundDrivers.selectedDriver;

                return self.definePrinterQueueSettings();
            });

        //console.log(arrDrivers);

    }

    /**
     * prompts a printer selection based on the choices object
     * @param choices
     */
    promptPrinterSelection(choices) {

        // create a reference to the class for the promise
        let self = this;

        inquirer
        // define the promt message
            .prompt({
                type: 'list',
                name: 'printer',
                message: 'Which one do you want to install?',
                choices: choices,
                default: 2
            })
            // handle the promts result
            .then((promptResult) => {
                if (promptResult.printer == "again") {

                    // reset the found printers array, so it can search again
                    this.foundPrinters = [];
                    return self.findPrinters();
                }
                if (promptResult.printer == "cancel") {
                    console.log("! quit");
                    process.exit(0);
                }

                self.selectedPrinter = promptResult.printer;

                self.searchDriverWithSlug(promptResult.printer._model);
            });

    }

    /**
     * search the printer driver database of CUPS by a given slug
     * @param slug
     */
    searchDriverWithSlug(slug) {

        // call the find function
        this.pm.findDriversForSlug(slug, (err, arrFoundDrivers)=> {

            // in case of an error, ask if should search again
            if (err) {
                return this.promptShouldSearchDriversAgain();
            }
            // in case of nothing found, ask if should search again
            if (arrFoundDrivers.length == 0) {
                return this.promptShouldSearchDriversAgain();
            }


            this.prepareSelectPrinterDriverPromptChoices(arrFoundDrivers);


        });


    }

    /**
     *
     * @param slug
     */
    promptEnterSearchDriverWithSlug(slug) {

        inquirer
            .prompt({
                type: 'input',
                name: 'slug',
                message: 'Search driver by slug. Please enter a slug:',

            })
            .then((result)=> {
                return this.searchDriverWithSlug(result['slug']);
            });

    }

    /**
     *
     */
    promptShouldSearchDriversAgain() {

        let self = this;

        inquirer
            .prompt({
                type: 'list',
                name: 'again',
                message: 'No driver found. Would you like to search by entering a search slug?',
                choices: ["yes", "no"]
            })
            .then((result)=> {
                switch (result.again) {
                    case "yes":
                        return self.promptEnterSearchDriverWithSlug();
                        break;
                    case "no":
                    default:
                        return self.findPrinters();

                }
            });
    }

    /**
     * additionaly settings you may define
     * @param opts
     */
    definePrinterQueueSettings(opts) {

        // create a reference to the class for the promise
        let self = this;


        let questions = [
            {
                type: "input",
                name: "queue",
                message: "Please define the PRINT QUEUE name:",
                validate: (input)=>{

                    if(input.match(/\s/)){

                        return "Whitespaces are not allowed in a printer queue";
                    }

                    if(input.match(/[^a-zA-Z\-\_0-9]/gmi)) {
                        return 'Only "letters", "numbers", "_" and "-" is allowed';
                    }

                    return true;


                },
                default: this.selectedPrinter._queue
            },
            {
                type: "input",
                name: "description",
                message: "Please define the printer description / title:",
                default: this.selectedPrinter._description
            },
            {
                type: "input",
                name: "location",
                message: "Please define the printer location",
                default: this.selectedPrinter._location
            },
            {
                type: "confirm",
                name: "shared",
                message: "Do you want to share this printer on your network",
                default: false
            }
        ];

        inquirer.prompt(questions).then((answers)=> {

            this.selectedPrinter._queue = answers['queue'];
            this.selectedPrinter._description = answers['description'];
            this.selectedPrinter._location = answers['location'];
            this.selectedPrinter.isShared = answers['shared'];
            //this.selectedPrinter._questionCallback = answers['queue'];

            //console.log("! You have selected the printer: " + clc.blue.bold(this.selectedPrinter._description));
            //console.log("! You have selected the driver:  " + clc.blue.bold(this.selectedDriver['make-and-model']));
            inquirer.prompt({
                    name: "doInstall",
                    type: "confirm",
                    message: "Do you want to install this printer?"
                })
                .then((result)=> {
                    //console.log("result", result);
                    if (result['doInstall'] === true) {
                        self.selectedPrinter.setDriver(self.selectedDriver.driver);
                        self.selectedPrinter.installOnCupsServer((err, success)=> {
                            if (err) {
                                console.log(clc.red.bold("! ERROR: " + err));
                            }
                            console.log(clc.green.bold("! Printer successfully installed."));
                        });
                    } else {
                        return self.findPrinters();
                    }
                })

        });




    }

}

let installer = new Installer();
installer.start();



















