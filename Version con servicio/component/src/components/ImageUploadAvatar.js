import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BsCheckCircleFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import Dropzone from "react-dropzone";
import dynamic from "next/dynamic";
import axios from 'axios';

const Avatar = dynamic(() => import("react-avatar-edit"), {
  ssr: false,
});

function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
//modal ventana de Alerta
const ModalAlert = ({ setEditor,setAlert,formStyle, setAlertSave,getAlertSave,alertSave,setAlertSize,getAlertSize,alertSize,setAlertError,alertError ,getAlertError}) => {
  return (
    <div className="fixed flex justify-center top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto items-center  backdrop-blur-md ">
      <div className={`flex items-center mx-2 flex-col ${formStyle?.bgColorAll?formStyle.bgColorAll:"bg-white"} ${formStyle?.textColorAll?formStyle.textColorAll:"text-black"}  w-96 p-2 rounded shadow-black`}>
        {
          //Alerta de Guardado
          getAlertSave==true?(<>{alertSave?.ico?alertSave.ico:<BsCheckCircleFill className="flex text-9xl text-green-400" />}
          <h1 className=" text-lg"> {alertSave?.message?alertSave.message:"Guardado Con Exito"} </h1>
          <hr className="border-black" />
          <button
            onClick={() => {
              setAlert(false);
              setAlertSave(false);
              setEditor(false);
            }}
            type="button"
            className={` my-2 rounded p-2  ${alertSave?.buttonStyle?.textColor?alertSave.buttonStyle.textColor:"text-white"} ${alertSave?.buttonStyle?.bgColor?alertSave.buttonStyle.bgColor:"bg-blue-600 hover:bg-blue-500 active:bg-blue-700"}`}
          >
            Aceptar
          </button></>):("")
        }
        {
          //alerta de tamaño
          getAlertSize?<>
           {alertSize?.ico?alertSize.ico:<ImWarning className="flex text-9xl text-yellow-400" />}
        <h1 className=" text-lg">{alertSize?.message?alertSize.message:"El tamaño del Archivo es demasiado grande"}</h1>
        <hr className="border-black" />
        <button
          onClick={() => {setAlertSize(false); setAlert(false);}}
          type="button"
          className={`my-2 rounded p-2 ${alertSize?.buttonStyle?.textColor?alertSize.buttonStyle.textColor:"text-white"} ${alertSize?.buttonStyle?.bgColor?alertSize.buttonStyle.bgColor:"bg-blue-600 hover:bg-blue-500 active:bg-blue-700"}`}
        >
          Aceptar
        </button>
          </>:""
        }
        {
          //alerta de error generico
          getAlertError?<>
           {alertError?.ico?alertError.ico:<ImWarning className="flex text-9xl text-yellow-400" />}
        <h1 className=" text-lg">{alertError?.message?alertError.message:"Hay problemas al cargar su imagen"}</h1>
        <hr className="border-black" />
        <button
          onClick={() => {setAlertError(false); setAlert(false);}}
          type="button"
          className={`my-2 rounded p-2 ${alertError?.buttonStyle?.textColor?alertError.buttonStyle.textColor:"text-white"} ${alertError?.buttonStyle?.bgColor?alertError.buttonStyle.bgColor:"bg-blue-600 hover:bg-blue-500 active:bg-blue-700"}`}
        >
          Aceptar
        </button>
          </>:""
        }
      </div>
    </div>
  );
};

