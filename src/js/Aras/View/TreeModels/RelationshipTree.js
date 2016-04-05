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
	'dojo/Stateful'
], function(declare, lang, Stateful) {
	
	return declare('Aras.View.TreeModels.RelationshipTree', [Stateful], {
		
		TreeControl: null,
		
		RootNode: null,
		
		ChildrenWatch: null,
		
		LabelWatch: null,
		
		LoadedWatch: null,

		constructor: function(args) {
			
			lang.mixin(this, args);
			
			this.ChildrenWatch = {};
			
			this.LabelWatch = {};
			
			this.LoadedWatch = {};
			
			// Create Dummy Item
			this.RootNode = {ID: '-1', Name: 'Root', Loaded: true, ChildrenLoaded: true, Children: [] };
			
			// Watch for Changes in TreeControl
			this.watch('TreeControl', lang.hitch(this, function() {
				
				if (this.TreeControl == null)
				{
					// Remove Children from RootNode
					this.RootNode.Children = [];
					
					// Signal Change
					this.onChange(this.RootNode);
					this.onChildrenChange(this.RootNode, this.RootNode.Children);
				}
				else
				{
					if (this.TreeControl.Node != null)
					{
						// Add Node as Child of RootNode
						this.RootNode.Children = [];
						this.RootNode.Children.push(this.TreeControl.Node);
					
						// Signal Change
						this.onChange(this.RootNode);
						this.onChildrenChange(this.RootNode, this.RootNode.Children);
						this.onChange(this.TreeControl.Node);
					}
					else
					{
						// Remove Children from RootNode
						this.RootNode.Children = [];
					
						// Signal Change
						this.onChange(this.RootNode);
						this.onChildrenChange(this.RootNode, this.RootNode.Children);
					}
					
					// Watch for Changes in Node
					this.TreeControl.watch('Node', lang.hitch(this, function() {
						
						if (this.TreeControl.Node != null)
						{
							// Add Node as Child of RootNode
							this.RootNode.Children = [];
							this.RootNode.Children.push(this.TreeControl.Node);
					
							// Signal Change
							this.onChange(this.RootNode);
							this.onChildrenChange(this.RootNode, this.RootNode.Children);
							this.onChange(this.TreeControl.Node);
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
			this.onChildrenChange(item, item.Children);				
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
				if (item.Loaded)
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
					// Watch for changes in Loaded
					if (!this.LoadedWatch[item.ID])
					{
						this.LoadedWatch[item.ID] = item.watch('Loaded', lang.hitch(this, 'onChange', item));
					}		
				
					return null;
				}
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