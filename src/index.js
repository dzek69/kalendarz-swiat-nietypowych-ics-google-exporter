const fs = require("fs-extra");
const download = require("./wikiDownloader");
const parse = require("./wikiParser");
const createIcs = require("./icsCreator");

const main = async () => {
    try {
        const html = await download();
        const list = await parse(html);
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