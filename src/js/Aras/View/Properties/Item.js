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
	'../Property',
	'dijit/form/ValidationTextBox',
	'dijit/_HasDropDown',
	'dojo/text!dijit/form/templates/DropDownBox.html'
], function(declare, lang, Property, ValidationTextBox, _HasDropDown, template) {
	
	return declare('Aras.View.Properties.Item', [ValidationTextBox, _HasDropDown, Property], {
			
		_dialog: null,
		
		_viewModelValueHandle: null, 
		
		_valueHandle: null,
		
		_viewModelDialogHandle: null,
		
		templateString: template,
		
		hasDownArrow: true,
		
		cssStateNodes: { '_buttonNode': 'dijitDownArrowButton' },
		
		baseClass: 'dijitTextBox dijitComboBox',
		
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
			
			this._updateItem();
		},
		
		destroy: function() {
			this.inherited(arguments);	

			// Call Control Destroy
			this._destroy();
			
			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_updateItem: function() {
		
			if (this.ViewModel != null)
			{
				// Set Value from ViewModel
				this.set("value", this.ViewModel.Value);
			
				// Watch for changes in Control value
				if (!this._valueHandle)
				{
					this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
				
						if (oldValue !== newValue)
						{										
							if (!this._updateFromViewModel)
							{
								// Update ViewModel Value
								this.ViewModel.set('Value', newValue);
								this.ViewModel.Write();
							}
						}
	
					}));
				}
			
				// Watch for changes in the ViewModel Value
				if (!this._viewModelValueHandle)
				{
					this._viewModelValueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {
					
						// Stop ViewModel Update
						this._updateFromViewModel = true;
				
						// Set Value
						this.set("value", newValue);

						// Stop ViewModel Update
						this._updateFromViewModel = false;				
					}));
				}
				
				// Watch for changes in the ViewModel Dialog
				if (!this._viewModelDialogHandle)
				{
					this._viewModelDialogHandle = this.ViewModel.watch('Dialog', lang.hitch(this, function(name, oldValue, newValue) {
					
						if (newValue != null)
						{
							if (this._dialog == null)
							{
								this._dialog = newValue.Session.ViewControl(newValue);
							}
							else
							{
								this._dialog.set('ViewModel', newValue);
							}
						}
						else
						{
							if (this._dialog != null)
							{
								this._dialog.destroyRecursive();
								this._dialog = null;
							}
						}
					}));
				}
			}
			else
			{
				this.set("value", null);
				
				if (this._valueHandle)
				{
					this._valueHandle.unwatch();
				}
				
				if (this._viewModelValueHandle)
				{
					this._viewModelValueHandle.unwatch();
				}
				
				if (this._viewModelDialogHandle)
				{
					this._viewModelDialogHandle.unwatch();
				}
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update String
			this._updateItem();	
		},
		
		openDropDown: function(callback) {

			if ((this.ViewModel != null) && this.ViewModel.Select.CanExecute)
			{
				// Execute Select
				var Parameters = [];
				this.ViewModel.Select.Execute(Parameters);
			}
		}

	});
});