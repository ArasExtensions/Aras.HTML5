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
	'dijit/layout/ContentPane',
	'dojox/layout/TableContainer',
	'dijit/form/Button',
	'./Login',
	'./ErrorDialog',
	'../ViewModel/Server'
], function(declare, lang, BorderContainer, ContentPane, TableContainer, Button, Login, ErrorDialog, Server) {
	
	return declare('Aras.View.ApplicationContainer', [BorderContainer], {
		
		URL: null,
		
		Server: null,
		
		Login: null,
		
		Session: null,
		
		Menu: null,
		
		Workspace: null,
		
		_applicationCache: new Object(),
		
		constructor: function() {
			this.inherited(arguments);
			
		},
				
		startup: function() {
			this.inherited(arguments);
			
			// Create Menu
			this.Menu = new ContentPane({ region: "left", splitter:true });
			this.addChild(this.Menu);
			
			// Create Workspace
			this.Workspace = new ContentPane({ region: "center", splitter:true });
			this.addChild(this.Workspace);
			
			// Create Server
			this.Server = new Server({ URL: this.URL });
			
			// Watch for Errors
			this.Server.watch('InError', lang.hitch(this, this._displayServerError));
			
			// Watch for Session changing
			this.watch('Session', lang.hitch(this, this._updateMenu));
			
			// Create Login
			this.Login = new Login({ApplicationContainer: this, title: 'Aras Innovator Login'});
			this.Login.startup();
			
			// Update Menu
			this._updateMenu();
		},
		
		_updateMenu: function() {
			
			// Remove all Menu Items
			var menuitems = this.Menu.getChildren();
			
			for(i=0; i<menuitems.length; i++)
			{
				this.Menu.removeChild(menuitems[i]);
				menuitems[i].destroyRecursive();
			}

			if (this.Session != null)
			{		
				// Get ApplicationTypes
				this.Session.ApplicationTypes().then(lang.hitch(this, function(applicationtypes){
					
					// Create TableContainer
					var table = new TableContainer({ cols: 1, showLabels: false });
			
					// Add Appliction Buttons
					for(i=0; i<applicationtypes.length; i++)
					{
						var applicationbutton = new Button({ label: applicationtypes[i].Label, class: "menuButton", onClick: lang.hitch(this, this._startApplication, applicationtypes[i].Name)});
						table.addChild(applicationbutton);
					}

					// Add Logout Button
					var logoutbutton = new Button({ label: "Logout", class: "menuButton", onClick: lang.hitch(this, this._logout)});
					table.addChild(logoutbutton);
						
					// Add Table to Menu
					this.Menu.addChild(table);
					
					// Ensure Menu is correct size
					this.layout();					
				}));
			}
			else
			{
				// Create TableContainer
				var table = new TableContainer({ cols: 1, showLabels: false });
					
				// Add Login Button
				var loginbutton = new Button({ label: "Login", class: "menuButton", onClick: lang.hitch(this, this._login)});
				table.addChild(loginbutton);

				// Add Table to Menu
				this.Menu.addChild(table);	
				
				// Ensure Menu is correct size
				this.layout();
			}

		},
		
		_login() {
				
			// Display Login
			this.Login.show();
		},
		
		_logout() {
		
			// Logout
			this.set("Session", null);
			
			// Update Menu
			this._updateMenu();
		},
		
		_startApplication(name) {
			
			console.debug(name);
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