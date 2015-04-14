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
	'./Property',
	'./Command',
], function(declare, array, lang, Property, Command) {
	
	return declare('Aras.ViewModel.Control', null, {
		
		Session: null,
		
		ID: null,
		
		Type: null,
		
		Properties: null,
		
		Commands: null,
		
		constructor: function(args) {
			this.Session = args.Session;
			this.ID = args.ID;
			this.Type = args.Type;
			
			// Add Properties
			this.Properties = new Object();
			
			array.forEach(args.Properties, lang.hitch(this, function(property){
				property.Control = this;
				this.Properties[property.Name] = new Property(property);
			}));
			
			// Add Commands
			this.Commands = new Object();
			
			array.forEach(args.Commands, lang.hitch(this, function(command){
				command.Control = this;
				this.Commands[command.Name] = new Command(command);
			}));			
		}
	});
});