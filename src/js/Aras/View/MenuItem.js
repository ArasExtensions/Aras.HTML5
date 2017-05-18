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
	'dijit/MenuItem',
	'./Control'
], function(declare, lang, MenuItem, Control) {
	
	return declare('Aras.View.MenuItem', [MenuItem, Control], {
	
		_canExecuteHandle: null,
		
		constructor: function() {
		
		},
		
		startup: function() {
			this.inherited(arguments);
	
			// Disable Button
			this.SetEnabled(false);
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			if (this._canExecuteHandle)
			{
				this._canExecuteHandle.unwatch();
			}
		},
		
		SetEnabled: function(Enabled) {
		
			if (Enabled)
			{
				this.set('disabled', false);
			}
			else
			{
				this.set('disabled', true);
			}
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
			
			if (this.ViewModel != null)
			{
				// Link Click Event
				this.set('onClick', lang.hitch(this, function() {
					this.SetEnabled(false);
					this.ViewModel.Execute();
				}));
			
				// Set Enabled
				this.SetEnabled(this.ViewModel.CanExecute);
			
				// Watch for changes in CanExecute
				if (this._canExecuteHandle)
				{
					this._canExecuteHandle.unwatch();
				}
				
				this._canExecuteHandle = this.ViewModel.watch('CanExecute', lang.hitch(this, function(name, oldValue, newValue) {
					this.SetEnabled(newValue);
				}));
			}
		}
	
	});
});