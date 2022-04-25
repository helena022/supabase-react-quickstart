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
  const [loading, setLoading] = useState(false)
  const [loginWith, setLoginWith] = useState("magic_link")
  const [email, setEmail] = useState("")

  console.log(loginWith)

  const getDescription = (loginWith) => {
    let desc = descriptions.find(
      (description) => description.loginType === loginWith
    )
    return desc.description
  }

  const handleLogin = async (e) => {
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

  return (
    <div className='row flex flex-center'>
      <div className='col-6 form-widget' aria-live='polite'>
        <h1 className='header'>Supabase + React</h1>
        <p className='description'>{getDescription(loginWith)}</p>
        {loading ? (
          "Sending magic link..."
        ) : (
          <form onSubmit={handleLogin}>
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
          </form>
        )}
      </div>
    </div>
  )
}
