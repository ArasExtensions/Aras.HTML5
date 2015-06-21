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
	'dijit/form/Button',
	'./Command'
], function(declare, lang, Button, Command) {
	
	return declare('Aras.View.Button', [Button, Command], {
		
		_savedIconClass: null,
		
		constructor: function(args) {
			
			// Default to Disabled
			this.set('disbaled', true);
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Store IconClass
			this._savedIconClass = this.iconClass;
			
			// Disable Button
			this._setEnabled(false);
		},
		
		_setEnabled: function(Enabled) {
		
			if (Enabled)
			{
				this.set('disabled', false);
				this.set('iconClass', this._savedIconClass);
			}
			else
			{
				this.set('disabled', true);
				this.set('iconClass', this._savedIconClass + ' disableIcon');
			}
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);
			
			// Link Click Event
			this.set('onClick', lang.hitch(this, function() {
				this._setEnabled(false);
				this.ViewModel.Execute();
			}));
			
			// Set Enabled
			this._setEnabled(this.ViewModel.CanExecute);
			
			// Watch for changes in CanExecute
			this.ViewModel.watch('CanExecute', lang.hitch(this, function(name, oldValue, newValue) {
				this._setEnabled(newValue);
			}));
			
		}
	});
});