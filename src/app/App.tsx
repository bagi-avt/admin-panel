import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import 'antd/dist/reset.css'

import { AppRouter } from '@processes/routing'
import { history, store } from '@app/providers'
import '@shared/ui/page-card'

import './styles/app.css'

export const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppRouter />
    </ConnectedRouter>
  </Provider>
)
