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
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/Stateful'
], function(declare, array, lang, Stateful) {
	
	return declare('Aras.ViewModel.Control', [Stateful], {
		
		Session: null,
		
		Data: null,
		
		ID: null,
		
		Type: null,
				
		constructor: function(Session, Data) {
			
			this.Session = Session;
			this.ID = Data.ID;
			this.Type = Data.Type;
			this.Data = Data;
			
			// Read Data
			this._readData();
			
			// Watch for Data Updates
			this.watch('Data', lang.hitch(this, function(name, oldValue, newValue) {
				this._readData();
			}));
		},
		
		_readData: function() {
						
			// Process Properties
			array.forEach(this.Data.Properties, function(property){
				
				if (property.Values != null)
				{
					switch(property.Type)
					{
						case 0:
						
							// Boolean
							
							if (property.Values[0] == '1')
							{
								this.set(property.Name, true);
							}
							else
							{
								this.set(property.Name, false);
							}
							
							break;
						case 1:
						
							// Int32
							
							if (property.Values[0] != null)
							{
								this.set(property.Name, parseInt(property.Values[0]));
							}
							else
							{
								this.set(property.Name, null);
							}
							
							break;
							
						case 2:
						
							// String
							this.set(property.Name, property.Values[0]);
							break;
							
						case 3:
						
							// Control
							this.set(property.Name, this.Session.Control(property.Values[0]));
							
							break;
							
						case 4:
						
							// Control List
							var valuelist = [];
				
							array.forEach(property.Values, function(value) {
								valuelist.push(this.Session.Control(value));
							}, this);

							this.set(property.Name, valuelist);
						
							break;
							
						case 5:
						
							// NullableInt32
							if (property.Values[0] == null)
							{
								this.set(property.Name, null);
							}
							else
							{
								this.set(property.Name, parseInt(property.Values[0]));
							}
							
							break;
						
						case 6:
						
							// Float
							this.set(property.Name, Number(property.Values[0]));
							break;
						
						case 7:
						
							// String List
							this.set(property.Name, property.Values);
						
							break;
	
						case 8:
						
							// Date
							if (property.Values[0] == null)
							{
								this.set(property.Name, null);
							}
							else
							{
								this.set(property.Name, new Date(property.Values[0]));
							}
						
							break;
						case 9:
						
							// Decimal
							if (property.Values[0] == null)
							{
								this.set(property.Name, null);
							}
							else
							{
								this.set(property.Name, new Number(property.Values[0]));
							}
						
							break;	
						case 10:
						
							// Command
							this.set(property.Name, this.Session.Command(property.Values[0]));
							
							break;							
						default:
							console.debug('Property Type not implemented: ' + property.Type);
							break;
					}
				}
				else
				{
					this.set(property.Name, null);
				}

			}, this);
		
			// Remove ReadOnly Properties, these will never be written back to Server
			this.Data.Properties = array.filter(this.Data.Properties, function(property) {
				
				if (!property.ReadOnly)
				{
					return true;
				}
				
			}, this);
			
			// Remove Commands, these are never written back to Server
			delete this.Data.Commands;
			
			// Delete Type, not needed by Server
			delete this.Data.Type;
		},
	
		Read: function() {
		
			this.Session._readControl(this);
		},
		
		Write: function() {
			
			this._writeData();
			this.Session._writeControl(this);
		},
		
		_writeData: function() {
			
			array.forEach(this.Data.Properties, function(property, i){
					
				if (property.Type == 0)
				{
					if (this.get(property.Name))
					{
						property.Values[0] = '1';
					}
					else
					{
						property.Values[0] = '0';
					}
				}
				else if (property.Type == 3)
				{
					// Reset Values
					property.Values = [];
					
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
					property.Values = [];
				
					array.forEach(property.Values, function(value, i) {
							
						if (this.get(property.Name)[i] == null)
						{
							property.Values[i] = null;
						}
						else
						{
							property.Values[i] = this.get(property.Name)[i].ID;
						}
						
					}, this);
				}
				else if (property.Type == 8)
				{
					// Date
					property.Values = [];
					
					var datevalue = this.get(property.Name);
					
					if (datevalue == null)
					{
						property.Values[0] = null;
					}
					else
					{
						property.Values[0] = datevalue.toISOString();
					}
				}
				else
				{						
					// Set Value
					property.Values = [];
					property.Values[0] = this.get(property.Name);
				}

			}, this);
		}
		
	});
	
});