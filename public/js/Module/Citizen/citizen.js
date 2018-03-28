import SharingContractJSON from '../../../truffle-contract/build/contracts/Sharing.json'
import Manager from '../Manager/Manager'
import Crypt from '../Misc/crypt'
import Base from '../Misc/Base'

export default class Citizen extends Base {
	constructor(ownAddress) {
		super()
		this.manager = new Manager()
		
		/*this.SharingContract = new this.web3.eth.Contract(SharingContractJSON.abi, null, {
			from: '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
			gasPrice: '20000000000',
			gas: 2000000
		})*/

		this.SharingContract = this.web3.eth.contract(SharingContractJSON.abi)
		this.crypt = new Crypt()
		/*this.manager.getSharingContract(ownAddress, function(err, add) {
			
		})*/
	}

	/*generateNewKeys() {
		this.crypt.create_key_pair()
			.then(console.log)
	}*/

	updateSharedContractAddress(ownAddress, callback) {
		var context = this
		this.manager.getSharingContract(ownAddress, function(err, res) {
			context.SharingContractInstance = context.SharingContract.at(res)

			callback(err, res)
		})
	}

	approve(ownAddress, data, approvedTo, eTime, callback) {
		// data = {name:value, name:value} => format

		var dataSer = []
		var approvedDataSer = []
		for(var i in data) {
			approvedDataSer.push(i)
			dataSer.push(data[i])
		}
		var context = this
		// Add encryption
		var encodedData = JSON.stringify(dataSer)
		console.log('String Data: ' + encodedData)
		
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.crypt.encrypt_second(approvedTo, 'pub', 'long', encodedData)
				.then(function(result) {
					console.log(result)
					context.SharingContractInstance.approve(result.encrypted, JSON.stringify(approvedDataSer), approvedTo, eTime, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
				})
			
		})
		
	}

	approveOpenData(ownAddress, data, eTime, callback) {
		var dataSer = []
		var approvedDataSer = []
		for(var i in data) {
			approvedDataSer.push(i)
			dataSer.push(data[i])
		}
		var context = this
		// Add encryption
		if(dataSer.length == 0) {
			console.log('Not field Selected')
			return
		}
		var encodedData = JSON.stringify(dataSer)

		this.updateSharedContractAddress(ownAddress, function(err, res) {
			console.log(encodedData)
			context.crypt.open_encrypt(encodedData)
				.then(function(result) {
					console.log(result)
					context.SharingContractInstance.approve(result.encrypted, JSON.stringify(approvedDataSer), '0x0000000000000000000000000000000000000000', eTime, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, function(a, b) {
						callback(result, b)
					})
				})
			
		})
	}

	getData(ownAddress, recAddress, callback) {
		var context = this
		// Add encryption
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.getData(recAddress, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, function(err, data) {
				console.log(data)
				if(data === null || data === undefined || data.length == 0) {
					console.log('No data Avialable')
					return;
				}
				//var serData = JSON.parse(data[0])
				if(data.length == 0)
					return
				var dataType = JSON.parse(data[1])
				var addList = []
				for(var i=0;i<dataType.length; i++) {
					addList.push(context.manager.getIAFromField(ownAddress, dataType[i], {from: ownAddress, gasPrice: '20000000000', gas: 2000000}))
				}
				console.log(addList)
				var finalArray = []
				context.crypt.decrypt_service_side(ownAddress, 'priv', 'long', data[0])
					.then(function(result) {
						var jsonObj = JSON.parse(result.decrypted)

						var pro = []
						for(var i=0;i<addList.length;i++) {
							pro.push(context.crypt.decrypt(addList[i], 'pub', 'long', jsonObj[i]))
						}

						Promise.all(pro)
							.then(function(res) {
								for(var i=0;i<res.length;i++) {
									finalArray.push({'name': dataType[i], 'value': res[i].decrypted, 'add': addList[i]})
									callback(finalArray)
								}
							})
						
					})

				/*var dataObj = {}

				for(var i = 0; i < serData.length; i++) {
					dataObj[dataType[i]] = serData[i]
				}

				callback(err, dataObj)*/
			})
		})
	}

	getOpenData(ownAddress, recAddress, pub, callback) {
		var context = this
		// Add encryption
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.getOpenData(recAddress, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, function(err, data) {
				//var serData = JSON.parse(data[0])
				var dataType = JSON.parse(data[1])

				var finalArray = []
				context.crypt.open_decrypt(data[0], pub)
					.then(function(res) {
						var fieldsJSON = JSON.parse(res.decrypted)
						

						var addList = []
						for(var i=0;i<fieldsJSON.length; i++) {
							addList.push(context.manager.getIAFromField(ownAddress, fieldsJSON[i], {from: ownAddress, gasPrice: '20000000000', gas: 2000000}))
						}
						console.log(addList)


						var pro = []
						for(var i=0;i<addList.length;i++) {
							pro.push(context.crypt.decrypt(addList[i], 'pub', 'long', fieldsJSON[i]))
						}

						Promise.all(pro)
							.then(function(res) {
								for(var i=0;i<res.length;i++) {
									finalArray.push({'name': dataType[i], 'value': res[i].decrypted, 'auth': addList[i]})
									callback(finalArray)
								}
							})
					})

				

				/*var dataObj = {}

				for(var i = 0; i < serData.length; i++) {
					dataObj[dataType[i]] = serData[i]
				}

				callback(err, dataObj)*/
			})
		})
	}

	lock(ownAddress, callback) {
		var context = this
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.lock({from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	unlock(ownAddress, callback) {
		var context = this
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.unlock({from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getApprovedNumberOfCompanies(ownAddress, callback) {
		var context = this
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.getApprovedNumberOfCompanies({from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getApprovedCompanies(ownAddress, p, callback) {
		console.log(ownAddress)
		console.log(p)
		var context = this
		this.updateSharedContractAddress(ownAddress, function(err, res) {
			window.share = context.SharingContractInstance
			context.SharingContractInstance.getApprovedCompanies(p, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getApprovedData(ownAddress, companyId) {
		var context = this
		console.log(companyId)
		return new Promise(function(resolve, reject) {
			context.updateSharedContractAddress(ownAddress, function(err, res) {
				context.SharingContractInstance.getApprovedData(companyId, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, function(a,b) {
					console.log(JSON.parse(b))
					resolve(JSON.parse(b))
				})
			})
		})
		
	}

	registerAsServiceProvider(ownAddress, name, callback) {
		var context = this
		context.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.registerAsServiceProvider(name, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}

	getServiceProviderName(ownAddress, providerAddress, callback) {
		var context = this
		context.updateSharedContractAddress(ownAddress, function(err, res) {
			context.SharingContractInstance.getServiceProviderName(providerAddress, {from: ownAddress, gasPrice: '20000000000', gas: 2000000}, callback)
		})
	}
}