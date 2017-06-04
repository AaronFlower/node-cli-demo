#!/usr/bin/env node
var program = require('commander')
program
	.arguments('<file>')
	.option('-u, --username <username>', 'The user to authenticate to')
	.option('-p, --password <password>', 'The user\'s password')
	.action(function (file) {
		console.log('user: %s, password: %s, file: %s', program.username, program.password, file)
	})
	.parse(process.argv)