
import ImageUploadAvatar from '../components/ImageUploadAvatar'
import ImageUpload from '../components/ImageUpload'

export default function Home() {
  return (
    <div className='text-center'>
      <h1>Avatar</h1>
     <ImageUploadAvatar config={{folderSave:"AvatarUsuarios",status:true}}  userId={123}></ImageUploadAvatar>
    <div>
      <br/>
      <hr/>
      <br/>
    <h1>Subir imagen</h1>
    <ImageUpload config={{folderSave:"imagenes"}} userId={"foto"}></ImageUpload>
    </div>
    </div>

  )
}
