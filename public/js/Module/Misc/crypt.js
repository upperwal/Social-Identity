import Network from './Network'

export default class Crypt {

	constructor() {
		this.network = new Network()
	}

	hello() {
		console.log('hello')
		//this.network.get('jj', {'he': 'uu', 'jdj': 'yy'})
	}

	create_key_pair() {
		return this.network.getWithData('create_new_pair')
	}

	encrypt(vAddress, keyType, duration, plaintext) {
		var data = {
			'user': vAddress,
			'plaintext': plaintext,
			'keytype': keyType,
			'duration': duration
		}
		var context = this
		return this.network.get('encrypt', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	encrypt_second(vAddress, keyType, duration, plaintext) {
		var data = {
			'user': vAddress,
			'plaintext': plaintext,
			'keytype': keyType,
			'duration': duration
		}
		var context = this
		console.log('Enc Using: ' + vAddress + ' | Key type: ' + keyType)


		return this.network.get('encrypt_second', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	decrypt_service_side(vAddress, keyType, duration, cipher) {
		var data = {
			'user': vAddress,
			'cipher': cipher,
			'keytype': keyType,
			'duration': duration
		}
		var context = this
		console.log('Dec Using: ' + vAddress + ' | Key type: ' + keyType)
		console.log(cipher)
		return this.network.get('decrypt_service_side', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	decrypt(vAddress, keyType, duration, cipher) {
		var data = {
			'user': vAddress,
			'cipher': cipher,
			'keytype': keyType,
			'duration': duration
		}
		var context = this
		return this.network.get('decrypt', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	encryptTwice(vAddress1, vAddress2, keyType1, keyType2, duration, plaintext) {
		var data = {
			'user1': vAddress1,
			'user2': vAddress2,
			'plaintext': plaintext,
			'keytype1': keyType1,
			'keytype2': keyType2,
			'duration': duration
		}
		var context = this
		return this.network.get('encrypt_twice', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	decryptTwice(vAddress1, vAddress2, keyType1, keyType2, duration, cipher) {
		var data = {
			'user1': vAddress1,
			'user2': vAddress2,
			'cipher': cipher,
			'keytype1': keyType1,
			'keytype2': keyType2,
			'duration': duration
		}
		var context = this
		return this.network.get('decrypt_twice', data)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	open_encrypt(data) {
		var dataa = {
			'data': data
		}
		var context = this
		console.log(dataa)
		return this.network.get('open_encrypt', dataa)
			/*.then(function(res) {
				console.log(res.encrypted)
				data.cipher = res.encrypted;
				data.keytype = 'priv'
				context.network.get('decrypt', data)
					.then(console.log)
			})*/
	}

	open_decrypt(data, pub) {
		var dataa = {
			'data': data,
			'pub': pub
		}
		var context = this
		return this.network.get('open_decrypt', dataa)
	}
}