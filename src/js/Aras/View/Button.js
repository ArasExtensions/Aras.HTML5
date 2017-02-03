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
	'dojo/when',
	'dijit/form/Button',
	'./Command'
], function(declare, lang, when, Button, Command) {
	
	return declare('Aras.View.Button', [Button, Command], {
		
		_savedIconClass: null,
		
		_CanExecuteWatch: null,
		
		constructor: function(args) {
			
		},
		
		startup: function() {
			this.inherited(arguments);

			if (this.iconClass != null)
			{
				// Store IconClass
				this._savedIconClass = this.iconClass;
				
				this.SetEnabled(false);
			}
		},
		
		destroy: function() {
			this.inherited(arguments);

			if (this._CanExecuteWatch)
			{
				this._CanExecuteWatch.unwatch();
			}
		},
		
		SetEnabled: function(Enabled) {
			
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
			
			if (this.ViewModel != null)
			{
				// Set IconClass
				this.set("iconClass", "small" + this.ViewModel.Icon + "Icon");
			
				// Store IconClass
				this._savedIconClass = this.iconClass;
			
				when(this.ViewModel.Command).then(lang.hitch(this, function() {
					
					// Link Click Event
					this.set('onClick', lang.hitch(this, function() {
						this.SetEnabled(false);
						this.ViewModel.Command.Execute();
					}));
			
					// Set Enabled
					this.SetEnabled(this.ViewModel.Command.CanExecute);
			
					// Watch for changes in CanExecute
					if (this._CanExecuteWatch)
					{
						this._CanExecuteWatch.unwatch();
					}
					
					this._CanExecuteWatch = this.ViewModel.Command.watch('CanExecute', lang.hitch(this, function(name, oldValue, newValue) {
						this.SetEnabled(newValue);
					}));
				}));
			}
		}
	});
});