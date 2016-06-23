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
	'dojo/when',
	'./Control',
	'./Properties/String',
	'./Properties/List',
	'./Properties/Float'
], function(declare, lang, construct, array, when, Control, String, List, Float) {
	
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

			// Watch for changes in Value on ViewModel
			this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
					
			// Render Cell
			this._renderCell();		
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {

			when(newValue, lang.hitch(this, function(viewmodel) {
			
				if (this.Value != null)
				{
					// Update Value ViewModel
					this.Value.set("ViewModel", viewmodel);
				}
				
			}));

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
				when(this.ViewModel.Value).then(lang.hitch(this, function(valueviewmodel) {
					
					if (this.Value == null)
					{
						// Need to create new Widget
						switch(valueviewmodel.Type)
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
								console.debug('ViewModel Type not supported: ' + valueviewmodel);
								break;				
						}
					
						// Start Control
						this.Value.startup();
					
						if (this.Node != null)
						{
							// Place Value Control in Node
							this.Value.placeAt(this.Node);
						}
					}
		
					// Update Value ViewModel
					this.Value.set("ViewModel", valueviewmodel);				
				}));
				

			}
		}
		
	});
});