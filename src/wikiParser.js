const cheerio = require("cheerio");
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const notUnusual = ["Sylwester", "Boże Narodzenie", "Święto Pracy"];
const knownIgnored = ["Spis treści", "Przypisy"];
const months = [
    "Ruchome",
    ["Styczeń", "stycznia"],
    ["Luty", "lutego"],
    ["Marzec", "marca"],
    ["Kwiecień", "kwietnia"],
    ["Maj", "maja"],
    ["Czerwiec", "czerwca"],
    ["Lipiec", "lipca"],
    ["Sierpień", "sierpnia"],
    ["Wrzesień", "września"],
    ["Październik", "października"],
    ["Listopad", "listopada"],
    ["Grudzień", "grudnia"]
];

const numbers = [
    [""],
    ["pierwszy", "pierwsza"],
    ["drugi", "druga"],
    ["trzeci", "trzecia"],
    ["czwarty", "czwarta"],
    ["piąty", "piąta"],
];
const last = [
    "ostatni", "ostatnia",
];

const days = [
    "", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela",
];

const week = "tydzień";
const weekend = "weekend";

const manualDates = [
    "data ustalana", "marzec lub kwiecień", "równonoc wiosenna", // @todo handle równonoc
    "tydzień poprzedzający wielki tydzień",
];

const onlyUnusual = (holiday) => {
    return !notUnusual.includes(holiday);
};

const trim = s => s.trim();

const parseMonth = function($, $list, title, YEAR) {
    const monthName = $list.eq(0).find("a").attr("title").split(" ")[1].trim();
    const monthNumber = months.findIndex(m => m[1] === monthName);
    return Array.from($list.map(function() {
        const $item = $(this);
        const monthDay = Number($item.find("a").attr("title").split(" ")[0].trim());
        const text = entities.decode($item.text());

        const isDateItem = text.includes("–");
        if (!isDateItem) {
            // @todo handle additional info
            return;
        }

        const holidays = text.substr(text.indexOf("–") + 1).trim().split(",").map(trim).filter(onlyUnusual);
        return {
            day: monthDay,
            month: monthNumber,
            year: YEAR,
            list: holidays,
        };
    })).filter(Boolean);
};

