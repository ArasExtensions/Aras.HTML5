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
	'./Control',
	'./Cell',
], function(declare, lang, when, all, array, Control, Cell) {
	
	return declare('Aras.View.Row', [Control], {

		Grid: null,
		
		Cells: null,

		constructor: function() {
			this.inherited(arguments);
		},
		
		OnViewModelChange: function(name, oldValue, newValue) {
			this.inherited(arguments);
				
			if (this.Cells)
			{
				if (this.Cells.length > newValue.length)
				{
					this.Cells = this.Cells.slice(0, newValue.length);
				}
			}
			else
			{
				this.Cells = [];
			}
						
			array.forEach(newValue.Cells, lang.hitch(this, function(cellviewmodel, i){
				
				if (!this.Cells[i])
				{
					this.Cells[i] = new Cell();
					this.Cells[i].startup();
					this.Cells[i].set('Row', this);
				}
				
				this.Cells[i].set('ViewModel', cellviewmodel);
			}));			
		}
		
	});
});