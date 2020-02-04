const fetch = require("node-fetch");
const fs = require("fs-extra");
const { join } = require("path");

const URL = "https://nonsa.pl/wiki/" + encodeURIComponent("Kalendarz_świąt_nietypowych");
const FILE = "wiki.html";
const CACHE_DIR = ".cache";

const CACHE_FILE = join(CACHE_DIR, FILE);

const download = async () => {
    console.info(URL);
    await fs.ensureDir(CACHE_DIR);
    const cached = await fs.readFile(CACHE_FILE).catch(e => null);
    if (cached) {
        console.info("Loaded Wiki art from cache");
        return String(cached);
    }
    const html = await fetch(URL)
        .then(r => {
            if (!r.ok) {
                throw new Error(r.statusText);
            }
            return r.text();
        });
    fs.writeFile(CACHE_FILE, html)
        .then(r => console.info("Saved wiki page to cache"))
        .catch(e => console.error("Couldn't store wiki page to cache")); // Not so important to break
    return html;
};

module.exports = download;
