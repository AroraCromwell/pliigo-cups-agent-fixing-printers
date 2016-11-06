/**
 * Created by johannespichler on 29.01.16.
 */

var pm = require("./pliigo-cups-agent");
var util = require("util");

function provide() {
    return new pm();
}

exports = module.exports = provide;
