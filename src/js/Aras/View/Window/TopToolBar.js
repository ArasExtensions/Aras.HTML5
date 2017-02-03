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
	'dijit/Toolbar',
	'dijit/Tooltip',
	'../Button',
], function(declare, lang, Toolbar, Tooltip, Button) {
	
	return declare('Aras.View.Window.TopToolBar', [Toolbar], {
			
		Window: null,
		
		LoginButton: null,
		
		LogoutButton: null,
		
		constructor: function() {
			this.inherited(arguments);
	
		},
		
		startup: function() {
			this.inherited(arguments);
		
			dijit.Tooltip.defaultPosition = ['above', 'below'];
		
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
			
			// Watch for Window Session changing
			this.Window.watch('Session', lang.hitch(this, this._updateTopToolBar));
			
			// Update
			this._updateTopToolBar();
		},
		
		_updateTopToolBar: function() {
			
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

	});
});