//componente Tiene toda la logica para trabajar con la imagen
const ModelModify = ({
  status,
  format,
  folderSave,
  maxImageSize,
  imageQuality,
  setEditor,
  buttonStyleSave,
  userId,
  formStyle,
}) => {
  const {width} = useWindowDimensions();
  const [previousImage, SetPreviousImage] = useState();
  const [getAlertSize, setAlertSize] = useState(false);
  const [getAlertError, setAlertError] = useState(false);
  const [getAlertSave, setAlertSave] = useState(false);
  const [getAlert, setAlert] = useState(false);
  const [imagenDiv, setImagenDiv] = useState(720);
  const [getsrc, setSrc] = useState(null);

  //obtener archivo, veyficar tamaño y convertir a url esconder componente y
  // activer componente avatar y pasar src pasar la imagen
  const handleDrop = (data) =>{
    if (!data[0].type.includes("image")) {
      data=null
      setAlert(true)
      setAlertError(true)
    }
    if (data[0].size > maxImageSize ) {
        setAlert(true)
        setAlertSize(true);
        data = null;
        
    }
    else{
      getBase64(data[0]).then(
        data => setSrc(data)
        
      );
      
      }
    
    };

    //Tranformar imagen a base64
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    //Verificar el cambio de la imagen 
    useEffect(() => {
      setSrc(getsrc)
    }, [getsrc]);

  //tranformador de bytes a 'KB', 'MB', 'GB', 'TB
  function BytesSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "n/a";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + " " + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  }

  const compressImage = (imagenComoArchivo) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const imagen = new Image();
      imagen.onload = () => {
        canvas.width = imagen.width;
        canvas.height = imagen.height;
        canvas.getContext("2d").drawImage(imagen, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob === null) {
              return reject(blob);
            } else {
              resolve(blob);
            }
          },
          `image/${format?format:process.env.service.format}`,
          //100 calidad de imagen
          imageQuality / 100
        );
      };
      imagen.src = imagenComoArchivo;
    });
  };
  //Si el usuario apreta el boton cerrar
  const onClose = () => {
    setSrc(undefined)
    SetPreviousImage(null);
  };
  //Si el usuario apreta el boton guardar
  const onCrop = (vista) => {
    SetPreviousImage(vista);
  };

  const saveImage = async () => {
    if(userId==undefined){
      setAlert(true)
      setAlertError(true)
      console.error("Codigo de error: IUND ")
      return

    }
    
    const blob = await compressImage(previousImage);

    getBase64(blob).then(data => {
      axios.post(process.env.service,{userId:`${userId?userId:process.env.service.default}`,base64:data,folderSave:`${folderSave?folderSave:process.env.service.default}`,format:`${format?format:process.env.service.format}`,status:status})
      .then((data)=>{
        if (data.data.status) {
              setAlert(true);
              setAlertSave(true);
            } else {
              setAlert(true)
              setAlertError(true)
              console.error("Codigo de error: ECWS ");
            }
      }).catch((err)=>{
        setAlert(true)
        setAlertError(true)
        console.error("Codigo de error: ECWS ");})
  });
    
  };
  //verificar medidad de la pantalla para que compone te se ajuste
  useEffect(() => {
    if (width <= 779) {
      setImagenDiv(300);
    }
    if (width >= 548) {
      setImagenDiv(720);
    }
  }, [width]);

  return (
    <div className=" flex justify-center flex-wrap fixed top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto items-center  backdrop-blur-md">
      <div
        className={`flex justify-center text-center flex-col p-3 rounded w-auto  h-auto  drop-shadow-2xl   ${
          formStyle?.bgColorAll ? formStyle.bgColorAll : "bg-white"
        } `}
      >
        <div className=" flex justify-between items-center mb-1">
          <h1 className={`${formStyle?.textColorAll ? formStyle.textColorAll : "text-black"} font-bold `}>
            {formStyle?.title ? formStyle.title : "Cambiar Foto de perfil"}
          </h1>
          <button
            onClick={() => setEditor(false) || ""}
            className={`w-auto rounded-full m-1 ${formStyle?.close?.color?formStyle.close.color:"bg-red-600 hover:bg-red-500 active:bg-red-700"}  `}
            type="button"
          >
            {formStyle?.buttonClose?.ico?formStyle.buttonClose.ico:<IoMdClose className="text-white text-3xl" />
            }
          </button>
        </div>
        <hr className="border-black" />

        <h1 className={`${formStyle?.textColorAll ? formStyle.textColorAll : "text-black"} my-2`}>
          Peso maximo de imagen {BytesSize(maxImageSize)}
        </h1>

        <div className="flex justify-center h-auto">
          
          {getsrc==undefined?<Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div  {...getRootProps({ className: `hover:cursor-pointer flex  ${formStyle?.dragAndDropStyle?formStyle.dragAndDropStyle:"border-dashed border-2 border-black rounded py-5 px-2 h-auto"}` })}>
            <input {...getInputProps()} />
            <p className={`${formStyle?.labelStyle?formStyle.labelStyle:""}`}>{formStyle?.label ? formStyle.label : "Arrastrar y soltar archivos o hacer clic para seleccionar archivos"}</p>
          </div>
        )}
      </Dropzone>:""}
          

{
  getsrc!=undefined?<Avatar
    onCrop={onCrop}
    onClose={onClose}
    src={getsrc}
    imageWidth={imagenDiv}
    minCropRadius={"50"}
  />:""
}
          
          
        </div>
        
        {previousImage ? (
          <button
            onClick={() => saveImage()}
            type="button"
            className={`my-2 rounded p-2 ${
              buttonStyleSave.textColor ? buttonStyleSave.textColor : "text-white"
            }  
            
            ${
              buttonStyleSave.bgColor ? buttonStyleSave.bgColor : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
            }`}
          >
            Guardar
          </button>
        ) : (
          ""
        )}
      </div>
      {getAlert ? (
            <ModalAlert  setAlert={setAlert} setEditor={setEditor} formStyle={formStyle?formStyle:""}  alertError={formStyle?.alertError?formStyle.alertError:""} setAlertError={setAlertError} getAlertError={getAlertError} alertSize={formStyle?.alertSize?formStyle.alertSize:""} setAlertSize={setAlertSize} getAlertSize={getAlertSize} alertSave={formStyle?.alertSave?formStyle.alertSave:""} setAlertSave={setAlertSave} getAlertSave={getAlertSave} />
          ) : (
            ""
          )}
    </div>
  );
};


//boton del inicio de Componente
const ImageUploadAvatar = ({ config, configStyle, userId }) => {
  const [getEditor, setEditor] = useState(false);


  return (

    <div className={"w-auto flex justify-center"}>
      {getEditor ? (
        <ModelModify
          userId={userId}
          formStyle={configStyle?.formStyle ? configStyle.formStyle : ""}
          buttonStyleSave={
            configStyle?.buttonStyleSave ? configStyle.buttonStyleSave : ""
          }
          status={config?.status?config.status:process.env.status}
          format={config?.format?config.format:process.env.format}
          folderSave={config?.folderSave?config.folderSave:process.env.default}
          maxImageSize={config?.maxImageSize ? config.maxImageSize : process.env.maxImageSize}
          imageQuality={config?.imageQuality ? config.imageQuality : process.env.imageQuality}
          setEditor={setEditor}
        />
      ) : (
        ""
      )}
      <button
        onClick={() => setEditor(true)}
        className={`rounded  p-2  ${
          configStyle?.buttonStyle?.bgColor?configStyle.buttonStyle.bgColor
            : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
        } 
        ${
          configStyle?.buttonStyle?.textColor?configStyle.buttonStyle.textColor
            : 'text-white'
        }`}
        type="button"
      >
       Cambiar Imagen
      </button>
      
    </div>
  );
};


export default ImageUploadAvatar;
