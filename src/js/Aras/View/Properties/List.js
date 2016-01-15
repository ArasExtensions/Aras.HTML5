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
	'dojo/_base/array',
	'../Property',
	'dijit/form/Select'
], function(declare, lang, array, Property, Select) {
	
	return declare('Aras.View.Properties.List', [Select, Property], {
		
		_viewModelValueLoadedHandles : null,
		
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Remove existing watch handles
			
			if (this._viewModelValueLoadedHandles != null)
			{
				array.forEach(this._viewModelValueLoadedHandles, function(watchhandle, i) {
					watchhandle.unwatch();
				}, this);
				
				this._viewModelValueLoadedHandles.destroy();
			}
			
			if (this.ViewModel != null)
			{
				// Check if values are loaded
				var allloaded = true;
				this._viewModelValueLoadedHandles = [];
				
				array.forEach(this.ViewModel.Values, function(valueviewmodel, i) {
					
					if (!valueviewmodel.Loaded)
					{
						allloaded = false;
						
						this._viewModelValueLoadedHandles[i] = valueviewmodel.watch('Loaded', lang.hitch(this, function(name, oldValue, newValue) {
					
							if (newValue)
							{
								// Add Options
								this._addOptions();
							}
					
						}));
					}
					
				}, this);

				if (allloaded)
				{
					// Add Options
					this._addOptions();
				}
			}
		},
		
		_addOptions: function()
		{
			// Load List Values if all loaded
			var allloaded = true;
			var options = [];
			
			array.forEach(this.ViewModel.Values, function(valueviewmodel, i) {
			
				if (valueviewmodel.Loaded)
				{
					if (this.ViewModel.Value == valueviewmodel.Value)
					{
						options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value, selected: true };
					}
					else
					{
						options[i] = { label: valueviewmodel.Label, value: valueviewmodel.Value };
					}
				}
				else
				{
					allloaded = false;
					options[i] = null;
				}

			}, this);
			
			if (allloaded)
			{				
				// Add Options
				this.addOption(options);
				
				// Watch for change in Select Value
				this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
					
					if (newValue !== this.ViewModel.Value)
					{
						this.ViewModel.Value = newValue;
						this.ViewModel.Write();
					}
					
				}));				
				

			}
		}

	});
});