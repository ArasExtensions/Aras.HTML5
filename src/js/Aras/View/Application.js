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
	'dojo/_base/array',
	'./Login',
	'./ErrorDialog',
	'../ViewModel/Server'
], function(declare, lang, array, Login, ErrorDialog, Server) {
	
	return declare('Aras.View.Application', null, {
		
		URL: null,
		
		Database: null,
		
		Username: null,
		
		Password: null,
		
		Name: null,
		
		Server: null,
		
		Login: null,
				
		constructor: function(args) {
			
		},
		
		Initialise: function() {
			
			// Create Server
			this.Server = new Server({ URL: this.URL });
			
			// Watch for Errors
			this.Server.watch('InError', lang.hitch(this, this._displayServerError));
			
			if ((this.Database != null) && (this.Username != null) && (this.Password != null))
			{				
				// Get Database
				this.Server.Database(this.Database).then(lang.hitch(this, function(database) {
		
					// Login
					database.Login(this.Username, this.Password).then(lang.hitch(this, function(session){

						// Get Application ViewModel
						session.Application(this.Name).then(lang.hitch(this, function(application){ 
								
							// Set ViewModel
							this.set("ViewModel", application);
										
						}));
					}));
				}));
			}
			else
			{
				// Interactive Login
				
				if (this.Login == null)
				{
					this.Login = new Login({Application: this, title: 'Aras Innovator Login'});
					this.Login.startup();
				}
				
				this.Login.show();
			}
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