
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/home';
import Error from './pages/error';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="*" component={Error} />
            </Switch>
        </BrowserRouter>
    )
}