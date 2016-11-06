/**
 * Created by johannespichler on 29.01.16.
 */
'use strict'


const util = require("util");
const path = require('path');
const exec = require('child_process').exec;
const EventEmitter = require('events').EventEmitter;
const _ = require("lodash");
//const mdns = require('multicast-dns');
const InstallablePrinter = require("./PrinterInstallable");
const Printer = require('./Printer');

const TLD = '.local'
const WILDCARD = '_services._dns-sd._udp' + TLD

class PrinterManager extends EventEmitter {


    /**
     * constructor
     */
    constructor(initValue) {

        // call parent constructor of EventEmitter
        super();


        //this.mdns = mdns();
        //
        //this.mdns.query({
        //    questions: [{name:WILDCARD, type:'ANY'}]
        //}, ()=>{
        //    console.log("sent questions");
        //});
        //
        //
        //this.mdns.on("response", (packet, rinfo) => {
        //
        //    console.log("on response");
        //    console.log("rinfo", rinfo);
        //    console.log("packet", packet);
        //
        //});

        //this.mdns.on("query", (packet, rinfo) => {
        //
        //    console.log("on query");
        //    console.log("rinfo", rinfo);
        //    console.log("packet", packet);
        //
        //});


    }

    static getIgnoredDevices() {
        return ["http", "https", "ipp", "ipps", "lpd", "smb", "socket", "fax", "canonoipnets2", "cnips2", "epsonfax"];
    }


    /**
     * returns an array of printer ojects, that are currently installed to the system
     * @param callback
     */
    //getInstalledPrinters(callback) {
    getInstalledPrinters() {
        let cmd = `lpstat -s`;

        exec(cmd, (error, stdout, stderr)=> {

            if (error) {
                console.log(error);
                //callback(error, null);
            }


            // verify output to UTF-8
            stdout = stdout.toString('utf8');

            // split the stdout into an array, by finding new lines
            let lines = stdout.split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
            lines.splice(0, 1);
            lines.splice(-1);

            let arr = [];
            _.forEach(lines, (item, index)=> {
                item = item.split(/:(.+)?/);
                item[0] = item[0].substring(item[0].lastIndexOf(" ") + 1).trim();
                item[1] = item[1].trim();

                arr.push(
                    new Printer(item[0])
                );
                //item[0]

            });

            console.log(arr);
            //callback(null, arr);

        })

    }



    /**
     * search for available printers availble on the network or directly attached (e.g. USB)
     * @param callback
     */
    searchPrinters(callback) {


        /**
         * the printers object, that will be returned
         * structure
         * @type {}
         * @structure:
         *
         * {
         *  network: [
         *      {
         *         uri: "dnssd://Brother%20HL-5270DN%20series._pdl-datastream._tcp.local./?bidi",
         *         uri_decoded: "dnssd://Brother HL-5270DN series._pdl-datastream._tcp.local./?bidi",
         *         protocol: dnssd,
         *         name: "Brother HL-5270DN series"
         *      },
         *      {
         *         uri: "dnssd://Brother%20HL-2030._pdl-datastream._tcp.local./?bidi",
         *         uri_decoded: "dnssd://Brother HL-2030._pdl-datastream._tcp.local./?bidi",
         *         protocol: dnssd,
         *         name: "Brother HL-2030"
         *      }
         *  ],
         *  direct: []
         * }
         *
         */
        let objPrintersToReturn = {};


        /**
         * define command to discover devices
         * lpinfo:
         *
         * lists the available devices or drivers known to the CUPS server.  The first form
         * (-m)  lists  the  available  drivers,  while  the  second form (-v) lists the available
         * devices.
         */
        let cmd = `lpinfo -v`;

        // run the find command, to disconver devices
        var child_process = exec(cmd, (error, stdout, stderr)=> {

            if (error) {
                callback(error, null);
            }


            // verify output to UTF-8
            stdout = stdout.toString('utf8');

            // split the stdout into an array, by finding new lines
            let lines = stdout.split(/\r\n|[\n\r\u0085\u2028\u2029]/g);


            if (!_.isArray(lines)) {

                return callback(null, objPrintersToReturn);

            }

            // iterate over this array
            _.forEach(lines, (item, key)=> {
                if (item && item != "" && item != " ") {
                    let arrItem = item.split(" ");
                    if (_.isArray(arrItem)) {

                        let type = arrItem[1];
                        let protocol = arrItem[0];


                        if (_.indexOf(PrinterManager.getIgnoredDevices(), type) === -1) {

                            if (!_.isArray(objPrintersToReturn[protocol])) {
                                objPrintersToReturn[protocol] = [];
                            }

                            //let rx = /(^([a-zA-Z]*)\:\/\/)(.*)/gmi;
                            let rx_type = /(^([a-zA-Z].*)\:\/\/)/gmi;

                            let rx_usb = /(usb:\/\/)(.*)(\/)(.*)(\?)(.*)/gmi;
                            let rx_network = /\/\/(.*?)\._/gmi;

                            let uri = type;


                            let uri_decoded = decodeURIComponent(type);


                            let regexed_type = rx_type.exec(uri_decoded);
                            let connection_type = ""
                            if (Array.isArray(regexed_type) && regexed_type[2]) {
                                connection_type = regexed_type[2]; // usb|socket|dnssd|...
                            }


                            let model = "";
                            let make = "";

                            if (connection_type == "usb") {


                                let regexed_usb = rx_usb.exec(uri_decoded);


                                if (Array.isArray(regexed_usb) && regexed_usb[2] && regexed_usb[4]) {
                                    model = regexed_usb[2] + " " + regexed_usb[4];
                                } else {
                                    model = "unknown";
                                }


                            } else {

                                let regexed_network = rx_network.exec(uri_decoded);

                                if (Array.isArray(regexed_network) && regexed_network[1]) {
                                    model = regexed_network[1];
                                } else {
                                    model = "unknown";
                                }


                            }


                            let name = "";//regexed[3] || "no name";


                            let params = {
                                uri: type,
                                uri_pretty: uri_decoded,
                                protocol: connection_type,
                                //make: make,
                                model: model
                            }


                            objPrintersToReturn[protocol].push(new InstallablePrinter(params))
                        }
                    }

                }

            })


            callback(null, objPrintersToReturn);

        });


    }

