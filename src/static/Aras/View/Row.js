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
	'./Control',
	'./Cell',
], function(declare, lang, array, Control, Cell) {
	
	return declare('Aras.View.Row', [Control], {

		Grid: null,
		
		Cells: null,

		Loaded: null,
		
		constructor: function() {
			this.inherited(arguments);
			
			this.set('Loaded', false);
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
				
			// Ensure correct number of Cells
			if (this.Cells)
			{
				if (this.Cells.length > this.ViewModel.Cells.length)
				{
					this.Cells = this.Cells.slice(0, this.ViewModel.Cells.length);
				}
			}
			else
			{
				this.Cells = [];
			}
				
			// Set ViewModel for each Cell
			array.forEach(this.ViewModel.Cells, function(cellviewmodel, i) {
			
				if (!this.Cells[i])
				{
					this.Cells[i] = new Cell();
					this.Cells[i].startup();
					this.Cells[i].set('Row', this);
				}
				
				this.Cells[i].set('ViewModel', cellviewmodel);
			}, this);

			// Set to Loaded
			this.set('Loaded', true);			
		}
		
	});
});