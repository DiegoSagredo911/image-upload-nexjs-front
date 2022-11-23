const fs =require("fs")

//esta funcion se encarga de realizar la carga de un archivo (imagen)
//Request:
//folderSave (nombre de la carpeta)
//userId (Identificador para la imagen)
//format (formato de imagen con punto)
//
//
//path: post("/imagen/")
const loadImage= async (req,res)=>{

    try {
        //Valida que req tenga las variables de lo contrario se entrega un stado 404
        if (req.body.folderSave ==undefined || req.body.userId == undefined || req.body.format==undefined||req.body.status==undefined||req.body.status==null ) {
            return res.status(404).send()
        }

        //validar si existe la carpeta, si no existe se crea
        if (!fs.existsSync(`./${req.body.status==false?"public":"private"}/${req.body.folderSave}`)) {
            fs.mkdirSync(`./${req.body.status==false?"public":"private"}/${req.body.folderSave}`, { recursive: true });
        }

        //preparar direccion del almacenar
        let filePath = `./${req.body.status==false?"public":"private"}/${req.body.folderSave}/${req.body.userId}.${req.body.format}`;    
        let base64Image = req.body.base64.split(';base64,').pop();
        
        //se hace el guardado de la imagen
        fs.writeFile(filePath, base64Image, {encoding: 'base64'}, function(err) {
            if (err!=null) {
                return res.status(404).send()
            }
        });
        return res.status(200).json({ status:true })
    } catch (error) {
        return res.status(404).send()
    }
}

//esta funcion se encarga de enviar el archivo a la web (imagen)
//Request:
//fileName (nombre de la imagen)
//
//path: get("/imagen/:folder/:img")
const getImage= async (req,res)=>{
    //verificar si la direccion existe
    if (!fs.existsSync(`./private/${req.params.folder}/${req.params.img}`)) {
        return res.status(404).send("Error")
    }
    //retornar Imagen
        return res.sendFile(`${req.params.folder}/${req.params.img}` , { root : `./private/`});


}


module.exports={loadImage,getImage}