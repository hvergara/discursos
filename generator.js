var fs = require('fs')
var util = require('util')
var marked = require('marked')
var request = require('request')
var async = require('async')
var ejs = require('ejs')

var config = require('./config.json')

var yearTemplate = ejs.compile(fs.readFileSync('templates/year.ejs').toString())
var homeTemplate = ejs.compile(fs.readFileSync('templates/index.ejs').toString())

// async.forEachOf(config.years, fetch, function (err) {
// 	if (err) console.log(err)
// })


var years = {}

for (var year in config.years) {
	var item = config.years[year]
	years[item.president] = years[item.president] || []
	years[item.president].push(year)
}

var index = homeTemplate({
	presidents: config.presidents,
	years: years
})

fs.writeFileSync('index.html', index)


function fetch (item, year, callback) {
	var url = config.base_url + item.filename

	request.get(url, function (err, res, body) {
		if (err) return callback(err)
		render(year, item, marked(body), callback)
	})

}

function render (year, item, html, callback) {

	fs.mkdir(year, function (err) {

		var output = yearTemplate({
			content: html,
			title: util.format(config.title_template, config.presidents[item.president].name, year),
		})

		fs.writeFile(year + '/index.html', output, callback)
	})

}