var ursa = require('ursa')
var fs = require('fs')




module.exports.createKeyPair = function() {
	var rand = parseInt(Math.random() * (100 - 2) + 2)
	if(rand % 2 == 0)
		rand++
	var key = ursa.generatePrivateKey(1024, rand)
	var privpem = key.toPrivatePem('base64');
	var pubpem = key.toPublicPem('base64');
	

	return {'priv':privpem, 'pub':pubpem}

}


module.exports.createAllPersistentKeys = function(users) {
		var keystore = {}
		for(var i=0; i<users.length; i++) {
			var keys = this.createKeyPair()
			var keyData = {}
			console.log(users[i])
			keyData['pub'] = keys[1]
			keyData['priv'] = keys[0]
			keystore[users[i]] = keyData
		}
		 
		

		fs.writeFile('keystore_per', JSON.stringify(keystore), 'utf-8')
	}

module.exports.getFileContent = function(srcPath, callback) { 
	    fs.readFile(srcPath, 'utf8', function (err, data) {
	        if (err) fs.writeFile(srcPath, '', 'utf-8')
	        callback(data);
	        }
	    );
	}


module.exports.createTempKeys = function(user) { 
		var context = this
	    this.getFileContent('keystore_temp', function(data) {
	    	console.log('sdfsdf'+data)
	    	if(data != '')
	    		var keyObject = JSON.parse(data)
	    	else
	    		var keyObject = {}


	    	console.log('ff')
	    	var keys = context.createKeyPair()
	    	var keyData = {}
			keyData['pub'] = keys[1]
			keyData['priv'] = keys[0]

			keyObject[user] = keyData

	        fs.writeFile ('keystore_temp', JSON.stringify(keyObject), function(err) {
	            if (err) throw err;
	            console.log('complete');
	        });
	    });
	}


module.exports.fetchKey = function(userId, keyType, duration, callback) {
		console.log('In fetchkey : uid' + userId)
		if(duration == 'long') {
			var file = 'keystore_per'
		}
		else {
			var file = 'keystore_temp'
		}

		fs.readFile(file, 'utf8', function (err, data) {
	        if (err) console.log('Error: Reading file.')
	        
	        if(data != '')
	    		var keyObject = JSON.parse(data)
	    	else {
	    		console.log('data not available.')
	    	}
	    	console.log('In fetchkey : keyObject' + keyObject)
	    	var key = keyObject[userId][keyType]
	    	console.log(key)
	    	callback(key)
	    });
	}

encrypt_priv = function(userId, data, keyType, duration, callback) {
	//console.log('In Encrypt : uid' + userId)
	module.exports.fetchKey(userId, keyType, duration, function(keyPEM) {
		if(keyType == 'pub') {
			var pubkey = ursa.createPublicKey(keyPEM, 'base64')

			var enc = pubkey.encrypt(data, 'utf8', 'hex')
			if(callback == undefined)
				return {'encrypted': enc, 'error': false};
			callback({'encrypted': enc, 'error': false});
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			var enc = key.privateEncrypt(data, 'utf8', 'hex')
			if(callback == undefined)
				return {'encrypted': enc, 'error': false};
			callback({'encrypted': enc, 'error': false});
		}
	})
}

module.exports.encrypt = function(userId, data, keyType, duration, res) {

	console.log('In Encrypt : uid' + userId)
	encrypt_priv(userId, data, keyType, duration, function(result) {
		res.send(result)
	})
	/*this.fetchKey(userId, keyType, duration, function(keyPEM) {
		if(keyType == 'pub') {
			var pubkey = ursa.createPublicKey(keyPEM, 'base64')

			var enc = pubkey.encrypt(data, 'utf8', 'hex')
			res.send({'encrypted': enc, 'error': false});
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			var enc = keykey.privateEncrypt(data, 'utf8', 'hex')
			res.send({'encrypted': enc, 'error': false});
		}
	})*/
}

decrypt_priv = function(userId, data, keyType, duration, callback) {
	module.exports.fetchKey(userId, keyType, duration, function(keyPEM) {

		if(keyType == 'pub') {
			var key = ursa.createPublicKey(keyPEM, 'base64')
			var dec = key.publicDecrypt(data, 'hex', 'utf8')
			callback({'decrypted': dec, 'error': false});
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			console.log('data: ' + data)
			var dec = key.decrypt(data, 'hex', 'utf8')
			callback({'decrypted': dec, 'error': false});
		}
	})
}


module.exports.decrypt = function(userId, data, keyType, duration, res) {
	decrypt_priv(userId, data, keyType, duration, function(result) {
		res.send(result)
	})
	/*this.fetchKey(userId, keyType, duration, function(keyPEM) {

		if(keyType == 'pub') {
			var key = ursa.createPublicKey(keyPEM, 'base64')
			var dec = key.publicDecrypt(data, 'hex', 'utf8')
			res.send({'decrypted': dec, 'error': false});
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			console.log('data: ' + data)
			var dec = key.decrypt(data, 'hex', 'utf8')
			res.send({'decrypted': dec, 'error': false});
		}
	})*/
}

