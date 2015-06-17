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
	'./_Grid',
	'dijit/layout/BorderContainer',
	'./Control',
	'./Column',
	'./Row'
], function(declare, lang, array, _Grid, BorderContainer, Control, Column, Row) {
	
	return declare('Aras.View.Grid', [BorderContainer, Control], {
			
		_grid: null,
		
		Columns: null,
		
		ColumnsLoaded: null,
		
		_columnsHandle: null,
		
		Rows: null,

		_rowsHandle: null,
				
		constructor: function() {
			
			this.ColumnsLoaded = false;
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'single' });
			this.addChild(this._grid);
		},

		OnViewModelLoaded: function() {
			this.inherited(arguments);
			
			// Update Columns
			this._updateColumns();
				
			// Watch for Changes in Columns
			if (this._columnsHandle != null)
			{
				this._columnsHandle.unwatch();
			}
				
			this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
				
			// Update Rows
			this._updateRows();
				
			// Watch for Changes in Rows
			if (this._rowsHandle != null)
			{
				this._rowsHandle.unwatch();
			}
				
			this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
		},
		
		_updateColumns: function() {

			if (this.Columns)
			{
				if (this.Columns.length > this.ViewModel.Columns.length)
				{
					this.Columns = this.Columns.slice(0, this.ViewModel.Columns.length);
				}
			}
			else
			{
				this.Columns = [];
			}
					
			array.forEach(this.ViewModel.Columns, function(columnviewmodel, i) {
					
				if (!this.Columns[i])
				{
					this.Columns[i] = new Column({ Grid: this });
					this.Columns[i].startup();
				}
					
				this.Columns[i].set('Index', i);
				this.Columns[i].set('ViewModel', columnviewmodel);
			}, this);
		},

		_updateRows: function() {

			// Update Rows
			if (this.Rows)
			{
				if (this.Rows.length > this.ViewModel.Rows.length)
				{
					this.Rows = this.Rows.slice(0, this.ViewModel.Rows.length);
				}
			}
			else
			{
				this.Rows = [];
			}
					
			array.forEach(this.ViewModel.Rows, function(rowviewmodel, i) {
			
				if (!this.Rows[i])
				{
					this.Rows[i] = new Row({ Grid: this });
					this.Rows[i].startup();
				}

				this.Rows[i].set('Index', i);
				this.Rows[i].set('ViewModel', rowviewmodel);
			}, this);
		},

		_refreshColumns: function() {
		
			var gridcolumns = {};
			var loaded = true;
			
			array.forEach(this.Columns, function(column, i) {
				
				if (column.Loaded)
				{
					gridcolumns[this.Columns[i].Name] = {};
					gridcolumns[this.Columns[i].Name].label = this.Columns[i].Label;
					gridcolumns[this.Columns[i].Name].renderCell = lang.hitch(column, this._renderCell);
				}
				else
				{
					loaded = false;
				}
			}, this);
			
			if (loaded)
			{
				// Set Grid Columns
				this._grid._setColumns(gridcolumns);
				
				this.set('ColumnsLoaded', true);
				
				// Refresh Rows
				this._refreshRows();
			}
		},
		
		_renderCell: function(object, value, node, options) {

			this.Grid.Rows[object.id].Cells[this.Index].renderCell(node);			
		},
		
		_refreshRows: function() {
			
			if (this.Rows && this.ColumnsLoaded)
			{		
				if (this.Rows.length > 0)
				{
					var rowdata = new Array(this.Rows.length);
							
					array.forEach(this.Rows, function(row, i) {
					
						rowdata[i] = new Object();
						rowdata[i]['id'] = i;
								
						array.forEach(row.Cells, function(cell, j) {
							rowdata[i][this.Columns[j].Name] = cell.Value;
						}, this);
		
					}, this);
				
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
		}

	});
});