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
	
	return declare('Aras.View.TreeModels.RelationshipTree', [Stateful], {
		
		TreeControl: null,
		
		RootNode: null,
		
		ChildrenWatch: null,
		
		LabelWatch: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
			
			this.ChildrenWatch = {};
			
			this.LabelWatch = {};
			
			// Create Dummy Item
			this.RootNode = {ID: '-1', Name: 'Root', ChildrenLoaded: true, Children: [] };
			
			// Watch for Changes in TreeControl
			this.watch('TreeControl', lang.hitch(this, function(name, oldTreeControl, newTreeControl) {
				
				if (newTreeControl == null)
				{
					// Remove Children from RootNode
					this.RootNode.Children = [];
					
					// Signal Change
					this.onChange(this.RootNode);
					this.onChildrenChange(this.RootNode, this.RootNode.Children);
				}
				else
				{
					// Watch for Changes in Node
					newTreeControl.watch('Node', lang.hitch(this, function(name, oldNode, newNode) {
						
						this._addRootNode(newNode);
						
					}));
			
					// Add Root Node
					this._addRootNode(newTreeControl.Node);
				}
				
			}));
		},
		
		_addRootNode: function(Node) {
		
			when(Node, lang.hitch(this, function(LoadedNode) {

				if (LoadedNode != null)
				{
					// Add Node as Child of RootNode
					this.RootNode.Children = [];
					this.RootNode.Children.push(LoadedNode);
					
					// Signal Change
					this.onChange(this.RootNode);
					this.onChildrenChange(this.RootNode, this.RootNode.Children);
					this.onChange(LoadedNode);
				}
				else
				{
					// Remove Children from RootNode
					this.RootNode.Children = [];
					
					// Signal Change
					this.onChange(this.RootNode);
					this.onChildrenChange(this.RootNode, this.RootNode.Children);
				}
			}));
		},
		
		destroy: function(){
			
		},
		
		getRoot: function(onItem, onError){
		
			onItem(this.RootNode);
		},
				
		mayHaveChildren: function(item){
			
			return true;
		},
		
		getChildren: function(parentItem, onComplete, onError){
			
			if (parentItem.ID != '-1')
			{
				// Watch for Changes
				if (!this.ChildrenWatch[parentItem.ID])
				{
					this.ChildrenWatch[parentItem.ID] = parentItem.watch('Children', lang.hitch(this, "_onChildrenChange", parentItem));
				}
				
				// Load Children
				if (!parentItem.ChildrenLoaded)
				{
					parentItem.Load.Execute();
				}
			}

			onComplete(parentItem.Children);
		},
		
		_onChildrenChange: function(item) {
			
			var allitems = item.Children.slice();
			allitems.push(item);
			
			all(allitems).then(lang.hitch(this, function(loadeditems) {

				var loadeditem = loadeditems.pop();
				
				this.onChildrenChange(loadeditem, loadeditems);
			}));			
		},
		
		isItem: function(something){

			return true;
		},
		
		getIdentity: function(item){
			
			return item.ID;
		},
		
		getLabel: function(item){
			
			if (item.ID != '-1')
			{
				// Watch for changes in Name	
				if (!this.LabelWatch[item.ID])
				{
					this.LabelWatch[item.ID] = item.watch('Name', lang.hitch(this, 'onChange', item));
				}	
				
				return item.Name;
	
			}
			else
			{
				// Root Node
				return item.Name;
			}
		},
		
		newItem: function(args, parent, insertIndex, before){
			console.debug('newItem', arguments);
		},
		
		pasteItem: function(childItem, oldParentItem, newParentItem, bCopy, insertIndex, before){
			console.debug('pasteItem', arguments);
		},
		
		onChange: function(item){
		
		},
		
		onChildrenChange: function(item, children){
			
		}
		
	});
	
});