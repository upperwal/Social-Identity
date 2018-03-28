import React from "react";

import Manager from '../../Module/Manager/Manager'
import Citizen from '../../Module/Citizen/citizen'
import IA from '../../Module/IA/issuing_authority'

//import './home.css'

export default class Service extends React.Component {

	constructor(props) {
		super()
		this.userId = '0x821aea9a577a9b44299b9c15c88cf3087f3b5544';
		console.log(this.userId)

		this.state = {
			fetchDataComplete: false
		}

		//this.jsonConcat = this.jsonConcat.bind(this)

		this.citizen = new Citizen()
		this.ia = new IA()
		this.manager = new Manager()

		//this.handleCheckBox = this.handleCheckBox.bind(this)
		this.citizenData = []
		this.customerAddress = ''
		this.citizenDataOpen = []
		this.serviceName = ''
		//this.imageClick = this.imageClick.bind(this);
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

	handleServiceName(e) {
		this.serviceName = e.target.value;
	}

	submitName(e) {
		e.preventDefault()

		console.log('Name Added')
		this.citizen.registerAsServiceProvider(this.userId, this.serviceName, console.log)
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
				<h4>Virtual Address: {this.userId}</h4>
			  	<ul class="nav nav-tabs">
				  <li class="active"><a data-toggle="tab" href="#deploy">View your customer's data</a></li>
				  <li class=""><a data-toggle="tab" href="#reg">Register yourself</a></li>
				  <li class=""><a data-toggle="tab" href="#link3">View "Open Key" Data</a></li>
				</ul>

				<div class="tab-content">
				  <div id="deploy" class="tab-pane fade in active">
				    <h3>This information is downloaded from the <b>blockchain</b> and <b>decrypted</b> using <b>your Private Key</b> and <b>Issuing Authorities Public key</b>.</h3>
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
							{this.citizenData.map(this.renderCitizenInfo)}
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

				<div id="reg" class="tab-pane fade">
				    <h3>Service Provider's need to register their names so that customers can see it in permissions.</h3>
				    <br/>
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Your Registered Name</label>
					    <div class="input-group">
					      <div class="input-group-addon name-label">Your Registered Name</div>
					      <input onChange={this.handleServiceName.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="Airtel"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					</form>
					<button type="submit" class="btn btn-primary btn-block" onClick={this.submitName.bind(this)}>SUBMIT</button>


				  </div>


				  <div id="link3" class="tab-pane fade">
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
