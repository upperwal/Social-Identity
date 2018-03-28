import React from "react";

import {Link} from 'react-router-dom';

import './home.css'

export default class Home extends React.Component {

	constructor() {
		super()
		//this.imageClick = this.imageClick.bind(this);
	}

	imageClick(e,r) {
		switch(e) {
			case 1:

		}
	}


	render() {
		return (
		  <div class="container home-div">
		  	<div class="row">
		  		<div class="col-md-4 profile">
		  			<Link to={`/Citizen/${1}`}>
			  			<img src="/public/img/c1.svg" onClick={this.imageClick.bind(this, 1)} />
				    	<h4>Citizen 1</h4>	
		    		</Link>
		    	</div>
		    	<div class="col-md-4 profile">
		    		<Link to={`/Citizen/${2}`}>
			    		<img src="/public/img/c2.svg" onClick={this.imageClick.bind(this, 2)}/>
			    		<h4>Citizen 2</h4>
		    		</Link>
		    	</div>
		    	<div class="col-md-4 profile">
		    		<Link to={`/Citizen/${3}`}>
			    		<img src="/public/img/c3.svg" onClick={this.imageClick.bind(this, 3)}/>
			    		<h4>Citizen 3</h4>
		    		</Link>
		    	</div>
		  	</div>
		  	<br/>
		    <div class="row">
		    	<div class="col-md-3 profile">
		    		<Link to={`/IA/${1}`}>
			    		<img src="/public/img/ia1.svg" onClick={this.imageClick.bind(this, 4)}/>
			    		<h4>Issuing Authority 1</h4>
		    		</Link>
		    	</div>
		    	<div class="col-md-3 profile">
	    			<Link to={`/IA/${2}`}>
			    		<img src="/public/img/ia2.svg" onClick={this.imageClick.bind(this, 5)}/>
			    		<h4>Issuing Authority 2</h4>
			    	</Link>
		    	</div>
		    	<div class="col-md-3 profile">
		    		<Link to={`/Service/`}>
			    		<img src="/public/img/s1.svg" onClick={this.imageClick.bind(this, 6)}/>
			    		<h4>Service Provider 1</h4>
		    		</Link>
		    	</div>
		    	<div class="col-md-3 profile">
		    		<Link to={`/Management`}>
			    		<img src="/public/img/s2.svg" onClick={this.imageClick.bind(this, 7)}/>
			    		<h4>Management</h4>
		    		</Link>
		    	</div>
		    	
		    </div>
		  </div>
		);
	}
}
