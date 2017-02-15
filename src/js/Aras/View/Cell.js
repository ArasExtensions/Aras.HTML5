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
	'./Properties/Float',
	'./Properties/Integer',
	'./Properties/Sequence'
], function(declare, lang, construct, array, Control, String, List, Float, Integer, Sequence) {
	
	return declare('Aras.View.Cell', [Control], {
		
		Column: null,
		
		Row: null,
		
		Value: null,

		Node: null,
		
		_viewModelValueHandle: null,

		_startup: function() {
			this.inherited(arguments);
			
			// Update Cell
			this._updateCell();	
		},
		
		_destroy: function() {
			this.inherited(arguments);
			
			if (this._viewModelValueHandle)
			{
				this._viewModelValueHandle.unwatch();
			}		
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
			// Update Cell
			this._updateCell();	
		},
		
		_updateCell: function() {

			if (this.ViewModel != null)
			{
				// Watch for changes in ViewModel Value
				if (this._viewModelValueHandle)
				{
					this._viewModelValueHandle.unwatch();
				}

				this._viewModelValueHandle = this.ViewModel.watch("Value", lang.hitch(this, this.OnViewModelValueChange));
			}
		},
		
		OnViewModelValueChange: function(name, oldValue, newValue) {

			if (this.Value)
			{
				// Update Value ViewModel
				this.Value.set("ViewModel", newValue);
			}
		},
				
		RenderCell: function() {
		
			if ((this.ViewModel != null) && (this.ViewModel.Value != null))
			{
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
					this.Value = this.ViewModel.Session.ViewControl(this.ViewModel.Value, {style: 'width:100%; height:100%; padding:0; margin:0; border:0'});
									
					// Start Control
					this.Value.startup();
				}
				
				return this.Value;
			}
			else
			{
				return null;
			}
		}
		
	});
});