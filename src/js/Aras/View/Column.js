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
	'./Control'
], function(declare, lang, when, Control) {
	
	return declare('Aras.View.Column', [Control], {

		Grid: null,
		
		Name: null,
		
		Label: null,
		
		Loaded: null,
		
		constructor: function() {
			this.inherited(arguments);
			
			this.set('Loaded', false);
		},
		
		startup: function() {
			this.inherited(arguments);
		},
				
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			if (this.ViewModel != null)
			{
				this.set('Name', this.ViewModel.Name);
				this.set('Label', this.ViewModel.Label);
				this.set('Loaded', true);
			
				this.Grid._refreshColumns();
			}
		}
		
	});
});