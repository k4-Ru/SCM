import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUserRole, login } from '../lib/api'
import { getHomePathByRole } from '../lib/rbac'


function Login({ onAuthSuccess }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = await login({ identifier, password })
      if (onAuthSuccess) onAuthSuccess(payload)

      const role = payload?.role || payload?.user?.role || getCurrentUserRole()
      navigate(getHomePathByRole(role), { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/login-bg.png"
        alt="Login background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/1 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xs backdrop-saturate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">SCM</h1>
            <p className="mt-2 text-sm text-white/75">Supply Chain Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="mb-1 block text-sm font-medium text-white/85">
                name/ email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/45 outline-none backdrop-blur-xs focus:border-white/40 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-white/85">
                password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/45 outline-none backdrop-blur-xs focus:border-white/40 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-white/25"
            >
              Login
            </button>
          </form>

          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

          <p className="mt-4 text-center text-sm text-white/70">
            apply to be a supplier here: {' '}
            <Link to="/register" className="font-medium text-white underline underline-offset-4">
              Register here
            </Link>
          </p>

          <div className="mt-4 text-center">
            <p className="text-sm text-white/70">
              BY BSCS 3B
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
