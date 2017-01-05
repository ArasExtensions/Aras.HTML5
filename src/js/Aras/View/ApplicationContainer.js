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
	'dijit/form/Button',
	'./Login',
	'./ErrorDialog',
	'../ViewModel/Server'
], function(declare, lang, BorderContainer, ContentPane, Button, Login, ErrorDialog, Server) {
	
	return declare('Aras.View.ApplicationContainer', [BorderContainer], {
		
		URL: null,
		
		Server: null,
		
		Login: null,
		
		Session: null,
		
		Menu: null,
		
		constructor: function() {
			this.inherited(arguments);
			
		},
				
		startup: function() {
			this.inherited(arguments);
			
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
			
			// Destroy Current Menu
			if (this.Menu != null)
			{
				this.removeChild(this.Menu);
				this.Menu.destroyRecursive();
			}
			
			// Create Menu
			this.Menu = new ContentPane({ region: "left" });
			this.addChild(this.Menu);
			
			if (this.Session != null)
			{		
				// Get ApplicationTypes
				this.Session.ApplicationTypes().then(lang.hitch(this, function(applicationtypes){

					// Add Appliction Buttons
					for(i=0; i<applicationtypes.length; i++)
					{
						var logoutbutton = new Button({ label: applicationtypes[i].Label, onClick: lang.hitch(this, this._startApplication, applicationtypes[i].Name)});
						this.Menu.addChild(logoutbutton);
					}

					// Add Logout Button
					var logoutbutton = new Button({ label: "Logout", onClick: lang.hitch(this, this._logout)});
					this.Menu.addChild(logoutbutton);
				}));
			}
			else
			{
				// Add Login Button
				var loginbutton = new Button({ label: "Login", onClick: lang.hitch(this, this._login)});
				this.Menu.addChild(loginbutton);
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