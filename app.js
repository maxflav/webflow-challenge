var express = require("express");
var http = require("http");
var https = require("https");
var jsdom = require("jsdom");
var url = require("url");

var app = express();

app.get('/', function (req, res) {
  var path = req.query.path;
  if (!path) {
    res.status(400).send({error: '"path" GET param has no value'});
    return;
  }
  var protocol = url.parse(path).protocol;
  if (protocol != "http:" && protocol != "https:") {
    res.status(400).send({error: "Invalid path protocol, must be http or https"});
    return;
  }

  var getMethod = url.parse(path).protocol == "http:" ? http.get : https.get;
  getMethod(path, function(httpRes) {
    var error;
    if (httpRes.statusCode !== 200) {
      error = "Request Failed. Status Code: " + httpRes.statusCode;
      console.log(error);
      res.status(500).send({error: error});
      return;
    }

    var html = "";
    httpRes.on("data", function(chunk) {
      html += chunk;
    });

    httpRes.on("end", function() {
      handleHTML(html, res);
    });
  }).on("error", function(e) {
    console.log(e.message);
    res.status(500).send({error: e.message});
  });
});

function handleHTML(html, res) {
  var document = jsdom.jsdom(html, {
    features: {
      FetchExternalResources: ["css", "link"]
    }
  });
  var window = document.defaultView;

  var fonts = {};

  var elems = document.body.getElementsByTagName("*");
  for (var i = 0; i < elems.length; i++) {
    var font =  window.getComputedStyle(elems[i]).getPropertyValue("font-family");
    if (font) {
      fonts[font] = 1;
    }
  };

  res.send({fonts: Object.keys(fonts)});
}

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
