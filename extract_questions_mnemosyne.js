"use strict";

const fs = require('fs');
const readline = require('readline');


const dataPath = './data/';
const questionFilename = 'Technician Pool and Syllabus 2022-2026 Public Release Errata March 7 2022.txt';
const inputFile = dataPath + questionFilename;
const outputFile = dataPath + `mnemosyne_flashcards_import_${questionFilename}`;

async function processFile() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity
  });

  let output = '';
  let section = new Array;

  for await (const line of rl) {
    if (line === ('~~')) {
      
      let choicesArray = new Array;
      let choices = new String;

      for (let i = 3; i >= 0; i--) {
        choicesArray.push(section.pop().trim());
      }
      choicesArray.reverse();
      for (const value of choicesArray) {
        choices += `${value}<br>`;
      }

      const question = `${section.pop().trim()}<br>`;
      const correctAnswer = `${section.pop().trim().match(/\((.)\)/)[1].toString()}`;
      
      let answer;
      switch (correctAnswer) {
        case 'A':
          answer = `${choicesArray.at(0)}\r`;
          break;
        case 'B':
          answer = `${choicesArray.at(1)}\r`;
          break;
        case 'C':
          answer = `${choicesArray.at(2)}\r`;
          break;
        case 'D':
          answer = `${choicesArray.at(3)}\r`;
          break;
      }

      output += `${question}${choices}\t${answer}`;
      section = Array.of();
    } else {
      section.push(line);
    }
  }

  fs.writeFile(outputFile, output, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

processFile();