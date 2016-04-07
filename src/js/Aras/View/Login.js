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
	'dojox/encoding/digests/MD5',
	'dijit/Dialog',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dijit/layout/ContentPane',
	'dojo/store/Memory',
	'dojox/widget/Standby',
	'./Button'
], function(declare, lang, dom, domconstruct, MD5, Dialog, ComboBox, TextBox, ContentPane, Memory, Standby, Button) {
	
	return declare('Aras.View.Login', [Dialog], {
		
		Application: null,
		
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
			var layout = new ContentPane({content: '<table><tr><td>Database:</td><td id="logindatabase"></td></tr><tr><td>Username:</td><td id="loginusername"></td></tr><tr><td>Password:</td><td id="loginpassword"></td></tr><tr><td></td><td align="right"><div id="loginlogin"></div><div id="logincancel"></div></td></tr></table>'});
			this.addChild(layout);
			
			// Add Database 
			var databasetarget = dom.byId('logindatabase');	
			var dataStore = Memory({data: []});
			this.Database = new ComboBox({store: dataStore}, databasetarget);
			this.Database.startup();
			
			// Add Standy for Database
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
				this.hide();	
			}));
	
			// Add Login Button
			var loginbuttontarget = dom.byId('loginlogin');
			this.LoginButton = new Button({label: 'Login'}, loginbuttontarget);
			this.LoginButton.startup();
			
			this.LoginButton.set('onClick', lang.hitch(this, function() {
				
				// Get Database
				this.Application.Server.Database(this.Database.item.name).then(lang.hitch(this, function(database) {
		
					// Login
					database.Login(this.Username.value, MD5(this.Password.value, 1)).then(lang.hitch(this, function(session){

						// Get Application ViewModel
						session.Application(this.Application.Name).then(lang.hitch(this, function(application){ 
								
							// Set ViewModel
							this.Application.set("ViewModel", application);
							
							// Close Dialog
							this.hide();
						}));
					}));
				}));
			}));
						
			// Get Database
			this.Application.Server.Databases().then(lang.hitch(this, function(databases) {
				
				// Add Databases
				var data = [];
				
				for(i=0; i<databases.length; i++)
				{
					data.push({id: databases[i].ID, name: databases[i].Name});
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

		}

	});
});