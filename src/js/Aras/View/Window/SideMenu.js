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
	'dojo/_base/array',
	'dojo/aspect',
	'dijit/layout/ContentPane',
	'dojox/layout/TableContainer',
	'../TreeModels/SideMenuTree',
	'../_Tree',
], function(declare, lang, array, aspect, ContentPane, TableContainer, TreeModel, _Tree) {
	
	return declare('Aras.View.Window.SideMenu', [ContentPane], {
			
		Window: null,
		
		Table: null,
		
		Logo: null,
		
		TreeModel: null,
		
		Tree: null,
		
		_sessionHandle: null,
		
		constructor: function() {
		
		},
		
		startup: function() {
			this.inherited(arguments);
		
			// Create Table to layout Logo and Menu
			this.Table = new TableContainer({ cols: 1, showLabels: false });
			this.Table.startup();
			
			// Add Menu
			this.Logo = new ContentPane({ content: '<div id="sideMenuLogo" class="sideMenuLogo"></div>'});
			this.Table.addChild(this.Logo);
			
			// Add Tree Model
			this.TreeModel = new TreeModel({ SideMenu: this, Session: this.Window.Session });
			
			// Add Tree
			this.Tree = new _Tree({ id: "sideMenuTree", class: "sideMenuTree", style: 'height: 100%; width: 100%', region: 'center', gutters: false, persist: false, model: this.TreeModel, getIconClass: this.getIconClass, showRoot: false, autoExpand: true });
			this.Tree.onClick = lang.hitch(this, function(item) {
				
				// Start Application
				this.Window._startApplication(item);
			});
			this.Table.addChild(this.Tree);
			
			this.set("content", this.Table);
			
			// Watch for Session changing
			this._sessionHandle = this.Window.watch('Session', lang.hitch(this, function() {
				
				// Update Session in Tree Model
				this.TreeModel.set("Session", this.Window.Session);
			}));
		},
		
		_autoStart: function(ApplicationType) {
			
			if (ApplicationType != null)
			{
				if (ApplicationType.Start)
				{
					// Start Application
					this.Window._startApplication(ApplicationType);
				}
				
				// Check Children
				if (ApplicationType.Children)
				{
					array.forEach(ApplicationType.Children, function(apptype){
						this._autoStart(apptype);
					}, this);
				}
			}
		},
		
		destroy: function() {
			this.inherited(arguments);
			
			if (this._sessionHandle)
			{
				this._sessionHandle.unwatch();
			}
		},
		
		getIconClass: function(item, opened) {
					
			if (item)
			{
				return 'medium' + item.Icon + 'Icon';
			}
			else
			{
				if (opened)
				{
					return 'dijitFolderOpened';
				}
				else
				{
					return 'dijitFolderClosed';
				}
			}
		}

	});
});