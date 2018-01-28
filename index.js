// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const fetch = require('node-fetch');
const https = require('https');
const host = 'https://sandbox-healthservice.priaid.ch';
const all_symptoms = [
  {
    "ID": 10,
    "Name": "Abdominal pain"
  },
  {
    "ID": 238,
    "Name": "Anxiety"
  },
  {
    "ID": 104,
    "Name": "Back pain"
  },
  {
    "ID": 75,
    "Name": "Burning eyes"
  },
  {
    "ID": 46,
    "Name": "Burning in the throat"
  },
  {
    "ID": 170,
    "Name": "Cheek swelling"
  },
  {
    "ID": 17,
    "Name": "Chest pain"
  },
  {
    "ID": 31,
    "Name": "Chest tightness"
  },
  {
    "ID": 175,
    "Name": "Chills"
  },
  {
    "ID": 139,
    "Name": "Cold sweats"
  },
  {
    "ID": 15,
    "Name": "Cough"
  },
  {
    "ID": 207,
    "Name": "Dizziness"
  },
  {
    "ID": 244,
    "Name": "Drooping eyelid"
  },
  {
    "ID": 273,
    "Name": "Dry eyes"
  },
  {
    "ID": 87,
    "Name": "Earache"
  },
  {
    "ID": 92,
    "Name": "Early satiety"
  },
  {
    "ID": 287,
    "Name": "Eye pain"
  },
  {
    "ID": 33,
    "Name": "Eye redness"
  },
  {
    "ID": 153,
    "Name": "Fast, deepened breathing"
  },
  {
    "ID": 76,
    "Name": "Feeling of foreign body in the eye"
  },
  {
    "ID": 11,
    "Name": "Fever"
  },
  {
    "ID": 57,
    "Name": "Going black before the eyes"
  },
  {
    "ID": 9,
    "Name": "Headache"
  },
  {
    "ID": 45,
    "Name": "Heartburn"
  },
  {
    "ID": 122,
    "Name": "Hiccups"
  },
  {
    "ID": 149,
    "Name": "Hot flushes"
  },
  {
    "ID": 40,
    "Name": "Increased thirst"
  },
  {
    "ID": 73,
    "Name": "Itching eyes"
  },
  {
    "ID": 96,
    "Name": "Itching in the nose"
  },
  {
    "ID": 35,
    "Name": "Lip swelling"
  },
  {
    "ID": 235,
    "Name": "Memory gap"
  },
  {
    "ID": 112,
    "Name": "Menstruation disorder"
  },
  {
    "ID": 123,
    "Name": "Missed period"
  },
  {
    "ID": 44,
    "Name": "Nausea"
  },
  {
    "ID": 136,
    "Name": "Neck pain"
  },
  {
    "ID": 114,
    "Name": "Nervousness"
  },
  {
    "ID": 133,
    "Name": "Night cough"
  },
  {
    "ID": 12,
    "Name": "Pain in the limbs"
  },
  {
    "ID": 203,
    "Name": "Pain on swallowing"
  },
  {
    "ID": 37,
    "Name": "Palpitations"
  },
  {
    "ID": 140,
    "Name": "Paralysis"
  },
  {
    "ID": 54,
    "Name": "Reduced appetite"
  },
  {
    "ID": 14,
    "Name": "Runny nose"
  },
  {
    "ID": 29,
    "Name": "Shortness of breath"
  },
  {
    "ID": 124,
    "Name": "Skin rash"
  },
  {
    "ID": 52,
    "Name": "Sleeplessness"
  },
  {
    "ID": 95,
    "Name": "Sneezing"
  },
  {
    "ID": 13,
    "Name": "Sore throat"
  },
  {
    "ID": 64,
    "Name": "Sputum"
  },
  {
    "ID": 179,
    "Name": "Stomach burning"
  },
  {
    "ID": 28,
    "Name": "Stuffy nose"
  },
  {
    "ID": 138,
    "Name": "Sweating"
  },
  {
    "ID": 248,
    "Name": "Swollen glands in the armpits"
  },
  {
    "ID": 169,
    "Name": "Swollen glands on the neck"
  },
  {
    "ID": 211,
    "Name": "Tears"
  },
  {
    "ID": 16,
    "Name": "Tiredness"
  },
  {
    "ID": 115,
    "Name": "Tremor at rest"
  },
  {
    "ID": 144,
    "Name": "Unconsciousness, short"
  },
  {
    "ID": 101,
    "Name": "Vomiting"
  },
  {
    "ID": 181,
    "Name": "Vomiting blood"
  },
  {
    "ID": 56,
    "Name": "weakness"
  },
  {
    "ID": 23,
    "Name": "Weight gain"
  },
  {
    "ID": 30,
    "Name": "Wheezing"
  }
]
const wwoApiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InBldGVqb3NoaTI0QGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiMjc1MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvdmVyc2lvbiI6IjIwMCIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbGltaXQiOiI5OTk5OTk5OTkiLCJodHRwOi8vZXhhbXBsZS5vcmcvY2xhaW1zL21lbWJlcnNoaXAiOiJQcmVtaXVtIiwiaHR0cDovL2V4YW1wbGUub3JnL2NsYWltcy9sYW5ndWFnZSI6ImVuLWdiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9leHBpcmF0aW9uIjoiMjA5OS0xMi0zMSIsImh0dHA6Ly9leGFtcGxlLm9yZy9jbGFpbXMvbWVtYmVyc2hpcHN0YXJ0IjoiMjAxOC0wMS0yNyIsImlzcyI6Imh0dHBzOi8vc2FuZGJveC1hdXRoc2VydmljZS5wcmlhaWQuY2giLCJhdWQiOiJodHRwczovL2hlYWx0aHNlcnZpY2UucHJpYWlkLmNoIiwiZXhwIjoxNTE3MTA2Mzg0LCJuYmYiOjE1MTcwOTkxODR9.9RJUeBvOVvOa9TOdmpAgvGNUljjbJIyvkLQmwA6Fvac';
exports.weatherWebhook = (req, res) => {
  // Get the city and date from the request
  let symptoms = req.body.result.parameters['symptom']; // city is a required param
  console.log("parameters: "+JSON.stringify(req.body.result.parameters));
  console.log(symptoms);
  let gender = req.body.result.parameters['gender'];
  console.log("gender "+req.body.result.parameters['gender']);
  
  let year = req.body.result.parameters['age']['amount'];
  console.log("year: "+req.body.result.parameters['age']['amount']);
  // Get the date for the weather forecast (if present)
  let date = '';
  if (req.body.result.parameters['date']) {
    date = req.body.result.parameters['date'];
    console.log('Date: ' + date);
  }

  let symp = "["
  
  console.log("Hello Eyal")
  for (let x=0;x<symptoms.length;x++){
    for (let i=0; i < all_symptoms.length;i++) {
      if (all_symptoms[i]['Name'].toUpperCase() == symptoms[x].toUpperCase()) {
        let id = all_symptoms[i]['ID'];
        console.log("Symptoms are", id)
        symp  += `'${id}',`
    }
    }

  }
  console.log("Symps is", symp)


  
  symp = symp.slice(0, -1);
  symp += "]"
  let path = '/diagnosis' +
      '?symptoms='+symp + '&gender='+gender+'&year_of_birth='+year +'&token=' + wwoApiKey + '&language=en-gb&format=json';
    console.log('API Request: ' + host + path);
    console.log("Inside Call Weather API functionm");
  fetch(host+path)
  .then(res => res.json())
  .then((out) => {
    console.log('Checkout this JSON! ', out);
    let response = out
      // console.log("Data is", response)
      // let name = response[0]["Issue"]["Name"];
      // let accuracy = response[0]["Issue"]["Accuracy"];
      // let IcdName = response[0]['Issue']['IcdName'];
      // let profname = response[0]['Issue']['ProfNam'];
      
      // let specialization = response[0]['Specialisation']['Name'];
      // Create response
      let output="";
      let max = 2
      if (response.length < 2) {
        console.log("Response is less than 2")
        max = 1
      }
      for (let i=0; i < max; i++) {
        let name = response[i]["Issue"]["Name"];
        let accuracy = response[i]["Issue"]["Accuracy"];
        let IcdName = response[i]['Issue']['IcdName'];
        let profname = response[i]['Issue']['ProfName'];
        let specialization = response[i]['Specialisation'][0]['Name'];
        console.log("Specialization is", JSON.stringify(response[i]['Specialisation']));
      // Create response
     output += `Your symptoms indicate ${name}, otherwise known as ${profname}. Your probability of this disease is 
      ${accuracy} percent. You should see a doctor specializing in ${specialization} to confirm this diagnosis! `;
      }

    
      // Resolve the promise with the output text
      console.log(output);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
      console.log("after Call Weather API");
  })
  .catch(err => { 
    res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': "I cannot diagnose this disease. Seek medical help", 'displayText': "I cannot diagnose this disease. Seek medical help" }));
   });


  // // Call the weather API
  // callWeatherApi('["14"]',gender,year).then((output) => {
  //   // Return the results of the weather API to Dialogflow
  //   
  // }).catch((error) => {
  //   // If there is an error let the user know
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  // });
};
function callWeatherApi (symptoms,gender,year) {
  return new Promise((resolve, reject) => {

    
    // Create the path for the HTTP request to get the weather
    
    // Make the HTTP request to get the weather
    // $.getJSON('', function(data) {
    // //data is the JSON string
    // });

   
    // https.get({host: host, path: path}, (res) => {
    //   let body = ''; // var to store the response chunks
    //   res.on('data', (d) => { body += d; }); // store each response chunk
    //   res.on('end', () => {
    //     // After all the data has been received parse the JSON for desired data
        
    //     resolve(output);
    //   });
    //   res.on('error', (error) => {
    //     reject(error);
    //   });
    // });
  });
}
