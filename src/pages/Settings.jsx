import { useState } from 'react'
import CrudPanel from '../components/CrudPanel'
import { apiRequest, logout } from '../lib/api'



//rtolebase seetings page
function Settings({ role }) {
  const [profile, setProfile] = useState(null)
  const [profilePatch, setProfilePatch] = useState('{\n  "fullName": "",\n  "phone": ""\n}')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadProfile() {
    setError('')
    setMessage('')

    try {
      const meData = await apiRequest('/api/me')
      const profileData = await apiRequest('/api/users/profile')
      setProfile({ me: meData, profile: profileData })
    } catch (err) {
      setError(err.message || 'Unable to load profile')
    }
  }

  async function updateProfile() {
    setError('')
    setMessage('')

    try {
      const body = JSON.parse(profilePatch)
      const data = await apiRequest('/api/users/profile', {
        method: 'PUT',
        body,
      })
      setProfile((prev) => ({ ...(prev || {}), profile: data }))
      setMessage('Profile updated.')
    } catch (err) {
      setError(err.message || 'Unable to update profile')
    }
  }



  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-gray-600 text-sm">Profile setts.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/me</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/users/profile</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PUT /api/users/profile</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">GET /api/users</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">POST /api/users</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">PATCH /api/users</span>
          <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-mono px-2.5 py-1.5 rounded">DELETE /api/users</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p>Work in progress</p> </div>

  
    </div>
  )
}

export default Settings
