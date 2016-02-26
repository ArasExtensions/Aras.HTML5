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
	'dojo/_base/lang'
], function(declare, lang) {
	
	return declare('Aras.View.TreeModels.RelationshipTree', null, {
		
		TreeControl: null,

		constructor: function(args) {
			
			lang.mixin(this, args);
			
			// Watch for changes in the Root Node Name
			//this.TreeControl.Node.watch('Name', lang.hitch(this, "_onChildrenChange", this.TreeControl.Node));
		},
		
		destroy: function(){
			
		},
		
		getRoot: function(onItem, onError){
			
			onItem(this.TreeControl.Node);
		},
				
		mayHaveChildren: function(item){
			
			return true;
		},
		
		getChildren: function(parentItem, onComplete, onError){
			
			console.debug('getChildren', parentItem.ChildrenLoaded);
			
			// Load Children
			if (!parentItem.ChildrenLoaded)
			{
				parentItem.Load.Execute();
				parentItem.watch('ChildrenLoaded', lang.hitch(this, "_onChildrenChange", parentItem));
			}
			
			onComplete(parentItem.Children);
		},
		
		_onChildrenChange: function(item) {
			this.onChange(item);
			this.onChildrenChange(item, item.Children);
		},
		
		isItem: function(something){

			return true;
		},
		
		getIdentity: function(item){
			
			return item.ID;
		},
		
		getLabel: function(item){

			if (item.Loaded)
			{
				return item.Name;
			}
			else
			{
				item.watch('Name', lang.hitch(this, 'onChange', item));
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