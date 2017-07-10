/*  
  Copyright 2017 Processwall Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 
  Company: Processwall Limited
  Address: The Winnowing House, Mill Lane, Askham Richard, York, YO23 3NW, United Kingdom
  Tel:     +44 113 815 3440
  Web:     http://www.processwall.com
  Email:   support@processwall.com
*/

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'./_Grid',
	'dgrid/util/misc',
	'dijit/layout/BorderContainer',
	'./Control',
	'./CellEditors/Boolean',
	'./CellEditors/Date',
	'./CellEditors/Decimal',
	'./CellEditors/Float',
	'./CellEditors/Integer',
	'./CellEditors/Item',
	'./CellEditors/List',
	'./CellEditors/String',
	'./CellEditors/Text',
	'./Column',
	'./Row',
	'./Cell',
], function(declare, lang, array, _Grid, GridMisc, BorderContainer, Control, BooleanEditor, DateEditor, DecimalEditor, FloatEditor, IntegerEditor, ItemEditor, ListEditor, StringEditor, TextEditor, Column, Row, Cell) {
	
	return declare('Aras.View.Grid', [BorderContainer, Control], {

		_grid: null,
		
		_rowsHandle: null,
		
		_columnsHandle: null,
		
		SelectedRows: null,
		
		baseClass: 'dijitContentPaneNoPadding',
		
		ShowHeader: null,
		
		Columns: null,
		
		Rows: null,
		
		constructor: function() {

			this.Columns = [];
			this.Rows = [];
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();

			// Create Grid
			this._grid = new _Grid({ region: 'center', selectionMode: 'extended', showHeader: this.ShowHeader });
			this.addChild(this._grid);
		
			// Process Grid Select Event
			this._grid.on('dgrid-select', lang.hitch(this, function(event) {
				
				if ((this.ViewModel != null) && (this.ViewModel.Select.CanExecute))
				{					
					var Parameters = [];
				
					array.forEach(event.rows, function(row) {
						Parameters.push(this.ViewModel.Rows[row.data.id].ID);
					}, this);

					this.ViewModel.Select.Execute(Parameters);
				}
			}));
			
			// Process Grid Editor Show Event
			this._grid.on('dgrid-editor-show', lang.hitch(this, function(event) {
								
				if (this.ViewModel != null)
				{
					// Get Cell ViewModel
					var rowid = event.cell.row.id;
					var colname = event.cell.column.id;
					var rowviewmodel = this.ViewModel.Rows[rowid];
					var colindex = -1;
					
					for (var j=0; j<this.ViewModel.Columns.length; j++) 
					{
						if (this.ViewModel.Columns[j].Name == colname)
						{
							colindex = j;
							break;
						}
					}

					// Set Editor ViewModel
					event.editor.set('ViewModel', this.ViewModel.Rows[rowid].Cells[colindex]);
				}

			}));
			
			// Process Grid Editor Changed Event
			this._grid.on('dgrid-datachange', lang.hitch(this, function(event) {
				
				// Cancel Event
				event.preventDefault();
				
				if (this.ViewModel != null)
				{
					// Get Cell ViewModel
					var rowid = event.cell.row.id;
					var colname = event.cell.column.id;
					var rowviewmodel = this.ViewModel.Rows[rowid];
					var colindex = -1;
					
					for (var j=0; j<this.ViewModel.Columns.length; j++) 
					{
						if (this.ViewModel.Columns[j].Name == colname)
						{
							colindex = j;
							break;
						}
					}
										
					// Write New Value
					this.ViewModel.Rows[rowid].Cells[colindex].Write();
				}
			
			}));
			
			// Watch for Changes in Columns
			this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
			
			// Watch for Changes in Rows
			this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
			
			// Update Rows
			this._updateColumns();	
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			// Call Control Destroy
			this._destroy();
						
			if (this._rowsHandle)
			{
				this._rowsHandle.unwatch();
			}
			
			if (this._columnsHandle)
			{
				this._columnsHandle.unwatch();
			}
		},

		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
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
			
			// Watch for Changes in Columns
			this._columnsHandle = this.ViewModel.watch("Columns", lang.hitch(this, this._updateColumns));
			
			// Watch for Changes in Rows
			this._rowsHandle = this.ViewModel.watch("Rows", lang.hitch(this, this._updateRows));
			
			// Update Columns
			this._updateColumns();	
		},
		
		_updateColumns: function() {
		
			// Reset Columns
			array.forEach(this.Columns, function(column) {
				column.Visible = false;
			}, this);
			
			// Create Columns
			var gridcolumns = {};
				
			array.forEach(this.ViewModel.Columns, function(columnviewmodel, i) {
	
				if (this.Columns[i])
				{
					this.Columns[i].Visible = true;
				}
				else
				{
					this.Columns[i] = new Column({ Grid: this});
					this.Columns[i].startup();
				}
				
				this.Columns[i].ViewModel = columnviewmodel;
				
				gridcolumns[columnviewmodel.Name] = {};
				gridcolumns[columnviewmodel.Name].label = columnviewmodel.Label;	
				gridcolumns[columnviewmodel.Name].sortable = false;
				gridcolumns[columnviewmodel.Name].editOn = 'click';
				gridcolumns[columnviewmodel.Name].dismissOnEnter = false;
				
				if (columnviewmodel.Editable)
				{
					// Set canEdit to allow row specific editing 
					gridcolumns[columnviewmodel.Name].canEdit = lang.hitch(this, this._canEditCell);
					
					switch(columnviewmodel.Type)
					{
						case "Aras.View.Columns.Boolean":
							gridcolumns[columnviewmodel.Name].editor = BooleanEditor;
							break;

						case "Aras.View.Columns.Date":
							gridcolumns[columnviewmodel.Name].editor = DateEditor;
							gridcolumns[columnviewmodel.Name].editorArgs = { style: 'width:' + (columnviewmodel.Width - 5) + 'px;' };
							break;
							
						case "Aras.View.Columns.Decimal":
							gridcolumns[columnviewmodel.Name].editor = DecimalEditor;
							break;
	
						case "Aras.View.Columns.Float":
							gridcolumns[columnviewmodel.Name].editor = FloatEditor;
							break;
							
						case "Aras.View.Columns.Integer":
							gridcolumns[columnviewmodel.Name].editor = IntegerEditor;
							break;

						case "Aras.View.Columns.Item":
							gridcolumns[columnviewmodel.Name].editor = ItemEditor;
							break;
	
						case "Aras.View.Columns.List":
							gridcolumns[columnviewmodel.Name].editor = ListEditor;
							break;
	
						case "Aras.View.Columns.String":
							gridcolumns[columnviewmodel.Name].editor = StringEditor;
							break;

						case "Aras.View.Columns.Text":
							gridcolumns[columnviewmodel.Name].editor = TextEditor;
							break;
							
						default:
							gridcolumns[columnviewmodel.Name].editor = undefined;
							break;
					}
				}
				else
				{
					gridcolumns[columnviewmodel.Name].editor = undefined;
				}
				
				// Cell Formatter
				gridcolumns[columnviewmodel.Name].formatter = lang.hitch(this, this._formatCell);
				
				// Set Column Width
				GridMisc.addCssRule('#' + GridMisc.escapeCssIdentifier(this._grid.domNode.id) +
						' .dgrid-column-' + GridMisc.escapeCssIdentifier(columnviewmodel.Name, '-'),
						'width: ' + columnviewmodel.Width + 'px;');
						
			}, this);
			
			// Set Grid Columns
			this._grid._setColumns(gridcolumns);

			// Update Rows
			this._updateRows();	
		},
		
		_canEditCell: function(Grid, Cell) {
		
			if (Cell.ViewModel != null)
			{
				return Cell.ViewModel.Editable;
			}
			else
			{
				return false;
			}
		},
		
		_updateRows: function() {
		
			// Reset Rows
			array.forEach(this.Rows, function(row) {
				row.Visible = false;
			}, this);
			
			// Render Grid
			var rowdata = [];
				
			array.forEach(this.ViewModel.Rows, function(rowviewmodel, i) {
					
				if (this.Rows[i])
				{
					this.Rows[i].Visible = true;
				}
				else
				{
					this.Rows[i] = new Row({ Grid: this });
					this.Rows[i].startup();
				}
				
				this.Rows[i].ViewModel = rowviewmodel;
				this.Rows[i].ID = i;
					
				rowdata[i] = new Object();
				rowdata[i]['id'] = i;
						
				for (var j=0; j<this.ViewModel.Columns.length; j++) 
				{
					if (!this.Rows[i].Cells[j])
					{
						this.Rows[i].Cells[j] = new Cell({ Row: this.Rows[i], Column: this.Columns[j]});
						this.Rows[i].Cells[j].startup();
					}

					this.Rows[i].Cells[j].set('ViewModel', rowviewmodel.Cells[j]);
					
					rowdata[i][this.ViewModel.Columns[j].Name] = this.Rows[i].Cells[j];
				}
					
			}, this);
											
			// Clear Grid
			this._grid.refresh();
				
			// Render Grid
			this._grid.renderArray(rowdata);
		},
		
		_formatCell: function(value, object) {

			switch(value.Column.ViewModel.Type)
			{
				case "Aras.View.Columns.Boolean":
				
					if (value.ViewModel.Value == '1')
					{
						return '<input type="checkbox" disabled checked="checked">';
					}	
					else
					{
						return '<input type="checkbox" disabled>';
					}
				case "Aras.View.Columns.List":
				
					if (value.ViewModel.Selected != null)
					{
						return value.ViewModel.Selected.Label;
					}
					else
					{
						return '';
					}
					
				default:
				
					if (value.ViewModel.Value != null)
					{
						return value.ViewModel.Value;
					}
					else
					{
						return '';
					}
			}

		}
		
	});
});