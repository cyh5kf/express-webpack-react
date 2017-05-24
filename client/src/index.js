import ReactDOM from 'react-dom';
import React from 'react';
import { Router, hashHistory, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { LocaleProvider, message } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import routes from './routes';

// const history = useRouterHistory(createHistory)({
//   basename: '#'
// })
const history = hashHistory;

ReactDOM.render(
    <LocaleProvider locale={enUS}>
        <Router routes={routes} history={history} />
    </LocaleProvider>,
    document.getElementById('root')
);
