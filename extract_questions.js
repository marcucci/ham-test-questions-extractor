const fs = require('fs');

const dataPath = './ham_test_extractor/data/';
const questionFilename = 'Technician Pool and Syllabus 2022-2026 Public Release Errata March 7 2022.txt';
const inputFile = dataPath + questionFilename;
const outputFile = dataPath + 'flashcards_' + questionFilename;

// Read the input file
const questionFile = fs.readFileSync(inputFile, 'utf8',);

// Splut the file into lines
const lines = questionFile.toString().split('\n');
//var indicator = array();

// Find the first question indicator '~~'
var marker = lines.indexOf('~~\r');

// initilize output
var output = '';

// Find all the questions and answers and add them to output
while (marker > 0) {
  
  const correct_answer = lines[marker-6].match(/\((.)\)/)[1].toString();
  const question = lines[marker-5].trim()+ '<br>';
  
  var choices = '';
  for (let i=4; i > 0; i--) {
    choices = choices + lines[marker-i].trim() + '<br>'
  }
  
  var answer;
  switch (correct_answer) {
    case 'A' : answer = lines[marker-4]+'\r'; break;
    case 'B' : answer = lines[marker-3]+'\r'; break;
    case 'C' : answer = lines[marker-2]+'\r'; break; 
    case 'D' : answer = lines[marker-1]+'\r'; break;
  }
  output = output + question + choices + '\t' + answer.trim() + '\r';
  marker = lines.indexOf('~~\r', marker+1);
}

// write the results to a txt file in Mnemosyne format
fs.writeFile(outputFile, output.toString(), (err) => {
  if (err) {
    console.error(err);
    return;
  }
})