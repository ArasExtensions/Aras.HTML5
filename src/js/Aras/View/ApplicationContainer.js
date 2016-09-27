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
	'dijit/layout/BorderContainer',
	'./Login',
	'./ErrorDialog',
	'./MenuBar',
	'./PopupMenuBarItem',
	'./DropDownMenu',
	'./MenuItem',
	'../ViewModel/Server'
], function(declare, lang, BorderContainer, Login, ErrorDialog, MenuBar, PopupMenuBarItem, DropDownMenu, MenuItem, Server) {
	
	return declare('Aras.View.ApplicationContainer', [BorderContainer], {
		
		URL: null,
		
		Server: null,
		
		Login: null,
		
		Session: null,
		
		Menu: null,
		
		LoginMenu: null,
		
		LogoutMenu: null,
		
		constructor: function() {
			this.inherited(arguments);
			
		},
				
		startup: function() {
			this.inherited(arguments);
			
			// Create MenuBar
			this.Menu = new MenuBar({ region: 'top'});
			this.addChild(this.Menu);
			
			// Create File Menu
			var filemenu = new DropDownMenu({});
			var filepopupmenu = new PopupMenuBarItem({ label: 'File', popup: filemenu });
			this.Menu.addChild(filepopupmenu);
			
			// Add Login Menu Item
			this.LoginMenu = new MenuItem({ label: 'Login' });
			filemenu.addChild(this.LoginMenu);
			this.LoginMenu.set('onClick', lang.hitch(this, function() {
				this.Login.show();
			}));
			this.LoginMenu.SetEnabled(true);
			
			// Add Logout Menu Item
			this.LogoutMenu = new MenuItem({ label: 'Logout' });
			filemenu.addChild(this.LogoutMenu);
			this.LogoutMenu.set('onClick', lang.hitch(this, function() {
				this.set('Session', null);
			}));
			this.LogoutMenu.SetEnabled(false);
			
			// Create Server
			this.Server = new Server({ URL: this.URL });
			
			// Watch for Errors
			this.Server.watch('InError', lang.hitch(this, this._displayServerError));
			
			// Watch for Login
			this.watch('Session', lang.hitch(this, this._addApplications));
			
			// Create Login
			this.Login = new Login({ApplicationContainer: this, title: 'Aras Innovator Login'});
			this.Login.startup();
		},
		
		_addApplications: function() {
			
			if (this.Session == null)
			{
				this.LoginMenu.SetEnabled(true);
				this.LogoutMenu.SetEnabled(false);
			}
			else
			{
				this.LoginMenu.SetEnabled(false);
				this.LogoutMenu.SetEnabled(true);
			}
		},
		
		_startApplication(name) {
			
			
		},
		
		_displayServerError: function() {
			
			if (this.Server != null)
			{
				if (this.Server.InError)
				{
					// Close Login Dialog
					if (this.Login)
					{
						this.Login.hide();
					}
	
					// Prepare Message Text
					var messagetext = this.Server.ErrorMessage;
					
					if (this.Server.ErrorCode == 0)
					{
						messagetext = 'Unable to connect to Innovator Server';
					}
					
					// Display Error Message
					var message = ErrorDialog({ErrorMessage: messagetext});
					message.show();
				
					// Reset Error
					this.Server.ResetError();
				}
			}
		}
		
	});
});