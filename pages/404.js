/* eslint-disable react/display-name */
import { Result, Button } from 'antd'
import Link from 'next/link'
import Footer from '../components/Footer'

export default () => (
  <div>
    <Result
      status="warning"
      title="Virhe 404 Sivua ei löytynyt"
      extra={
        <Link href="/index" as="/">
          <Button type="primary" key="console">
            Kotiin
          </Button>
        </Link>
      }
    />
    <Footer />
  </div>
)
