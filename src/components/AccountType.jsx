import { connect } from 'react-redux'
import React, { Component } from 'react'
import { push } from 'react-router-redux'

import { store } from '../store'

import './PersonalArea.sass'

class AccountType extends Component {

	componentWillMount() {

		const { loginUser } = this.props.state

		if (loginUser && loginUser.results[0].accountType === 'PRIVATE_SELLER') {

			this.onHndlePrivateSeller()

		} else if (loginUser && loginUser.results[0].accountType === 'PERMANENT_SELLER') {

			this.onHandlePermanentSeller()

		} else if (loginUser && loginUser.results[0].accountType === 'SHELTER') {

			this.onHandleShelter()

		}
	}

	onHandleShelter = () => {
		this.props.handleShelter()
	}

	onHandlePermanentSeller = () => {
		this.props.handlePermanentSeller()
	}

	onHndlePrivateSeller = () => {
		this.props.handlePrivateSeller()
	}

	//генерирование таблиц
	table = () => {
		let generateTable = () => {

			let obj, mass = [], tr, td

			//получили данные
			obj = this.props.state.accountType.tableData

			//прошлись циклом и вывели  td
			for(let i in obj) {

				let arg0 = i
				let arg1 = obj[i]

				mass.push(arg0, arg1)

				td = () => {

					return (
						mass.map((elem, idx) => {
							return (
								idx % 2 === 0 ?
									<tr key={idx}>
										<td>{elem}</td>
										<td>{mass[idx + 1]}</td>
									</tr> : null
							)
						})
					)
				}
			}
			
			return (
				td()
			)
		}

		return (
			<table>
				<tbody>
					{
						generateTable()
					}
				</tbody>
			</table>
		)
	}

	//выход из аккаунта
	handleExit = () => {
		localStorage.removeItem('user')
		this.props.loginFalse()
		store.dispatch(push('/'))
	}

	render() {
		return (
			<div className='accountType'>
				<p className='title'>Аккаунт</p>
				<p className='subTitle'>Тип аккаунта</p>
				<div className='buttons'>
					<a href='javascript:void(0)'
						className={ `typeBtn ${this.props.state.accountType.type === 'PRIVATE_SELLER' ? 'active' : ''}` }
						onClick={ this.onHndlePrivateSeller }
					>
						<i className='fa fa-smile-o' aria-hidden='true' />
						<p>Частный <br /> продавец</p>
					</a>
					
				</div>

				<p className='price'>{ this.props.state.accountType.price } рублей</p>
				<p className='inMonth'>В месяц</p>
				{
					this.table()
				}
				
				<a href='javascript:void(0)'
					className='exitBtn button2'
					onClick={ this.handleExit }
				>Выйти из аккаунта</a>
			</div>
		)
	}
}
/*
	<a href="javascript:void(0)" className={`typeBtn ${this.props.state.accountType.type === "PERMANENT_SELLER" ? "active" : ""}`} onClick={this.onHandlePermanentSeller}>
		<i className="fa fa-mobile" aria-hidden="true"></i>
		<p>Постоянный <br /> продавец</p>
	</a>
	<a href="javascript:void(0)" className={`typeBtn ${this.props.state.accountType.type === "SHELTER" ? "active" : ""}`} onClick={this.onHandleShelter}>
		<i className="fa fa-home" aria-hidden="true"></i>
		<p>Приют</p>
	</a>
	<a href="javascript:void(0)" className="button1">Активировать</a>
*/

export default connect(
	state => ({
		state
	}),
	dispatch => ({
		handleShelter: () => {
			dispatch({ type: 'SHELTER' })
		},
		handlePermanentSeller: () => {
			dispatch({ type: 'PERMANENT_SELLER'})
		},
		handlePrivateSeller: () => {
			dispatch({ type: 'PRIVATE_SELLER' })
		},
		loginFalse: () => {
			dispatch({ type: 'LOGIN_FALSE', payload: false })
		}
	})
)(AccountType)