import React from "react";
import Web3 from 'web3'

import Manager from '../../Module/Manager/Manager'

import './management.css'

export default class Management extends React.Component {

	constructor(props) {
		super()
		this.userId = '0x627306090abab3a6e1400e9345bc60c78a8bef57'
		console.log(this.userId)

		this.state = {
			name: '',
			address: '',
			fields: ''
		}

		this.manager = new Manager()
		//this.imageClick = this.imageClick.bind(this);
	}

	submitAddIssue(e) {
		e.preventDefault()
		console.log(this.state)

		//var manager = new Manager()
		var fl = this.state.fields.replace(' ', '').split(',')

		//this.manager.getAllIA(this.userId, null)
		this.manager.addIssuingAuthority(this.userId, this.state.name, this.state.address, fl, console.log)
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
	}

	renderIAInfo(ia, index) {
		return (
			<tr key={index}> 
				<th scope="row">{index + 1}</th> 
				<td>{ia.name}</td> 
				<td>{ia.owner}</td>
				<td>{ia.contract}</td>
				<td>{ia.fields}</td>
			</tr>
		)
	}


	render() {
		var IAArray = this.manager.getAllIA(this.userId, null);
		return (
		  	<div class="container">
		  		<h4>Virtual Address: {this.userId}</h4>
			  	<ul class="nav nav-tabs">
				  <li class="active"><a data-toggle="tab" href="#deploy">Add Issuing Authority</a></li>
				  <li><a data-toggle="tab" href="#menu1">View Issuing Authorities</a></li>
				</ul>

				<div class="tab-content">
				  <div id="deploy" class="tab-pane fade in active">
				    <h3>Please fill the following to add a new issuing authority</h3>
				    <form class="form">
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Name of Issuing Authority</label>
					    <div class="input-group">
					      <div class="input-group-addon">Name of the Issuing Authority. &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;</div>
					      <input value={this.state.name} onChange={this.changeName.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="RTO Karnataka"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Virtal Address of Issuing Authority</label>
					    <div class="input-group">
					      <div class="input-group-addon">Virtal Address of the Issuing Authority</div>
					      <input value={this.state.address} onChange={this.changeVAddress.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="0xf17f52151ebef6c7334fad080c5704d77216b732"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>

					  <div class="form-group">
					    <label class="sr-only" for="exampleInputAmount">Comma seperated list of Fields</label>
					    <div class="input-group">
					      <div class="input-group-addon">Comma seperated list of Fields &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;</div>
					      <input value={this.state.fields} onChange={this.changeFields.bind(this)} type="text" class="form-control" id="exampleInputAmount" placeholder="NAME, DOB, ADDRESS"/>
					      <div class="input-group-addon"></div>
					    </div>
					  </div>
					  <button type="submit" class="btn btn-primary btn-block" onClick={this.submitAddIssue.bind(this)}>ADD</button>
					</form>	


					<table class="table"> 
						<caption>Issuing Authorities addresses (These are provided to help you add them easily)</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Name</th> 
								<th>Address</th> 
								<th>Fields</th>
							</tr> 
						</thead> 
						<tbody> 
							<tr> 
								<th scope="row">1</th> 
								<td>Municipal Coorporation</td> 
								<td>0xf17f52151ebef6c7334fad080c5704d77216b732</td>
								<td>NAME, DOB, ADDRESS</td>
							</tr> 
							<tr> 
								<th scope="row">2</th> 
								<td>RTO Karnataka</td> 
								<td>0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef</td> 
								<td>DRIVING_LICENSE_NO</td>
							</tr>
						</tbody> 
					</table>


				  </div>
				  <div id="menu1" class="tab-pane fade">
				    <h3>Information of all issuing authority added by the management</h3>
				    <table class="table"> 
						<caption>Issuing Authorities</caption> 
						<thead> 
							<tr> 
								<th>#</th> 
								<th>Name</th> 
								<th>Owner Address</th> 
								<th>Contract Address</th>
								<th>Fields</th>
							</tr> 
						</thead> 
						<tbody> 
							{IAArray.map(this.renderIAInfo)}
						</tbody> 
					</table>
				  </div>
				</div>	

		  	</div>
		);
	}
}
