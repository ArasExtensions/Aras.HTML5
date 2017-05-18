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
	'dojo/_base/array',
	'./Control',
	'./ErrorDialog'
], function(declare, array, Control, ErrorDialog) {
	
	return declare('Aras.View.Container', [Control], {
			
		_addChildren: function() {
			
			if (this.ViewModel != null)
			{
				array.forEach(this.ViewModel.Children, function(childviewmodel) {
					
					var control = childviewmodel.Session.ViewControl(childviewmodel);
					this.addChild(control);
					
				}, this);
			}
		},
		
		_removeChildren: function() {
			
			var children = this.getChildren();
			
			array.forEach(children, function(child) {
				child.destroyRecursive();
				this.removeChild(child);
			}, this);
		},
		
		OnError: function(Message) {
			this.inherited(arguments);
			
			// Display Error Message
			var message = ErrorDialog({ Message: Message });
			message.show();		
		}
		
	});
});