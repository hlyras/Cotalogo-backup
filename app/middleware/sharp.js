import fs from 'fs';
import sharp from 'sharp';

async function compressImage(file, size) {
    const newPath = file.path.split('.')[0] + '.png';

    let data = await sharp(file.path).resize(size).toFormat('png').toBuffer();
    await fs.promises.writeFile(newPath, data, err => { if (err) { throw err; } });

    return newPath;
};

export { compressImage };