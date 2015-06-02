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
		
		ID: null,
		
		Type: null,
		
		constructor: function(args) {
			this.Session = args.Session;
			this.ID = args.ID;
			this.Type = args.Type;
			
			// Add Properties
			this._updateProperties(args.Properties);
			
			// Add Commands
			this._updateCommands(args.Commands);
		},
		
		_updateProperties: function(Properties) {
			
			array.forEach(Properties, lang.hitch(this, function(property){
				
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
		
		_updateCommands: function(Commands) {
			
			array.forEach(Commands, lang.hitch(this, function(command){
				
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