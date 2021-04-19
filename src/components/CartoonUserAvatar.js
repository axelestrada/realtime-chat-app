export default function CartoonUserAvatar({src}) {
  return (
    <div className="py-24 flex justify-center">
      <img className="w-32 h-32 object-cover" src={src} alt="cartoon user avatar"/>
    </div>
  )
}
