const fs = require('fs');
const moment = require('moment');

const input = fs.readFileSync('problem2.json');

const data = JSON.parse(input);

data.accidents.forEach((accident) => {
  accident.date = moment(accident.date, 'M/D/YYYY').format('YYYY-MM-DD');
});

fs.writeFileSync('output2.json', JSON.stringify(data));