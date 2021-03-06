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
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/json',
	'dojo/when',
	'./Control',
	'./Command',
	'./ApplicationType',
	'../View/Containers/BorderContainer',
	'../View/Containers/TabContainer',
	'../View/Grid',
	'../View/Panes/TitlePane',
	'../View/Button',
	'../View/Properties/Integer',
	'../View/Properties/String',
	'../View/Properties/Integers/Spinner',
	'../View/ToolbarSeparator',
	'../View/Containers/TableContainer',
	'../View/Properties/Item',
	'../View/Properties/Sequence',
	'../View/Properties/Date',
	'../View/Properties/List',
	'../View/Properties/Decimal',
	'../View/Properties/Float',
	'../View/Properties/Text',
	'../View/Properties/Boolean',
	'../View/Properties/Federated',
	'../View/Panes/ContentPane',
	'../View/Dialog',
	'../View/Containers/Toolbar'
], function(
	declare, 
	request, 
	lang, 
	array, 
	json, 
	when, 
	Control, 
	Command, 
	ApplicationType, 
	BorderContainer,
	TabContainer,
	Grid, 
	TitlePane, 
	Button, 
	Integer, 
	String, 
	Spinner, 
	ToolbarSeparator, 
	TableContainer,
	Item,
	Sequence,
	DateProp,
	ListProp,
	DecimalProp,
	FloatProp,
	TextProp,
	BooleanProp,
	FederatedProp,
	ContentPane,
	Dialog,
	Toolbar
) {
	
	return declare('Aras.ViewModel.Session', null, {
		
		Database: null, 
		
		Username: null,
		
		AccessToken: null,
		
		OAuthClient: null,
		
		_controlCache: new Object(),
		
		_commandCache: new Object(),
		
		_applicationTypeCache: new Object(),
		
		constructor: function(args) {
			declare.safeMixin(this, args);
		},
		
		_processResponse: function(Response) {
			
			// Process Commands
			array.forEach(Response.CommandQueue, lang.hitch(this, function(command) {
				
				if (this._commandCache[command.ID] === undefined)
				{
					// Create new Command
					this._commandCache[command.ID] = new Command(this, command.ID, command.CanExecute);
				}
				else
				{			
					// Set CanExecute
					this._commandCache[command.ID].set('CanExecute', command.CanExecute);	
				}
			}));
			
			// Process Controls
			array.forEach(Response.ControlQueue, lang.hitch(this, function(control) {
				
				if (this._controlCache[control.ID] === undefined)
				{
					// Create new Control
					this._controlCache[control.ID] = new Control(this, control);
				}
				else
				{
					// Set new Data in existing Control
					this._controlCache[control.ID].set('Data', control);
				}
			}));
		},
		
		_getAccessToken: function() {
			
			// Get Latest Token
			this.AccessToken = this.OAuthClient.getToken();

			return this.AccessToken;
		},
		
		ApplicationTypes: function() {
			return request.get(this.Database.Server.URL + '/applicationtypes',
							   { headers: {'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken()}, 
								 handleAs: 'json'
							   }).then(
				lang.hitch(this, function(result) {					
					return result;
				}),
				lang.hitch(this, function(error) {
					this.ProcessError(error);
					return [];
				})
			);
		},
		
		Application: function(Name) {
				return request.post(this.Database.Server.URL + '/applications', 
							   { headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken()}, 
								 handleAs: 'json',
								 data: json.stringify({ Name: Name })
							   }).then(
				lang.hitch(this, function(result) {

					// Process Response
					this._processResponse(result);
					
					return this._controlCache[result.Value.ID];
				}),
				lang.hitch(this, function(error) {
					this.Database.Server.ProcessError(error);
					return null;
				})
			);
		},
		
		Plugin: function(Name, Context) {
				return request.post(this.Database.Server.URL + '/plugins', 
							   { headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken()}, 
								 handleAs: 'json',
								 data: json.stringify({ Name: Name, Context: Context })
							   }).then(
				lang.hitch(this, function(result) {
				
					// Process Response
					this._processResponse(result);
				
					// Create Plugin
					if (this._controlCache[result.Value.ID] === undefined)
					{
						this._controlCache[result.Value.ID] = new Control(this, result.Value.ID, result.Value);
					}
					else
					{
						this._controlCache[result.Value.ID].set('Data', result.Value);
					}
					
					return this._controlCache[result.Value.ID];
				}),
				lang.hitch(this, function(error) {
					this.Database.Server.ProcessError(error);
					return null;
				})
			);
		},
		
		_readControl: function(Control) {
		
			request.get(this.Database.Server.URL + '/controls/' + Control.ID, 
						{ headers: {'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken()}, 
						  handleAs: 'json'
						}).then(
				lang.hitch(this, function(result) {
							
					// Process Response
					this._processResponse(result);
									
					// Update Data on Control
					Control.set("Data", result.Value);
				}),
				lang.hitch(this, function(error) {
					this.Database.Server.ProcessError(error);
				}));	
		},
		
		Control: function(ID) {
			
			if (ID)
			{	
				return this._controlCache[ID];
			}
			else
			{
				return null;
			}
		},
			
		Command: function(ID) {
			
			if (ID)
			{
				return this._commandCache[ID];
			}
			else
			{
				return null;
			}
		},
		
		Execute: function(Command, Parameters) {
			
			// Execute Command
			request.post(this.Database.Server.URL + '/commands/' + Command.ID + '/execute', 
								{ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken() }, 
								  handleAs: 'json',
								  data: json.stringify(Parameters)
								}).then(
				lang.hitch(this, function(response){
									
					// Process Response
					this._processResponse(response);
				}),
				lang.hitch(this, function(error) {
					this.Database.Server.ProcessError(error);
				})
			);				
		},
		
		_writeControl: function(Control) {
			
			// Send to Server
			request.post(this.Database.Server.URL + '/controls/' + Control.ID, 
								{ headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'AUTH_TOKEN': this._getAccessToken() }, 
								  handleAs: 'json',
								  data: json.stringify(Control.Data)
								}).then(
				lang.hitch(this, function(response){
									
					// Process Response
					this._processResponse(response);
				}),
				lang.hitch(this, function(error) {
					this.Database.Server.ProcessError(error);
				})
			);				
		},
		
		ViewControl: function(ViewModelControl, Parameters) {
			
			var viewcontrol = null;
			
			// Build Parameters for Control
			
			if (!Parameters)
			{
				Parameters = new Object();
			}
			
			// ViewModel
			Parameters['ViewModel'] = ViewModelControl;
			
			// Region 
			switch(ViewModelControl.Region)
			{
				case 1:
					Parameters['region'] = 'top';
					break;
				case 2:
					Parameters['region'] = 'bottom';
					break;
				case 3:
					Parameters['region'] = 'right';
					break;
				case 4:
					Parameters['region'] = 'left';
					break;
				case 5:
					Parameters['region'] = 'center';
					break;
				case 6:
					Parameters['region'] = 'leading';
					break;
				case 7:
					Parameters['region'] = 'trailing';
					break;
				default:
					Parameters['region'] = 'center';
					break;			
			}
			
			// Splitter
			if (ViewModelControl.Splitter)
			{
				Parameters['splitter'] = true;
			}
			
			// Style
			var style = '';
			
			if (Parameters['style'])
			{
				style = Parameters['style'];
			}
				
			if (ViewModelControl.Height != null)
			{
				style = style + 'height:' + ViewModelControl.Height + 'px;';
			}
	
			if (ViewModelControl.Width != null)
			{
				style = style + 'width:' + ViewModelControl.Width + 'px;';
			}
			
			if (style.length > 0)
			{
				Parameters['style'] = style;
			}
			
			switch(ViewModelControl.Type)
			{
				case 'Aras.View.Containers.BorderContainer':
					viewcontrol = new BorderContainer(Parameters);
					break;
				case 'Aras.View.Grid':
					Parameters['ShowHeader'] = ViewModelControl.ShowHeader;
					viewcontrol = new Grid(Parameters);
					break;
				case 'Aras.View.Panes.TitlePane':
					viewcontrol = new TitlePane(Parameters);
					break;
				case 'Aras.View.Button':
					viewcontrol = new Button(Parameters);
					break;
				case 'Aras.View.Properties.Integer':
					viewcontrol = new Integer(Parameters);
					break;
				case 'Aras.View.Properties.String':
					viewcontrol = new String(Parameters);
					break;
				case 'Aras.View.Properties.Integers.Spinner':
					viewcontrol = new Spinner(Parameters);
					break;
				case 'Aras.View.ToolbarSeparator':
					viewcontrol = new ToolbarSeparator(Parameters);
					break;
				case 'Aras.View.Containers.TableContainer':
					viewcontrol = new TableContainer(Parameters);
					break;	
				case 'Aras.View.Containers.TabContainer':
					viewcontrol = new TabContainer(Parameters);
					break;	
				case 'Aras.View.Properties.Item':
					viewcontrol = new Item(Parameters);
					break;	
				case 'Aras.View.Properties.Sequence':
					viewcontrol = new Sequence(Parameters);
					break;	
				case 'Aras.View.Properties.Date':
					viewcontrol = new DateProp(Parameters);
					break;
				case 'Aras.View.Properties.List':
					viewcontrol = new ListProp(Parameters);
					break;	
				case 'Aras.View.Properties.Decimal':
					viewcontrol = new DecimalProp(Parameters);
					break;
				case 'Aras.View.Properties.Float':
					viewcontrol = new FloatProp(Parameters);
					break;
				case 'Aras.View.Properties.Text':
					viewcontrol = new TextProp(Parameters);
					break;
				case 'Aras.View.Properties.Boolean':
					viewcontrol = new BooleanProp(Parameters);
					break;
				case 'Aras.View.Properties.Federated':
					viewcontrol = new FederatedProp(Parameters);
					break;
				case 'Aras.View.Panes.ContentPane':
					viewcontrol = new ContentPane(Parameters);
					break;	
				case 'Aras.View.Dialog':
					viewcontrol = new Dialog(Parameters);
					break;
				case 'Aras.View.Containers.Toolbar':
					viewcontrol = new Toolbar(Parameters);
					break;				
				default:
					console.debug("View not supported: " + ViewModelControl.Type);
					break;
			}
			
			return viewcontrol;
		}
		
	});
});