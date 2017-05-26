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
	'dojo/_base/array',
	'dojo/Stateful',
	'dojo/_base/lang',
	'dijit/Tooltip'
], function(declare, array, Stateful, lang, Tooltip) {
	
	return declare('Aras.View.Control', [Stateful], {
		
		ViewModel: null, 
		
		_viewModelHandle: null,
		
		_errorMessageHandle: null,
		
		_toolTip: null,
		
		_toolTipHandle: null,
		
		_dialogsCache: new Object(),
		
		_dialogsHandle: null,
				
		_startup: function() {

			// Update Control
			this._updateControl();
			
			// Watch ViewModel
			this._viewModelHandle = this.watch("ViewModel", lang.hitch(this, this.OnViewModelChanged));
		},
	
		_destroy: function() {
	
			if (this._viewModelHandle)
			{
				this._viewModelHandle.unwatch();
			}
			
			if (this._inErrorHandle)
			{
				this._inErrorHandle.unwatch();
			}
		},
		
		_updateControl: function() {
			
			if(this.ViewModel != null)
			{	
				if (this.ViewModel.Tooltip != null)
				{
					if (!this._toolTip)
					{
						// Create Tooltip
						this._toolTip = new Tooltip({ connectId: this.id, label: this.ViewModel.Tooltip });
					}
					else
					{
						// Update Tooltip
						this._toolTip.set('label', this.ViewModel.Tooltip);
					}
				}
				else
				{
					// Destroy Tooltip
					if (this._toolTip)
					{
						this._toolTip.destroyRecursive();
						this._toolTip = null;
					}
				}
				
				// Watch Tooltip
				if (!this._toolTipHandle)
				{
					this._toolTipHandle = this.ViewModel.watch('Tooltip', lang.hitch(this, function(name, oldValue, newValue) {
						
						// Update Tooltip
						this._toolTip.set('label', newValue);
					}));
				}
				
				// Watch ErrorMessage
				if (!this._errorMessageHandle)
				{
					this._errorMessageHandle = this.ViewModel.watch('ErrorMessage', lang.hitch(this, function(name, oldValue, newValue) {
					
						if (newValue != null)
						{
							this.OnError(newValue);
						}
					}));
				}
				
				// Process Dialogs
				this._createDialogs();
				
				// Watch for changes in Dialogs
				if (!this._dialogsHandle)
				{
					this._dialogsHandle = this.ViewModel.watch('Dialogs', lang.hitch(this, function(name, oldValue, newValue) {
						this._createDialogs();
					}));
				}				
				
			}
			else
			{
				// Destroy Tooltip
				if (this._toolTip)
				{
					this._toolTip.destroyRecursive();
					this._toolTip = null;
				}
				
				// Unwatch Tooltip
				if (this._toolTipHandle)
				{
					this._toolTipHandle.unwatch();
				}
				
				// Unwatch ErrorMessage
				if (this._errorMessageHandle)
				{
					this._errorMessageHandle.unwatch();
				}
				
				// Unwatch Dialogs
				if (this._dialogsHandle)
				{
					this._dialogsHandle.unwatch();
				}
			}	
		},
		
		_createDialogs: function() {
			
			array.forEach(this.ViewModel.Dialogs, function(dialogviewmodel) {
									
				if (this._dialogsCache[dialogviewmodel.ID] === undefined)
				{
					// Create new Dialog
					this._dialogsCache[dialogviewmodel.ID] = dialogviewmodel.Session.ViewControl(dialogviewmodel);
					
					// Start Dialog
					this._dialogsCache[dialogviewmodel.ID].startup();
				}
					
			}, this);
		},

		OnViewModelChanged: function(name, oldValue, newValue) {

			// Update Control
			this._updateControl();
		},
		
		OnError: function(Message) {
			
		}

	});
});