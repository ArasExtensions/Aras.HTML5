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
	'dojo/when',
	'dojo/promise/all',
	'dojo/_base/array',
	'./_Grid',
	'dijit/layout/BorderContainer',
	'./Control'
], function(declare, lang, when, all, array, _Grid, BorderContainer, Control) {
	
	return declare('Aras.View.Grid', [BorderContainer, Control], {
			
		_grid: null,
		
		_columns: null,
		
		_rows: null,
		
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Grid
			this._grid = new _Grid();
			this.addChild(this._grid);
			
			// Watch Rows
			this.watch("_rows", lang.hitch(this, this.OnRowsChange));
		},
		
		OnViewModelChange: function(name, oldValue, newValue) {
			this.inherited(arguments);
						
			// Update Grid
			when(this.ViewModel, lang.hitch(this, function(viewmodel){
								
				// Update Columns
				this._columns = all(viewmodel.Properties.Columns.Value).then(lang.hitch(this, function(columns){
					var gridcolumns = {};
					
					array.forEach(columns, lang.hitch(this, function(column){
						gridcolumns[column.Properties.Name.Value] = column.Properties.Label.Value;
					}));
					
					this._grid._setColumns(gridcolumns);
				}));
				
				// Update Rows
				this.set('_rows', viewmodel.Properties.Rows);
			}));
		},
				
		OnRowsChange: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
			// Update Rows once columns are completed
			when(this._columns, lang.hitch(this, function(columns){
				
				console.debug(this._rows);
				
			}));
		}
		
	});
});