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
	'dojo/when',
	'dijit/layout/ContentPane',
	'../Control',
	'../ErrorDialog'
], function(declare, when, ContentPane, Control, ErrorDialog) {
	
	return declare('Aras.View.Panes.ContentPane', [ContentPane, Control], {
		
		_content: null,
		
		constructor: function() {

		},

		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
			
			// Update ContentPane
			this._updateContentPane();
		},
		
		destroy: function() {
			this.inherited(arguments);
		},
		
		_updateContentPane: function() {
				
			if ((this.ViewModel != null) && (this.ViewModel.Content != null))
			{
				if (!this._content)
				{
					// Create Control
					this._content = this.ViewModel.Session.ViewControl(this.ViewModel.Content);
				
					// Set Content
					this.set("content", this._content);
				}
				else
				{
					this._content.ViewModel = this.ViewModel.Content;
				}
			}
			else
			{
				this.set("content", null);
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update ContentPane
			this._updateContentPane();	
		},
		
		OnError: function(Message) {
			this.inherited(arguments);
			
			// Display Error Message
			var message = ErrorDialog({ Message: Message });
			message.show();		
		}
		
	});
});