const getDateResult = date => ({
    dayOfWeek: date.getDay() ? date.getDay() : 7, // I love JavaScript `Date`
    day: date.getDate(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
});

const monthDaysCache = {};
const getMonthDays = (year, month) => {
    const id = `${year}${month}`;
    if (monthDaysCache[id]) {
        return monthDaysCache[id];
    }
    const date = new Date(year, month - 1, 1); // I really do
    const dates = [];
    while (date.getMonth() + 1 === month) {
        dates.push(getDateResult(date));
        date.setDate(date.getDate() + 1);
    }
    monthDaysCache[id] = dates;
    return dates;
};

const findDateBefore = (sourceDate, weekDay) => {
    const isWeek = weekDay === -1;
    const searchWeekDay = isWeek ? 1 : weekDay;
    const date = new Date(sourceDate.year, sourceDate.month - 1, sourceDate.day);
    let found = false;
    let foundCounter = 0;
    let tries = 0;
    if (!isWeek) {
        // if searching for given day of week - subtract one day to avoid matching start day as a result
        // if searching for whole week - don't do it, to avoid skipping week if start day is monday
        date.setDate(date.getDate() - 1);
    }
    while (!found && tries < 1000) {
        const fixedDate = getDateResult(date);
        if (fixedDate.dayOfWeek === searchWeekDay) {
            foundCounter++;
            if (!isWeek) {
                return fixedDate;
            }
            if (foundCounter > 1) {
                return fixedDate;
            }
        }
        date.setDate(date.getDate() - 1);
        tries++;
    }
};

const findDateByNumbers = (year, month, order, weekDay) => {
    // const isLast = order === -1;
    const isWeek = weekDay === -1;
    const isWeekEnd = weekDay === -2;

    const searchedWeekDay = isWeek ? 1 : (isWeekEnd ? 6 : weekDay);

    const days = getMonthDays(year, month);
    let result = null;
    let matchCount = 0;
    days.every(day => {
        if (day.dayOfWeek === searchedWeekDay) {
            matchCount++;
            result = day;
        }
        if (matchCount === order) {
            return false;
        }
        return true;
    });

    return result;
};

const findDayOrderNumber = day => {
    const dayName = day.toLowerCase();
    const index = numbers.findIndex((number) => {
        return number.includes(dayName);
    });
    if (index > 0) { // yeah, 0
        return index;
    }
    if (last.includes(dayName)) {
        return -1;
    }
};

const isWholeWeek = word => {
    return word === week;
};

const isWeekend = word => {
    return word === weekend;
};

const findWeekDayNumber = word => {
    const index = days.indexOf(word.toLowerCase());
    if (index > 0) {
        return index;
    }
    if (isWholeWeek(word)) {
        return -1;
    }
    if (isWeekend(word)) {
        return -2;
    }
};

const findMonthNumber = word => {
    const index = months.findIndex((month) => {
        return month[1] === word;
    });
    if (index > 0) {
        return index;
    }
};

const findDate = (text, YEAR) => {
    const words = text.split(" ");
    const firstWord = words[0];
    const secondWord = words[1];
    const thirdWord = words[2];

    const order = findDayOrderNumber(firstWord);
    const weekDay = findWeekDayNumber(secondWord);
    const month = findMonthNumber(thirdWord);

    if (order && weekDay && month) {
        return findDateByNumbers(YEAR, month, order, weekDay);
    }

    switch (text) {
        case "Ostatni tydzień przed środą popielcową": {
            const ashDay = specials.ashDay(YEAR);
            return findDateBefore(ashDay, -1);
        }
        case "Przeddzień środy popielcowej": {
            const ashDay = specials.ashDay(YEAR);
            return findDateBefore(ashDay, ashDay.dayOfWeek === 1 ? 7 : ashDay.dayOfWeek - 1);
        }
        case "Ostatni poniedziałek przed Wielkanocą": {
            const easter = specials.easter(YEAR);
            return findDateBefore(easter, 1);
        }
        case "Sobota poprzedzająca Wielką Sobotę": {
            const easter = specials.easter(YEAR);
            const holySaturday = findDateBefore(easter, 6);
            return findDateBefore(holySaturday, 6);
        }
        case "Tydzień w którym przypada 8 maja": {
            const may8th = getDateResult(new Date(YEAR, 5 - 1, 8));
            return findDateBefore(may8th, -1);
        }
    }

    return null;
};

const specials = {
    easter: function(Y) { // thanks SO: https://stackoverflow.com/a/1284335
        const C = Math.floor(Y/100);
        const N = Y - 19*Math.floor(Y/19);
        const K = Math.floor((C - 17)/25);
        let I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
        I = I - 30*Math.floor((I/30));
        I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
        let J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
        J = J - 7*Math.floor(J/7);
        const L = I - J;
        const M = 3 + Math.floor((L + 40)/44);
        const D = L + 28 - 31*Math.floor(M/4);

        return getDateResult(
            new Date(Y, M - 1, D)
        );
    },
    ashDay: function(year) {
        const e = specials.easter(year);
        const date = new Date(e.year, e.month - 1, e.day);
        date.setDate(date.getDate() - 46);
        return getDateResult(date);
    },
};

const isManualDate = (text) => {
    const lower = text.toLowerCase();
    const found = manualDates.find(date => {
        return lower.includes(date);
    });
    return Boolean(found);
};

const findSplitter = text => {
    if (text.includes("–")) {
        return "–";
    }
    return "-";
};

const parseMovable = function($, $list, title, YEAR) {
    return Array.from($list.map(function() {
        const $item = $(this);
        const text = entities.decode($item.text());
        if (isManualDate(text)) {
            // @todo count/store them to display?
            return;
        }

        const SPLITTER = findSplitter(text);

        const isDateItem = text.includes(SPLITTER);
        if (!isDateItem) {
            throw new Error("Cannot parse splitter: " + text);
        }

        const splitPoint = text.indexOf(SPLITTER);
        const descriptiveDate = text.substr(0, splitPoint).trim();
        const holidays = text.substr(splitPoint + 1).trim().split(",").map(trim).filter(onlyUnusual);

        const fullDate = findDate(descriptiveDate, YEAR);

        if (!fullDate) {
            throw new Error("Cannot parse: " + descriptiveDate);
        }

        return {
            day: fullDate.day,
            month: fullDate.month,
            year: YEAR,
            list: holidays,
        };
    })).filter(Boolean);
};

const parseSection = function($, YEAR) {
    const $section = $(this);
    const title = $section.text().replace("edytuj", "").trim();
    if (knownIgnored.includes(title)) {
        return;
    }
    const $list = $section.nextAll("dl").eq(0).find("dd");
    if (title === months[0]) {
        return parseMovable($, $list, title, YEAR);
    }
    return parseMonth($, $list, title, YEAR);
};

const parse = (html, YEAR) => {
    const $ = cheerio.load(html);
    const $content = $("#mw-content-text");
    const $headers = $content.find("h2");

    const list = [];

    console.info("Found", $headers.length, "headers");

    $headers.each(function() {
        console.info("Parsing new header");
        const parsedItems = parseSection.call(this, $, YEAR);
        console.info("Found", (parsedItems || 0) && parsedItems.length, "lists");
        parsedItems && parsedItems.forEach((item) => {
            console.info("Found", item.list.join("; "));
            item.list.forEach(dayName => {
                list.push({
                    month: item.month,
                    day: item.day,
                    year: item.year,
                    name: dayName
                });
            });
        });
    });

    const validList = list.filter((item) => {
        const date = new Date(item.year, item.month - 1, item.day);
        return date.getFullYear() === item.year && date.getDate() === item.day && date.getMonth() + 1 === item.month;
    });

    console.info("Found", validList.length, "holidays within", list.length, "entries");

    return validList;
};

module.exports = parse;