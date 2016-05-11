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
	'dijit/Dialog',
	'./Search',
	'./Control',
	'./Toolbar',
	'./Button'
], function(declare, lang, _Tree, _TreeModel, BorderContainer, Menu, MenuItem, MenuSeparator, ToolbarSeparator, Tooltip, Dialog, Search, Control, Toolbar, Button) {
	
	return declare('Aras.View.RelationshipTree', [BorderContainer, Control], {
	
		Toolbar: null,
		
		ExpandAllButton: null,
		
		CollapseAllButton: null,
		
		RefreshButton: null,
		
		SaveButton: null,
		
		AddButton: null,
		
		CutButton: null,
		
		CopyButton: null,
		
		PasteButton: null,
		
		DeleteButton: null,
		
		IndentButton: null,
		
		OutdentButton: null,
		
		UndoButton: null,
		
		Tree: null,
		
		TreeModel: null,
		
		ContextMenu: null,
		
		CutMenuItem: null,
		
		CopyMenuItem: null,
		
		PasteMenuItem: null,
		
		DeleteMenuItem: null,
		
		IndentMenuItem: null,
				
		UndoMenuItem: null,
		
		SearchDialog: null,
		
		SearchControl: null,
		
		_viewModelID: null,
		
		constructor: function(args) {
			
			lang.mixin(this, args);
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Create Search Control
			this.SearchControl = new Search({style: 'width:500px; height: 600px;'});
			this.SearchControl.startup();
			
			// Create Search Dialog
			this.SearchDialog = new Dialog({onHide: lang.hitch(this, this._SearchDialogClosed), content: this.SearchControl, title: 'Select Item'});
			this.SearchDialog.startup();
			
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
			
			// Create Refresh Button
			this.RefreshButton = new Button({ iconClass: 'refreshIcon'});
			this.Toolbar.addChild(this.RefreshButton);
			var refreshtooltip = new Tooltip({connectId: this.RefreshButton.id, label: 'Refresh'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
			
			// Create Save Button
			this.SaveButton = new Button({ iconClass: 'saveIcon'});
			this.Toolbar.addChild(this.SaveButton);
			var savetooltip = new Tooltip({connectId: this.SaveButton.id, label: 'Save All Changes'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
		
			// Create Undo Button
			this.UndoButton = new Button({ iconClass: 'undoIcon'});
			this.Toolbar.addChild(this.UndoButton);
			var undotooltip = new Tooltip({connectId: this.UndoButton.id, label: 'Undo All Changes'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
			
			// Create Add Button
			this.AddButton = new Button({ iconClass: 'newIcon'});
			this.Toolbar.addChild(this.AddButton);
			var addtooltip = new Tooltip({connectId: this.AddButton.id, label: 'Add Existing Item'});
			
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
			
			// Create Outdent Button
			this.OutdentButton = new Button({ iconClass: 'arrowLeftIcon'});
			this.Toolbar.addChild(this.OutdentButton);
			var outdenttooltip = new Tooltip({connectId: this.OutdentButton.id, label: 'Outdent the Selected Tree Node'});
			
			// Create Indent Button
			this.IndentButton = new Button({ iconClass: 'arrowRightIcon'});
			this.Toolbar.addChild(this.IndentButton);
			var indenttooltip = new Tooltip({connectId: this.IndentButton.id, label: 'Indent the Selected Tree Node'});
			
			this.Toolbar.addChild(new ToolbarSeparator());
			
			// Create Tree Model
			this.TreeModel = new _TreeModel();
			
			// Create Tree
			this.Tree = new _Tree({style: 'height: 100%; width: 100%', region: 'center', gutters: false, persist: false, model: this.TreeModel, getIconClass: this.getIconClass, showRoot: false });
			this.addChild(this.Tree);
			
			// Create Context Menu
			this.ContextMenu = new Menu({ targetNodeIds: [this.Tree.id]});
						
			// Create Cut Menu Item
			this.CutMenuItem = new MenuItem({label: 'Cut', iconClass: 'smallCutIcon'});
			this.ContextMenu.addChild(this.CutMenuItem);
						
			// Create Copy Menu Item
			this.CopyMenuItem = new MenuItem({label: 'Copy', iconClass: 'smallCopyIcon'});
			this.ContextMenu.addChild(this.CopyMenuItem);
			
			this.ContextMenu.addChild(new MenuSeparator());
						
			// Create Paste Menu Item
			this.PasteMenuItem = new MenuItem({label: 'Paste', iconClass: 'smallPasteIcon'});
			this.ContextMenu.addChild(this.PasteMenuItem);
						
			this.ContextMenu.addChild(new MenuSeparator());
						
			// Add Delete
			this.DeleteMenuItem = new MenuItem({label: 'Delete', iconClass: 'smallDeleteIcon'});
			this.ContextMenu.addChild(this.DeleteMenuItem);
						
			this.ContextMenu.addChild(new MenuSeparator());

			// Add Outdent
			this.OutdentMenuItem = new MenuItem({label: 'Outdent', iconClass: 'smallArrowLeftIcon'});
			this.ContextMenu.addChild(this.OutdentMenuItem);
			
			// Add Indent
			this.IndentMenuItem = new MenuItem({label: 'Indent', iconClass: 'smallArrowRightIcon'});
			this.ContextMenu.addChild(this.IndentMenuItem);
		},
		
		_SearchDialogClosed: function() {
		
			if (this.ViewModel != null)
			{
				this.ViewModel.SearchClosed.Execute();
			}
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
				
			if ((this.ViewModel != null) && (this.ViewModel.ID != this._viewModelID))
			{
				this._viewModelID = this.ViewModel.ID;
				
				// Update Search Model
				this.SearchControl.set('ViewModel', this.ViewModel.Search);
				
				// Update Tree Model
				this.TreeModel.set('TreeControl', this.ViewModel);
				
				// Connect Buttons
				this.RefreshButton.set('ViewModel', this.ViewModel.Refresh);
				this.SaveButton.set('ViewModel', this.ViewModel.Save);
				this.UndoButton.set('ViewModel', this.ViewModel.Undo);
				this.AddButton.set('ViewModel', this.ViewModel.Add);
				this.CutButton.set('ViewModel', this.ViewModel.Cut);
				this.CopyButton.set('ViewModel', this.ViewModel.Copy);
				this.PasteButton.set('ViewModel', this.ViewModel.Paste);
				this.DeleteButton.set('ViewModel', this.ViewModel.Delete);
				this.IndentButton.set('ViewModel', this.ViewModel.Indent);
				this.OutdentButton.set('ViewModel', this.ViewModel.Outdent);
				
				// Connect Menu Items
				this.CutMenuItem.set('ViewModel', this.ViewModel.Cut);
				this.CopyMenuItem.set('ViewModel', this.ViewModel.Copy);
				this.PasteMenuItem.set('ViewModel', this.ViewModel.Paste);
				this.DeleteMenuItem.set('ViewModel', this.ViewModel.Delete);
				this.IndentMenuItem.set('ViewModel', this.ViewModel.Indent);
				this.OutdentMenuItem.set('ViewModel', this.ViewModel.Outdent);
			
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

				// Watch for Changes in ShowSearch
				this.ViewModel.watch('ShowSearch', lang.hitch(this, function(name, oldValue, newValue) {
					
					if (newValue)
					{
						this.SearchDialog.show();
					}
					else
					{
						this.SearchDialog.hide();
					}
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
		}

	});
	
});