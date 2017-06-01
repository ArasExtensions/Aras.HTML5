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
	'dojo/html',
	'./Control'
], function(declare, lang, html, Control) {
	
	return declare('Aras.View.Cell', [Control], {
		
		_valueHandle: null,
		
		Column: null,
		
		Row: null,
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	

			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
						
			if (this.ViewModel != null)
			{				
				// Watch for changes in ViewModel Value
				this._valueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {

					// Update Cell Value
					if (this.Column.Visible && this.Row.Visible)
					{
						var row = this.Column.Grid._grid.row(this.Row.ID);
						var cell = this.Column.Grid._grid.cell(row, this.Column.ViewModel.Name);
								
						html.set(cell.element, this.Column.Grid._formatCell(this));
					}
					
				}));
			}
		}

	});
});