Menu Backend
================================

## Application
The menube module is a backend tool used to create and manage an
application menu. Menu structure and actions are defined in JSON files
which are loaded when a menube instance is created.

Methods are provided for the application user interface to list available
menu items with their defined labels and controls to enable menu traversal
and taking action on menu items.

Results from menu item actions are communicated through events where defined
in the menu JSON files.


## Install
Use npm to install the package from the npm repository or directly from the
git repository.

`npm install menube --save`


## Menu Construction
Menus are defined in JSON files where each file contains an array of menu items.
Each menu item includes a label to be used by the menu display mechanism while
the rest of the menu item defines the function of the menu item.

The follow is a simple example that emits events based on the selected menu
item. An event listener attached to the menu instance would need to act on
each event.
```JSON
[
  {
    "label": "Say Hi",
    "emit": {
      "name": "text",
      "arguments": ["Hello World"]
    }
  },
  {
    "label": "Say Bye",
    "emit": {
      "name": "text",
      "arguments": ["Good Bye"]
    }
  },
  {
    "label": "Exit",
    "emit": "exit"
  }
]
```


## Menu Item Types

### menu
A menu type menu item is used to define a sub menu. The menu property must be an
array of menu items that make up the sub menu.

In the following example the menu item with the label "System" has a property
named "menu" with an array of menu items. This property specifies that the
System menu opens a sub-menu when selected. The sub-menu is defined by the array
of menu items defined in the menu property.
```json
{
  "label": "System",
  "menu": [
    {
      "label": "Test",
      "emit": {
        "name": "text",
        "arguments": ["Text test."]
      }
    },
    {
      "label": "Date",
      "command": "date"
    }
  ]
}
```


### menuFile
The "menuFile" is another type of sub-menu but in this case the value of the
property is a file path where the sub-menu is defined.

In this example the "Level2" menu item will open a sub-menu that is defined in
the json file level2.json.
```json
{
  "label": "Level2",
  "menuFile": "./level2.json"
}
```


### command
The "command" menu item type is used to execute a shell command. If the menu item
definition includes an "emit" property with the name of the event to be emitted
then an event will be emitted with the error, stdout, and stderr values resulting
from the shell command.

The following example is a menu item "Date" that when selected will execute the
date command with the results delivered through an event named "show_date".
```json
{
  "label": "Date",
  "command": "date",
  "emit": "show_date"
}
```
The code used to listen for the "show_date" event in the previous example may
look something like the following...
```javascript
menu.on('show_date', function (error, stdout, stderr) {
  console.log('stdout: ', stdout);
  console.log('stderr: ', stderr);
  console.log('error: ', error);
});
```


### emit
Emit an event. This menu item will emit an event when selected. The emit may be
defined as a string with the event name or as an object with the event name and
an array of arguments for a more complex event.

A simple event with no arguements may look like the following...
```json
{
  "label": "Shutdown",
  "emit": "shutdown"
}
```
The following example menu item will show up as *Test* on the menu and when
selected will emit an event named *text*. The event will include the string
*"Text test."* as the first argument passed with the event.
```json
{
  "label": "Test",
  "emit": {
    "name": "text",
    "arguments": ["Text test."]
  }
}
```
A listener for the previous example may look something like the following...
```javascript
menu.on('text', function (txt) {
  console.log('TEXT: ', txt);
});
```


## Methods
The menube module provides methods to request current menu states and control
menu interaction.

### getActiveMenu()
The currently active menu branch is returned by the getActiveMenu() method. The
branch is an array of menu items and can be used to display menu item labels in
the user interface.


### getCurrentSelect()
An active menu branch will always have one selected menu item. The currently
selected menu item in the active branch is returned by the getCurrentSelect()
method.


### menuDown()
The application user interface calls the menuDown() method when a user selects
the next menu item. This will update the currently selected menu item in the
active menu branch.


### menuUp()
The application user interface calls the menuUp() method to move the menu
selection to the previous item in the active menu branch.


### menuBack()
When in a sub-menu the menuBack() method will take menube back one menu branch
and will change the current item selection to the item which led to the sub-menu.


### activateSelect()
Maybe need a better name for this method.
