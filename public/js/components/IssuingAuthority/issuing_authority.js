import React from "react";
import Web3 from 'web3'

import Manager from '../../Module/Manager/Manager'
import IA from '../../Module/IA/issuing_authority'
import Citizen from '../../Module/Citizen/citizen'

import './issuing_authority.css'

export default class IssuingAuthority extends React.Component {

	constructor(props) {
		super()
		switch(props.match.params.id) {
			case '1':
				this.userId = '0xf17f52151ebef6c7334fad080c5704d77216b732';
				break;
			case '2':
				this.userId = '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef';
				break;
		}
		console.log(this.userId)

		this.updateFieldsName = this.updateFieldsName.bind(this)
		this.renderFieldInfo = this.renderFieldInfo.bind(this)
		//this.changeFieldValue = this.changeFieldValue.bind(this)

		this.state = {
			field: false
		}

		this.citizen = new Citizen()

		this.fields = []
		this.fieldsVal = []
		this.citizenData = []
		this.citizenDataOpen = []
		this.citizenId = ''
		this.ia = new IA()
		window.iaa = this.ia

		this.ia.getFieldsWithUnknownContract(this.userId, this.userId, this.updateFieldsName);
		//this.imageClick = this.imageClick.bind(this);
	}

	/*submitAddIssue(e) {
		e.preventDefault()
		console.log(this.state)

		//var manager = new Manager()
		var fl = this.state.fields.split(',')

		//this.manager.getAllIA(this.userId, null)
		//this.manager.addIssuingAuthority(this.userId, this.state.name, this.state.address, fl, console.log)
		//manager.getIAContractAddress(this.userId, '0xf17f52151ebef6c7334fad080c5704d77216b732', console.log)
	}

	changeName(e) {
		this.setState({name: e.target.value})
	}

	changeVAddress(e) {
		this.setState({address: e.target.value})
	}

	changeFields(e) {
		this.setState({fields: e.target.value})
	}*/

	changeFieldValue(val, e) {
		this.fieldsVal[val] = e.target.value;
		console.log('Changed: ' + this.fieldsVal)
	}

	renderFieldInfo(ia, index) {
		console.log(ia)
		return (
			<div class="form-group" key={index}>
				<label class="sr-only" for="exampleInputAmount">{ia}</label>
				<div class="input-group">
					<div class="input-group-addon name-label">{ia}</div>
					<input onChange={this.changeFieldValue.bind(this, index)} type="text" class="form-control" id="exampleInputAmount" placeholder=""/>
					<div class="input-group-addon"></div>
				</div>
			</div>
		)
	}

	updateFieldsName(_fields) {
		this.fields = []
		for(var i in _fields) {
			this.fields.push(_fields[i])
		}
		console.log(this.fields)
		this.setState({field: true})

		//this.fields.map(console.log)

	}

	updateCitizenId(e) {
		this.citizenId = e.target.value;
	}

	renderCitizenInfo(dataPoint, index) {
		console.log(dataPoint)
		return (
			<tr key={index}> 
				<th scope="row">{index + 1}</th> 
				<td>{dataPoint.name}</td> 
				<td>{dataPoint.value}</td>
				<td>{dataPoint.add}</td>
			</tr>
		)
	}

	updateInfo(e) {
		e.preventDefault()
		console.log(this.fieldsVal[0])

		for(var i = 0; i<this.fields.length; i++) {
			if(this.fieldsVal[i] == undefined || this.fieldsVal[i] == '')
				continue;
			else {
				console.log(i)
				this.ia.updateData(this.userId, this.citizenId, this.fields[i], this.fieldsVal[i], console.log)
			}
		}
		
	}

	handleCustomerAddress(e) {
		this.customerAddress = e.target.value;
	}

	getUserInfo(e) {
		e.preventDefault()
		var context = this
		this.citizen.getData(context.userId, context.customerAddress, function(res) {
			context.citizenData = res;
			context.setState({fetchDataComplete: true})
		})
	}

	handleUserAddress(e) {
		this.userAddressOpen = e.target.value
	}

	handlePublicKey(e) {
		this.pubKeyOpen = e.target.value
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

	renderCiti(dataPoint, index) {
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


	render() {
		
		return (
		  	<div class="container">
		  		<h4>Issuing Authority Virtual Address: {this.userId}</h4>
			  	<ul class="nav nav-tabs">
				  <li class="active"><a data-toggle="tab" href="#deploy">Update Citizen's Information</a></li>
				  <li><a data-toggle="tab" href="#menu1">View Citizen's Information</a></li>
				  <li><a data-toggle="tab" href="#menu2">View "Open Key" Data</a></li>
				</ul>

				<div class="tab-content">
				  <div id="deploy" class="tab-pane fade in active">
				    <h3>Please fill the following to update citizen's information</h3>
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Virtual Address of the User</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Virtual Address of the User &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;</div>
					      <input onChange={this.updateCitizenId.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					  {this.fields.map(this.renderFieldInfo)}
					  <button type="submit" class="btn btn-primary btn-block" onClick={this.updateInfo.bind(this)}>ADD</button>
					</form>	
					<br/>
					<p>All the data is first <b>encrypted</b> using <b>IA's Private Key</b> and then again using <b>Citizen's Public Key</b> and then stored onto the blockchain.</p>


					<table class="table"> 
						<caption>Citizen information example (These are provided to help you add them easily)</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Virtual Address</th> 
								<th>Name</th> 
								<th>DOB</th>
								<th>Address</th>
							</tr> 
						</thead> 
						<tbody> 
							<tr> 
								<th scope="row">1</th> 
								<td>0x5aeda56215b167893e80b4fe645ba6d5bab767de</td> 
								<td>Citizen 1</td>
								<td>23-04-1993</td>
								<td>Mumbai</td>
							</tr> 
							<tr> 
								<th scope="row">2</th> 
								<td>0x6330a553fc93768f612722bb8c2ec78ac90b3bbc</td> 
								<td>Citizen 2</td> 
								<td>18-07-1980</td>
								<td>Gurgaon</td>
							</tr>
							<tr> 
								<th scope="row">2</th> 
								<td>0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5</td> 
								<td>Citizen 3</td> 
								<td>16-06-1995</td>
								<td>Karnal</td>
							</tr>
						</tbody> 
					</table>


				  </div>
				  <div id="menu1" class="tab-pane fade">
				    <h3>This information is downloaded from the <b>blockchain</b> and <b>decrypted</b> using <b>Receiver's Key</b> and <b>Issuing Authorities Public key</b>.</h3>
				    <br/>
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Virtual Address of the Customer</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Virtual Address of the Customer</div>
					      <input onChange={this.handleCustomerAddress.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0x821aea9a577a9b44299b9c15c88cf3087f3b5544"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					</form>
					<button type="submit" class="btn btn-primary btn-block" onClick={this.getUserInfo.bind(this)}>SUBMIT</button>
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
							{this.citizenData.map(this.renderCitizenInfo.bind(this))}
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
				  <div id="menu2" class="tab-pane fade">
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
							{this.citizenDataOpen.map(this.renderCiti)}
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
