import React, {Component} from "react";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import "./styles/styles.sass";
import "./styles/base.sass";
import "./App.sass";

//redux
import {connect} from "react-redux";

//actions


//my modules
import TopHeader from "./components/TopHeader.jsx";
import Menu from "./components/Menu.jsx";
import Footer from "./components/Footer.jsx";

class App extends Component {
	
	render() {
		return (
			<MuiThemeProvider>
				<div className="container">
					<TopHeader />
					<div className="wrapBackground">
						<div className="wrapper">
							<Menu />
							<div className="spaContent">
								{this.props.children}
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default connect(
	state => ({
		state: state
	}),
	dispatch => ({

	})
	)(App);