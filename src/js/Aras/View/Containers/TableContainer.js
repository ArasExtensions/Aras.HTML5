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
	'dojo/_base/array',
	'dojo/promise/all',
	'dojox/layout/TableContainer',
	'../Container'
], function(declare, lang, array, all, TableContainer, Container) {
	
	return declare('Aras.View.Containers.TableContainer', [TableContainer, Container], {
		
		constructor: function() {
			
			// Show Labels
			this.showLabels = true;
			
			// Set Label Orientation
			this.orientation = 'vert';
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
		},

		destroy: function() {
			this.inherited(arguments);
			
			// Call Control Destroy
			this._destroy();
		},
		
		buildRendering: function() {
			this.inherited(arguments);
			
			if (this.ViewModel)
			{
				// Set Columns
				this.set('cols', this.ViewModel.Columns);
				
				// Add Children
				this._addChildren();
			}

		}

	});
});