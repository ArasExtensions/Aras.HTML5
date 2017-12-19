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
	'dojo/_base/array',
	'../CellEditor',
	'dijit/form/Select'
], function(declare, lang, array, CellEditor, Select) {
	
	return declare('Aras.View.CellEditors.List', [Select, CellEditor], {
		
		_valueHandle: null,
	
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
	
			// Call Control Startup
			this._startup();
		},
		
		destroy: function() {
			this.inherited(arguments);	
			
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			if (this.ViewModel != null)
			{		
				// Load Options
				this.options = [];

				if (this.ViewModel.AllowNull)
				{
					if (this.ViewModel.Value == null)
					{
						this.options.push({ label: "", value: "--select--", selected: true });
					}
					else
					{
						this.options.push({ label: "", value: "--select--" });
					}
				}
				
				array.forEach(this.ViewModel.Values, function(valueviewmodel) {
			
					if (this.ViewModel.Value == valueviewmodel.Value)
					{
						this.options.push({ label: valueviewmodel.Label, value: valueviewmodel.Value, selected: true });
					}
					else
					{
						this.options.push({ label: valueviewmodel.Label, value: valueviewmodel.Value });
					}
				}, this);					
				
				this._loadChildren();
					
				if (this._valueHandle != null)
				{
					this._valueHandle.unwatch();
				}
				
				// Watch for change in Select Value
				this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
					
					// Update ViewModel
					if (newValue == "--select--")
					{
						this.ViewModel.UpdateValue = null;
					}
					else
					{
						this.ViewModel.UpdateValue = newValue;
					}	
				}));
			}
		},
		
		UpdateValue: function() {
			this.inherited(arguments);	
			
			if ((this.ViewModel != null) && (this.options != null))
			{
				if (this.ViewModel.Value == null)
				{
					if ((this.options.length > 0) && !this.ViewModel.AllowNull)
					{
						this.options[0].selected = true;
						this.ViewModel.UpdateValue = this.options[0].value;
					}
				}
				else
				{
					for (var i = 0; i < this.options.length; i++) 
					{
						if (this.options[i].value == this.ViewModel.Value)
						{
							this.options[i].selected = true;
						}
						else
						{
							this.options[i].selected = false;
						}
					}
					
					this.ViewModel.UpdateValue = this.ViewModel.Value;
				}
			}
		}

	});
});