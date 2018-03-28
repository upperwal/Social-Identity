import Web3 from 'web3'

export default class Base {
	
	constructor() {

		this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
		window.web3 = this.web3;
	}
}