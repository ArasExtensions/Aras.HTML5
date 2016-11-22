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
	'dijit/ToolbarSeparator',
	'dijit/layout/BorderContainer',
	'../Control',
	'../Grid',
	'../Toolbar',
	'../Button'
], function(declare, lang, when, ToolbarSeparator, BorderContainer, Control, Grid, Toolbar, Button) {
	
	return declare('Aras.View.Design.Order', [BorderContainer, Control], {
	
		Configuration: null,
		
		BOM: null, 
		
		Toolbar: null,
				
		SaveButton: null,
		
		UpdateBOMButton: null,
		
		startup: function() {
			
			this.inherited(arguments);
			
			// Create Toolbar
			this.Toolbar = new Toolbar({ region: 'top' });
			this.addChild(this.Toolbar);
					
			// Create Update BOM Button
			this.UpdateBOMButton = new Button({ title: 'Update BOM', iconClass: 'refreshIcon'});
			this.Toolbar.addChild(this.UpdateBOMButton);
			
			// Create Save Button
			this.SaveButton = new Button({ title: 'Update BOM and Save', iconClass: 'saveIcon'});
			this.Toolbar.addChild(this.SaveButton);

			// Create BOM
			this.BOM = new Grid({ style: 'width: 500px; height: 100%;', region: 'right' });
			this.addChild(this.BOM);
			
			// Create Configuration
			this.Configuration = new Grid({ region: 'center', style: 'width: 100%; height: 100%;', gutters: false });
			this.addChild(this.Configuration);
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
									
			if (this.ViewModel != null)
			{
				// Set Configuration ViewModel
				this.Configuration.set("ViewModel", this.ViewModel.Configuration);
	
				// Set BOM ViewModel
				this.BOM.set("ViewModel", this.ViewModel.BOM);	
					
				// Update Save
				this.SaveButton.set('ViewModel', this.ViewModel.Save);
								
				// Update UpdateBOM
				this.UpdateBOMButton.set('ViewModel', this.ViewModel.BuildFlatBOM);
			}
		}
	});
});