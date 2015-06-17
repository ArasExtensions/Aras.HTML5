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
	'./Control'
], function(declare, lang, Control) {
	
	return declare('Aras.View.Cell', [Control], {
		
		Column: null,
		
		Row: null,
		
		Value: null,
		
		Node: null,
		
		_valueHandle: null,
						
		constructor: function() {
			this.inherited(arguments);
			
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
						
			// Unwatch current ViewModel
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
			
			if (this.ViewModel != null)
			{
				// Set Value
				this._setValue(this.ViewModel.get('Value'));
			
				// Watch for changes in Value on ViewModel
				this._valueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnValueChange));
			}
		},
		
		OnValueChange: function(name, oldValue, newValue) {
	
			if (oldValue != newValue)
			{
				// Set new Value
				this._setValue(newValue);
			}
		},
		
		_setValue: function(Value) {
			
			if (this.Value)
			{
				this.Value.set('value', Value);
			}
			else
			{
				this.Node.innerHTML = Value;
			}
			
		}
		
	});
});