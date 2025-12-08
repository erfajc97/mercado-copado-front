export const dataToFormData = (data: any) => {
  const formData = new FormData()

  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key])
    }
  }

  return formData
}

