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
	'./Control',
	'./Column',
	'./Row'
], function(declare, lang, when, all, array, _Grid, BorderContainer, Control, Column, Row) {
	
	return declare('Aras.View.Grid', [BorderContainer, Control], {
			
		_grid: null,
		
		Columns: null,
		
		_columnsHandle: null,
		
		Rows: null,

		_rowsHandle: null,
				
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'single' });
			this.addChild(this._grid);
		},

		OnViewModelChange: function(name, oldValue, newValue) {
			this.inherited(arguments);
					
			when(newValue, lang.hitch(this, function(viewmodel) {
			
				// Update Columns
				this._updateColumns(viewmodel.Columns);
									
				if (this._columnsHandle != null)
				{
					this._columnsHandle.unwatch();
				}
				
				this._columnsHandle = viewmodel.watch("Columns", lang.hitch(this, this.OnColumnsViewModelChange));
				
				// Update Rows
				this._updateRows(viewmodel.Rows);
				
				if (this._rowsHandle != null)
				{
					this._rowsHandle.unwatch();
				}
				
				this._rowsHandle = viewmodel.watch("Rows", lang.hitch(this, this.OnRowsViewModelChange));
			}));
		},

		OnColumnsViewModelChange: function(name, oldValue, newValue) {

			// Process Columns
			this._updateColumns(newValue);
		},
		
		OnRowsViewModelChange: function(name, oldValue, newValue) {

			// Process Rows
			this._updateRows(newValue);
		},
		
		_updateColumns: function(ColumnsResponse) {

			all(ColumnsResponse).then(lang.hitch(this, function(columnsviewmodel){

				if (this.Columns)
				{
					if (this.Columns.length > columnsviewmodel.length)
					{
						this.Columns = this.Columns.slice(0, columnsviewmodel.length);
					}
				}
				else
				{
					this.Columns = [];
				}
					
				array.forEach(columnsviewmodel, lang.hitch(this, function(columnviewmodel, i){
					
					if (!this.Columns[i])
					{
						this.Columns[i] = new Column();
						this.Columns[i].startup();
						this.Columns[i].set('Grid', this);
					}
					
					this.Columns[i].set('ViewModel', columnviewmodel);
				}));
				
				// Refresh Columns
				this._refreshColumns();
			}));			
		},

		_updateRows: function(RowsResponse) {

			// Update Rows
			all(RowsResponse).then(lang.hitch(this, function(rowsviewmodel){
				
				if (this.Rows)
				{
					if (this.Rows.length > rowsviewmodel.length)
					{
						this.Rows = this.Rows.slice(0, rowsviewmodel.length);
					}
				}
				else
				{
					this.Rows = [];
				}
					
				array.forEach(rowsviewmodel, lang.hitch(this, function(rowviewmodel, i){
					
					if (!this.Rows[i])
					{
						this.Rows[i] = new Row();
						this.Rows[i].startup();
						this.Rows[i].set('Grid', this);
					}

					this.Rows[i].set('ViewModel', rowviewmodel);
				}));
				
				// Refresh Rows
				this._refreshRows();
			}));
		},

		_refreshColumns: function() {
		
			var gridcolumns = {};
					
			array.forEach(this.Columns, lang.hitch(this, function(column){
				gridcolumns[column.Name] = column.Label;
			}));
					
			// Set Grid Columns
			this._grid._setColumns(gridcolumns);
				
			// Refresh Rows
			this._refreshRows();
		},
		
		_refreshRows: function() {
			
			if (this.Rows)
			{					
				var rowdata = new Array(this.Rows.length);
							
				array.forEach(this.Rows, lang.hitch(this, function(row, i) {
					rowdata[i] = new Object();
					rowdata[i]['id'] = row.ID;
								
					array.forEach(row.Cells, lang.hitch(this, function(cell, j) {
						rowdata[i][this.Columns[j].Name] = cell.Value;
					}));
							
				}));
		
				// Refresh Grid
				this._grid.refresh();
				this._grid.renderArray(rowdata);							
			}
			else
			{
				// No Rows
				this._grid.refresh();
			}

		}

	});
});