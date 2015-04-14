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
	'./Control'
], function(declare, request, lang, array, Control) {
	
	return declare('Aras.ViewModel.Session', null, {
		
		Database: null, 
		
		Username: null,
		
		Password: null,
		
		_controlCache: new Object(),
		
		_propertyCache: new Object(),
		
		_commandCache: new Object(),
		
		constructor: function(args) {
			declare.safeMixin(this, args);
		},
		
		_processResponse: function(Response) {
			
			// Update Properties
			array.forEach(Response.PropertyQueue, lang.hitch(this, function(property) {
				
				if (this._propertyCache[property.ID])
				{
					this._propertyCache[property.ID]._processValues(property.Values);
				}
			}));
					
			// Update Commands
			array.forEach(Response.CommandQueue, lang.hitch(this, function(command) {
				
				if (this._commandCache[command.ID])
				{
					this._commandCache[command.ID].set('CanExecute', command.CanExecute);
				}
			}));	
		},
		
		_processControl: function(ControlResponse) {
			
			ControlResponse['Session'] = this;
			this._controlCache[ControlResponse.ID] = new Control(ControlResponse);

			// Add Properties to Cache
			for (propertyname in this._controlCache[ControlResponse.ID].Properties)
			{
				this._propertyCache[this._controlCache[ControlResponse.ID].Properties[propertyname].ID] = this._controlCache[ControlResponse.ID].Properties[propertyname];
			}
				
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
						ret.push(this._processControl(entry));
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
						var ret = this._processControl(result.Value);
						
						// Process Response
						this._processResponse(result);
						
						return ret;
					})
				);
			}
	
			return this._controlCache[ID];
		}
	});
});