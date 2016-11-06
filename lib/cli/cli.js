/**
 * Created by johannespichler on 31.01.16.
 */

const program = require("commander");
const clc = require('cli-color');



//console.log(`
//brought to you by:
//██╗    ██╗███████╗██████╗ ██████╗ ██╗██╗  ██╗███████╗██╗     ███████╗
//██║    ██║██╔════╝██╔══██╗██╔══██╗██║╚██╗██╔╝██╔════╝██║     ██╔════╝
//██║ █╗ ██║█████╗  ██████╔╝██████╔╝██║ ╚███╔╝ █████╗  ██║     ███████╗
//██║███╗██║██╔══╝  ██╔══██╗██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║     ╚════██║
//╚███╔███╔╝███████╗██████╔╝██║     ██║██╔╝ ██╗███████╗███████╗███████║
// ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝`);





program
    .version('1.0.0')
    .usage('[command] [options]')
    //.usage('[command]')
    .command("list", "List all installed printers")
    .command("find", "Find all available printers for installation")
    .command("install", "Install a printer from available printers")
    .command("manage", "Manage an installed printer")
    .command("remove", "Remove an installed printer")

    //.option('-p, --printer', 'Define a printer to speed up workflow')
    //.option('-l, --list', 'List all available Printers for installation')
    //.option('-i, --install [printername]', 'Add pineapple')
    //.option('-s --size <size>', 'Pizza size', /^(large|medium|small)$/i, 'medium')
    //.option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i)

program.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ custom-help --help');
    console.log('    $ custom-help -h');
    console.log('');
});

program.parse(process.argv);


//
//if (!process.argv.slice(2).length) {
//    program.outputHelp(make_red);
//}
//
//function make_red(txt) {
//    return clc.red(txt); //display the help text in red on the console
//}
