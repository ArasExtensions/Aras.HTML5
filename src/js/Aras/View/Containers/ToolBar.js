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
	'dojo/promise/all',
	'dijit/Toolbar',
	'../Container',
	'../Button',
	'dijit/Tooltip',
	'dijit/ToolbarSeparator',
], function(declare, lang, all, Toolbar, Container, Button, Tooltip, Separator) {
	
	return declare('Aras.View.Containers.Toolbar', [Toolbar, Container], {
		
		Window: null,
		
		LoginButton: null,
		
		LogoutButton: null,
		
		HideSideMenuButton: null,
		
		_sessionHandle: null,
		
		constructor: function(args) {
	
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Container Startup
			this._startup();
			
			this._updateToolbar();
		},
		
		destroy: function() {
			this.inherited(arguments);
		
			// Call Container Destroy
			this._destroy();
			
			if (this._sessionHandle)
			{
				this._sessionHandle.unwatch();
			}		
		},
		
		_addTopButtons: function() {
		
			if (this.Window != null)
			{
				// Add Toggle Side Menu
				this.HideSideMenuButton = new Button({ iconClass: "mediumMenuIcon"});
				this.HideSideMenuButton.set('onClick', lang.hitch(this, function() {
					this.Window.toggleSideMenu();
				}));
				this.addChild(this.HideSideMenuButton);
				var hidesidemenutip = new Tooltip({connectId: this.HideSideMenuButton.id, label: 'Toggle Side Menu'});
				
				// Add Login Button
				this.LoginButton = new Button({ iconClass: "mediumLoginIcon"});
				
				this.LoginButton.set('onClick', lang.hitch(this, function() {
					this.Window._login();
				}));
				this.addChild(this.LoginButton);
				var logintooltip = new Tooltip({connectId: this.LoginButton.id, label: 'Login'});
			
				// Add Logout Button
				this.LogoutButton = new Button({ iconClass: "mediumLogoutIcon"});
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
		
		_updateToolbar: function() {
			
			// Clear Toolbar
			this._removeChildren()
						
			// Add Top Buttons
			this._addTopButtons();
			
			// Add Control Buttons
			this._addChildren();
		},
		
		OnViewModelChanged: function() {
			this.inherited(arguments);

			this._updateToolbar();
		}
	});
});