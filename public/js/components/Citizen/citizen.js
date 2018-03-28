import React from "react";

import Manager from '../../Module/Manager/Manager'
import Citizen from '../../Module/Citizen/citizen'
import IA from '../../Module/IA/issuing_authority'

import './citizen.css'

export default class CitizenR extends React.Component {

	constructor(props) {
		super()
		switch(props.match.params.id) {
			case '1':
				this.userId = '0x5aeda56215b167893e80b4fe645ba6d5bab767de';
				break;
			case '2':
				this.userId = '0x6330a553fc93768f612722bb8c2ec78ac90b3bbc';
				break;
			case '3':
				this.userId = '0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5';
				break;
		}
		console.log(this.userId)

		this.state = {
			fetchDataComplete: false,
			pubKey: '',
			updateUI: ''
		}

		//this.jsonConcat = this.jsonConcat.bind(this)

		this.citizen = new Citizen()
		this.ia = new IA()
		this.manager = new Manager()

		this.citizenDataOpen = []

		window.cit = this.citizen

		//this.handleCheckBox = this.handleCheckBox.bind(this)

		//this.setCompanies = this.setCompanies.bind(this)
		
		this.fetchData()
		this.getCompanies()

		this.serviceAddress = ''
		this.serviceAppTime = 0

		this.userAddressOpen = ''
		this.pubKeyOpen = ''

		this.companies = []
		this.updatedApp = {}
		//this.imageClick = this.imageClick.bind(this);


	}

	jsonConcat(o1, name) {
		for (var i = 0;i <o1.length; i++) {
			o1[i]['auth'] = name;
		}
		return o1;
		/*for (var key in o2) {
			o1[key] = {'value': o2[key], 'auth': name};
		}
		return o1;*/
	}

	imageClick(e) {
		e.preventDefault()
		
		
	}

	fetchData() {
		console.log('INFOOOO')
		var IAList = this.manager.getAllIA(this.userId)
		console.log(IAList)

		this.citizenData = []

		var promises = []

		for(var i=0; i<IAList.length; i++) {
			promises.push(this.ia.getAllFieldNameValuePair(this.userId, IAList[i].owner, IAList[0].contract))
		}

		var context = this
		Promise.all(promises)
			.then(function(values) {
				for(var i=0;i<values.length; i++) {
					var o = context.jsonConcat(values[i], IAList[i].name)
					context.citizenData = context.citizenData.concat(o)
					console.log(context.citizenData)
					context.setState({fetchDataComplete: true})
				}
			})

		
	}

	renderCitizenInfo(dataPoint, index) {
		console.log(dataPoint)
		return (
			<tr key={index}> 
				<th scope="row">{index + 1}</th> 
				<td>{dataPoint.name}</td> 
				<td>{dataPoint.value}</td>
				<td>{dataPoint.auth}</td>
			</tr>
		)
	}

	handleCheckBox(index, e) {
		this.citizenData[index]['approve'] = e.target.checked
		console.log(this.citizenData)
	}

	renderCitizenInfoApprove(dataPoint, index) {
		//console.log(this)
		return (
			<tr key={index}> 
				<th scope="row">{index + 1}</th> 
				<td>{dataPoint.name}</td> 
				<td>{dataPoint.value}</td>
				<td>{dataPoint.auth}</td>
				<td><input type="checkbox" onChange={this.handleCheckBox.bind(this, index)}/></td>
			</tr>
		)
	}

	updateApproval(add, e) {
		e.preventDefault()

		var keys = Object.keys(this.updatedApp)
		var keysAdd = []
		for(var i=0; i<keys.length; i++) {
			if(this.updatedApp[keys[i]] == true) {
				keysAdd.push(keys[i])
			}
		}
		var sendData = {}
		for(var i =0; i<this.citizenData.length; i++) {
			if(keysAdd.indexOf(this.citizenData[i].name) >= 0) {
				sendData[this.citizenData[i].name] = this.citizenData[i].dec_once
			}
		}
		console.log(sendData)
		// Here 0 time would mean, no update to the time.
		this.citizen.approve(this.userId, sendData, add, 0, console.log)
		//this.setState({updateUI: sendData})

	}

	approveSubmit(e) {
		e.preventDefault()
		var sendData = {}
		for(var i =0; i<this.citizenData.length; i++) {
			if(this.citizenData[i].approve == true) {
				sendData[this.citizenData[i].name] = this.citizenData[i].dec_once
			}
		}
		console.log(sendData)
		this.citizen.approve(this.userId, sendData, this.serviceAddress, this.serviceAppTime, console.log)
	}

	approveSubmitOpen(e) {
		e.preventDefault()
		var context = this
		var sendData = {}
		for(var i =0; i<this.citizenData.length; i++) {
			if(this.citizenData[i].approve == true) {
				sendData[this.citizenData[i].name] = this.citizenData[i].dec_once
			}
		}
		console.log(sendData)
		this.citizen.approveOpenData(this.userId, sendData, this.serviceAppTime, function(a, b) {
			console.log(a, b)
			context.setState({pubKey: 'Public key to view your data : '+a.pub})
		})
	}

