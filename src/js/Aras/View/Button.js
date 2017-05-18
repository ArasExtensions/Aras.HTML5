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
	'dojo/when',
	'dijit/form/Button',
	'./Control'
], function(declare, lang, when, Button, Control) {
	
	return declare('Aras.View.Button', [Button, Control], {
		
		_savedIconClass: null,
		
		_canExecuteHandle: null,
				
		startup: function() {

			if(!this._started)
			{
				// Call Control Startup
				this._startup();
			
				// Update Button
				this._updateButton();
			}
			
			this.inherited(arguments);
		},
		
		destroy: function() {
			this.inherited(arguments);

			// Call Control Destroy
			this._destroy();
			
			if (this._canExecuteHandle)
			{
				this._canExecuteHandle.unwatch();
			}
		},
		
		SetEnabled: function(Enabled) {
			
			if (Enabled)
			{
				this.set('disabled', false);
				this.set('iconClass', this._savedIconClass);
			}
			else
			{
				this.set('disabled', true);
				this.set('iconClass', this._savedIconClass + ' disableIcon');
			}
		},
		
		_updateButton: function() {
			
			if (this.ViewModel != null)
			{
				// Set IconClass
				this.set("iconClass", "medium" + this.ViewModel.Icon + "Icon");
			
				// Store IconClass
				this._savedIconClass = this.iconClass;
			
				// Link Click Event
				this.set('onClick', lang.hitch(this, function() {
					this.SetEnabled(false);
					this.ViewModel.Command.Execute();
				}));
			
				// Set Enabled
				this.SetEnabled(this.ViewModel.Command.CanExecute);
			
				// Watch for changes in CanExecute
				if (this._canExecuteHandle)
				{
					this._canExecuteHandle.unwatch();
				}
					
				this._canExecuteHandle = this.ViewModel.Command.watch('CanExecute', lang.hitch(this, function(name, oldValue, newValue) {
					this.SetEnabled(newValue);
				}));
			}
			else
			{
				// Store IconClass
				this._savedIconClass = this.iconClass;
			}
		},
		
		OnViewModelChanged: function() {
			this.inherited(arguments);
			
			this._updateButton();
		}
	});
});