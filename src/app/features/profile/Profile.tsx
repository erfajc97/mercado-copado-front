import { ProfileTabs } from './components/tabs/ProfileTabs'

export function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">Mi Perfil</h1>
      <ProfileTabs />
    </div>
  )
}
