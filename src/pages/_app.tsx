import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";
import { PlayerContextProvider } from "../contexts/PlayerContext";

// Os componentes que forem renderizados no App, vão aparecer em todas as
// páginas da aplicação
function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />)
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp