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
	'dojo/request',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/json',
	'dojo/when',
	'./Control'
], function(declare, request, lang, array, json, when, Control) {
	
	return declare('Aras.ViewModel.Session', null, {
		
		Database: null, 
		
		Username: null,
		
		Password: null,
		
		_controlCache: new Object(),
		
		_commandCache: new Object(),
		
		constructor: function(args) {
			declare.safeMixin(this, args);
		},
		
		_processResponse: function(Response) {
			
			// Update Controls
			array.forEach(Response.ControlQueue, lang.hitch(this, function(control) {
				this._updateControl(control);
			}));
					
			// Update Commands
			array.forEach(Response.CommandQueue, lang.hitch(this, function(command) {
				
				if (this._commandCache[command.ID])
				{
					this._commandCache[command.ID].set('CanExecute', command.CanExecute);
				}
			}));	
		},
				
		_updateControl: function(ControlResponse) {	
			
			if (this._controlCache[ControlResponse.ID])
			{
				// Update Existing Control
				when(this._controlCache[ControlResponse.ID], lang.hitch(this, function(control) {
					control.set('Data', ControlResponse);
				}));
			}
			else
			{
				// Does not exist, Create new Control
				this._createControl(this, ControlResponse);
			}
		},
		
		_createControl: function(ControlResponse) {
			
			// Create Control and add to Cache
			this._controlCache[ControlResponse.ID] = new Control(this, ControlResponse);
				
			// Add Commands to Cache
			for (commandname in this._controlCache[ControlResponse.ID].Commands)
			{
				this._commandCache[this._controlCache[ControlResponse.ID].Commands[commandname].ID] = this._controlCache[ControlResponse.ID].Commands[commandname];
			}
			
			return this._controlCache[ControlResponse.ID];
		},
		
		Applications: function() {
				return request.get(this.Database.Server.URL + '/applications', 
							   { headers: {'Accept': 'application/json'}, 
								 handleAs: 'json'
							   }).then(
				lang.hitch(this, function(result) {
					
					// Process Applications
					var ret = [];
			
					array.forEach(result.Values, lang.hitch(this, function(entry) {
						ret.push(this._createControl(entry));
					}));
					
					// Process Response
					this._processResponse(result);
					
					return ret;
				})
			);
		},
		
		Control: function(ID) {
			
			if (!this._controlCache[ID])
			{
				this._controlCache[ID] = request.get(this.Database.Server.URL + '/controls/' + ID, 
							   { headers: {'Accept': 'application/json'}, 
								 handleAs: 'json'
							   }).then(lang.hitch(this, function(result) {
								   
						// Process Control
						var ret = this._createControl(result.Value);
						
						// Process Response
						this._processResponse(result);
						
						return ret;
					})
				);
			}
	
			return this._controlCache[ID];
		},
				
		Execute: function(Command) {
			
			// Execute Command
			request.put(this.Database.Server.URL + '/commands/' + Command.ID + '/execute', 
								{ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
								  handleAs: 'json'
								}).then(lang.hitch(this, function(response){
					this._processResponse(response);
				})
			);				
		},
		
		UpdateControl: function(Control) {
			
			// Update Control Data
			Control._updateData();
			
			// Send to Server
			request.put(this.Database.Server.URL + '/controls/' + Control.ID, 
								{ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, 
								  handleAs: 'json',
								  data: json.stringify(Control.Data)
								}).then(lang.hitch(this, function(response){
					this._processResponse(response);
				})
			);				
		}
		
	});
});