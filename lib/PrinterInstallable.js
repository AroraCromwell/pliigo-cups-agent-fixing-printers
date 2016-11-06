/**
 * Created by johannespichler on 30.01.16.
 */
'use strict'


const util = require("util");
const exec = require('child_process').exec;
const _ = require("lodash");

const Printer = require('./Printer');
//const mdns = require('multicast-dns');





class PrinterInstallable extends Printer {


    /**
     * constructor
     * @param queue
     * @param opts
     */
    constructor(queue, opts) {

        // call constructor of parent class
        super();


        let queuePredefined = false;

        if (typeof queue !== "string") {
            opts = queue;
        } else {
            queuePredefined = true;
            this._queue = queue;
        }

        if (!opts || !_.isObject(opts)) {
            throw new Error("You may not instantiate a printer without a full system definition...");
        }


        let defaultOpts = {
            uri: "unknown",
            uri_pretty: "unknown",
            protocol: "unknown",
            model: "unknown",

        }

        if (_.isObject(opts)) {
            _.merge(defaultOpts, opts);
        }

        if (queuePredefined !== true && !defaultOpts['queue']) {
            this._queue = defaultOpts.model.replace(/([^a-zA-Z0-9.])/gmi, "_"); // a printer queue may only contain letters, numbers, - and _
        } else if(queuePredefined !== true && defaultOpts['queue']){
            this._queue = defaultOpts['queue'].replace(/([^a-zA-Z0-9.])/gmi, "_");
        } else if(queuePredefined === true){
            this._queue = queue.replace(/([^a-zA-Z0-9.])/gmi, "_");
        }

        this._uri = defaultOpts.uri;

        if(defaultOpts.uri != "unknown" && defaultOpts.uri_pretty != "unknown") {
            this._uri_pretty = defaultOpts.uri_pretty;
        } else if (defaultOpts.uri != "unknown" && defaultOpts.uri_pretty == "unknown") {
            this._uri_pretty = decodeURIComponent(this._uri);

        }

        this._protocol = defaultOpts.protocol;
        this._description = defaultOpts.model || "no description provided";
        this._model = /(.*?)(?=\s@|$)/mi.exec(defaultOpts.model)[1]; // removes any @ shared indicator like ... "printer @ ubuntuserver"
        this._location = "";


    }


    /**
     * sets the location parameter of the printer
     */
    _setLocation() {

    }

    /**
     * set the driver uri
     * @param driverUri
     */
    setDriver(driverUri) {

        if (!driverUri.indexOf("://") > 0) {
            driverUri = "/" + driverUri;
        }

        this._driverOrPpd = driverUri;

    }


    /**
     * installs printer to CUPS server
     * returns true|false of operation success
     *
     * @returns {boolean}
     */
    installOnCupsServer(cb) {

        if(this._driverOrPpd === false){
            throw new Error("You can not install a printer without a driver of PPD defined");
        }

        // define command to add printer
        let cmd = `lpadmin -p "${this._queue}" -v "${this._uri}" -m "${this._driverOrPpd}" -D "${this._description}" -L "${this._location}" -E`;

        // set default media
        cmd = `${cmd} -o media=${this.defaultMedia}`;

        if (this.isShared === false) {
            cmd = `${cmd} -o printer-is-shared=false`
        } else {
            cmd = `${cmd} -o printer-is-shared=true`
        }


        // execute printer installation
        exec(cmd, (error, stdout, stderr) => {
            //if(stdout) util.print('stdout: ' + stdout);
            if (stderr) {
                //util.print('stderr: ' + stderr);
                if (typeof cb == 'function') {
                    cb(stderr, false);
                }
            }
            if (error !== null) {
                //console.log('exec error: ' + error);
                if (typeof cb == 'function') {
                    cb(error.message, false);
                }
            }

            if (this.isDefault === true) {
                cmd = `lpoptions -d ${this._queue}`;
                exec(cmd, function (error, stdout, stderr) {

                });
            }
        });

        if (typeof cb == 'function') {
            cb(null, true);
        }

    }




}

var exports = module.exports = PrinterInstallable;