	handleServiceAddress(e) {
		this.serviceAddress = e.target.value;
	}

	handleTime(e) {
		this.serviceAppTime = e.target.value;
	}

	getApprovedCompaniesPromise(user, i) {
		var context = this;
		return new Promise(function(resolve, reject) {
			console.log('inside Promise')
			context.citizen.getApprovedCompanies(user, i, function(err,arr) {
				resolve(arr)
			});
			
		})
	}

	/*setCompanies(c, d) {

		if(d == null) return
		for(var i = 0; i<d.length; i++) {
			if(this.companiesAdd.indexOf(d[i]) === -1 && d[i] != '0x0000000000000000000000000000000000000000') {
				this.companiesAdd.push(d[i])
			}
		}
		console.log(this.companiesAdd)
	}*/

	getCompanies() {
		//console.log(this.getApprovedCompaniesPromise(this.userId, 0))
		var context = this
		this.citizen.getApprovedNumberOfCompanies(context.userId, function(e,n) {
			console.log(n.c[0])
			var pro = []
			for(var i=0; i<n.c[0]; i=i+5)
				pro.push(context.getApprovedCompaniesPromise(context.userId, i))
			
			Promise.all(pro)
				.then(function(values) {
					var com = []

					for(var i in values[0]) {
						if(com.indexOf(values[0][i]) == '0x0000000000000000000000000000000000000000') {
							break
						}
						else if(com.indexOf(values[0][i]) === -1) {
							com.push(values[0][i])
						}
					}
					console.log(com)
					if(com.length == 0)
						return;
					context.citizen.getApprovedData(context.userId, com[0])
						.then(function(data) {
							console.log(data)
							context.citizen.getServiceProviderName(context.userId ,com[0], function(a,b) {
								context.companies.push({'address': com[0], 'fields': data, 'name': b})
								context.setState({fetchDataComplete: true})
							})
							
						})
				})
			
			//context.getApprovedCompaniesPromise(context.userId, 0)

			//context.citizen.getApprovedCompanies(context.userId, 0, console.log)
		})
	}

	handleCheckBoxUpdateApproval(field, add, e) {
		//this.updatedApp[add].push(field)
		//console.log(this.citizenData)

		this.updatedApp[field] = e.target.checked;

		console.log(this.updatedApp)
	}

	renderCompaniesTable(add, f, index) {
		return (
			<tr key={index}> 
				<th scope="row" key={index}>{index + 1}</th> 
				<td>{f}</td>
				<td><input type="checkbox" onChange={this.handleCheckBoxUpdateApproval.bind(this, f, add)}/></td> 
			</tr>
		)
	}

	renderCompanies(cm, index) {

		if(cm.fields == null || cm.fields.length == 0)
			return;
		return (
			<div class="panel panel-default" key={index}>
				<div class="panel-heading">
					<h4 class="panel-title">
						<a data-toggle="collapse" href="#collapse1">{cm.name} : {cm.address}</a>
					</h4>
				</div>
				<div id="collapse1" class="panel-collapse collapse">
					<div class="panel-body">
						<table class="table"> 
							<caption>You have given access to view these fields. Please tick what all you want to retain</caption> 
							<thead> 
								<tr> 
									<th>#</th>  
									<th>Field Name</th>
									<th>Permissions</th>
								</tr> 
							</thead> 
							<tbody> 
								{cm.fields.map(this.renderCompaniesTable.bind(this, cm.address))}
								
								
							</tbody> 
						</table>
					</div>
					<div class="panel-footer">
						<button onClick={this.updateApproval.bind(this, cm.address)} type="submit" class="btn btn-primary btn-block">Update</button>
					</div>
				</div>


			</div>
		)
	}


	getOpenData(e) {
		e.preventDefault()
		var context = this
		this.citizen.getOpenData(context.userId, context.userAddressOpen, this.pubKeyOpen, function(res) {
			//console.log(res)
			context.citizenDataOpen = res;
			context.setState({fetchDataComplete: true})
		})
	}

	handleUserAddress(e) {
		this.userAddressOpen = e.target.value
	}

	handlePublicKey(e) {
		this.pubKeyOpen = e.target.value
	}


