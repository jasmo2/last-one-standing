import CssBaseline from '@material-ui/core/CssBaseline';
import {
	createMuiTheme,
	MuiThemeProvider
} from '@material-ui/core/styles';
import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';

import Main from './main';

const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#448aff',
			dark: '#448aff'
		}
	},
});

const rootEl = document.getElementById("app");

render(
	<React.Fragment>
		<CssBaseline />
		<MuiThemeProvider theme={theme}>
			<HashRouter>
				<Main />
			</HashRouter>
		</MuiThemeProvider>
	</React.Fragment>,
	rootEl
);