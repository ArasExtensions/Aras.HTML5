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
	'dojo/_base/array',
	'./Control',
	'./Fields/String',
	'./Fields/List'
], function(declare, lang, array, Control, String, List) {
	
	return declare('Aras.View.Cell', [Control], {
		
		Column: null,
		
		Row: null,
		
		Value: null,
		
		Node: null,
		
		_viewModelValueHandle: null,
		
		_valueHandle: null,
						
		constructor: function() {
			this.inherited(arguments);
			
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
						
			// Remove watch on current ViewModel
			if (this._viewModelValueHandle)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this.ViewModel != null)
			{
				// Set Value
				this._setValue();
			
				// Watch for changes in Value on ViewModel
				this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
			}
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {
	
			if (oldValue != newValue)
			{
				// Set new Value
				this._setValue();
			}
		},
		
		_setValue: function() {
			
			if (this.Value)
			{
				if (this.ViewModel.Type == 'Aras.ViewModel.Cells.List')
				{
					// Set List Options
					var options = [];
					
					array.forEach(this.ViewModel.Values, function(value) {
						options.push({label: value, value: value});
					}, this);
					
					this.Value.set('options', options);
				}
								
				// Set Value
				this.Value.set('value', this.ViewModel.get('Value'));
			}
			else
			{
				this.Node.innerHTML = this.ViewModel.get('Value');
			}
			
		},
		
		renderCell: function(node) {

			switch(this.Column.ViewModel.Type)
			{
				case 'Aras.ViewModel.Columns.Boolean':
				
					if (this.Column.Editable)
					{
						this.Value = new String( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
						this.Value.placeAt(node);
						this._setValueWatch('value');
					}
					else
					{
						this.Node = node;
					}
					
					break;
				case 'Aras.ViewModel.Columns.String':
				
					if (this.Column.Editable)
					{
						this.Value = new String( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
						this.Value.placeAt(node);
						this._setValueWatch('value');
					}
					else
					{
						this.Node = node;
					}
					
					break;
				case 'Aras.ViewModel.Columns.List':
				
					if (this.Column.Editable)
					{
						this.Value = new List( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
						this.Value.placeAt(node);
						this._setValueWatch('value');
					}
					else
					{
						this.Node = node;
					}
					
					break;
				case 'Aras.ViewModel.Columns.Float':
				
					if (this.Column.Editable)
					{
						this.Value = new String( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
						this.Value.placeAt(node);
						this._setValueWatch('value');
					}
					else
					{
						this.Node = node;
					}
					
					break;
				default:
					this.Node = node;
				break;				
			}
		
		},
		
		_setValueWatch: function(Property) {
		
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}	

			this._valueHandle = this.Value.watch(Property, lang.hitch(this, this.OnValueChange));
		},
		
		OnValueChange: function(name, oldValue, newValue) {
			
			if (newValue != this.ViewModel.get('Value'))
			{
				this.ViewModel.set('Value', newValue);
				this.ViewModel.Write();
			}
		}
		
	});
});