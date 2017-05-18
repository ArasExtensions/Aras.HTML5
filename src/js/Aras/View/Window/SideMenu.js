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