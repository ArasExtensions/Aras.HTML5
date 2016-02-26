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
	'dijit/Dialog',
	'dijit/form/ComboBox',
	'dijit/form/TextBox',
	'dijit/layout/ContentPane',
	'dijit/layout/BorderContainer',
	'dojo/store/Memory'
], function(declare, lang, dom, domconstruct, Dialog, ComboBox, TextBox, ContentPane, BorderContainer, Memory) {
	
	return declare('Aras.View.Login', [Dialog], {
		
		Application: null,
		
		Database: null,
		
		Username: null,
		
		Password: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
		},
		
		startup: function() {
			this.inherited(arguments);
									
			// Get Database
			this.Application.Server.Databases().then(lang.hitch(this, function(databases) {
				
				// Create Layout
				var layout = new ContentPane({content: '<table><tr><td>Database:</td><td id="logindatabase"></td></tr><tr><td>Username:</td><td id="loginusername"></td></tr><tr><td>Password:</td><td id="loginpassword"></td></tr></table>'});
				this.addChild(layout);

				// Add Databases
				var data = [];
				
				for(i=0; i<databases.length; i++)
				{
					data.push({id: databases[i].ID, name: databases[i].Name});
				}
				
				var databasetarget = dom.byId('logindatabase');	
				var dataStore = Memory({data: data});
				this.Database = new ComboBox({store: dataStore}, databasetarget);
				this.Database.startup();
				
				// Add Username
				var usernametarget = dom.byId('loginusername');	
				this.Username = new TextBox({}, usernametarget);
				this.Username.startup();
			
				// Add Password
				var passwordtarget = dom.byId('loginpassword');	
				this.Password = new TextBox({type: 'password'}, passwordtarget);
				this.Password.startup();	
			
			}));
				

			

		
			

			
		}
		

	});
});