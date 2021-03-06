import React from 'react'
import { Route } from 'react-router'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

import App from './App.js'
import configureStore from './store'

import Conf from './components/conf/ConfComponent'
import NotFound from './components/notFound/NotFoundComponent'
import Moderate from './components/moderate/ModerateComponent'
import PersonalArea from './components/personalArea/PersonalAreaComponent'
import AddCardFormComponent from './components/forms/addCardForm/AddCardFormComponent'
import ContactsForm from './components/forms/contactsForm/ContactsFormComponent'
import PageCards from './components/cards/pageCards/PageCards'
import Advertisement from './components/cards/advertisement/Advertisement'
import ResetPassword from './components/forms/ResetPassword'
import AddNewPassword from './components/forms/AddNewPassword'

const initialState = process.env.BROWSER ? window.__INITIAL_STATE__ : {}

export const store = configureStore(initialState)

const userIsAuthenticated = connectedRouterRedirect({
	redirectPath: '/',
	authenticatedSelector: state => {
		const { auth:
			{
				user,
				userError,
				userLoading
			} } = state

		return userLoading === false && userError === false && user !== null
	}
})

export const routes = <Route component={ App } >
	<Route path='/' component={ PageCards } />
	<Route path='/conf' component={ Conf } />
	<Route path='/contacts' component={ ContactsForm } />
	<Route path='/adv/:id' component={ Advertisement } />
	<Route path='/advEdit/:id' component={ userIsAuthenticated(AddCardFormComponent) } />
	<Route path='/resetPassword' component={ ResetPassword } />
	<Route path='/addNewPassword/:token' component={ AddNewPassword } />
	<Route path='/animals/:type/:advertisment' component={ PageCards }/>
	<Route path='/moderation' component={ userIsAuthenticated(Moderate) } />
	<Route path='/personalArea' component={ userIsAuthenticated(PersonalArea) } />
	<Route path='/placeAnAd' component={ userIsAuthenticated(AddCardFormComponent) } />
	<Route path='*' component={ NotFound } />
</Route>
