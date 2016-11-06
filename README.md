#pliigo-cups-agent

![pliigo-cups-agent](https://bitbucket.org/repo/9GK7aA/images/1827874712-1_.png)

**pliigo cups agent** is a tool to programaticly add and remove cups printers to your system.
It also provides an **shell tool**, e.g. to remotely manage this through shell.

**We highly recommend, you install the gutenprint library** [http://gimp-print.sourceforge.net](http://gimp-print.sourceforge.net/).

With that library installed, you can cover printer drivers for a huge amount of printers. Of course you may use the generic PS/PCL CUPS drivers.

More information is in the [pliigo-cups-agent wiki page](https://bitbucket.org/joeherold/pliigo-cups-agent/wiki/Home).

##INSTALLATION
```bash
npm install pliigo-cups-agent -g
```

Use the global flag, to install it globally and you may call the shell tool directly by **pliigo-cups-agent**


##GUIDED SHELL TOOL
```bash
pliigo-cups-agent [cmd]
```

![animated.gif](https://bitbucket.org/repo/9GK7aA/images/1243942817-ezgif.com-resize.gif)

###AVAILABLE COMMANDS

- list
- find
- install
- manage
- remove 

####list
List all installed printers
####find
Find all available printers for installation
####install
Find all available printers for installation and then install it to the system
####manage
Manage an installed printer
####remove
Remove an installed printer

###WHEN NO COMMAND IS PASSED
You will get the help if no command is passed.

```bash
$ pliigo-cups-agent 

  Usage: pliigo-cups-agent [command] [options]


  Commands:

    list               List all installed printers
    find               Find all available printers for installation
    install            Install a printer from available printers
    manage             Manage an installed printer
    remove             Remove an installed printer

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    ...
```

##PROGRAMATIC USAGE (yet not finished)

The programatic usage is under construction to make it more easy and consistent

```javascript
// create a print manager instance
var PrintManager = require('pliigo-cups-agent')();

// get printers
var arrPrinters = PrintManager.getPrinters();

// get one specific Printer
var brotherPrinter = PrintManager.getPrinter("BROTHER_HL-2030N");

// uninstall this printer
brotherPrinter.uninstall(function(err){
    if(err){
        // do something in case of error
    }
});
```


##YET OPEN TASKS
- [x] SHELL LIST WORKFLOW
- [x] SHELL FIND/DISCOVER WORKFLOW
- [x] SHELL INSTALL WORKFLOW
- [x] SHELL UNINSTALL WORKFLOW
- [ ] SHELL MANAGE WORKFLOW
- [ ] FINISH PROGRAMATIC USAGE
- [ ] FINISH README PAGE
- [ ] FINISH WIKI PAGE