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
	'dojo/when',
	'dojo/promise/all',
	'dojo/Stateful'
], function(declare, lang, when, all, Stateful) {
	
	return declare('Aras.View.TreeModels.SideMenuTree', [Stateful], {
		
		SideMenu: null,
		
		Session: null,
		
		RootNode: null,
		
		_sessionHandle: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
			
			// Update
			this._update();
			
			// Watch for Changes in RootNode
			this._sessionHandle = this.watch('Session', lang.hitch(this, function() {
				
				// Update
				this._update();
			}));
		},
		
		_update: function() {
		
			if (this.Session == null)
			{
				// Create Dummy Root Node
				this.RootNode = {ID: '-1', Name: 'Root', Label: 'Root', Children: [] };
				
				// Signal Change
				this.onChange(this.RootNode);
				this.onChildrenChange(this.RootNode, this.RootNode.Children);	
			}
			else
			{
				// Get ApplicationTypes from Server and update tree
				this.Session.ApplicationTypes().then(lang.hitch(this, function(applicationtype){
					
					// Force RootNode ID to be -1
					applicationtype.ID = '-1';
					
					// Set as Root Node
					this.RootNode = applicationtype;
				
					// Signal Change
					this.onChange(this.RootNode);
					this.onChildrenChange(this.RootNode, this.RootNode.Children);	
					
					// Auto Start
					this.SideMenu._autoStart(applicationtype);
				}));
			}
		},
		
		destroy: function(){
			this.inherited(arguments);
			
			if (this._sessionHandle)
			{
				this._sessionHandle.unwatch();
			}
		},
		
		getRoot: function(onItem, onError){
		
			onItem(this.RootNode);
		},
				
		mayHaveChildren: function(item){
			
			if (item.Children)
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		
		getChildren: function(parentItem, onComplete, onError){

			if (parentItem)
			{
				if (parentItem.Children)
				{
					onComplete(parentItem.Children);
				}
				else
				{
					onComplete([]);
				}
			}
			else
			{
				onComplete([]);
			}
		},
		
		isItem: function(something){

			return true;
		},
		
		getIdentity: function(item){
			
			if (item)
			{
				return item.ID;
			}
			else
			{
				return null;
			}
		},
		
		getLabel: function(item){
			
			if (item)
			{
				return item.Label;
			}
			else
			{
				return null;
			}
		},
		
		newItem: function(args, parent, insertIndex, before){
			
		},
		
		pasteItem: function(childItem, oldParentItem, newParentItem, bCopy, insertIndex, before){
			
		},
		
		onChange: function(item){
		
		},
		
		onChildrenChange: function(item, children){
			
		}
		
	});
	
});