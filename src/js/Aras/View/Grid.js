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
		
		SelectedRows: null,
		
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
			this._grid = new _Grid({ region: 'center', selectionMode: 'extended' });
			this.addChild(this._grid);
			
			// Process Grid Select Event
			this._grid.on('dgrid-select', lang.hitch(this, function(event) {
				
				if (this.ViewModel != null && this.ViewModel.Loaded && this.ViewModel.Select.CanExecute)
				{					
					var Parameters = [];
				
					for(i=0; i<event.rows.length; i++)
					{
						if (this.Rows[event.rows[i].data.id].ViewModel != null && this.Rows[event.rows[i].data.id].ViewModel.Loaded)
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
					
			if (this.ViewModel.Rows.length > this.Rows.length)
			{
				// Add additional Rows to Grid
				var rowdata = [];
				var rowdatacnt = 0;
				var currentrowslength = this.Rows.length;
				
				for(i=currentrowslength; i<this.ViewModel.Rows.length; i++)
				{
					this.Rows[i] = new Row({ Grid: this });
					this.Rows[i].startup();
					this.Rows[i].set('Index', i);
					
					rowdata[rowdatacnt] = new Object();
					rowdata[rowdatacnt]['id'] = i;
							
					for (j=0; j<this.Rows[i].Cells.length; j++) 
					{
						rowdata[rowdatacnt][this.Columns[j].Name] = null;
					}

					rowdatacnt++;					
				}
				
				// Add new Rows to Grid
				var gridrows = this._grid.renderArray(rowdata);
				
				// Store Grid Rows in Row Object
				for (i=0; i<gridrows.length; i++)
				{
					this.Rows[currentrowslength+i].GridRow = gridrows[i];
				}
			}
			else if (this.ViewModel.Rows.length < this.Rows.length)
			{
				if (this.ViewModel.Rows.length == 0)
				{
					// Clear Rows
					this.Rows = [];
					this._grid.refresh();
				}
				else
				{					
					// Remove Rows from Grid
					for(i=this.ViewModel.Rows.length;i<this.Rows.length; i++)
					{
						this._grid.removeRow(this.Rows[i].GridRow, false);
					}
					
					this.Rows = this.Rows.slice(0, this.ViewModel.Rows.length);
				}		
			}
			
			// Update ViewModel for each Row
			array.forEach(this.ViewModel.Rows, function(rowviewmodel, i) {

				if ((this.Rows[i].ViewModel == null) || (this.Rows[i].ViewModel.ID != rowviewmodel.ID))
				{
					this.Rows[i].set('ViewModel', rowviewmodel);
				}
				
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