    findDriversForSlug(slug, cb) {

        return exec(`lpinfo -l --make-and-model "${slug}" -m`, (error, stdout, stderr)=> {


            if (error || stderr) {
                if (typeof cb == "function") {
                    return cb(error || stderr, null)
                }
                return [];
            }
            var arr = stdout.split("\n");
            //_.forEach(arr, (item, index)=>{
            //
            //})
            let newArr = [];

            do {
                let tempArr = arr.splice(0, 4);
                var obj = {
                    "make-and-model": tempArr[2].split("=")[1].trim(),
                    lang: tempArr[1].split("=")[1].trim(),
                    id: tempArr[3].split("=")[1].trim(),
                    driver: tempArr[0].split("=")[1].trim()

                }
                newArr.push(obj);


            } while (arr.length > 4);

            if (typeof cb == "function") {
                return cb(null, newArr);
            }
            return newArr;


        });

    }


    installPrinter(name, opts) {

        // define printer name
        var name = "nodeJS_printer";
        // define a description of the printer
        var description = 'Printer added via nodeJS application';
        // define a location
        var location = "connected to pliigo-box";
        // define destination of printer
        var connection = "dnssd://Photosmart%205510d%20series%20%5B4DAE43%5D._pdl-datastream._tcp.local./?uuid=1c852a4d-b800-1f08-abcd-2c768a4dae43";

        // define model of printer (PCL)
        var model = "drv:///sample.drv/deskjet.ppd";

        // generic PS driver
        var modelPS = "drv:///sample.drv/generic.ppd";
        /**
         * all generic printer drivers...

         drv:///sample.drv/generpcl.ppd Generic PCL Laser Printer
         drv:///sample.drv/generic.ppd Generic PostScript Printer


         drv:///sample.drv/dymo.ppd Dymo Label Printer
         drv:///sample.drv/epson9.ppd Epson 9-Pin Series
         drv:///sample.drv/epson24.ppd Epson 24-Pin Series

         drv:///sample.drv/deskjet.ppd HP DeskJet Series
         drv:///sample.drv/laserjet.ppd HP LaserJet Series PCL 4/5

         drv:///sample.drv/intelbar.ppd Intellitech IntelliBar Label Printer, 2.1

         drv:///sample.drv/okidata9.ppd Oki 9-Pin Series
         drv:///sample.drv/okidat24.ppd Oki 24-Pin Series

         drv:///sample.drv/zebracpl.ppd Zebra CPCL Label Printer
         drv:///sample.drv/zebraep1.ppd Zebra EPL1 Label Printer
         drv:///sample.drv/zebraep2.ppd Zebra EPL2 Label Printer
         drv:///sample.drv/zebra.ppd Zebra ZPL Label Printer
         */


        var isDefault = true;
        var isShared = true;
        var defaultMedia = 'A4';

        // define command to add printer
        var cmd = `lpadmin -p "${name}" -v "${connection}" -m "${model}" -D "${description}" -L "${location}" -E`;


        // set default media
        cmd = `${cmd} -o media=${defaultMedia}`;

        if (isShared === false) {
            cmd = `${cmd} -o printer-is-shared=false`
        } else {
            cmd = `${cmd} -o printer-is-shared=true`
        }


        // execute printer installation
        let child = exec(cmd, function (error, stdout, stderr) {
            //if(stdout) util.print('stdout: ' + stdout);
            if (stderr) util.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }

            if (isDefault === true) {
                cmd = `lpoptions -d ${name}`;
                exec(cmd, function (error, stdout, stderr) {

                });
            }
        });


    }

    uninstallPrinter(name) {

        // define printer name
        var p = "nodeJS_printer";

        // define command to remove printer
        var cmd = `lpadmin -x ${p}`;

        // execute removement of printer
        let child = exec(cmd, function (error, stdout, stderr) {
            if (stdout) util.print('stdout: ' + stdout);
            if (stderr) util.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });

    }

    setDefaultPrinter(name) {


    }

    getPrinters(){

        var printer = require("../node_modules/printer/lib"),
            util = require('util');
        //console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

        return printer.getPrinters();
    }

}


var exports = module.exports = PrinterManager;

