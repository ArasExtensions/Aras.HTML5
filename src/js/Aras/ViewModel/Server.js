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
	'dojo/request',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/Stateful',
	'./Database'
], function(declare, request, array, lang, Stateful, Database) {
	
	return declare('Aras.ViewModel.Server', Stateful, {
		
		URL: null,
		
		InError: null,
		
		ErrorCode: null,
		
		ErrorMessage: null,
		
		_databaseCache: new Object(),
		
		constructor: function(args) {
			
			declare.safeMixin(this, args);
		
			this.ResetError();
		},
		
		ResetError: function() {
		
			this.set('InError', false);
			this.set('ErrorCode', null);
			this.set('ErrorMessage', null);
		},
		
		ProcessError: function(error) {
						
			this.set('ErrorCode', error.response.status);
			
			if (error.response.text.charAt(0) === '"' && error.response.text.charAt(error.response.text.length - 1) === '"')
			{
				this.set('ErrorMessage', error.response.text.substr(1, error.response.text.length - 2));
			}
			else
			{
				this.set('ErrorMessage', error.response.text);
			}
			
			this.set('InError', true);
			
		},
		
		Databases: function() {
			return request.get(this.URL + '/databases', 
							   { headers: {'Accept': 'application/json'}, 
								 handleAs: 'json'
							   }).then(
				lang.hitch(this, function(result) {
			
					var ret = [];
			
					array.forEach(result, lang.hitch(this, function(entry) {
						
						if (!this._databaseCache[entry.ID])
						{
							entry['Server'] = this;
							this._databaseCache[entry.ID] = new Database(entry);
						}

						ret.push(this._databaseCache[entry.ID]);
					}));
					
					return ret;
				}),
				lang.hitch(this, function(error) {
					this.ProcessError(error);
					return [];
				})
			);
		},
		
		Database: function(ID) {
			return request.get(this.URL + '/databases/' + ID, 
							   { headers: {'Accept': 'application/json'}, 
								 handleAs: 'json'
							   }).then(
				lang.hitch(this, function(entry) {
					
					if (!this._databaseCache[entry.ID])
					{
						entry['Server'] = this;
						this._databaseCache[entry.ID] = new Database(entry);
					}

					return this._databaseCache[entry.ID];
				}),
				lang.hitch(this, function(error) {
					this.ProcessError(error);
					return null;
				})
			);
		}
		
	});
});
