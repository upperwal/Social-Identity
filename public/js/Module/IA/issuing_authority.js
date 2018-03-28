import IssuingAuthorityContractJSON from '../../../truffle-contract/build/contracts/IssuingAuthority.json'
import Superuser from '../Manager/Manager'
import Crypt from '../Misc/crypt'
import Base from '../Misc/Base'

export default class IssuingAuthority extends Base {

	constructor() {
		super()

		/*this.IssuingAuthorityContract = new this.web3.eth.Contract(IssuingAuthorityContractJSON.abi, null, {
			from: '0xf17f52151ebef6c7334fad080c5704d77216b732',
			gasPrice: '20000000000',
			gas: 2000000
		})*/

		this.IssuingAuthorityContract = this.web3.eth.contract(IssuingAuthorityContractJSON.abi)
		this.crypt = new Crypt()
		//window.pp = this.managerContractInstance;
		//this.managerContractInstance.getSuperuser({'from': '0xf17f52151ebef6c7334fad080c5704d77216b732'},console.log)

		//window.ia = this.IssuingAuthorityContract
	}

	updateIAContractAddress(ownAddress, callback) {
		var su = new Superuser
		var context = this
		console.log('Address: ' + ownAddress)
		su.getIAContractAddress(ownAddress, ownAddress, function(err, res) {
			context.IssuingAuthorityContractInstance = context.IssuingAuthorityContract.at(res)
			callback(err, res)
		})
	}

	updateData(ownAddress, uid, fieldName, fieldValue, callback) {
		var context = this
		var su = new Superuser
		this.updateIAContractAddress(ownAddress, function(err, data) {
			// Add encryption: fieldValue
			context.crypt.encryptTwice(ownAddress, uid, 'priv', 'pub', 'long', fieldValue)
				.then(function(dat) {
					console.log('Encrypted')
					console.log(dat)
					context.IssuingAuthorityContractInstance.updateData(uid, context.web3.fromAscii(fieldName), dat.encrypted, {'from': ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
				})
			
		})
		
	}

	getFieldNameValuePair(ownAddress, agencyAddress, i, callback) {
		var context = this
		this.updateIAContractAddress(agencyAddress, function(err, data) {
			window.ia = context.IssuingAuthorityContractInstance
			context.IssuingAuthorityContractInstance.getFieldNameValuePair(i, {'from': ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getNumberOfFields(ownAddress, agencyAddress, callback) {
		var context = this
		this.updateIAContractAddress(agencyAddress, function(err, data) {
			context.IssuingAuthorityContractInstance.getNumberOfFields({from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getFields(ownAddress, contractAddress) {
		this.IssuingAuthorityContractInstance = this.IssuingAuthorityContract.at(contractAddress)

		var fieldsName = []
		var fieldNumber = this.IssuingAuthorityContractInstance.getNumberOfFields({from: ownAddress, gasPrice: '20000000000', gas: 2000000})
		
		for(var i = 0; i<fieldNumber; i++) {
			var fl = this.IssuingAuthorityContractInstance.getFields(i, {from: ownAddress, gasPrice: '20000000000', gas: 2000000})
			fieldsName.push(this.web3.toAscii(fl))
		}

		return fieldsName
		
	}

	getAllFieldNameValuePair(ownAddress, contractOwner, contractAddress, callback) {
		this.IssuingAuthorityContractInstance = this.IssuingAuthorityContract.at(contractAddress)
		var fieldNumber = this.IssuingAuthorityContractInstance.getNumberOfFields({from: ownAddress, gasPrice: '20000000000', gas: 2000000})
		var context = this
		console.log('fieldNumber: ' + fieldNumber)
		var fld = []
		var j = 0
		
		var promises = []
		for(var i=0; i<fieldNumber; i++) {
			var datArr = this.IssuingAuthorityContractInstance.getFieldNameValuePair(i, {'from': ownAddress, gasPrice: '20000000000', gas: 2000000})
			console.log(datArr)
			if(datArr[1] == '')
				break;
			fld.push(context.web3.toAscii(datArr[0]))
			
			promises.push(this.crypt.decryptTwice(ownAddress, contractOwner, 'priv', 'pub', 'long', datArr[1]))

		}


		return Promise.all(promises)
			.then(function(values) {
				console.log(values)
				var arr = []
				for(var i=0;i<fld.length;i++) {
					var jsonObj = {}
					jsonObj['name'] = fld[i].replace(' ', '')
					jsonObj['value'] = values[i].decrypted
					jsonObj['dec_once'] = values[i].dec_once

					arr.push(jsonObj)
				}
				//console.log('sds')
				//console.log(arr)
				return arr
			})
		
	}

	getFieldsWithUnknownContract(ownAddress, agencyAddress, callback) {
		var context = this
		this.updateIAContractAddress(agencyAddress, function(err, data) {
			var fieldNumber = context.IssuingAuthorityContractInstance.getNumberOfFields({from: ownAddress, gasPrice: '20000000000', gas: 2000000})
			//console.log('FLD: ' + fieldNumber)
			var fieldsName = []
			for(var i = 0; i<fieldNumber; i++) {
				var fl = context.IssuingAuthorityContractInstance.getFields(i, {from: ownAddress, gasPrice: '20000000000', gas: 2000000})
				fieldsName.push(context.web3.toAscii(fl))
			}

			//console.log(fieldsName)

			callback(fieldsName)
		})
		
	}

	getName(ownAddress, contractAddress) {
		this.IssuingAuthorityContractInstance = this.IssuingAuthorityContract.at(contractAddress)
		return this.IssuingAuthorityContractInstance.getIAName({from: ownAddress, gasPrice: '20000000000', gas: 2000000})
	}

}