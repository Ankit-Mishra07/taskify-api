const { v4: uuidv4 } = require('uuid');

const isValidDate = (date) => {
    if(!date || new Date(date).toString() == 'Invalid Date') {
        return false;
    }else {
        return true;
    }
}


const convertLogTime = (time) => {
    let logTimeInSeconds = 0;
    const regex = /^(\d+(\.\d+)?)(h)$/;
    const match = time.match(regex);

    if (match && match.length) {
        const numberPart = parseFloat(match[1]); // "0.5" as a number
        const unitPart = match[3];              // "h" as a string
        if(unitPart == 'h') {
            logTimeInSeconds = (60*60) * Number(numberPart);
        }else if(unitPart == 'm') {
            logTimeInSeconds = 60 * Number(numberPart);
        }
        return logTimeInSeconds;
    } else {
        console.log("String format is invalid");
        return logTimeInSeconds;
    }
}
const combineSubtaskToTask = (tasklist) => {
    let list = [];
    for(let task of tasklist) {
      list.push(task);
      task.subTasks.forEach(el => {
        list.push(el);
      })
    }
    return list;
  }

function generateUUIDId() {
  return `IDS-${uuidv4().split('-')[0].toUpperCase()}`;
}
module.exports = {isValidDate, combineSubtaskToTask, generateUUIDId}