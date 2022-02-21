const router = require("express").Router();
const lib = require('jarmlib');
const multer = require('./../middleware/multer');
const compressTool = require('./../middleware/sharp');

const homeController = require("../controller/home");

router.get("/", lib.route.toHttps, homeController.index);

router.post("/nova-imagem", lib.route.toHttps, multer.single('image'), (req, res) => {
    if (req.file) {
         compressTool.compressImage(req.file, 500)
            .then(newPath => {
                  return res.send("Upload e compressão realizados com sucesso! O novo caminho é:" +newPath );
             })
            .catch(err => console.log(err) );
    } else {
    	return res.send('Houve erro no upload!');
    }
});

router.get("/login", lib.route.toHttps, homeController.login);
router.get("/signup", lib.route.toHttps, homeController.signup);

router.use("/user", require("./user"));
router.use("/product", require("./product"));

module.exports = router;