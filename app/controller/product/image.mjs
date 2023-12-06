import { uploadFileS3, deleteFileS3 } from "../../middleware/s3.mjs";
import { compressImage } from "../../middleware/sharp.mjs";

import fs from 'fs';

import ProductImage from '../../model/product/image.mjs'

const imageController = {};

imageController.upload = async (user_id, file, product_id) => {
  try {
    let newPath = await compressImage(file, 425);
    let imageData = await uploadFileS3(newPath, file.filename.split('.')[0] + '.png', "/development");

    fs.promises.unlink(newPath);
    file.mimetype != 'image/png' && fs.promises.unlink(file.path);

    let image = new ProductImage();
    image.user_id = user_id;
    image.product_id = product_id;
    image.etag = imageData.ETag.replaceAll(`"`, "");
    image.url = imageData.Location;
    image.keycode = imageData.Key;
    await image.save();

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

imageController.deleteByProductId = async (product_id) => {
  try {
    const images = await ProductImage.list(product_id);

    for (let i in images) {
      await ProductImage.delete(images[i].id);
      if (images[i].keycode) { await deleteFileS3(images[i].keycode); }
    };

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

imageController.delete = async (req, res) => {

  try {
    const image = (await ProductImage.findById(req.params.id))[0];

    if (image.user_id != req.user.id) {
      return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
    }

    await ProductImage.delete(image.id);
    if (image.keycode) { await deleteFileS3(image.keycode); }

    res.send({ done: 'Imagem deletada com sucesso!' });
  } catch (err) {
    console.log(err);
    res.send({ msg: 'Ocorreu um erro ao excluir a imagem.' });
  }
};

export default imageController;