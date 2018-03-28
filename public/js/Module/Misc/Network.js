export default class Network {

	constructor() {
		this.URL = 'http://localhost'
		this.PORT = 3000
		this.COMPLETE_URL = this.URL + ':' + this.PORT + '/'
	}

	post(url, data) {
		return fetch(this.COMPLETE_URL + url, {
			method: 'POST',
			headers: {
		    	Accept: 'application/json',
		    			'Content-Type': 'application/json',
		    			'Access-Control-Allow-Origin': '*',

		  	},
		  	body: JSON.stringify(data)
		}).then((res) => res.json())
	}

	get(url, data) {
		var afterURL = '';
		var keys = Object.keys(data)
		for(var i = 0; i < keys.length; i++) {
			afterURL += keys[i] + '=' + data[keys[i]]
			if(i != keys.length - 1)
				afterURL += '&'
		}
		console.log(afterURL)
		return fetch(this.COMPLETE_URL + url + '?' + afterURL, {
			method: 'GET',
			headers: {
		    	Accept: 'application/json',
		    			'Content-Type': 'application/json',
		    			'Access-Control-Allow-Origin': '*',

		  	}
		}).then((res) => res.json())
	}

	getWithData(url, data) {
		return fetch(this.COMPLETE_URL + url, {
			method: 'GET',
			headers: {
		    	Accept: 'application/json',
		    			'Content-Type': 'application/json',
		    			'Access-Control-Allow-Origin': '*',

		  	}
		}).then((res) => res.json())
	}

}

/*
fetch(this.COMPLETE_URL + '/encrypt?', {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
        		'Access-Control-Allow-Credentials':true,
        		'Access-Control-Allow-Methods':'POST, GET',
		    	Accept: 'application/json',
		    			'Content-Type': 'application/json',
		    			'Access-Control-Allow-Origin': '*',

		  	},
		  	body: JSON.stringify({
		    	vAddress: vAddress,
		    	keyType: keyType,
		    	duration: duration,
		    	data: data
		  	})
		}).then(function(data) {
			console.log(data)
		})
		.catch(function(error) {
			console.log(error)
		})
		*/