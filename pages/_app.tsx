import '../styles/globals.css'
import '../styles/github-markdown-light.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
