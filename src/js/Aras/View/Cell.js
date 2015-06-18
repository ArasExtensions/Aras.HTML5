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
				// Render Cell
				this._renderCell();
			
				// Watch for changes in Value on ViewModel
				this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
			}
			else
			{
				this.Value = null;
			}
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {
	
			if (oldValue != newValue)
			{
				// Set new Value
				this._updateValue();
			}
		},
				
		_updateValue: function() {

			switch(this.ViewModel.Type)
			{
				case 'Aras.ViewModel.Cells.Boolean':
				
					if (this.ViewModel.Editable)
					{
						this.Value.set('value', this.ViewModel.get('Value'));
					}
					else
					{
						this.Node.innerHTML = this.ViewModel.get('Value');
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.String':
				
					if (this.ViewModel.Editable)
					{
						this.Value.set('value', this.ViewModel.get('Value'));
					}
					else
					{
						this.Node.innerHTML = this.ViewModel.get('Value');
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.List':
				
					if (this.ViewModel.Editable)
					{
						this.Value.set('value', this.ViewModel.get('Value'));
					}
					else
					{
						this.Node.innerHTML = this.ViewModel.get('Value');
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.Float':
				
					if (this.ViewModel.Editable)
					{
						this.Value.set('value', this.ViewModel.get('Value'));
					}
					else
					{
						this.Node.innerHTML = this.ViewModel.get('Value');
					}
					
					break;
					
				default:
					this.Node.innerHTML = this.ViewModel.get('Value');
					break;				
			}
		
		},
		
		_destroyValue: function() {
			
			if (this.Value != null)
			{
				this.Value.destroy();
				this.Value = null;
			}
		},
		
		_setNodeValue: function() {
		
			this._destroyValue();
			this.Node.innerHTML = this.ViewModel.get('Value');
		},
		
		_renderCell: function() {

			switch(this.ViewModel.Type)
			{
				case 'Aras.ViewModel.Cells.Boolean':
				
					if (this.ViewModel.Editable)
					{
						if ((this.Value == null) || (this.Value.declaredClass != 'Aras.View.Fields.String'))
						{
							this._destroyValue();
							this.Value = new String( {value: this.ViewModel.get('Value'), style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							this.Value.placeAt(this.Node);
							this._setValueWatch('value');
						}
						else
						{
							this.Value.set('value', this.ViewModel.get('Value'));
						}
					}
					else
					{
						this._setNodeValue();
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.String':
				
					if (this.ViewModel.Editable)
					{
						if ((this.Value == null) || (this.Value.declaredClass != 'Aras.View.Fields.String'))
						{
							this._destroyValue();
							this.Value = new String( {value: this.ViewModel.get('Value'), style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							this.Value.placeAt(this.Node);
							this._setValueWatch('value');
						}
						else
						{
							this.Value.set('value', this.ViewModel.get('Value'));
						}
					}
					else
					{
						this._setNodeValue();
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.List':
				
					if (this.ViewModel.Editable)
					{
						if ((this.Value == null) || (this.Value.declaredClass != 'Aras.View.Fields.List'))
						{							
							this._destroyValue();
							
							// Build Options
							var options = [];
					
							array.forEach(this.ViewModel.Values, function(value) {
								options.push({label: value, value: value});
							}, this);
					
							this.Value = new List( {value: this.ViewModel.get('Value'), options: options, style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							this.Value.placeAt(this.Node);
							this._setValueWatch('value');
						}
						else
						{
							this.Value.set('value', this.ViewModel.get('Value'));
						}
					}
					else
					{
						this._setNodeValue();
					}
					
					break;
					
				case 'Aras.ViewModel.Cells.Float':
				
					if (this.ViewModel.Editable)
					{
						if ((this.Value == null) || (this.Value.declaredClass != 'Aras.View.Fields.String'))
						{
							this._destroyValue();
							this.Value = new String( {value: this.ViewModel.get('Value'), style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							this.Value.placeAt(this.Node);
							this._setValueWatch('value');
						}
						else
						{
							this.Value.set('value', this.ViewModel.get('Value'));
						}
					}
					else
					{
						this._setNodeValue();
					}
					
					break;
					
				default:
					this._setNodeValue();
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