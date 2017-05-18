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
	'dojo/on',
	'../Cell',
	'dijit/form/NumberTextBox'
], function(declare, lang, on, Cell, NumberTextBox) {
	
	return declare('Aras.View.Cells.Float', [NumberTextBox, Cell], {
		
		_valueHandle: null,
		
		constructor: function() {

		},
		
		startup: function() {
			this.inherited(arguments);

			// Call Control Startup
			this._startup();
			
			this._updateFloat();				
		},
		
		destroy: function() {
			this.inherited(arguments);	
			
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
		},
				
		_updateFloat: function() {
			
			if (this.ViewModel != null)
			{
				// Set Min and Max Values
				//this.set("constraints", {min: this.ViewModel.MinValue, max: this.ViewModel.MaxValue});
			
				// Set Value
				this.set("value", this.ViewModel.Value);

				if (this._valueHandle)
				{
					this._valueHandle.unwatch();
				}
				
				// Watch for changes in Control value
				this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
		
					if (isNaN(newValue))
					{
						// Not a valid number, reset to old value
						this.set("value", oldValue);
					}
					else
					{
						var newnumber = Number(newValue);
						var currentnumber = Number(this.ViewModel.get('Value'));
				
						if (currentnumber !== newnumber)
						{	
							if (!this._updateFromViewModel)
							{
								// Update ViewModel Value
								this.ViewModel.set('UpdateValue', newnumber);	
								this.ViewModel.Write();
							}
						}
					}
				}));
			}
			else
			{
				this.set("value", null);
				
				if (this._valueHandle)
				{
					this._valueHandle.unwatch();
				}				
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update Float
			this._updateFloat();	
		}

	});
});