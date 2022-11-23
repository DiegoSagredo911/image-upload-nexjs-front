const fs =require("fs")
//import { promises as fs } from 'fs'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb' // Set desired value here
        }
    }
}
 
export default async (req, res) => {
   
    try {
        //Validador que los request tenvan valor de lo contrario se entrega un stado 404
        if (req.method!=="POST" ||req.body.folderSave ==undefined || req.body.userId == undefined || req.body.format==undefined||req.body.folderSave ==null || req.body.userId == null || req.body.format==null ) {
            return res.status(404).send()
        }

        //validar si existe la carpeta, si no existe se crea
        if (!fs.existsSync(`./public/${req.body.folderSave}`)) {
            fs.mkdirSync(`./public/${req.body.folderSave}`, { recursive: true });
        }

        //preparar direccion del almacenar
        let filePath = `./public/${req.body.folderSave}/${req.body.userId}.${req.body.format}`;    
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