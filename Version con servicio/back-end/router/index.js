const {Router} = require('express');
const router = Router();
const {loadImage,getImage}=require("../controllers/image")

/////Manejos de Archivos////////
router.post('/imagen/',loadImage);
router.get('/imagen/:folder/:img',getImage);
/////////////////////////////////////


module.exports=router;