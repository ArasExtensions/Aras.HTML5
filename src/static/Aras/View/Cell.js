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
	'dojo/when',
	'./Control'
], function(declare, lang, when, Control) {
	
	return declare('Aras.View.Cell', [Control], {
		
		Row: null,
		
		Value: null,
		
		_valueHandle: null,
		
		constructor: function() {
			this.inherited(arguments);
		},
		
		OnViewModelChange: function(name, oldValue, newValue) {
			this.inherited(arguments);
				
			// Unwatch current ViewModel
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
			
			// Set Value
			this.Value = newValue.Value;
			
			// Watch for changes in Value on ViewModel
			this._valueHandle = newValue.watch("Value", lang.hitch(this, this.OnValueChange));	
		},
		
		OnValueChange: function(name, oldValue, newValue) {
		
			this.Value = newValue;
			this.Row.Grid._refreshRows();
		}
		
	});
});