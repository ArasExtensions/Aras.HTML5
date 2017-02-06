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
	'dojox/layout/TableContainer',
	'dijit/form/Button',
	'./Login',
	'./Window/SideMenu',
	'./Window/Status',
	'./Window/TopMenu',
	'./Containers/Toolbar',
	'./Window/Workspace',
	'./ErrorDialog',
	'../ViewModel/Server'
], function(declare, lang, BorderContainer, ContentPane, TableContainer, Button, Login, SideMenu, Status, TopMenu, TopToolBar, Workspace, ErrorDialog, Server) {
	
	return declare('Aras.View.Window', [BorderContainer], {
		
		URL: null,
		
		Server: null,
		
		Login: null,
		
		Session: null,
		
		SideMenu: null,
		
		TopMenu: null,
		
		TopToolBar: null,
		
		Status: null,
		
		Workspace: null,
		
		_applicationViewModelCache: null,
		
		_inErrorHandle: null,
		
		constructor: function() {
			
			this._applicationViewModelCache = new Object();
		},
				
		startup: function() {
			this.inherited(arguments);
			
			// Set defaults for Tooltips
			dijit.Tooltip.defaultPosition = ['above', 'below'];
			
			// Create Side Menu
			this.SideMenu = new SideMenu({ id: "sideMenu", class: "sideMenu", minSize: 180, Window: this, region: "left", splitter: true });
			this.addChild(this.SideMenu);
			
			// Create Top Menu
			this.TopMenu = new TopMenu({ id: "topMenu", class: "topMenu", region: "top", Window: this, splitter: false });
			this.addChild(this.TopMenu);
	
			// Create Top ToolBar
			this.TopToolBar = new TopToolBar({ id: "topToolBar", class: "topToolBar", region: "top", Window: this, splitter: false });
			this.addChild(this.TopToolBar);
			
			// Create Status
			this.Status = new Status({ id: "status", class: "status", region: "bottom", Window: this, splitter: false });
			this.addChild(this.Status);
			
			// Create Workspace
			this.Workspace = new Workspace({ id: "workspace", class: "workspace", region: "center", Window: this,  splitter:true });
			this.addChild(this.Workspace);
			
			// Create Server
			this.Server = new Server({ URL: this.URL });
			
			// Watch for Errors
			this._inErrorHandle = this.Server.watch('InError', lang.hitch(this, this._displayServerError));
			
			// Create Login
			this.Login = new Login({ id: "login", class: "login", Window: this, title: 'Aras Innovator Login' });
			this.Login.startup();
			
			// Display Login
			this.Login.show();
		},

		destroy: function() {
			this.inherited(arguments);
			
			if (this._inErrorHandle)
			{
				this._inErrorHandle.unwatch();
			}
			
		},
		
		_login() {
				
			// Display Login
			this.Login.show();
		},
		
		_logout() {
		
			// Clear Session
			this.set("Session", null);
			
			// Stop Application
			this.Workspace.DeleteApplications();
			
			// Clear Application ViewModel Cache
			this._applicationCache = new Object();
		},
		
		_startApplication(ApplicationType) {
			
			if (this.Session)
			{
				if (ApplicationType)
				{
					if (ApplicationType.Name)
					{
						if (this._applicationViewModelCache[ApplicationType.Name])
						{
							// Place Application in Workspace
							this.Workspace.StartApplication(this._applicationViewModelCache[ApplicationType.Name]);
						}
						else
						{
							this.Session.Application(ApplicationType.Name).then(lang.hitch(this, function(viewmodel) {
							
								// Store ViewModel
								this._applicationViewModelCache[viewmodel.Name] = viewmodel;
							
								// Place Application in Workspace
								this.Workspace.StartApplication(viewmodel);
							}));
						}
					}
				}
			}
		},
		
		_displayServerError: function() {
			
			if (this.Server != null)
			{
				if (this.Server.InError)
				{
					// Close Login Dialog
					if (this.Login)
					{
						this.Login.hide();
					}
	
					// Prepare Message Text
					var messagetext = this.Server.ErrorMessage;
					
					if (this.Server.ErrorCode == 0)
					{
						messagetext = 'Unable to connect to Innovator Server';
					}
					
					// Display Error Message
					var message = ErrorDialog({ErrorMessage: messagetext});
					message.show();
				
					// Reset Error
					this.Server.ResetError();
				}
			}
		}
		
	});
});