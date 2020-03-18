import wilma from '../../components/api/Wilma'

const Login = async (req, res) => {
  const {
    body: { username, password }
  } = req

  if (username && password) {
    const SID = await wilma
      .LoginWilma(username, password)
      .catch(err => res.status(403).json({ error: true, errorMsg: err }))
    if (SID) {
      res.status(200).json({ error: false, SID })
    } else {
      res.status(200).json({ error: true, SID })
    }
  } else {
    res.status(403).json({ error: true, errorMsg: 'no username or password' })
  }
}

export default Login
