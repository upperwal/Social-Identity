
import SuperUserContractJSON from '../../../truffle-contract/build/contracts/SuperUser.json'
import Base from '../Misc/Base'

import IAContract from '../IA/issuing_authority'

export default class Manager extends Base {

	constructor() {
		super();

		this.managerContractInstance = this.web3.eth.contract(SuperUserContractJSON.abi).at(SuperUserContractJSON.networks['4447'].address)
		window.pp = this.managerContractInstance;
		//this.managerContractInstance.getSuperuser({'from': '0xf17f52151ebef6c7334fad080c5704d77216b732'},console.log)
		/*this.SuperuserContract = new this.web3.eth.Contract(SuperUserContractJSON.abi, SuperUserContractJSON.networks['4447'].address, {
			from: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
			gasPrice: '20000000000',
			gas: 2000000
		})

		window.sup = this.SuperuserContract


		console.log('ttttt')
		console.log(SuperUserContractJSON.add)*/
	}

	addIssuingAuthority(ownAddress, name, add, fields, callback) {
		//string name, address add, bytes32[] feilds
		var fl = []
		for(var i = 0; i<fields.length; i++) {
			fl.push(this.web3.fromAscii(fields[i]) )
		}
		this.managerContractInstance.addIssuingAuthority(name, add, fl, {'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'}, callback)
		//this.SuperuserContract.methods.addIssuingAuthority(name, add, fl).send({from: ownAddress}, callback)
	}

	getIAContractAddress(ownAddress, IAAdd, callback) {
		this.managerContractInstance.getIAContractAddress(IAAdd, {'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'}, callback);
		//this.SuperuserContract.methods.getIAContractAddress(IAAdd).call({from: ownAddress,}, callback)
	}

	getSharingContract(ownAddress, callback) {
		this.managerContractInstance.getSharingContract({'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'}, callback);
		//this.SuperuserContract.methods.getSharingContract().call({from: ownAddress}, callback)
	}

	getAllIA(ownAddress) {
		var context = this;
		var number = this.managerContractInstance.getNumberOfIA({'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'}).c[0]
		console.log('llll: ' + number)

		var contractInfo = []
		for(var i = 0; i<number; i++) {
			var IA = {}
			var dat = this.managerContractInstance.getIAAddressContract(i, {'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'})
			console.log('Info')
			console.log(dat)
			IA['owner'] = dat[0]
			IA['contract'] = dat[1]

			var iaContract = new IAContract()

			IA['name'] = iaContract.getName(ownAddress, dat[1])
			var fl = iaContract.getFields(ownAddress, dat[1])
			var strFl = ''
			for(var j = 0; j<fl.length; j++) {
				strFl += fl[j]

				if(j != fl.length - 1) {
					strFl += ', '
				}
			}
			IA['fields'] = strFl
			console.log('hgjh' + IA)
			contractInfo.push(IA)
		}
		console.log('ggg')
		console.log(contractInfo)
		return contractInfo;
	}

	getIAFromField(ownAddress, field) {
		console.log(field)
		var IAAddress = this.managerContractInstance.getIAFromField(field, {'from': ownAddress, 'gas': 2000000, 'gasPrice': '20000000000'})
		return IAAddress
	}
} 