// menube function to create a menu using the file specified in menuFile
module.exports = function (menuFile) {
  var path = require('path');
  var events = require('events');
  var emitter = new events.EventEmitter();
  var menu = null; // the loaded menu
  var activeMenu = menu; // reference to active menu branch
  var currentSelect = [0]; // index of currently selected menu items

  // load the menu json file with recursive calls if needed
  function loadMenu(menuFile) {
    // load the menu file json
    var menu = require(menuFile[0] === path.sep ? menuFile : process.cwd() + path.sep + menuFile);

    // function to recursively check menu branches for further menu files to load
    var loadMenuFiles = function (menu, i) {
      if (i >= menu.length) {
        // finished loading this menu file
        return;
      }
      if (menu[i].menuFile) {
        // this menu item is defined by another menu file
        menu[i].menu = loadMenu(menu[i].menuFile);
      }
      // next menu item
      loadMenuFiles(menu, i + 1);
    };

    if (Array.isArray(menu)) {
      // load any menuFile items in this menu item array
      loadMenuFiles(menu, 0);
    }

    return menu;
  }

  // activate the selected menu item
  function activateSelect() {
    var s = getCurrentSelect();
    if (s.menu && s.menu.length) {
      // submenu selected
      currentSelect.push(0);
      emitter.emit('menu_changed');
    }
    else if (s.command) {
      // shell command selected
      require('child_process').exec(s.command, function (err, stdout, stderr) {
        if (s.emit) {
          emitter.emit(s.emit, err, stdout, stderr);
        }
        emitter.emit('menu_command');
      });
    }
    else if (s.emit) {
      // emit event selected
      var args = [];
      if (typeof s.emit === "string") {
        // simple event
        args.push(s.emit);
      }
      else {
        // complex event
        args.push(s.emit.name);
        if (s.emit.arguments) {
          args = args.concat(s.emit.arguments);
        }
      }
      emitter.emit.apply(emitter, args);
      emitter.emit('menu_emit');
    }
  }

  // move menu selection back from sub-menu
  function menuBack() {
    if (currentSelect.length > 1) {
      currentSelect.pop();
      emitter.emit('menu_changed');
      return true;
    }
    return false;
  }

  // move menu selection up through menu
  function menuUp() {
    var i = currentSelect[currentSelect.length - 1] - 1;
    if (i < 0) {
      i = 0;
      return false;
    }
    currentSelect[currentSelect.length - 1] = i;
    emitter.emit('menu_changed');
    return true;
  }

  // move menu selection down through menu
  function menuDown() {
    var i = currentSelect[currentSelect.length - 1] + 1;
    if (i >= getActiveMenu().length) {
      i -= 1;
      return false;
    }
    currentSelect[currentSelect.length - 1] = i;
    emitter.emit('menu_changed');
    return true;
  }

  // get active menu branch
  function getActiveMenu() {
    return currentSelect.reduce(function (cur, val, ci) {
      return (ci + 1 < currentSelect.length ? cur.menu[val] : cur.menu);
    }, {menu: menu});
  }

  // get the parent selected menu item
  function getParentSelect() {
    if (currentSelect.length === 1) {
      // at root, no parent
      return null;
    }
    return currentSelect.reduce(function (cur, val, ci) {
      return (
        ci + 2 < currentSelect.length ?
        cur.menu[val] : (
          ci + 2 === currentSelect.length ?
          cur.menu :
          cur[currentSelect[currentSelect.length - 2]]
        )
      );
    }, {menu: menu});
  }

  // get the currently selected menu item
  function getCurrentSelect() {
    return getActiveMenu()[currentSelect[currentSelect.length - 1]];
  }

  // export functions
  emitter.menuUp = menuUp;
  emitter.menuDown = menuDown;
  emitter.activateSelect = activateSelect;
  emitter.menuBack = menuBack;
  emitter.getCurrentSelect = getCurrentSelect;
  emitter.getParentSelect = getParentSelect;
  emitter.getActiveMenu = getActiveMenu;

  // load menu in this instance
  menu = loadMenu(menuFile);
  return emitter;
};
