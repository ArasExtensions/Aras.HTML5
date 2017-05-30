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
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/html',
	'dojox/encoding/digests/MD5',
	'dijit/Dialog',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dojo/store/Memory',
	'dojox/widget/Standby',
	'dojox/layout/TableContainer',
	'dijit/layout/BorderContainer',
	'./ErrorDialog',
	'./Button'
], function(declare, lang, dom, domconstruct, html, MD5, Dialog, ComboBox, TextBox, Memory, Standby, TableContainer, BorderContainer, ErrorDialog, Button) {
	
	return declare('Aras.View.Login', [Dialog], {
		
		Window: null,
		
		Layout: null,
		
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
		
		buildRendering: function() {
			this.inherited(arguments);
			
			// Add Layout
			this.Layout = new BorderContainer({ gutters:false, style:'height:130px;width:280px;' });
			this.addChild(this.Layout);	
			
			// Create TableContainer
			var table = new TableContainer({ cols: 1, showLabels: true, orientation: 'horiz', region: 'top' });
			this.Layout.addChild(table);
			
			// Add Database 
			var dataStore = Memory({data: []});
			this.Database = new ComboBox({ store: dataStore, title: 'Database' });
			table.addChild(this.Database);
			
			// Add Standby for Database
			this.Standby = new Standby({target: this.Database.id});
			document.body.appendChild(this.Standby.domNode);
			this.Standby.startup();
			this.Standby.show();
			
			// Add Username
			this.Username = new TextBox({ title: 'Username' });
			table.addChild(this.Username);
			
			// Add Password
			this.Password = new TextBox({ type: 'password', title: 'Password' });
			table.addChild(this.Password);
							
			// Add Login Button
			this.LoginButton = new Button({label: 'Login', region: 'right', style: 'padding-right:5px;'});
			this.Layout.addChild(this.LoginButton);
			
			this.LoginButton.set('onClick', lang.hitch(this, this._login));
	
			// Add Cancel Button
			this.CancelButton = new Button({label: 'Cancel', region: 'right'});
			this.Layout.addChild(this.CancelButton);
			
			this.CancelButton.set('onClick', lang.hitch(this, function() {
				
				// Clear Password
				this.Password.set('value', '');
				
				// Reset Error Message
				this._errorMessage('');
				
				// Hide Login Widget
				this.hide();	
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

			// Display Error Message
			var message = ErrorDialog({ Message: message });
			message.show();
		}

	});
});