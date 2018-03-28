var express = require('express');
var path = require('path')
var app = express()


var crypto = require('./server/components/cryptography/Cryptography')



app.set('port', (process.env.PORT || 3000))

app.use('/public', express.static('public'))
app.use('/client.min.js', express.static('public/client.min.js'))
app.use('/node_modules', express.static(__dirname + '/node_modules'))


app.get('/create_keys', function(req, res) {
	var a = [
				'0x627306090abab3a6e1400e9345bc60c78a8bef57', 
				'0xf17f52151ebef6c7334fad080c5704d77216b732',
				'0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
				'0x821aea9a577a9b44299b9c15c88cf3087f3b5544',
				'0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
				'0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e',
				'0x2191ef87e392377ec08e7c08eb105ef5448eced5',
				'0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5',
				'0x6330a553fc93768f612722bb8c2ec78ac90b3bbc',
				'0x5aeda56215b167893e80b4fe645ba6d5bab767de'
			]

	//crypto.createKeyPair()
	crypto.createAllPersistentKeys(a);
	res.write('DONE')
	res.end()
	
})

app.get('/create_new_pair', function(req, res) {
	res.send(crypto.createKeyPair())
})

app.get('/encrypt', function(req, res) {
	crypto.encrypt(req.query.user, req.query.plaintext, req.query.keytype, req.query.duration, res)
})

app.get('/decrypt', function(req, res) {
	crypto.decrypt(req.query.user, req.query.cipher, req.query.keytype, req.query.duration, res)
}) 

app.get('/encrypt_twice', function(req, res) {
	crypto.encrypt_twice(req.query.user1, req.query.user2, req.query.plaintext, req.query.keytype1, req.query.keytype2, req.query.duration, res)
})

app.get('/decrypt_twice', function(req, res) {
	crypto.decrypt_twice(req.query.user1, req.query.user2, req.query.cipher, req.query.keytype1, req.query.keytype2, req.query.duration, res)
})

app.get('/encrypt_second', function(req, res) {
	crypto.encrypt_second(req.query.user, req.query.plaintext, req.query.keytype, req.query.duration, res)
})

app.get('/decrypt_service_side', function(req, res) {
	crypto.decrypt_service_side(req.query.user, req.query.cipher, req.query.keytype, req.query.duration, res)
})

app.get('/open_encrypt', function(req, res) {
	crypto.open_encrypt(req.query.data, res)
})

app.get('/open_decrypt', function(req,res) {
	crypto.open_decrypt(req.query.data, req.query.pub, res)
})

app.get('*', function(req, res) {
	//res.send('hfhg')
	res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.listen(app.get('port'), function() {
	console.log('Application running on localhost:' + app.get('port'))
})