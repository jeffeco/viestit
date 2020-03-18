import { useState } from 'react'
import { Form, Input, Button, Typography } from 'antd'
import 'antd/dist/antd.css'
import fetch from 'isomorphic-unfetch'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0,
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const Text = Typography.Text

const Login = ({ msg }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setError(false)
    if (username && password) {
      setLoading(true)
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }).catch(() => {
        setError('Salasana väärin tai wilma ei ole päällä')
        setLoading(false)
      })
      const data = await res.json().catch(() => {
        setError('Salasana väärin tai wilma ei ole päällä')
        setLoading(false)
      })

      if (!data) return setError('Nyt jääty')

      if (data && data.error) {
        setError('Salasana väärin tai wilma ei ole päällä')
        return setLoading(false)
      }

      Cookies.set('SSID', data.SID)
      router.push('/viestit')
    } else {
      setError('Nyt kirjoita jotain edes!')
    }
  }

  return (
    <Form name="basic">
      <center>
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={container} initial="hidden" animate="visible">
            <img
              css="flex: 1; margin-bottom: 0px; max-width: 190px; margin-top: 40px; padding-bottom: 25px;"
              src="/images/Viestit.svg"
              alt="Logo"
            />
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="visible">
            <h2 css="font-family: Poppins; font-size: 20px;">
              {msg || 'Kirjaudu sisään wilma tunnuksella'}
            </h2>
          </motion.div>
        </motion.div>
      </center>

      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div className="item2" variants={item}>
          <Form.Item label="Nimi" name="nimi">
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Item>
        </motion.div>

        <motion.div className="item2" variants={item}>
          <Form.Item label="Salasana" name="salasana">
            <Input.Password
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>
        </motion.div>

        <motion.div className="item2" variants={item}>
          <Form.Item>
            <Button
              css="background: linear-gradient(-135deg,#d735ff,#ff4949); border: 0px"
              loading={loading}
              onClick={submit}
              type="primary"
              htmlType="submit">
              Kirjaudu
            </Button>

            {error && (
              <Text css="margin-left: 10px" type="danger">
                {error}
              </Text>
            )}
          </Form.Item>
        </motion.div>
      </motion.div>
    </Form>
  )
}

export default Login
