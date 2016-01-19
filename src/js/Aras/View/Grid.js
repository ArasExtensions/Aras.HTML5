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
		
		VisibleRows: null,

		_rowsHandle: null,
				
		constructor: function() {
			
			this.ColumnsLoaded = false;
			this.Columns = [];
			this.Rows = [];
			this.VisibleRows = 0;
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'single' });
			this.addChild(this._grid);
		},

		OnViewModelLoaded: function() {
			this.inherited(arguments);
	
			// Watch for changes in Columns
			if (!this._columnsHandle)
			{
				this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
			}
	
			// Watch for Changes in Rows
			if (!this._rowsHandle)
			{
				this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
			}
			
			// Update Columns
			this._updateColumns();
			
			// Update Rows
			this._updateRows();
		},
		
		_updateColumns: function() {

			if (this.Columns.length > this.ViewModel.Columns.length)
			{
				this.Columns = this.Columns.slice(0, this.ViewModel.Columns.length);
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
					
			array.forEach(this.ViewModel.Rows, function(rowviewmodel, i) {

				if (!this.Rows[i])
				{
					this.Rows[i] = new Row({ Grid: this });
					this.Rows[i].startup();
					this.Rows[i].set('Index', i);
					this.Rows[i].set('ViewModel', rowviewmodel);
				}
				else
				{
					if (this.Rows[i].ViewModel.ID != rowviewmodel.ID)
					{
						this.Rows[i].set('ViewModel', rowviewmodel);
					}
				}

			}, this);
			
			if (this.VisibleRows != this.ViewModel.Rows.length)
			{
				this.VisibleRows = this.ViewModel.Rows.length;
				this._refreshRows();
			}
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
			
			if (object.id < this.Grid.Rows.length)
			{				
				// Set Cell Node
				this.Grid.Rows[object.id].Cells[this.Index].set('Node', node);
				
				if (this.Grid.Rows[object.id].Cells[this.Index].Value != null)
				{
					// Place Value Control in Node
					this.Grid.Rows[object.id].Cells[this.Index].Value.placeAt(node);
				}
			}			
		},
		
		_refreshRows: function() {
			
			if (this.ColumnsLoaded)
			{		
				if (this.VisibleRows > 0)
				{
					var rowdata = new Array(this.VisibleRows);
							
					for (i=0; i<this.VisibleRows; i++) {
					
						rowdata[i] = new Object();
						rowdata[i]['id'] = i;
							
						for (j=0; j<this.Rows[i].Cells.length; j++) {
							rowdata[i][this.Columns[j].Name] = null;
						}		
					}
				
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