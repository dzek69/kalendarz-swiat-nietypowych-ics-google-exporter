#!/usr/bin/env node

const fs = require("fs-extra");
const createIcs = require("./icsCreator");
const parse = require("kalendarz-swiat-nietypowych-parser");

const YEAR = process.argv[2];

const main = async () => {
    try {
        const list = await parse(YEAR);
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
