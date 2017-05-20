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
	'Aras/ViewModel/Server'
], function(declare, lang, Server) {
	
	return declare('Aras.Test.Session.Test', null, {
		
		URL: null,
		
		DatabaseID: null,
		
		Username: null,
		
		Password: null,
		
		constructor: function(args) {
			declare.safeMixin(this, args);
		},
		
		Execute: function() {
			
			// Create Server
			var server = new Server({ URL: this.URL });
			
			// List all Databases
			server.Databases().then(
				function(databases) {
					console.log(databases);
				});
				
			// Get Database
			server.Database(this.DatabaseID).then(
				lang.hitch(this, function(database) {
					console.log(database);
					
					// Login
					database.Login(this.Username, this.Password).then(lang.hitch(this, function(session){
							console.log(session);
							session.Applications().then(function(result){ console.log(result);});
						})
					);
				})
			);
		}
	});
});