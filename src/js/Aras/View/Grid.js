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
	'dgrid/util/misc',
	'dijit/layout/ContentPane',
	'./Control',
	'./Column',
	'./Row'
], function(declare, lang, array, _Grid, GridMisc, ContentPane, Control, Column, Row) {
	
	return declare('Aras.View.Grid', [ContentPane, Control], {
			
		_grid: null,
		
		Columns: null,
		
		NoColumns: null,
			
		_columnsHandle: null,
			
		Rows: null,
		
		NoRows: null,
		
		_rowsHandle: null,
		
		SelectedRows: null,
		
		baseClass: 'dijitContentPaneNoPadding',
		
		ShowHeader: null,
		
		constructor: function() {

			this.Columns = [];
			this.NoColumns = 0;
			this.Rows = [];
			this.NoRows = 0;
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
			
			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'extended', showHeader: this.ShowHeader });
			this.set('content', this._grid);
			
			// Process Grid Select Event
			this._grid.on('dgrid-select', lang.hitch(this, function(event) {
				
				if (this.ViewModel != null && this.ViewModel.Select.CanExecute)
				{					
					var Parameters = [];
				
					array.forEach(event.rows, function(row) {
						
						if (this.Rows[row.data.id].ViewModel != null)
						{
							Parameters.push(this.Rows[row.data.id].ViewModel.ID);
						}
						
					}, this);

					this.ViewModel.Select.Execute(Parameters);
				}
			}));
			
			// Update Grid
			this._updateGrid();
		},

		destroy: function() {
			this.inherited(arguments);
			
			// Call Control Destroy
			this._destroy();
			
			if (this._columnsHandle)
			{
				this._columnsHandle.unwatch();
			}
			
			if (this._rowsHandle)
			{
				this._rowsHandle.unwatch();
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
			// Update Grid
			this._updateGrid();	
		},
		
		_updateGrid: function() {
	
			// Unwatch for changes in Columns
			if (this._columnsHandle)
			{
				this._columnsHandle.unwatch();
			}
			
			// Unwatch for Changes in Rows
			if (this._rowsHandle)
			{
				this._rowsHandle.unwatch();
			}
			
			// Update Columns
			this._updateColumns();
			
			// Watch for changes in Columns
			this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
	
			// Watch for Changes in Rows
			this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
		},
		
		_updateColumns: function() {
		
			// Refresh Columns
			var gridcolumns = {};
				
			array.forEach(this.ViewModel.Columns, function(columnviewmodel, i) {
								
				if (!this.Columns[i])
				{
					// Create Column
					this.Columns[i] = new Column({ Grid: this, ViewModel: columnviewmodel, Index: i });
					this.Columns[i]._startup();
				}
				else
				{
					// Update Column
					this.Columns[i].set('Index', i);
					this.Columns[i].set('ViewModel', columnviewmodel);	
				}				
	
				gridcolumns[this.Columns[i].Name] = {};
				gridcolumns[this.Columns[i].Name].label = this.Columns[i].Label;
				gridcolumns[this.Columns[i].Name].renderCell = lang.hitch(this.Columns[i], this._renderCell);
				
				// Set Column Width
				var rule = GridMisc.addCssRule('#' + GridMisc.escapeCssIdentifier(this._grid.domNode.id) +
						' .dgrid-column-' + GridMisc.escapeCssIdentifier(this.Columns[i].Name, '-'),
						'width: ' + columnviewmodel.Width + 'px;');
					
			}, this);
			
			// Update NoColumns
			this.NoColumns = this.ViewModel.Columns.length;
			
			// Set Grid Columns
			this._grid._setColumns(gridcolumns);

			// Update Rows
			this._updateRows();				
		},

		_updateRows: function() {

			array.forEach(this.ViewModel.Rows, function(rowviewmodel, i) {
					
				if (!this.Rows[i])
				{
					// Create Row
					this.Rows[i] = new Row({ Grid: this, ViewModel: rowviewmodel, Index: i });
					this.Rows[i]._startup();
				}
				else
				{
					// Update ViewModel
					this.Rows[i].set('ViewModel', rowviewmodel);
				}
			}, this);	

			if (this.NoRows != this.ViewModel.Rows.length)
			{
				// Update NoRows
				this.NoRows = this.ViewModel.Rows.length;
				
				// Render Grid
				var rowdata = [];
					
				for(var i=0; i<this.NoRows; i++)
				{
					rowdata[i] = new Object();
					rowdata[i]['id'] = i;
						
					for (var j=0; j<this.Columns.length; j++) 
					{
						rowdata[i][this.Columns[j].Name] = null;
					}
				}
										
				// Clear Grid
				this._grid.refresh();
				
				// Render Grid
				this._grid.renderArray(rowdata);
			}	
		},
		
		_renderCell: function(object, value, node, options) {

			// Store Node in Cell
			this.Grid.Rows[object.id].Cells[this.Index].Node = node;
		
			// Place Widget in Cell Node
			var widget = this.Grid.Rows[object.id].Cells[this.Index].RenderCell();
			
			if (widget)
			{
				widget.placeAt(this.Grid.Rows[object.id].Cells[this.Index].Node);
			}
		}
		
	});
});