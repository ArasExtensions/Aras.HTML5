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
		
		_viewModelValueHandle: null,
								
		constructor: function() {
			
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Watch for changes in ViewModel Value
			if (this._viewModelValueHandle)
			{
				this._viewModelValueHandle.unwatch();
			}

			this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {

			when(newValue, lang.hitch(this, function(viewmodel) {
			
				if (this.Value)
				{
					// Update Value ViewModel
					this.Value.set("ViewModel", viewmodel);
				}
				
			}));

		},
				
		RenderCell: function() {
		
			if ((this.ViewModel != null) && (this.ViewModel.Value != null))
			{	
				return when(this.ViewModel.Value).then(lang.hitch(this, function(valueviewmodel) {

					
					if ( dojo.isIE)
					{						
						if (this.Value != null)
						{
							this.Value = null;
						}
					}
					
					if (this.Value == null)
					{
						// Need to create new Widget
						switch(valueviewmodel.Type)
						{
							case 'Aras.View.Properties.Boolean':							
								this.Value = new Boolean( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
								break;
							case 'Aras.View.Properties.String':							
								this.Value = new String( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
								break;
							case 'Aras.View.Properties.List':							
								this.Value = new List( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
								break;
							case 'Aras.View.Properties.Float':							
								this.Value = new Float( {style: 'width:100%; height:100%; padding:0; margin:0; border:0'} );
								break;								
							default:
								console.debug('ViewModel Type not supported: ' + valueviewmodel);
								break;				
						}
					
						// Start Control
						this.Value.startup();
					
					}
	
					// Update Value ViewModel
					this.Value.set("ViewModel", valueviewmodel);
				
					return this.Value;	
				}));

			}
			else
			{
				return null;
			}
		}
		
	});
});