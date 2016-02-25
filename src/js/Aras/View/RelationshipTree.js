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
	'./_Tree',
	'./TreeModels/RelationshipTree',
	'dijit/layout/BorderContainer',
	'./Control',
	'./Toolbar',
	'./Button'
], function(declare, lang, _Tree, _TreeModel, BorderContainer, Control, Toolbar, Button) {
	
	return declare('Aras.View.RelationshipTree', [BorderContainer, Control], {
	
		Toolbar: null,
		
		ExpandAllButton: null,
		
		CollapseAllButton: null,
		
		Tree: null,
		
		TreeModel: null,
		
		CurrentNodeID: null,
		
		_nodeHandle: null,
		
		_nodeLoadedHandle: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Toolbar
			this.Toolbar = new Toolbar({ region: 'top' });
			this.addChild(this.Toolbar);
			
			// Create ExpandAll Button
			this.ExpandAllButton = new Button({ iconClass: 'expandAllIcon'});
			this.Toolbar.addChild(this.ExpandAllButton);
			
			// Create CollapseAll Button
			this.CollapseAllButton = new Button({ iconClass: 'collapseAllIcon'});
			this.Toolbar.addChild(this.CollapseAllButton);
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Unwatch current ViewModel
			if (this._nodeHandle != null)
			{
				this._nodeHandle.unwatch();
			}
				
			if (this.ViewModel != null)
			{
				// Add Tree
				this._updateTree();
								
				// Watch for changes in root Node
				this._nodeHandle = this.ViewModel.watch('Node', lang.hitch(this, function(name, oldValue, newValue) {
					this._updateTree();
				}));
			}
		},
		
		_updateTree: function() {
			
			if (this.ViewModel.Node != null)
			{						
				if ((this.Tree == null) || (this.CurrentNodeID != this.ViewModel.Node.ID))
				{
					if (this.ViewModel.Node.Loaded)
					{
						// Remove current Tree
						this._removeTree();
					
						// Add Tree
						this.TreeModel = new _TreeModel({ TreeControl: this.ViewModel });
						this.Tree = new _Tree({style: 'height: 100%; width: 100%', region: 'center', gutters: false, model: this.TreeModel });
						this.addChild(this.Tree);
						this.CurrentNodeID = this.ViewModel.Node.ID;
					}
					else
					{
						// Watch for when Node Loaded
						this._nodeLoadedHandle = this.ViewModel.Node.watch('Loaded', lang.hitch(this, function(name, oldValue, newValue) {
							this._updateTree();
						}));
					}
				}
			}
			else
			{
				this._removeTree();
			}
		},
				
		_removeTree: function() {
			
			if (this.Tree != null)
			{
				// Remove Tree
				this.removeChild(this.Tree);
				
				// Destroy Tree
				this.Tree.destroy();
				this.Tree = null;
			}
			
			if (this.TreeModel != null)
			{
				// Destroy Tree Model
				this.TreeModel.destroy();
				this.TreeModel = null;
			}
		}
		
	});
	
});