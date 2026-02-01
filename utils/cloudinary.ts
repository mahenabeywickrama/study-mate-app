export const uploadImageToCloudinary = async (uri: string) => {
  const data = new FormData()

  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg"
  } as any)

  data.append("upload_preset", "profile_upload")
  data.append("cloud_name", "djsdwv2na")

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djsdwv2na/image/upload",
    {
      method: "POST",
      body: data
    }
  )

  const json = await res.json()

  return json.secure_url
}
