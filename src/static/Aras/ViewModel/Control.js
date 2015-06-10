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
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/Stateful',
	'./Command',
], function(declare, array, lang, Stateful, Command) {
	
	return declare('Aras.ViewModel.Control', [Stateful], {
		
		Session: null,
		
		Data: null,
		
		ID: null,
		
		Type: null,
		
		constructor: function(Session, Data) {

			// Set Session
			this.set('Session', Session);

			// Watch for Data Updates
			this.watch('Data', lang.hitch(this, function(name, oldValue, newValue) {
				
				// Set ID
				this.set('ID', this.Data.ID);
				
				// Set Type
				this.set('Type', this.Data.Type);
			
				// Add Properties
				this._updateProperties();
			
				// Add Commands
				this._updateCommands();
			}));
			
			// Set Data
			this.set('Data', Data);
		},
		
		_updateProperties: function() {
			
			array.forEach(this.Data.Properties, lang.hitch(this, function(property){
				
				if (property.Values != null)
				{
					if (property.Type == 3)
					{
						// Get Control from Cache
						this.set(property.Name, this.Session.Control(property.Values[0]));
					}
					else if (property.Type == 4)
					{
						// Get List of Controls from Cache
						var valuelist = [];
				
						array.forEach(property.Values, lang.hitch(this, function(value) {
							valuelist.push(this.Session.Control(value));
						}));

						this.set(property.Name, valuelist);
					}
					else
					{
						// Set Value
						this.set(property.Name, property.Values[0]);
					}
				}
				else
				{
					this.set(property.Name, null);
				}

			}));
		},
	
		_updateData: function() {
			
			array.forEach(this.Data.Properties, lang.hitch(this, function(property, i){
				
				console.debug(property.Values);
				
				if (property.Values != null)
				{
					if (property.Type == 3)
					{
						// Update Control ID
			
						if (this.get(property.Name) == null)
						{
							property.Values[0] = null;
						}
						else
						{
							property.Values[0] = this.get(property.Name).ID;
						}
					}
					else if (property.Type == 4)
					{
						// Get List of Controls from Cache
						var valuelist = [];
				
						array.forEach(property.Values, lang.hitch(this, function(value, i) {
							
							if (this.get(property.Name)[i] == null)
							{
								property.Values[i] = null;
							}
							else
							{
								property.Values[i] = this.get(property.Name)[i].ID;
							}
						}));
					}
					else
					{						
						// Set Value
						property.Values[0] = this.get(property.Name);
					}
				}

			}));
		},
		
		_updateCommands: function() {
			
			array.forEach(this.Data.Commands, lang.hitch(this, function(command){
				
				if (this[command.Name])
				{
					this[command.Name].set('CanExecute', command.CanExecute);
				}
				else
				{
					command.Control = this;
					this.set(command.Name, new Command(command));
				}
			}));
		}
		
	});
	
});