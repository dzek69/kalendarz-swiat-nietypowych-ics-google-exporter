const fs = require("fs-extra");
const download = require("./wikiDownloader");
const parse = require("./wikiParser");
const createIcs = require("./icsCreator");

const parseYear = (y) => {
    if (!y) {
        return null;
    }
    if (String(y).match(/^\d{4}$/)) {
        return Number(y);
    }
};

const DEFAULT_YEAR = (new Date()).getFullYear();
const YEAR = parseYear(process.argv[2]) || DEFAULT_YEAR;

const main = async () => {
    try {
        console.info("Using", YEAR, "as year");
        await new Promise(r => setTimeout(r, 1000));
        console.info("Downloading wiki page");
        const html = await download();
        console.info("Parsing article");
        const list = await parse(html, YEAR);
        const ics = await createIcs(list);
        await fs.writeFile("calendar.ics", ics);
        console.info("Calendar file saved correctly.");
    }
    catch(e) {
        console.error("Error during generating.");
        console.error(e);
    }
};
main();