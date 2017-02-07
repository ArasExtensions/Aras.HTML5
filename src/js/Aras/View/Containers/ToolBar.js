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
	'dojo/promise/all',
	'dijit/Toolbar',
	'../Control',
	'dijit/Tooltip',
	'../Button',
	'dijit/ToolbarSeparator',
], function(declare, lang, all, Toolbar, Control, Tooltip, Button, Separator) {
	
	return declare('Aras.View.Containers.Toolbar', [Toolbar, Control], {
		
		Window: null,
		
		LoginButton: null,
		
		LogoutButton: null,
		
		_sessionHandle: null,
		
		constructor: function(args) {
	
		},
		
		startup: function() {
			this.inherited(arguments);
			
			this._addTopButtons();
		},
		
		destroy: function() {
			this.inherited(arguments);
		
			if (this._sessionHandle)
			{
				this._sessionHandle.unwatch();
			}		
		},
		
		_addTopButtons: function() {
		
			if (this.Window != null)
			{
				// Add Login Button
				this.LoginButton = new Button({ iconClass: "smallLoginIcon"});
				this.LoginButton.set('onClick', lang.hitch(this, function() {
					this.Window._login();
				}));
				this.addChild(this.LoginButton);
				var logintooltip = new Tooltip({connectId: this.LoginButton.id, label: 'Login'});
			
				// Add Logout Button
				this.LogoutButton = new Button({ iconClass: "smallLogoutIcon"});
				this.LogoutButton.set('onClick', lang.hitch(this, function() {
					this.Window._logout();
				}));
				this.addChild(this.LogoutButton);
				var logouttooltip = new Tooltip({connectId: this.LogoutButton.id, label: 'Logout'});
			
				var sep = new Separator();
				this.addChild(sep);
				
				// Watch for Window Session changing
				
				if (this._sessionHandle)
				{
					this._sessionHandle.unwatch();
				}
				
				this._sessionHandle = this.Window.watch('Session', lang.hitch(this, this._updateTopToolBar));
			
				// Update
				this._updateTopToolBar();
				
				return true;
			}
			else
			{
				return false;
			}
		},
		
		_updateTopToolBar: function() {
			
			if (this.Window != null)
			{
				if (this.Window.Session == null)
				{
					this.LoginButton.SetEnabled(true);
					this.LogoutButton.SetEnabled(false);
				}
				else
				{
					this.LoginButton.SetEnabled(false);
					this.LogoutButton.SetEnabled(true);
				}
			}				
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Clear Toolbar
			var children = this.getChildren();
			
			for(var i=0; i<children.length; i++)
			{
				children[i].destroyRecursive();
				this.removeChild(children[i]);
			}
			
			// Add Top Buttons
			this._addTopButtons();
			
			if (this.ViewModel != null)
			{
				// Check all ViewModels are loaded
				all(this.ViewModel.Children).then(lang.hitch(this, function(childviewmodels) {

					// Get all required Control Paths
					var controlpaths = [];
					
					for(var i=0; i<childviewmodels.length; i++)
					{
						controlpaths.push(this.ControlPath(childviewmodels[i]));
					}
						
					// Ensure all Controls are loaded
					require(controlpaths, lang.hitch(this, function() {
						
						for(var i=0; i<childviewmodels.length; i++)
						{
							var controltype = arguments[i];
							
							var childviewmodel = childviewmodels[i];

							// Create Control
							var control = new controltype(this.ControlParameters(childviewmodel));
				
							// Add to Toolbar
							this.addChild(control);
				
							// Set ViewModel
							control.set("ViewModel", childviewmodel);	
						}
					}));
				}));	
			}
		}
	});
});