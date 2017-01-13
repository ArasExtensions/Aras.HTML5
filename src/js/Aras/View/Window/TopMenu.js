/*
  Aras.HTML5 provides a HTML5 client library to build Aras Innovator Applications

  Copyright (C) 2015 Processwall Limited.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see http://opensource.org/licenses/AGPL-3.0.
 
  Company: Processwall Limited
  Address: The Winnowing House, Mill Lane, Askham Richard, York, YO23 3NW, United Kingdom
  Tel:     +44 113 815 3440
  Email:   support@processwall.com
*/

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dijit/layout/ContentPane',
	'../MenuBar',
	'../PopupMenuBarItem',
	'../DropDownMenu',
	'../MenuItem',
], function(declare, lang, ContentPane, MenuBar, PopupMenuBarItem, DropDownMenu, MenuItem) {
	
	return declare('Aras.View.Window.TopMenu', [ContentPane], {
			
		Window: null,
		
		MenuBar: null,
		
		LoginMenu: null,
		
		LogoutMenu: null,
		
		constructor: function(args) {

		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Watch for Window Session changing
			this.Window.watch('Session', lang.hitch(this, this._updateMenuBar));
			
			// Create MenuBar
			this.MenuBar = new MenuBar();
			this.addChild(this.MenuBar);
		
			// Create Server Menu
			var servermenu = new DropDownMenu();
			var serverpopupmenu = new PopupMenuBarItem({ label: 'Server', popup: servermenu });
			this.MenuBar.addChild(serverpopupmenu);
			
			// Add Login Menu Item
			this.LoginMenu = new MenuItem({ label: 'Login' });
			servermenu.addChild(this.LoginMenu);
			this.LoginMenu.set('onClick', lang.hitch(this, function() {
				this.Window._login();
				
			}));

			
			// Add Logout Menu Item
			this.LogoutMenu = new MenuItem({ label: 'Logout' });
			servermenu.addChild(this.LogoutMenu);
			this.LogoutMenu.set('onClick', lang.hitch(this, function() {
				this.Window._logout();
				
			}));

			this._updateMenuBar();
		},
		
		_updateMenuBar: function() {
			
			if (this.Window.Session == null)
			{
				this.LoginMenu.SetEnabled(true);
				this.LogoutMenu.SetEnabled(false);
			}
			else
			{
				this.LoginMenu.SetEnabled(false);
				this.LogoutMenu.SetEnabled(true);
			}	
		}

	});
});