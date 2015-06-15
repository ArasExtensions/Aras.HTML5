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
	'dijit/layout/BorderContainer',
	'dijit/layout/ContentPane',
	'./Control',
	'./Toolbar',
	'./Button',
	'./Grid'
], function(declare, lang, BorderContainer, ContentPane, Control, Toolbar, Button, Grid) {
	
	return declare('Aras.View.Search', [BorderContainer, Control], {
	
		Toolbar: null,
		
		SearchButton: null,
				
		Grid: null,
		
		constructor: function() {
			this.inherited(arguments);
		},
				
		startup: function() {
			this.inherited(arguments);

			// Create Toolbar
			this.Toolbar = new Toolbar({ region: 'top' });
			this.addChild(this.Toolbar);
			
			// Create Search Button
			this.SearchButton = new Button({ iconClass: 'searchIcon'});
			this.Toolbar.addChild(this.SearchButton);
			
			// Create Grid			
			this.Grid = new Grid({style: 'height: 100%; width: 100%', region: 'center', gutters: false });		
			this.addChild(this.Grid);
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Set Grid ViewModel
			this.Grid.set("ViewModel", this.ViewModel.Grid);
				
			// Set Search Button ViewModel			
			this.SearchButton.set("ViewModel", this.ViewModel.Refresh);	
		}
	});
});