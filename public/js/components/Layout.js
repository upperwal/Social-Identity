import React from "react";

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'

import Footer from "./Footer";
import Header from "./Header";

import Home from "./Home/Home"
import Citizen from "./Citizen/citizen"
import IssuingAuthority from "./IssuingAuthority/issuing_authority"
import Management from "./Management/management"
import Service from "./Service/service"

import Crypto from '../Module/Misc/crypt'

import './global.css'

export default class Layout extends React.Component {
	constructor() {
		super();
		this.state = {
			title: "Welcome",
		};

		this.cr = new Crypto();
		//cr.hello();
		console.log('Application Layout Init.')

	}

	changeTitle(title) {
		this.setState({title});
		console.log(title)
		this.cr.encrypt('0x627306090abab3a6e1400e9345bc60c78a8bef57', 'pub', 'long', title);
	}

	render() {
		return (
			<Router>
				<div>
					<Header changeTitle={this.changeTitle.bind(this)} title={this.state.title} />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/Citizen/:id" component={Citizen} />
						<Route path="/IA/:id" component={IssuingAuthority} />
						<Route path="/Service" component={Service} />
						<Route path="/Management" component={Management} />
					</Switch>
					<Footer />
				</div>
			</Router>
		);
	}
}
