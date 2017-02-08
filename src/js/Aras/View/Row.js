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
	'dojo/promise/all',
	'./Control',
	'./Cell',
], function(declare, lang, array, all, Control, Cell) {
	
	return declare('Aras.View.Row', [Control], {

		Grid: null,
		
		Cells: null,
		
		Index: null,

		constructor: function() {

		},
		
		_startup: function() {
			this.inherited(arguments);
			
			this.Cells = [];
			
			array.forEach(this.Grid.Columns, function(column, i) {
				
				this.Cells[i] = new Cell({ Column: column, Row: this, Index: i });
				this.Cells[i]._startup();
				
			}, this);
			
			this._updateRow();
		},
		
		_updateRow: function() {
	
			// Set ViewModel for each Cell
			array.forEach(this.ViewModel.Cells, function(cellviewmodel, i) {	
				
				if (this.Cells[i].ID != cellviewmodel.ID)
				{
					this.Cells[i].set('ViewModel', cellviewmodel);
				}			
					
			}, this);
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
			// Update Row
			this._updateRow();	
		}
		
	});
});