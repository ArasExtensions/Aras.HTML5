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
	'dijit/layout/TabContainer',
	'../Containers/Application',
], function(declare, lang, TabContainer, Application) {
	
	return declare('Aras.View.Window.Workspace', [TabContainer], {
			
		Window: null,
		
		constructor: function() {
		
			this.inherited(arguments);
			
			this.tabPosition = "bottom";
			this.tabStrip = "true";
		},
		
		startup: function() {
			this.inherited(arguments);

		},
		
		StartApplication: function(ViewModel) {
			
			var currentapplicatons = this.getChildren();
			var application = null;
			
			for(var i=0; i<currentapplicatons.length; i++)
			{
				if (currentapplicatons[i].id == ViewModel.Name)
				{
					application = currentapplicatons[i];
					break;
				}
			}
			
			if (application == null)
			{
				// Create Application
				application = new Application({ id: ViewModel.Name, title: ViewModel.Label, iconClass: "small" + ViewModel.Icon + "Icon" });
				
				// Add to TabContainer
				this.addChild(application);
			
				// Set Application ViewModel
				application.set("ViewModel", ViewModel);
			}
			
			// Select Application
			this.selectChild(application);
			
			// Update Toolbar
			this.Window.TopToolBar.set("ViewModel", ViewModel.Toolbar);
		},
		
		DeleteApplications: function() {
			
			var currentapplicatons = this.getChildren();
			
			for(var i=0; i<currentapplicatons.length; i++)
			{
				this.removeChild(currentapplicatons[i]);
				currentapplicatons[i].destroyRecursive();
			}
		}

	});
});