#!/usr/bin/env node

const fs = require("fs");
const target = process.argv[2];

function doFormat(imageset) {
    try {
        const contentJSON = JSON.parse(fs.readFileSync(imageset + "/Contents.json"));
        contentJSON.images.forEach((it, idx) => {
            if (it.idiom === "universal" && it.scale === "1x" && it.filename !== undefined && it.filename !== imageset.split("/").pop() + ".png") {
                fs.renameSync(imageset + "/" + it.filename, imageset + "/" + imageset.split("/").pop() + ".png");
                contentJSON.images[idx].filename = imageset.split("/").pop() + ".png";
            }
            else if (it.idiom === "universal" && it.scale === "2x" && it.filename !== undefined && it.filename !== imageset.split("/").pop() + "@2x.png") {
                fs.renameSync(imageset + "/" + it.filename, imageset + "/" + imageset.split("/").pop() + "@2x.png");
                contentJSON.images[idx].filename = imageset.split("/").pop() + "@2x.png";
            }
            else if (it.idiom === "universal" && it.scale === "3x" && it.filename !== undefined  && it.filename !== imageset.split("/").pop() + "@3x.png") {
                fs.renameSync(imageset + "/" + it.filename, imageset + "/" + imageset.split("/").pop() + "@3x.png");
                contentJSON.images[idx].filename = imageset.split("/").pop() + "@3x.png";
            }
        })
        fs.writeFileSync(imageset + "/Contents.json", JSON.stringify(contentJSON));
    } catch (error) { }
}

function doSearch(path) {
    try {
        let files = fs.readdirSync(path);
        files.forEach(it => {
            if (it.endsWith(".imageset")) {
                doFormat(path + "/" + it);
            }
            else if (it.indexOf(".") < 0) {
                doSearch(path + "/" + it);
            }
        });
    } catch (error) { }
}

if (target === undefined) {
    console.error("Usage >>> rename-xcasset-files xcassetsDIR")
}
else {
    doSearch(target);
}