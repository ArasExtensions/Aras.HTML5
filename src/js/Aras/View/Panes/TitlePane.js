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
	'dijit/TitlePane',
	'../Control',
], function(declare, lang, when, TitlePane, Control) {
	
	return declare('Aras.View.Panes.TitlePane', [TitlePane, Control], {
		
		startup: function() {
			this.inherited(arguments);

			// Call Control Startup
			this._startup();
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			// Call Control Destroy
			this._destroy();
		},
		
		buildRendering: function() {
			this.inherited(arguments);
			
			this._updateTitlePane();
		},
				
		_updateTitlePane: function() {
			
			if (this.ViewModel)
			{				
				this.set("title", this.ViewModel.Title);
				this.set("open", this.ViewModel.Open);
			
				if(this.ViewModel.Content)
				{
					this.set("content", this.ViewModel.Session.ViewControl(this.ViewModel.Content));
				}
				else
				{
					this.set("content", null);
				}
			}
			else
			{
				this.set("title", null);
				this.set("open", false);
				this.set("content", null);
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);
			
			// Update TotlePane
			this._updateTitlePane();	
		}
		
	});
});