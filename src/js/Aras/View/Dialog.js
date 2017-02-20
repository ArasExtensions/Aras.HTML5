/*
  Aras.HTML5 provides a HTML5 client library to build Aras Innovator Applications

  Copyright (C) 2017 Processwall Limited.

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
	'dijit/Dialog',
	'./Control'
], function(declare, lang, Dialog, Control) {
	
	return declare('Aras.View.Dialog', [Dialog, Control], {
		
		_content: null,
		
		_viewModelOpenHandle: null,
		
		_openHandle: null,
		
		baseClass: 'dijitContentPaneNoPadding',
		
		constructor: function () {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();

			// Update Dialog
			this._updateDialog();
		},
		
		_updateDialog: function() {
			
			if (this.ViewModel != null)
			{
				// Set Title
				this.set('title', this.ViewModel.Title);
				
				if (this.ViewModel.Content != null)
				{
					// Set Content
					if (this._content == null)
					{
						this._content = this.ViewModel.Session.ViewControl(this.ViewModel.Content);
						this.set('content', this._content);
					}
					else
					{
						// Update ViewModel
						this._content.set('ViewModel', this.ViewModel.Content);
					}
				}
				else
				{
					this.set('content', null);
				}
				
				if (this.ViewModel.Open)
				{
					this.show();
				}
				else
				{
					this.hide();
				}
				
				// Watch for changes in ViewModel Open value
				if (!this._viewModelOpenHandle)
				{
					this._viewModelOpenHandle = this.ViewModel.watch('Open', lang.hitch(this, function(name, oldValue, newValue) {
				
						// Stop ViewModel Update
						this._updateFromViewModel = true;
						
						if (newValue)
						{										
							this.show();
						}
						else
						{
							this.hide();
						}
						
						// Start ViewModel Update
						this._updateFromViewModel = false;
					}));
				}
				
				// Watch for changes in Control open
				if (!this._openHandle)
				{
					this._openHandle = this.watch('open', lang.hitch(this, function(name, oldValue, newValue) {
				
						if (oldValue !== newValue)
						{										
							if (!this._updateFromViewModel)
							{
								// Update ViewModel Value
								this.ViewModel.set('Open', newValue);
								this.ViewModel.Write();
							}
						}
	
					}));
				}
			}
			else
			{
				if (this._openHandle)
				{
					this._openHandle.unwatch();
				}
				
				if (this._viewModelOpenHandle)
				{
					this._viewModelOpenHandle.unwatch();
				}
				
				this.hide();
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update Dialog
			this._updateDialog();	
		}
		
	});
});