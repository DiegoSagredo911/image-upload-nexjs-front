
import ImageUploadAvatar from '../components/ImageUploadAvatar'
import ImageUpload from '../components/ImageUpload'

export default function Home() {
  return (
    <div className='text-center'>
      <h1>Imagen Avatar</h1>
     <ImageUploadAvatar config={{folderSave:"AvatarUsuarios"}} userId={123}></ImageUploadAvatar>
     <br/>
     <hr/>
     <br/>
     <h1>Imagen </h1>
     <ImageUpload config={{folderSave:"imagenes"}} userId={123}></ImageUpload>
    </div>
  )
}
