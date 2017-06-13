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
	'dijit/layout/BorderContainer',
	'dijit/layout/ContentPane',
	'dojox/layout/TableContainer',
	'dijit/form/Button',
	'./Login',
	'./Window/SideMenu',
	'./Window/TopMenu',
	'./Containers/Toolbar',
	'./Window/Workspace',
	'./ErrorDialog',
	'../ViewModel/Server'
], function(declare, lang, BorderContainer, ContentPane, TableContainer, Button, Login, SideMenu, TopMenu, TopToolBar, Workspace, ErrorDialog, Server) {
	
	return declare('Aras.View.Window', [BorderContainer], {
		
		URL: null,
		
		Server: null,
		
		Login: null,
		
		Session: null,
		
		SideMenu: null,
		
		_sideMenuOpen: null,
		
		TopMenu: null,
		
		TopToolBar: null,
				
		Workspace: null,
		
		_applicationViewModelCache: null,
		
		_inErrorHandle: null,
		
		constructor: function() {
			
			this._applicationViewModelCache = new Object();
			this._sideMenuOpen = true;
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

		toggleSideMenu: function() {
		
			if (this._sideMenuOpen)
			{
				this.removeChild(this.SideMenu);
				this._sideMenuOpen = false;
			}
			else
			{
				this.addChild(this.SideMenu);
				this._sideMenuOpen = true;
			}
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			if (this._inErrorHandle)
			{
				this._inErrorHandle.unwatch();
			}
			
		},
		
		_login: function() {
				
			// Display Login
			this.Login.Display();
		},
		
		_logout: function() {
		
			// Clear Session
			this.set("Session", null);
			
			// Stop Application
			this.Workspace.DeleteApplications();
			
			// Clear Application ViewModel Cache
			this._applicationCache = new Object();
			
			// Clear Toolbar
			this.TopToolBar.set("ViewModel", null);
			
			// Clear Application Cache
			this._applicationViewModelCache = new Object();
		},
		
		_startApplication: function(ApplicationType) {
			
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
					var message = ErrorDialog({ Message: messagetext });
					message.show();
				
					// Reset Error
					this.Server.ResetError();
				}
			}
		}
		
	});
});