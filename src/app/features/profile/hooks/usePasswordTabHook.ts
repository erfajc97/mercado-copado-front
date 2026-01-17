import { Form } from 'antd'
import { useChangePasswordMutation } from '../mutations/useProfileMutations'

export const usePasswordTabHook = () => {
  const [form] = Form.useForm()
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePasswordMutation()

  const handleChangePassword = async (values: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: ['Las contraseñas no coinciden'],
        },
      ])
      return
    }
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      form.resetFields()
    } catch (error) {
      console.error('Error changing password:', error)
    }
  }

  return {
    form,
    handleChangePassword,
    isChangingPassword,
  }
}
