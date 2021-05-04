export default function CartoonUserAvatar({src}) {
  return (
    <div className="flex justify-center">
      <img className="w-32 h-32 my-10 object-cover" src={src} alt="cartoon user avatar"/>
    </div>
  )
}
