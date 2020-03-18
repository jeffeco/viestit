import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Login from '../components/Login'
import cookie from 'cookie'
import Cookies from 'js-cookie'
import Footer from '../components/Footer'

const Bg = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -22;
  background: linear-gradient(-134deg, #ff2828, #e73c7e, #f7da2c, #ff7b2e);
  background-size: 400% 400%;
  animation: gradient 30s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`

const Card = styled.div`
  max-width: 480px;
  width: 100%;
  margin: 0 auto;

  padding-top: 25px;
`

const Index = ({ reset }) => {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    if (reset) {
      Cookies.remove('SSID')
      setMsg('Kirjaudu uudelleen')
    }
  }, [reset])
  return (
    <>
      {/* <div css="display: flex; align-items: center; max-width: 1100px; margin: 0 auto;">
        <img
          css="flex: 1; margin-bottom: 0px; max-width: 150px; margin-top: 3px;"
          src="/images/Viestit.svg"
          alt="Logo"
        />
      </div> */}
      <div>
        <Bg />
        <Card className="login">
          <Login msg={msg} />
        </Card>
        <Footer />
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  if (ctx.query.r) {
    return {
      props: {
        reset: true
      }
    }
  }
  const headerCookies = ctx.req.headers.cookie
  if (!headerCookies) {
    return {
      props: {}
    }
  } else {
    const cookies = cookie.parse(headerCookies)
    if (cookies.SSID) {
      ctx.res.writeHead(301, {
        Location: '/viestit'
      })
      ctx.res.end()
    }
    return {
      props: {} // will be passed to the page component as props
    }
  }
}

export default Index
