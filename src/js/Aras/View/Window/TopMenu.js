/*  
  Copyright 2017 Processwall Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 
  Company: Processwall Limited
  Address: The Winnowing House, Mill Lane, Askham Richard, York, YO23 3NW, United Kingdom
  Tel:     +44 113 815 3440
  Web:     http://www.processwall.com
  Email:   support@processwall.com
*/

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'../MenuBar',
	'../PopupMenuBarItem',
	'../DropDownMenu',
	'../MenuItem',
], function(declare, lang, MenuBar, PopupMenuBarItem, DropDownMenu, MenuItem) {
	
	return declare('Aras.View.Window.TopMenu', [MenuBar], {
			
		Window: null,
		
		LoginMenu: null,
		
		LogoutMenu: null,
		
		_sessionHandle: null,
				
		constructor: function(args) {

		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Watch for Window Session changing
			this._sessionHandle = this.Window.watch('Session', lang.hitch(this, this._updateMenuBar));
		
			// Create Server Menu
			var filemenu = new DropDownMenu();
			var filepopupmenu = new PopupMenuBarItem({ label: 'File', popup: filemenu });
			this.addChild(filepopupmenu);
			
			// Add Login Menu Item
			this.LoginMenu = new MenuItem({ label: 'Login' });
			filemenu.addChild(this.LoginMenu);
			this.LoginMenu.set('onClick', lang.hitch(this, function() {
				this.Window._login();
				
			}));

			// Add Logout Menu Item
			this.LogoutMenu = new MenuItem({ label: 'Logout' });
			filemenu.addChild(this.LogoutMenu);
			this.LogoutMenu.set('onClick', lang.hitch(this, function() {
				this.Window._logout();
				
			}));

			this._updateMenuBar();
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			if (this._sessionHandle)
			{
				this._sessionHandle.unwatch();
			}
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