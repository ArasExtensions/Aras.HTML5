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
	'dojo/_base/array',
	'dijit/layout/BorderContainer',
	'../Container',
	'../ErrorDialog',
	'../../ViewModel/Server'
], function(declare, lang, array, BorderContainer, Container, ErrorDialog, Server) {
	
	return declare('Aras.View.Plugin', [BorderContainer, Container], {
		
		URL: null,
		
		DatabaseID: null,
		
		Username: null,
		
		Password: null,
		
		Name: null,
		
		TopAras: null,
		
		Context: null,
		
		Server: null,
		
		constructor: function() {
		
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Container Startup
			this._startup();
			
			// Set defaults for Tooltips
			dijit.Tooltip.defaultPosition = ['above', 'below'];
			
			// Check for Top Aras and update connection parameters
			if (this.TopAras != null)
			{
				this.DatabaseID = this.TopAras.commonProperties.database;
				this.Username = this.TopAras.commonProperties.loginName;
				this.Password = this.TopAras.commonProperties.password;
			}
			
			// Create Server
			this.Server = new Server({ URL: this.URL });
			
			// Watch for Errors
			this.Server.watch('InError', lang.hitch(this, this._displayServerError));
			
			// Get Database
			this.Server.Database(this.DatabaseID).then(lang.hitch(this, function(database) {
		
				// Login
				database.Login(this.Username, this.Password).then(lang.hitch(this, function(session){

					// Get Application ViewModel
					session.Plugin(this.Name, this.Context).then(lang.hitch(this, function(plugin){ 
								
						// Set ViewModel
						this.set("ViewModel", plugin);

						if (plugin.InError)
						{
							// Display Error
							this._displayPluginError();
						}
						else
						{
							// Add Children
							this._addChildren();					
						}
				
						// Watch for Errors
						plugin.watch('InError', lang.hitch(this, function(name, oldValue, newValue) {
							
							if (newValue)
							{
								this._displayPluginError();
							}
						}));
					}));
				}));
			}));
		},
		
		Refresh: function() {
		
			if (this.ViewModel != null)
			{
				this.ViewModel.Refresh.Execute();
			}
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			// Call Container Destroy
			this._destroy();
		},
		
		_displayServerError: function() {
			
			if (this.Server != null)
			{
				if (this.Server.InError)
				{
					// Prepare Message Text
					var messagetext = this.Server.ErrorMessage;
					
					if (this.Server.ErrorCode == 0)
					{
						messagetext = 'Unable to connect to Innovator Server';
					}
					
					// Display Error Message
					var message = ErrorDialog({ Message: messagetext });
					message.show();
				
					// Reset Error
					this.Server.ResetError();
				}
			}
		},
		
		_displayPluginError: function() {
			
			if (this.ViewModel != null)
			{
				if (this.ViewModel.InError)
				{
					// Display Error Message
					var errordialog = new ErrorDialog({ ErrorMessage: this.ViewModel.ErrorMessage });
					errordialog.show();
					
					// Reset Error
					this.ViewModel.InError = false;
				}
			}
		}
		
	});
});