module.exports.encrypt_second = function(userId, data, keyType, duration, res) {
	console.log(data.length)
	var dataLen = data.length
	var chunks = Math.ceil(dataLen / 80);
	var final = ''

	module.exports.fetchKey(userId, keyType, duration, function(keyPEM) {
		if(keyType == 'pub') {
			var pubkey = ursa.createPublicKey(keyPEM, 'base64')

			for(var i=0; i<chunks; i++) {
				var start = i * 80;
				var end = start + 80
				if(i == chunks - 1)
					end = dataLen
				final += pubkey.encrypt(data.substring(start, end), 'utf8', 'hex')
			}
			res.send({'encrypted': final, 'error': false})
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			for(var i=0; i<chunks; i++) {
				var start = i * 80;
				var end = start + 80
				if(i == chunks - 1)
					end = dataLen
				final += key.privateEncrypt(data.substring(start, end), 'utf8', 'hex')
			}
			res.send({'encrypted': final, 'error': false})
		}
	})

	

	/*var red = ''
	encrypt_priv(userId, enc.substring(0,80), keyType, duration, function(result2) {
		red += result2.encrypted
		encrypt_priv(userId, enc.substring(80, 160), keyType, duration, function(result3) {
			red += result3.encrypted
			encrypt_priv(userId, enc.substring(160, 240), keyType, duration, function(result4) {
				red += result4.encrypted
				encrypt_priv(userId, enc.substring(240, 256), keyType, duration, function(result5) {
					red += result5.encrypted
					res.send({'encrypted': red, 'error': false})
				})
			})
		})
	})*/
}

module.exports.open_encrypt = function(data, res) {
	var keys = module.exports.createKeyPair()

	var dataLen = data.length
	var chunks = Math.ceil(dataLen / 80);
	var final = ''
	var key = ursa.createPrivateKey(keys.priv, '', 'base64')
	for(var i=0; i<chunks; i++) {
		var start = i * 80;
		var end = start + 80
		if(i == chunks - 1)
			end = dataLen
		final += key.privateEncrypt(data.substring(start, end), 'utf8', 'hex')
	}
	res.send({'pub':keys.pub, 'encrypted': final, 'error': false})
}

module.exports.open_decrypt = function(data, pub, res) {
	var dataLen = data.length;
	var chunks = Math.ceil(dataLen / 256)
	var final = ''
	var key = ursa.createPublicKey(pub, 'base64')
	for(var i=0; i<chunks; i++) {
		var start = i * 256;
		var end = start + 256
		if(i == chunks - 1)
			end = dataLen
		final += key.publicDecrypt(data.substring(start, end), 'hex', 'utf8')
	}
	res.send({'decrypted': final, 'error': false});
}


module.exports.decrypt_service_side = function(userId, data, keyType, duration, res) {
	console.log('Key check: ' + keyType)
	var dataLen = data.length;
	var chunks = Math.ceil(dataLen / 256)
	var final = ''

	module.exports.fetchKey(userId, keyType, duration, function(keyPEM) {

		
		if(keyType == 'pub') {
			var key = ursa.createPublicKey(keyPEM, 'base64')
			for(var i=0; i<chunks; i++) {
				var start = i * 256;
				var end = start + 256
				if(i == chunks - 1)
					end = dataLen
				final += key.publicDecrypt(data.substring(start, end), 'hex', 'utf8')
			}
			res.send({'decrypted': final, 'error': false});
		}
		else {
			var key = ursa.createPrivateKey(keyPEM, '', 'base64')
			for(var i=0; i<chunks; i++) {
				var start = i * 256;
				var end = start + 256
				if(i == chunks - 1)
					end = dataLen
				final += key.decrypt(data.substring(start, end), 'hex', 'utf8')
			}
			res.send({'decrypted': final, 'error': false});
		}

		
	})
	
}

module.exports.encrypt_twice = function(userId1, userId2, data, keyType1, keyType2, duration, res) {
	encrypt_priv(userId1, data, keyType1, duration, function(result) {
		console.log('First: '+result.encrypted)
		var enc = result.encrypted
		var red = ''
		encrypt_priv(userId2, enc.substring(0,80), keyType2, duration, function(result2) {
			red += result2.encrypted
			console.log('th: '+red)
			encrypt_priv(userId2, enc.substring(80, 160), keyType2, duration, function(result3) {
				red += result3.encrypted
				encrypt_priv(userId2, enc.substring(160, 240), keyType2, duration, function(result4) {
					red += result4.encrypted
					encrypt_priv(userId2, enc.substring(240, 256), keyType2, duration, function(result5) {
						red += result5.encrypted
						res.send({'encrypted': red, 'error': false})
					})
				})
			})
		})
	})
}

module.exports.decrypt_twice = function(userId1, userId2, data, keyType1, keyType2, duration, res) {
	var red = ''
	console.log('Data: ' +userId1 + ' Key: '+keyType1)
	/*decrypt_priv(userId1, data.substring(0, 256), keyType1, duration, function(result) {
		res.send(result)
	})*/
	decrypt_priv(userId1, data.substring(0,256), keyType1, duration, function(result) {
		red += result.decrypted
		console.log('First: ' + red)
		decrypt_priv(userId1, data.substring(256,512), keyType1, duration, function(result2) {
			red += result2.decrypted
			decrypt_priv(userId1, data.substring(512,768), keyType1, duration, function(result3) {
				red += result3.decrypted
				decrypt_priv(userId1, data.substring(768,1024), keyType1, duration, function(result4) {
					red += result4.decrypted
					decrypt_priv(userId2, red, keyType2, duration, function(result5) {
						result5['dec_once'] = red
						res.send(result5)
					})
				})
			})

		})
		
	})
}


/*class Cryptography {
	
	constructor() {
		console.log('dsfds')
		this.createAllPersistentKeys(['0xf17f52151ebef6c7334fad080c5704d77216b732', '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef'])
		this.createTempKeys('0xf17f52151ebef6c7334fad080c5704d77216b732')

		this.encrypt('0xf17f52151ebef6c7334fad080c5704d77216b732', 'hello', 'pub', 'long')
	}

	

	




}*/

//module.exports = new Cryptography;