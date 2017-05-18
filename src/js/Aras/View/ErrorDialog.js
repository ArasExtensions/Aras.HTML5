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
	'dojo/dom',
	'dijit/Dialog',
	'dijit/layout/ContentPane'
], function(declare, lang, dom, Dialog, ContentPane) {
	
	return declare('Aras.View.ErrorDialog', [Dialog], {
			
		Message: null,
		
		constructor: function() {
		
		},
				
		startup: function() {
	
			if(!this._started)
			{
				// Create Layout
				var layout = new ContentPane({content: '<span class="dijitInline mediumErrorIcon" style="padding-right: 5px;"></span><span class="dijitInline" style="min-width: 200px;">' + this.Message + '</span>'});
				this.set('content', layout);
					
								
				// Set Title
				this.set('title', 'Error');	
			}		

			this.inherited(arguments);				
		}

	});
});