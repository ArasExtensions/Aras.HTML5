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
	'../Property',
	'dijit/form/Select'
], function(declare, lang, array, Property, Select) {
	
	return declare('Aras.View.Properties.List', [Select, Property], {
		
		_viewModelValueHandle: null,
		
		_valueHandle: null,
	
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
	
			// Call Control Startup
			this._startup();
			
			this._updateList();
		},
		
		destroy: function() {
			this.inherited(arguments);	

			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_updateList: function() {
			
			if (this.ViewModel != null)
			{
				// Load Options
				var options = [];
					
				array.forEach(this.ViewModel.Values, function(valueviewmodel, i) {
			
					if (this.ViewModel.Value == valueviewmodel.Value)
					{
						options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value, selected: true };
					}
					else
					{
						options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value };
					}
				}, this);					
					
				this.addOption(options);
					
				// Watch for change in Select Value
				if (!this._valueHandle)
				{
					this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
					
						if (newValue !== this.ViewModel.Value)
						{
							if (!this._updateFromViewModel)
							{
								// Update ViewModel
								this.ViewModel.Value = newValue;
								this.ViewModel.Write();
							}
						}	
					}));
				}
			
				// Watch for change in ViewModel Value
				if (!this._viewModelValueHandle)
				{
					this._viewModelValueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {
								
						// Stop ViewModel Update
						this._updateFromViewModel = true;
					
						if (newValue)
						{
							// Set Value
							this.set('value', newValue);
						}
						else
						{
							this.reset();
						}
						
						// Start ViewModel Update
						this._updateFromViewModel = false;
					}));
				}
			}
			else
			{
				// Unwatch for change in Select Value
				if (this._valueHandle != null)
				{
					this._valueHandle.unwatch();
				}
				
				// Unwatch for change in ViewModel Value
				if (this._viewModelValueHandle != null)
				{
					this._viewModelValueHandle.unwatch();
				}
				
				this.addOption([]);
				
				// Set Value
				this.set('value', null);
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update List
			this._updateList();	
		}

	});
});