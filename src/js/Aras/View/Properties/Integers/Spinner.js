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
	'../../Property',
	'dijit/form/NumberSpinner'
], function(declare, lang, on, Property, NumberSpinner) {
	
	return declare('Aras.View.Properties.Integers.Spinner', [NumberSpinner, Property], {
		
		_viewModelValueHandle: null,
		
		_valueHandle: null,
				
		startup: function() {
			this.inherited(arguments);

			// Call Property Startup
			this._startup();
			
			this._updateSpinner();
		},

		destroy: function() {
			this.inherited(arguments);	

			// Call Property Destroy
			this._destroy();
			
			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_mouseWheeled: function(evt){
			
			// Disable change on scroll wheel
			evt.stopPropagation();
			evt.preventDefault();
		},
		
		_updateSpinner: function() {
	
			if (this.ViewModel != null)
			{
				// Set Value from ViewModel
				this.set("value", this.ViewModel.Value);
			
				// Watch for changes in Control value
				if (!this._valueHandle)
				{
					this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
				
						if (isNaN(newValue))
						{
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
									this.ViewModel.set('Value', newnumber);
									this.ViewModel.Write();
								}
							}
						}
					
					}));
				}
			
				// Watch for changes in ViewModel
				if (!this._viewModelValueHandle)
				{
					this._viewModelValueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {
					
						if (newValue)
						{
							// Stop ViewModel Update
							this._updateFromViewModel = true;
					
							// Set Value
							this.set("value", this.ViewModel.Value);
					
							// Start ViewModel Update
							this._updateFromViewModel = false;
						}

					}));
				}
			}
			else
			{
				this.set("value", null);
			
				if (this._valueHandle != null)
				{
					this._valueHandle.unwatch();
				}
			
				if (this._viewModelValueHandle != null)
				{
					this._viewModelValueHandle.unwatch();
				}
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update String
			this._updateSpinner();	
		}

	});
});