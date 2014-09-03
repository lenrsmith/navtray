var pages = require('pageutils');

var menuToggle = false;
var navTray = {};
var menuRow = {};
var animating = false;
var current_view = {};

// Build menu items from Global configuration
var menuItems = Alloy.Globals.menuItems;
var row = {};
for(var i = 0; i < menuItems.length; i++) {
	row = Titanium.UI.createTableViewRow({
		className: 'menuRow',
		rowID: i,
		menuName: menuItems[i].category,
		menuLink: menuItems[i].type == 'url' ? menuItems[i].link : '',
		menuTitle: menuItems[i].title,
		type: menuItems[i].type,
		menuCategory: menuItems[i].category,
		height: 40,
		color: "#ffffff",
		selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.GRAY
	});

	var label = Titanium.UI.createLabel({
		text: menuItems[i].title,
		color: "#ffffff",
		left: 50
	});

	var filename = "menu_" + menuItems[i].category + ".png";
	var f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + "/images/icons/", filename);

	if(f.exists()){
		var icon = Titanium.UI.createImageView({
			left: 20,
			height: 20,
			width: 20,
			image: "/images/icons/" + filename
		});
		row.add(icon);
	}

	row.add(label);

	row.addEventListener('click',clickMenuItem);

	$.menu.appendRow(row);
}

// Check for a flash sale
if(Alloy.Globals.flashSaleInfo.scheduled){
	showClock();
} else {
	hideClock();
}

function clickMenuItem(e){
	toggle(current_view);
//	navTray.win.close(close_animation);
	menuRow = e.row;
	openWindow();
}

var closeAnimation = Titanium.UI.createAnimation({
	left : 0,
	right : 0,
	duration : 200,
	curve : Titanium.UI.ANIMATION_CURVE_EASE_IN
});

closeAnimation.addEventListener('start', function(e){
	animating = true;
});

closeAnimation.addEventListener('complete', function(e){
	animating = false;
	menuToggle = false;
});

var openAnimation = Titanium.UI.createAnimation({
	left : -185,
	right : 185,
	duration : 200,
	curve : Titanium.UI.ANIMATION_CURVE_EASE_IN
});

openAnimation.addEventListener('start', function(e){
	animating = true;
});

openAnimation.addEventListener('complete', function(e){
	animating = false;
	menuToggle = true;
});

function toggle(view){
	pages.log('TOGGLE NAVTRY CALLED: menuToggle = ' + menuToggle + ' AND animating =' + animating);
	if(menuToggle && !animating){
		close(view);
	} else {
		open(view);
	}
}

function open(view){
	current_view = view;
	view.animate(openAnimation);
}

function close(view){
	current_view = view;
	view.animate(closeAnimation);
}

function openWindow(){
	if(menuRow.type == 'app'){
		pages.open({type: 'controller', name: menuRow.menuCategory});
	} else if (menuRow.type == 'url') {
		pages.open({type: 'web', name: menuRow.menuName, url: menuRow.menuLink, title: menuRow.menuTitle});
	}
	toggle(current_view);
}

function goHome(e) {
	pages.log("NAVTRAY: Clicked Home.");
	pages.closeAll();
}

exports.menuToggle = menuToggle;
exports.close = close;
exports.open = open;
exports.toggle = toggle;
