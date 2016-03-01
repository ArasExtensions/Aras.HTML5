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
	'./Menu',
	'./MenuItem',
	'dijit/MenuSeparator',
	'dijit/ToolbarSeparator',
	'dijit/Tooltip',
	'./Control',
	'./Toolbar',
	'./Button'
], function(declare, lang, _Tree, _TreeModel, BorderContainer, Menu, MenuItem, MenuSeparator, ToolbarSeparator, Tooltip, Control, Toolbar, Button) {
	
	return declare('Aras.View.RelationshipTree', [BorderContainer, Control], {
	
		Toolbar: null,
		
		ExpandAllButton: null,
		
		CollapseAllButton: null,
		
		SaveButton: null,
		
		CutButton: null,
		
		CopyButton: null,
		
		PasteButton: null,
		
		DeleteButton: null,
		
		Tree: null,
		
		TreeModel: null,
		
		ContextMenu: null,
		
		CurrentNodeID: null,
		
		_nodeHandle: null,
		
		_nodeLoadedHandle: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
		},
		
		startup: function() {
			this.inherited(arguments);
			
			dijit.Tooltip.defaultPosition = ['above', 'below'];
			
			// Create Toolbar
			this.Toolbar = new Toolbar({ region: 'top' });
			this.addChild(this.Toolbar);
			
			// Create ExpandAll Button
			this.ExpandAllButton = new Button({ iconClass: 'expandAllIcon'});
			this.Toolbar.addChild(this.ExpandAllButton);
			this.ExpandAllButton.set('onClick', lang.hitch(this, function() {
				this.Tree.expandAll();
			}));
			
			var expandalltooltip = new Tooltip({connectId: this.ExpandAllButton.id, label: 'Expand All Tree Nodes'});
			
			// Create CollapseAll Button
			this.CollapseAllButton = new Button({ iconClass: 'collapseAllIcon'});
			this.Toolbar.addChild(this.CollapseAllButton);
			this.CollapseAllButton.set('onClick', lang.hitch(this, function() {
				this.Tree.collapseAll();
			}));
			
			var collapsealltooltip = new Tooltip({connectId: this.CollapseAllButton.id, label: 'Collapse All Tree Nodes'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
			
			// Create Save Button
			this.SaveButton = new Button({ iconClass: 'saveIcon'});
			this.Toolbar.addChild(this.SaveButton);
			var savetooltip = new Tooltip({connectId: this.SaveButton.id, label: 'Save All Changes'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
			
			// Create Cut Button
			this.CutButton = new Button({ iconClass: 'cutIcon'});
			this.Toolbar.addChild(this.CutButton);
			var cuttooltip = new Tooltip({connectId: this.CutButton.id, label: 'Cut Selected Tree Node'});
			
			// Create Copy Button
			this.CopyButton = new Button({ iconClass: 'copyIcon'});
			this.Toolbar.addChild(this.CopyButton);

			var copytooltip = new Tooltip({connectId: this.CopyButton.id, label: 'Copy Selected Tree Node'});
			
			// Create Paste Button
			this.PasteButton = new Button({ iconClass: 'pasteIcon'});
			this.Toolbar.addChild(this.PasteButton);
			var pastetooltip = new Tooltip({connectId: this.PasteButton.id, label: 'Paste as a Child of the Selected Tree Node'});
			
			// Create Delete Button
			this.DeleteButton = new Button({ iconClass: 'deleteIcon'});
			this.Toolbar.addChild(this.DeleteButton);
			var deletetooltip = new Tooltip({connectId: this.DeleteButton.id, label: 'Delete Selected Tree Node'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
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
				// Connect Commands
				this.SaveButton.set('ViewModel', this.ViewModel.Save);
				this.CutButton.set('ViewModel', this.ViewModel.Cut);
				this.CopyButton.set('ViewModel', this.ViewModel.Copy);
				this.PasteButton.set('ViewModel', this.ViewModel.Paste);
				this.DeleteButton.set('ViewModel', this.ViewModel.Delete);
				
				// Add Tree
				this._updateTree();
								
				// Watch for changes in root Node
				this._nodeHandle = this.ViewModel.watch('Node', lang.hitch(this, function(name, oldValue, newValue) {
					this._updateTree();
				}));
			}
		},
		
		getIconClass: function(item, opened) {
					
			if (item)
			{
				if (opened)
				{
					return 'small' + item.OpenIcon + 'Icon';
				}
				else
				{
					return 'small' + item.ClosedIcon + 'Icon';
				}
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
						this.Tree = new _Tree({style: 'height: 100%; width: 100%', region: 'center', gutters: false, persist: false, model: this.TreeModel, getIconClass: this.getIconClass });
						this.addChild(this.Tree);
						this.CurrentNodeID = this.ViewModel.Node.ID;
						
						// Watch for changes in SelectedItems
						this.Tree.watch('selectedItems', lang.hitch(this, function(name, oldValue, newValue) {

							if ((newValue != null) && (newValue.length > 0))
							{
								this.ViewModel.Select.Execute([newValue[0].ID]);
							}
						}));
						
						// Switch on ExpandAll and CollapseAll Buttons
						this.ExpandAllButton.SetEnabled(true);
						this.CollapseAllButton.SetEnabled(true);
						
						// Add Context Menu
						this.ContextMenu = new Menu({ targetNodeIds: [this.Tree.id]});
						
						// Add Cut
						var cutmenuitem = new MenuItem({label: 'Cut', iconClass: 'smallCutIcon'});
						this.ContextMenu.addChild(cutmenuitem);
						cutmenuitem.set('ViewModel', this.ViewModel.Cut);
			
						// Add Copy
						var copymenuitem = new MenuItem({label: 'Copy', iconClass: 'smallCopyIcon'});
						this.ContextMenu.addChild(copymenuitem);
						copymenuitem.set('ViewModel', this.ViewModel.Copy);
						
						this.ContextMenu.addChild(new MenuSeparator());
						
						// Add Paste
						var pastemenuitem = new MenuItem({label: 'Paste', iconClass: 'smallPasteIcon'});
						this.ContextMenu.addChild(pastemenuitem);
						pastemenuitem.set('ViewModel', this.ViewModel.Paste);
						
						this.ContextMenu.addChild(new MenuSeparator());
						
						// Add Delete
						var deletemenuitem = new MenuItem({label: 'Delete', iconClass: 'smallDeleteIcon'});
						this.ContextMenu.addChild(deletemenuitem);
						deletemenuitem.set('ViewModel', this.ViewModel.Delete);
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

			if (this.ContextMenu != null)
			{
				this.ContextMenu.destroy();
				this.ContextMenu = null;
			}
			
			this.ExpandAllButton.SetEnabled(false);
			this.CollapseAllButton.SetEnabled(false);
		}
		
	});
	
});