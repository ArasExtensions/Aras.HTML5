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
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/html',
	'dojox/encoding/digests/MD5',
	'dijit/Dialog',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dijit/layout/ContentPane',
	'dojo/store/Memory',
	'dojox/widget/Standby',
	'./Button'
], function(declare, lang, dom, domconstruct, html, MD5, Dialog, ComboBox, TextBox, ContentPane, Memory, Standby, Button) {
	
	return declare('Aras.View.Login', [Dialog], {
		
		Window: null,
		
		Database: null,
		
		Username: null,
		
		Password: null,
		
		LoginButton: null,
		
		CancelButton: null,
		
		Standby: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
		},
		
		startup: function() {
			this.inherited(arguments);

			// Create Layout
			var layout = new ContentPane({content: '<table style="padding:15px 10px 0px 5px;"><tr><td>Database</td><td id="logindatabase"></td></tr><tr><td>Username</td><td id="loginusername"></td></tr><tr><td>Password</td><td id="loginpassword"></td></tr><tr><td></td><td align="right"><div id="loginlogin"></div><div id="logincancel"></div></td></tr><tr><td id="errormessage" colspan="2"></td></tr></table>'});
			this.set('content', layout);
			
			// Add Database 
			var databasetarget = dom.byId('logindatabase');	
			var dataStore = Memory({data: []});
			this.Database = new ComboBox({store: dataStore}, databasetarget);
			this.Database.startup();
			
			// Add Standby for Database
			this.Standby = new Standby({target: this.Database.id});
			document.body.appendChild(this.Standby.domNode);
			this.Standby.startup();
			this.Standby.show();
			
			// Add Username
			var usernametarget = dom.byId('loginusername');	
			this.Username = new TextBox({}, usernametarget);
			this.Username.startup();
			
			// Add Password
			var passwordtarget = dom.byId('loginpassword');	
			this.Password = new TextBox({type: 'password'}, passwordtarget);
			this.Password.startup();
			
			// Add Cancel Button
			var cancelbuttontarget = dom.byId('logincancel');
			this.CancelButton = new Button({label: 'Cancel'}, cancelbuttontarget);
			this.CancelButton.startup();
			
			this.CancelButton.set('onClick', lang.hitch(this, function() {
				
				// Clear Password
				this.Password.set('value', '');
				
				// Reset Error Message
				this._errorMessage('');
				
				// Hide Login Widget
				this.hide();	
			}));
	
			// Add Login Button
			var loginbuttontarget = dom.byId('loginlogin');
			this.LoginButton = new Button({label: 'Login'}, loginbuttontarget);
			this.LoginButton.startup();
			this.LoginButton.set('onClick', lang.hitch(this, this._login));
									
			// Get Database
			this.Window.Server.Databases().then(lang.hitch(this, function(databases) {
				
				// Add Databases
				var data = [];
				
				for(var i=0; i<databases.length; i++)
				{
					data.push({id: databases[i].ID, name: databases[i].ID});
				}
				
				var databasetarget = dom.byId('logindatabase');	
				var dataStore = Memory({data: data});
				this.Database.set('store', dataStore);

				if (data.length > 0)
				{	
					this.Database.set('item', data[0]);
				}
				
				// Enable Buttons
				this.CancelButton.SetEnabled(true);
				this.LoginButton.SetEnabled(true);
				
				// Remove Standby
				this.Standby.hide();
			}));

		},
		
		Display: function() {
			
			// Enable Buttons
			this.CancelButton.SetEnabled(true);
			this.LoginButton.SetEnabled(true);
			
			this.show();
		},
		
		_login: function() {
			
			// Disable Buttons
			this.CancelButton.SetEnabled(false);
			this.LoginButton.SetEnabled(false);
				
			// Get Database
			this.Window.Server.Database(this.Database.item.name).then(lang.hitch(this, function(database) {
		
				// Login
				database.Login(this.Username.value, MD5(this.Password.value, 1)).then(lang.hitch(this, function(session){

					// Clear Password
					this.Password.set("value", '');
					
					if (session)
					{
						// Clear Error Message
						this._errorMessage('');
						
						// Set Session
						this.Window.set("Session", session);
	
						// Close Dialog
						this.hide();
					}
					else
					{
						this._errorMessage('Login failed, check Username and Password');
						
						// Enable Buttons
						this.CancelButton.SetEnabled(true);
						this.LoginButton.SetEnabled(true);
					}
				}));
			}));	
		},
		
		_errorMessage: function(message) {
			html.set(dom.byId('errormessage'), message);
		}

	});
});