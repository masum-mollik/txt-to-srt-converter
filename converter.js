const fs = require("fs");
var path = require("path");
const directory =
  "D:/[FreeCoursesOnline.Me] [FrontendMasters] Deep JavaScript Foundations, v3 [FCO]/transcripts";
var directoryEntries = fs.readdirSync(directory);
directoryEntries.forEach((fileName) => {
  if (
    fs.statSync(path.join(directory, fileName)).isDirectory() == false &&
    fileName.slice(-4) == ".txt"
  ) {
    fs.readFile(path.join(directory, fileName), "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let processedData = processFile(data);
      writeDataInFile(processedData, directory, fileName);
    });
  }
});

function writeDataInFile(processedData, directory, fileName) {
  const fs = require("fs");
  const path = require("path");
  const fileNameWithoutExtension = fileName.slice(0, fileName.length - 4);
  fs.writeFile(
    path.join(directory, `${fileNameWithoutExtension}.srt`),
    processedData,
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
}

function processFile(data) {
  speechWithStartTime = data.split("\n\n");
  const formatReg = new RegExp(/^\[.*\]$/g);
  let dataWithTimeAndWithoutSpace = [];
  for (
    let index = 0, newIndex = 0;
    index < speechWithStartTime.length;
    index++
  ) {
    if (speechWithStartTime[index].match(formatReg)) {
      let speech = speechWithStartTime[index + 1];
      dataWithTimeAndWithoutSpace[
        newIndex
      ] = `${speechWithStartTime[index]}\n${speech}`;
      index++;
      newIndex++;
    } else {
      if (speechWithStartTime[index].trim() == "") {
        continue;
      }
      dataWithTimeAndWithoutSpace[newIndex] = speechWithStartTime[index];
      newIndex++;
    }
  }

  let reg = new RegExp(/\[.*\]/g);
  let startTime = "";
  let endTime = "";
  let index = 0;
  while (index < dataWithTimeAndWithoutSpace.length) {
    let currentElement = dataWithTimeAndWithoutSpace[index];
    let nextElement = "";
    let currentMatch = currentElement.match(reg);
    if (currentMatch == null) {
      index++;
      continue;
    }
    let currentTime = currentMatch[0];
    let nextMatch = "";
    let nextTime = "";

    if (
      index < dataWithTimeAndWithoutSpace.length - 1 &&
      dataWithTimeAndWithoutSpace[index + 1].trim() != ""
    ) {
      nextElement = dataWithTimeAndWithoutSpace[index + 1];
      nextMatch = nextElement.match(reg);
      if (nextMatch == null) {
        console.log(nextMatch);
        index++;
        continue;
      }
      nextTime = nextMatch[0];
      startTime = getStartTime(currentTime, index);
      endTime = getEndTime(nextTime, false);
      currentElement = currentElement.replace(
        reg,
        `${index + 1}\n${startTime} --> ${endTime}`
      );
      dataWithTimeAndWithoutSpace[index] = currentElement;
    } else {
      startTime = getStartTime(currentTime, index);
      endTime = getEndTime(currentTime, true);
      currentElement = currentElement.replace(
        reg,
        `${index + 1}\n${startTime} --> ${endTime}`
      );
      dataWithTimeAndWithoutSpace[index] = currentElement;
    }
    index++;
  }
  dataWithTimeAndWithoutSpace = dataWithTimeAndWithoutSpace.join("\n\n");
  console.log(dataWithTimeAndWithoutSpace);
  return dataWithTimeAndWithoutSpace;
}

function getStartTime(currentTime, index) {
  let reg = new RegExp(/\[|\]/g);
  var target = new Date("1970-01-01 " + currentTime.replace(reg, ""));
  var previousSecond = new Date(target - (index == 0 ? 0 : 1));
  var timeFormat =
    ("0" + previousSecond.getHours()).slice(-2) +
    ":" +
    ("0" + previousSecond.getMinutes()).slice(-2) +
    ":" +
    ("0" + previousSecond.getSeconds()).slice(-2) +
    "," +
    ("0" + previousSecond.getMilliseconds()).slice(-3);
  return timeFormat;
}

function getEndTime(nextTime, isLastTime) {
  let reg = new RegExp(/\[|\]/g);
  var target = new Date("1970-01-01 " + nextTime.replace(reg, ""));
  var endTime = new Date(target - (isLastTime ? -30999 : 1001));
  var timeFormat =
    ("0" + endTime.getHours()).slice(-2) +
    ":" +
    ("0" + endTime.getMinutes()).slice(-2) +
    ":" +
    ("0" + endTime.getSeconds()).slice(-2) +
    "," +
    ("0" + endTime.getMilliseconds()).slice(-3);
  return timeFormat;
}
