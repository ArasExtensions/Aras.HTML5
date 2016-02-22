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
	'dojo/dom-construct',
	'dojo/_base/array',
	'./Control',
	'./Properties/String',
	'./Properties/List',
	'./Properties/Float'
], function(declare, lang, construct, array, Control, String, List, Float) {
	
	return declare('Aras.View.Cell', [Control], {
		
		Column: null,
		
		Row: null,
		
		Value: null,
		
		Node: null,
		
		_viewModelValueLoadedHandle: null,
		
		_viewModelValueHandle: null,
								
		constructor: function() {
			
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
				
			// Remove watch on ViewModel Value
			if (this._viewModelValueHandle)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			// Remove watch on ViewModel Value Loaded
			if (this._viewModelValueLoadedHandle)
			{
				this._viewModelValueLoadedHandle.unwatch();
			}
						
			if (this.ViewModel != null)
			{
				if (this.ViewModel.Value.Loaded)
				{
					// Render Cell
					this._renderCell();
				}
				else
				{
					this._viewModelValueLoadedHandle = this.ViewModel.Value.watch('Loaded', lang.hitch(this, function(name, oldValue, newValue) {
					
						if (newValue)
						{
							// Render Cell
							this._renderCell();
						}
					
					}));					
				}
			}
			else
			{				
				// Render Cell
				this._renderCell();
			}
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {

			if (this.Value != null)
			{
				// Update Value ViewModel
				this.Value.set("ViewModel", newValue);
			}
		},
		
		_renderCell: function() {
		
			if ((this.ViewModel == null) || (this.ViewModel.Value == null))
			{
				// Destroy Widget if Exists
				if (this.Value != null)
				{
					this.Value.destroyRecursive(false);
					this.Value = null;
				}
			}
			else
			{
				if (this.Value == null)
				{
					// Need to create new Widget
					switch(this.ViewModel.Value.Type)
					{
						case 'Aras.ViewModel.Properties.Boolean':							
							this.Value = new Boolean( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							break;
						case 'Aras.ViewModel.Properties.String':							
							this.Value = new String( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							break;
						case 'Aras.ViewModel.Properties.List':							
							this.Value = new List( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							break;
						case 'Aras.ViewModel.Properties.Float':							
							this.Value = new Float( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
							break;								
						default:
							break;				
					}
					
					// Start Control
					this.Value.startup();
			
					// Set ViewModel
					this.Value.set("ViewModel", this.ViewModel.Value);
					
					// Watch for changes in Value on ViewModel
					this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
					
					if (this.Node != null)
					{
						// Place Value Control in Node
						this.Value.placeAt(this.Node);
					}
				}
				else
				{
					// Update Value ViewModel
					this.Value.set("ViewModel", this.ViewModel.Value);
				}
			}
		}
		
	});
});