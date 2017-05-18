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
	'./Control'
], function(declare, lang, Control) {
	
	return declare('Aras.View.Property', [Control], {
			
		_viewModelEnabledHandle: null,
		
		_updateFromViewModel: null,
		
		_startup: function() {
			this.inherited(arguments);

			// Default UpdateFromViewModel
			this._updateFromViewModel = false;
			
			// Prevent default dehaviour when Property is ReadOnly
			this.on('keydown', lang.hitch(this, function(event){
				
				if (this.readOnly)
				{
					event.preventDefault();
				}
				
			}));
			
			this._updateProperty();
		},
		
		_destroy: function() {
			this.inherited(arguments);
			
			if (this._viewModelEnabledHandle != null)
			{
				this._viewModelEnabledHandle.unwatch();
			}
		},
		
		_updateProperty: function() {
			
			if (this.ViewModel != null)
			{	
				// Set Label
				this.set('title', this.ViewModel.Label);

				// Set ReadOnly
				this.set("readOnly", !this.ViewModel.Enabled);
				
				// Set IntermediateChanges
				this.set("intermediateChanges", this.ViewModel.IntermediateChanges);
				
				// Watch for changes in ViewModel Enabled
				if (this._viewModelEnabledHandle != null)
				{
					this._viewModelEnabledHandle.unwatch();
				}
			
				this._viewModelEnabledHandle = this.ViewModel.watch('Enabled', lang.hitch(this, function(name, oldValue, newValue) {
					
					// Set Value
					this.set("readOnly", !this.ViewModel.Enabled);	
				}));
			}
		},
		
		OnViewModelChanged: function() {
			this.inherited(arguments);
						
			this._updateProperty();
		}

	});
});