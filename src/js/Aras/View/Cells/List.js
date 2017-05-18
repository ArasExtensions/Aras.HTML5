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
	'../Cell',
	'dijit/form/Select'
], function(declare, lang, array, Cell, Select) {
	
	return declare('Aras.View.Cells.List', [Select, Cell], {
		
		_valueHandle: null,
	
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
	
			// Call Control Startup
			this._startup();
		},
		
		destroy: function() {
			this.inherited(arguments);	
			
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			if (this.ViewModel != null)
			{
				// Load Options
				this.options = [];
					
				array.forEach(this.ViewModel.Values, function(valueviewmodel, i) {
			
					if (this.ViewModel.Value == valueviewmodel.Value)
					{
						this.options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value, selected: true };
					}
					else
					{
						this.options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value };
					}
				}, this);					
				
				this._loadChildren();
					
				if (this._valueHandle != null)
				{
					this._valueHandle.unwatch();
				}
				
				// Watch for change in Select Value
				this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
					
					// Update ViewModel
					this.ViewModel.UpdateValue = newValue;			
				}));
			}
		}

	});
});