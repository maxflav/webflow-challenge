var cheerio = require('cheerio');
var express = require('express');
var http = require('http');

var app = express();

app.get('/', function (req, res) {
  var path = req.query.path;
  if (!path) {
    res.status(400).send('"path" GET param has no value');
    return;
  }

  http.get(path, function(httpRes) {
    var error;
    if (httpRes.statusCode !== 200) {
      error = "Request Failed.\n Status Code: " + httpRes.statusCode;
      console.log(error);
      res.status(500).send(error);
    }

    var html = '';
    httpRes.on('data', function(chunk) {
      html += chunk;
    });

    httpRes.on('end', function() {
      handleHTML(html, res);
    });
  }).on('error', function(e) {
    console.log(e.message);
    res.status(500).send(e.message);
  });
});

function handleHTML(html, res) {
  var $ = cheerio.load(html);
  var fonts = [];

  $('*').each(function() {
    var font = $(this).css('font-family');
    if (font) {
      fonts.push(font)
    }
  });

  res.send(fonts);
}

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
