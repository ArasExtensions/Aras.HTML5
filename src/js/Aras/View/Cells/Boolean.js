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
	'../Cell',
	'dijit/form/CheckBox'
], function(declare, lang, Cell, CheckBox) {
	
	return declare('Aras.View.Cells.Boolean', [CheckBox, Cell], {
		
		_valueHandle: null,

		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
			
			this._updateBoolean();
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			// Call Control Destroy
			this._destroy();
			
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_updateBoolean: function() {

			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
				
			if (this.ViewModel != null)
			{
				// Set Value from ViewModel
				this.set("checked", this.ViewModel.Value);
			
				// Watch for changes in Control value
				this._valueHandle = this.watch('checked', lang.hitch(this, function(name, oldValue, newValue) {
				
					if (oldValue !== newValue)
					{										
						if (!this._updateFromViewModel)
						{
							// Update ViewModel Value
							
							if (newValue)
							{
								this.ViewModel.set('UpdateValue', "1");
							}
							else
							{
								this.ViewModel.set('UpdateValue', "0");
							}
							
							this.ViewModel.Write();
						}
					}
	
				}));
			}
			else
			{
				this.set("checked", false);
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update Boolean
			this._updateBoolean();	
		}

	});
});