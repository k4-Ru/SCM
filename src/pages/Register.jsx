import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../lib/api'



// Turn into supplier registration form

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      await register({ name, email, password })
      setMessage('Registration successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {

        
      setError(err.message || 'Unable to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/login-bg.png"
        alt="Register background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/1 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xs backdrop-saturate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">SCM</h1>
            <p className="mt-2 text-sm text-white/75">iba dapat hindi ganto generic, add step process</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-white/85">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/45 outline-none backdrop-blur-xs focus:border-white/40 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/85">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/45 outline-none backdrop-blur-xs focus:border-white/40 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-white/85">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/45 outline-none backdrop-blur-xs focus:border-white/40 focus:ring-2 focus:ring-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-white/25"
            >
              Register
            </button>
          </form>

          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}

          <p className="mt-4 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white underline underline-offset-4">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register