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
	'dojo/Stateful',
	'dojo/_base/lang',
	'dijit/Tooltip'
], function(declare, Stateful, lang, Tooltip) {
	
	return declare('Aras.View.Control', [Stateful], {
		
		ViewModel: null, 
		
		_viewModelHandle: null,
		
		_errorMessageHandle: null,
		
		_toolTip: null,
				
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
				
				// Watch ErrorMessage
				if (this._errorMessageHandle)
				{
					this._errorMessageHandle.unwatch();
				}
			
				this._errorMessageHandle = this.ViewModel.watch('ErrorMessage', lang.hitch(this, function(name, oldValue, newValue) {
					
					if (newValue != null)
					{
						this.OnError(newValue);
					}
				}));
			}
			else
			{
				// Destroy Tooltip
				if (this._toolTip)
				{
					this._toolTip.destroyRecursive();
					this._toolTip = null;
				}
				
				// Unwatch ErrorMessage
				if (this._errorMessageHandle)
				{
					this._errorMessageHandle.unwatch();
				}
			}	
		},

		OnViewModelChanged: function(name, oldValue, newValue) {

			// Update Control
			this._updateControl();
		},
		
		OnError: function(Message) {
			
		}

	});
});