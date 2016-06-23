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
	'./_Grid',
	'dijit/layout/BorderContainer',
	'./Control',
	'./Column',
	'./Row'
], function(declare, lang, array, all, _Grid, BorderContainer, Control, Column, Row) {
	
	return declare('Aras.View.Grid', [BorderContainer, Control], {
			
		_grid: null,
		
		Columns: null,
		
		NoColumns: null,
			
		_columnsHandle: null,
			
		Rows: null,
		
		NoRows: null,
		
		_rowsHandle: null,
		
		SelectedRows: null,
		
		constructor: function() {

			this.Columns = [];
			this.NoColumns = 0;
			this.Rows = [];
			this.NoRows = 0;
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'extended' });
			this.addChild(this._grid);
			
			// Process Grid Select Event
			this._grid.on('dgrid-select', lang.hitch(this, function(event) {
				
				if (this.ViewModel != null && this.ViewModel.Select.CanExecute)
				{					
					var Parameters = [];
				
					for(i=0; i<event.rows.length; i++)
					{
						if (this.Rows[event.rows[i].data.id].ViewModel != null)
						{
							Parameters.push(this.Rows[event.rows[i].data.id].ViewModel.ID);
						}
					}

					this.ViewModel.Select.Execute(Parameters);
				}
			}));
		},

		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Watch for changes in Columns
			if (this._columnsHandle)
			{
				this._columnsHandle.unwatch();
			}
			
			this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
	
			// Watch for Changes in Rows
			if (this._rowsHandle)
			{
				this._rowsHandle.unwatch();
			}

			this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
			
			// Update Columns
			this._updateColumns();
		},
		
		_updateColumns: function() {
		
			all(this.ViewModel.Columns).then(lang.hitch(this, function(columns) {
	
				array.forEach(columns, function(columnviewmodel, i) {
				
					// Ensure Column Exists
					if (!this.Columns[i])
					{
						this.Columns[i] = new Column({ Grid: this });
						this.Columns[i].startup();
					}
			
					// Update Column
					this.Columns[i].set('Index', i);
					this.Columns[i].set('ViewModel', columnviewmodel);			
	
				}, this);
			
				// Update NoColumns
				this.NoColumns = columns.length;
			
				// Update Rows
				this._updateRows();
				
			}));

		},

		_updateRows: function() {
				
			all(this.ViewModel.Rows).then(lang.hitch(this, function(rows) {
				
				array.forEach(rows, function(rowviewmodel, i) {
					
					// Ensure Row Exists
					if (!this.Rows[i])
					{
						this.Rows[i] = new Row({ Grid: this });
						this.Rows[i].startup();
						this.Rows[i].set('Index', i);
					}
				
					// Set ViewModel
					this.Rows[i].set('ViewModel', rowviewmodel);
			
				}, this);	

				if (this.NoRows != rows.length)
				{
					// Update NoRows
					this.NoRows = rows.length;
				
					// Render Grid
					var rowdata = [];
					
					for(i=0; i<this.NoRows; i++)
					{
						rowdata[i] = new Object();
						rowdata[i]['id'] = i;
						
						for (j=0; j<this.Columns.length; j++) 
						{
							rowdata[i][this.Columns[j].Name] = null;
						}
					}
					
					// Clear Grid
					this._grid.refresh();
					
					// Render Grid
					var gridrows = this._grid.renderArray(rowdata);
				
					// Store Grid Rows in Row Object
					for (i=0; i<gridrows.length; i++)
					{
						this.Rows[i].GridRow = gridrows[i];
					}
				}
				
			}));
				
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
		}

	});
});