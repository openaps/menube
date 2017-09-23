Examples of menube menu items in use.

This node application demonstrates how to use each of the menu items types. The
stdin.js script is executed with node.js and will use the keyboard arrow keys to
navigate the defined menu.

Up and down arrow keys are used to move up and down in the current menu branch.

The left arrow key will move back one branch in the menu tree. At the root of the
menu tree the left arrow does nothing.

The right arrow key will activate the currently selected menu item. The results
of the activate will depend on the type of menu item that is selected. I.E. If
the menu item selected is a sub menu then the current menu branch will change to
this sub menu.
