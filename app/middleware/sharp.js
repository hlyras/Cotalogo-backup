const fs = require("fs");
const sharp = require("sharp");

async function compressImage(file, size) {
    const newPath = file.path.split('.')[0] + '.png';

    let data = await sharp(file.path).resize(size).toFormat('png').toBuffer();
    await fs.promises.writeFile(newPath, data, err => { if (err) { throw err; } });

    return newPath;
};

module.exports = {
    compressImage
};