	render() {

		return (
			<div class="container">
				<h4>Citizen Virtual Address: {this.userId}</h4>

			  	<ul class="nav nav-tabs">
				  <li class="active"><a data-toggle="tab" href="#deploy">View your data</a></li>
				  <li><a data-toggle="tab" href="#menu1">Send Approval</a></li>
				  <li><a data-toggle="tab" href="#menu2">View/Delete your approvals</a></li>
				  <li><a data-toggle="tab" href="#menu3">Generate Open Key</a></li>
				  <li><a data-toggle="tab" href="#menu4">View "Open Key" data</a></li>
				</ul>

				<div class="tab-content">
				  <div id="deploy" class="tab-pane fade in active">
				    <h3>This information is downloaded from the <b>blockchain</b> and <b>decrypted</b> using <b>Issuing Authorities Public key</b> and <b>Citizen's Private Key</b>.</h3>
				    

					<table class="table"> 
						<caption>Below table shows citizen's data from all Issuing Authorities.</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Information Type</th> 
								<th>Information Value</th> 
								<th>Issuing Authority</th>
							</tr> 
						</thead> 
						<tbody> 
							{this.citizenData.map(this.renderCitizenInfo)}
						</tbody> 
					</table>


				  </div>
				  <div id="menu1" class="tab-pane fade">
				    <h3>Please fill in the virtual address of your service provider.</h3>
				    
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Virtual Address of the Service Provider</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Virtual Address of the Service Provider</div>
					      <input onChange={this.handleServiceAddress.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0x821aea9a577a9b44299b9c15c88cf3087f3b5544"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Enter data access time period (mins)</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Enter data access time period (mins)</div>
					      <input onChange={this.handleTime.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="300"/>
					      <div class="input-group-addon"></div>
					    </div>
					    <p>Your service provider will only be able to <b>see this data</b> within this <b>time period</b> starting when you click the <b>approve</b> button</p>
					  </div>
					</form>
					<br/>
					<h3>Please tick all the information fields you want your service provider to see.</h3>
				    <table class="table"> 
						<caption>Below table shows citizen's data from all Issuing Authorities.</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Information Type</th> 
								<th>Information Value</th> 
								<th>Issuing Authority</th>
								<th>Approve</th>
							</tr> 
						</thead> 
						<tbody> 
							{this.citizenData.map(this.renderCitizenInfoApprove.bind(this))}
						</tbody> 
					</table>

					<button type="submit" class="btn btn-primary btn-block" onClick={this.approveSubmit.bind(this)}>Approve</button>
				  

					<table class="table"> 
						<caption>Citizen information example (These are provided to help you add them easily)</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Name</th> 
								<th>Virtual Address</th>
								<th>Access Duration</th>
							</tr> 
						</thead> 
						<tbody> 
							<tr> 
								<th scope="row">1</th> 
								<td>Service Provider 1</td> 
								<td>0x821aea9a577a9b44299b9c15c88cf3087f3b5544</td>
								<td>300</td>
							</tr>
						</tbody> 
					</table>

				  </div>
				  
				  <div id="menu2" class="tab-pane fade">
					<h2>This panel shows the datapoints with each service provider you have given access to view.</h2>
					<div class="panel-group">
						{this.companies.map(this.renderCompanies.bind(this))}
						
					</div>
				  </div>


				  <div id="menu3" class="tab-pane fade">
					<h2><b>Open key data transfer</b> allows you to share your data using a new pair of <b>public-private key</b> which can be discarded after some use.</h2>
					
					<br/>
					<h3>Please tick all the information fields you want to share.</h3>
				    
					<form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Enter data access time period (mins)</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Enter data access time period (mins)</div>
					      <input onChange={this.handleTime.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="300"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					</form>
				    <table class="table"> 
						<caption>Below table shows citizen's data from all Issuing Authorities.</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Information Type</th> 
								<th>Information Value</th> 
								<th>Issuing Authority</th>
								<th>Approve</th>
							</tr> 
						</thead> 
						<tbody> 
							{this.citizenData.map(this.renderCitizenInfoApprove.bind(this))}
						</tbody> 
					</table>

					<button type="submit" class="btn btn-primary btn-block" onClick={this.approveSubmitOpen.bind(this)}>Open Share</button>
				  
					<div class="well">{this.state.pubKey}</div>

				  </div>



				  <div id="menu4" class="tab-pane fade">
				    <h3>This information is downloaded from the <b>blockchain</b> and <b>decrypted</b> using <b>time based Public Key</b> and <b>Issuing Authorities Public key</b>.</h3>
				    <br/>
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Virtual Address of the User</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Virtual Address of the User</div>
					      <input onChange={this.handleUserAddress.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0x821aea9a577a9b44299b9c15c88cf3087f3b5544"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Public Key</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Public Key</div>
					      <input onChange={this.handlePublicKey.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0x821aea9a5299b9ca77a9b44299b99b44299b915c88cf388cf308ca9b442908ca9b44299b915c88cf3089b442997f3b5544"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					</form>
					<button type="submit" class="btn btn-primary btn-block" onClick={this.getOpenData.bind(this)}>SUBMIT</button>
					<table class="table"> 
						<caption>Below table shows customer's data approved by him/her.</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Information Type</th> 
								<th>Information Value</th> 
								<th>Issuing Authority Address</th>
							</tr> 
						</thead> 
						<tbody> 
							{this.citizenDataOpen.map(this.renderCitizenInfo)}
						</tbody> 
					</table>


					<table class="table"> 
						<caption>Citizen information example</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Virtual Address</th> 
							</tr> 
						</thead> 
						<tbody> 
							<tr> 
								<th scope="row">1</th> 
								<td>0x5aeda56215b167893e80b4fe645ba6d5bab767de</td> 
							</tr> 
							<tr> 
								<th scope="row">2</th> 
								<td>0x6330a553fc93768f612722bb8c2ec78ac90b3bbc</td> 
							</tr>
							<tr> 
								<th scope="row">2</th> 
								<td>0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5</td> 
							</tr>
						</tbody> 
					</table>


				</div>




				</div>


				

		  	</div>
		);
	}
}
