const optionDefinitions = [
  { name: 'input', alias: 'i', type: String },
  { name: 'outputDir', alias: 'o', type: String }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

const fs = require('fs')

let svgSymbols = ''
try {
  svgSymbols = fs.readFileSync(options.input, {encoding: 'utf-8'})
} catch (e) {
  console.log(e)
}

try {
  fs.mkdirSync(options.outputDir)
} catch (err) {
  if (err.code !== 'EEXIST') throw err
}

const $ = require('cheerio')
const path = require('path')

$(svgSymbols).find('symbol').each(function(index, symbol) {
  const $symbol = $(symbol)
  const symbolTitle = $symbol.find('title').html() || $symbol.attr('id')
  const title = symbolTitle ? `${symbolTitle}.svg` : `svg_${index}.svg`
  const svg = `<svg viewBox="${$symbol.attr('viewBox')}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${$symbol.html()}</svg>`
  fs.writeFileSync(path.join(options.outputDir, title), svg)
}) 