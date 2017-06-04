#!/usr/bin/env node --harmony
var co = require('co')
var prompt = require('co-prompt')
var program = require('commander')

program
	.arguments('<file>')
	.option('-u, --username <username>', 'The user to authenticate to')
	.option('-p, --password <password>', 'The user\'s password')
	.action(function (file) {
		co(function* () {
			let username = program.username
			let password = program.password
			if (!username) {
				username = yield prompt('username: ')
			}
			if (!password) {
				password = yield prompt.password('password: ')
			}
			console.log('user: %s, password: %s, file: %s', username, password, file)
		})
	})
	.parse(process.argv)