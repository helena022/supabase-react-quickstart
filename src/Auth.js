import { useState } from "react"
import { supabase } from "./supabaseClient"

const descriptions = [
  {
    loginType: "magic_link",
    description: "Sign in via magic link with your email below",
  },
  { loginType: "email", description: "Sign in with your email and password" },
]

export default function Auth() {
  const [isSigningUp, setSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginWith, setLoginWith] = useState("magic_link")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const getDescription = (loginWith) => {
    let desc = descriptions.find(
      (description) => description.loginType === loginWith
    )
    return desc.description
  }

  const handleMagicLinkLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert("Check your email for the login link!")
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const LogIn = () => (
    <>
      <p className='description'>{getDescription(loginWith)}</p>
      {loading ? "Logging you in..." : renderLoginForm()}
    </>
  )

  const renderLoginForm = () => {
    if (loginWith === "magic_link") {
      return (
        <>
          <form onSubmit={handleMagicLinkLogin}>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              className='inputField'
              type='email'
              placeholder='Your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className='button block' aria-live='polite'>
              Send magic link
            </button>
            <div className='loginOptions'>
              <div
                className='loginTypeOption'
                onClick={() => setLoginWith("email")}
              >
                Log in with email and password
              </div>
              <div
                className='loginTypeOption'
                onClick={() => setSigningUp(true)}
              >
                Sign up
              </div>
            </div>
          </form>
        </>
      )
    }
    if (loginWith === "email") {
      return (
        <form onSubmit={handleEmailLogin}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            className='inputField'
            type='email'
            placeholder='Your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor='email'>Password</label>
          <input
            id='password'
            className='inputField'
            type='password'
            placeholder='Your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className='button block' aria-live='polite'>
            Log in
          </button>
          <div className='loginOptions'>
            <div
              className='loginTypeOption'
              onClick={() => setLoginWith("magic_link")}
            >
              Log in with magic link instead
            </div>
            <div className='loginTypeOption' onClick={() => setSigningUp(true)}>
              Sign up
            </div>
          </div>
        </form>
      )
    }
  }

  const SignUp = () => <>sign up</>

  return (
    <div className='row flex flex-center'>
      <div className='col-6 form-widget' aria-live='polite'>
        <h1 className='header'>Supabase + React</h1>
        {isSigningUp ? SignUp() : LogIn()}
      </div>
    </div>
  )
}
