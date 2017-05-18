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
				application = new Application({ ViewModel: ViewModel });
				
				// Add to TabContainer
				this.addChild(application);
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