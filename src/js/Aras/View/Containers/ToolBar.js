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
	'../Container',
	'../Button',
	'dijit/Tooltip',
	'dijit/ToolbarSeparator',
], function(declare, lang, all, Toolbar, Container, Button, Tooltip, Separator) {
	
	return declare('Aras.View.Containers.Toolbar', [Toolbar, Container], {
		
		Window: null,
		
		LoginButton: null,
		
		LogoutButton: null,
		
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