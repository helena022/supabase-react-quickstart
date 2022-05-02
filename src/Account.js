import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from("profiles")
        .select("username, website")
        .eq("id", user.id)
        .single()

      if (error && status !== 400) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date(),
      }

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal",
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live='polite'>
      {loading ? (
        "Saving..."
      ) : (
        <form onSubmit={updateProfile} className='form-widget'>
          <div>Email: {session.user.email}</div>
          <div>
            <label htmlFor='username'>Name</label>
            <input
              id='username'
              type='text'
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>Website: {session.user.website}</div>
          <div>
            <label htmlFor='username'>Website</label>
            <input
              id='website'
              type='text'
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <button
              type='submit'
              className='button block primary'
              disabled={loading}
            >
              Update Profile
            </button>
          </div>
        </form>
      )}
      <div>
        <button
          type='button'
          className='button block'
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Account
