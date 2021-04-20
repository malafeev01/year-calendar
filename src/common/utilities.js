import moment from 'moment';


const DATE_FORMAT = "YYYY-MM-DD";

function daysBetweenDates(startDate, endDate) {
  var dates = [];

  var currDate = moment(startDate).startOf('day');
  var lastDate = moment(endDate).startOf('day');
  dates.push(startDate);
  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    let copyDate = currDate.clone();
    dates.push(copyDate);
  }
  if (endDate) {
    dates.push(endDate);
  }
  return dates;
};

function isDateInArray(date, arr) {
  for (var i = 0; i < arr.length; i++) {

    if (date.format(DATE_FORMAT).toString() === arr[i].format(DATE_FORMAT).toString()) {
      return true;
    }
  }

  return false;
}

function logInfo (context, message) {
  console.info(`${context.constructor.name}: ${message}`)
}

function logError (context, message) {
  console.error(`${context.constructor.name}: ${message}`)
}

export {
  daysBetweenDates,
  isDateInArray,
  DATE_FORMAT,
  logInfo,
  logError
};
