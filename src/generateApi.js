const fs = require('fs-extra');
const download = require('./wikiDownloader');
const parse = require('./wikiParser');
const createIcs = require('./icsCreator');

const parseYear = (y) => {
  if (!y) {
    return null;
  }
  if (String(y).match(/^\d{4}$/)) {
    return Number(y);
  }
};

const DEFAULT_YEAR = new Date().getFullYear();
const YEAR = parseYear(process.argv[2]) || DEFAULT_YEAR;

const main = async () => {
  try {
    console.info('Using', YEAR, 'as year');
    await new Promise((r) => setTimeout(r, 1000));
    console.info('Downloading wiki page');
    const html = await download();
    console.info('Parsing article');
    const list = await parse(html, YEAR);
    generateApi(list);
  } catch (e) {
    console.error('Error during generating.');
    console.error(e);
  }
};

const mkdir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const months = Array.from(Array(13).keys());
const days = Array.from(Array(32).keys());
months.shift();
days.shift();

const generateApi = (list) => {
  const dir = './dist';
  mkdir(dir);
  console.log(months);
  months.forEach((month) => {
    mkdir(`${dir}/${month}`);
    days.forEach((day) => {
      holidays = list.filter(
        (holiday) => holiday.month === month && holiday.day === day
      );
      fs.writeFile(`${dir}/${month}/${day}.json`, JSON.stringify(holidays));
    });
  });
};

main();
