var fs = require('fs');
var path = require('path');
var language = require('@google-cloud/language');

var projectId = 'jono-fyi';

var data;
var client = new language.LanguageServiceClient({
  projectId: projectId,
});

var uri = path.resolve(__dirname, './prototypes/assets/excerpt-on-spiritual-in-art.txt');
var text = fs.readFileSync(uri).toString();

var document = {
  content: text,
  type: 'PLAIN_TEXT',
};

// getSentiment(getTokens);
getTokens();

function getSentiment(callback) {

  console.log('Starting sentiment analysis');

  client.analyzeSentiment({ document: document }).then(function(resp) {

    console.log('Finished sentiment analysis');

    var result = resp[0];
    var uri = path.resolve(__dirname, './prototypes/assets/excerpt-on-spiritual-in-art.sentiments.json');

    fs.writeFileSync(uri, JSON.stringify(result));
    console.log('Exported JSON Analysis');

    if (callback) {
      callback();
    }

  });

}

function getTokens(callback) {

  console.log('Starting syntax analysis');

  client.analyzeSyntax({ document: document }).then(function(resp) {

    console.log('Finished syntax analysis');

    var result = resp[0];
    var uri = path.resolve(__dirname, './prototypes/assets/excerpt-on-spiritual-in-art.tokens.json');

    fs.writeFileSync(uri, JSON.stringify(result));
    console.log('Exported JSON Analysis');

    if (callback) {
      callback();
    }

  });

}
