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
	'dijit/TitlePane',
	'../Control',
], function(declare, ContentPane, Control) {
	
	return declare('Aras.View.Panes.TitlePane', [TitlePane, Control], {
		
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
		},
		
		destroy: function() {
			this.inherited(arguments);
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			if (this.content)
			{
				// Destroy current content
				this.content.destroyRecursive();
			}
				
			if ((this.ViewModel != null) && (this.ViewModel.Content != null))
			{				
				this.set("title", this.ViewModel.Title);
				this.set("open", this.ViewModel.Open);
				
				when(this.ViewModel.Content, lang.hitch(this, function(contentviewmodel) {
					
					// Check Control is loaded
					require([this.ControlPath(contentviewmodel)], lang.hitch(this, function(controlType) {
					
						// Create Control
						var control = new controlType(this.ControlParameters(contentviewmodel));
				
						// Set Content
						this.set("content", control);
				
						// Set ViewModel
						control.set("ViewModel", contentviewmodel);
					}));
				}));
			}
			else
			{
				this.set("content", null);
				this.set("title", null);
				this.set("open", false);
			}
		}
		
	});
});