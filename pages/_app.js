import App from 'next/app'
import { ThemeProvider } from 'styled-components'
import '../components/global.css'
import Head from 'next/head'

const theme = {
  colors: {
    primary: '#0070f3'
  }
}

class ViestitApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Viestit</title>
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <meta
            name="google-site-verification"
            content="qyPMve6PKjxygyo0JKlDrDjySQJ4bxZtWsjCmxzA3CY"
          />

          <link
            key="ROBOTO"
            href="https://fonts.googleapis.com/css?family=Roboto:400"
            rel="stylesheet"
          />
          <link
            key="poppin"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta
            name="viewport"
            content="minimum-scale=1,initial-scale=1,width=device-width"
          />
          <meta name="description" content="Nyt jopa wilma viestejä" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Viestit" />
          <meta property="og:url" content="https://viestit.jeffe.co" />
          <meta property="og:description" content="Nyt jopa wilma viestejä" />
          <meta property="og:image" content="https://i.imgur.com/julmryQ.png" />
          <meta
            name="keywords"
            content="JEFFe,JEFFe viestit,wilma viestit, wilma kangasala, viestit"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </>
    )
  }
}

export default ViestitApp
