import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import FlatButton from 'material-ui/FlatButton'

import { actions as actionsFilterCity } from '../ducks/filterCity'
import { actions as actionsServerReducer } from '../ducks/serverReducer'

import SendAndRegistrationsTabs from './SendAndRegistrationsTabs.jsx'

import './SendDialog.sass'

class LoginModal extends Component {

	state = {
		open: false
	}

	handleOpen = () => {
		this.setState({ open: true })
	}

	handleClose = () => {
		this.setState({ open: false })
	}

	render() {

		const styles = {
			contentStyle: {
				maxWidth: '585px',
				width: '100%'
			},
			flatIcon: {
				minWidth: '30px',
				right: '10px',
				top: '-11px'
			},
			overlayStyle: {
				padding: '30px 16px 26px'
			},
			actionsContainerStyle: {
				position: 'absolute',
				top: '0',
				right: '0',
				width: '30px'
			}
		}

		const { allParamsUrl } = this.props.state
		const { dispatchCityTopHeader, getCards } = this.props

		const citys = [
			'Москва',
			'Санкт-Петербург',
			'Волгоград',
			'Екатеринбург',
			'Казань',
			'Краснодар',
			'Нижний Новгород',
			'Пермь',
			'Ростов-на-Дону',
			'Самара',
			'Уфа',
			'Челябинск',
			'Адыгея',
			'Архангельская обл.',
			'Астраханская обл.',
			'Башкортостан',
			'Белгородская обл.',
			'Брянская обл.',
			'Владимирская обл.',
			'Волгоградская обл.',
			'Вологодская обл.',
			'Воронежская обл.',
			'Дагестан',
			'Ивановская обл.',
			'Ингушетия',
			'Кабардино-Балкария',
			'Калининградская обл.',
			'Калмыкия',
			'Калужская обл.',
			'Карачаево-Черкесия',
			'Карелия',
			'Кировская обл.',
			'Коми',
			'Костромская обл.',
			'Краснодарский край',
			'Крым',
			'Курганская обл.',
			'Курская обл.',
			'Ленинградская обл.',
			'Липецкая обл.',
			'Марий Эл',
			'Мордовия',
			'Московская обл.',
			'Мурманская обл.',
			'Ненецкий АО',
			'Нижегородская обл.',
			'Новгородская обл.',
			'Оренбургская обл.',
			'Орловская обл.',
			'Пензенская обл.',
			'Пермский край',
			'Псковская обл.',
			'Ростовская обл.',
			'Рязанская обл.',
			'Самарская обл.',
			'Саратовская обл.',
			'Свердловская обл.',
			'Северная Осетия',
			'Смоленская обл.',
			'Ставропольский край',
			'Тамбовская обл.',
			'Татарстан',
			'Тверская обл.',
			'Тульская обл.',
			'Удмуртия',
			'Ульяновская обл.',
			'Челябинская обл.',
			'Чеченская республика',
			'Чувашия',
			'Ярославская обл.'
		]

		const actions = [
			<FlatButton
				icon={ <i className='fa fa-times' aria-hidden='true' /> }
				primary={ true }
				onTouchTap={ this.handleClose }
				style={ styles.flatIcon }
			/>
		]

		const dialogModal01 = () => <Dialog
			actions={ actions }
			modal={ true }
			autoScrollBodyContent={ true }
			repositionOnUpdate={ true }
			autoDetectWindowHeight={ true }
			open={ this.state.open }
			contentStyle={ styles.contentStyle }
			actionsContainerStyle={ styles.actionsContainerStyle }
			bodyStyle={ styles.overlayStyle }
		>
			<SendAndRegistrationsTabs className='sendAndRegDialog' />
		</Dialog>

		const dialogModal02 = () => {

			let handleCityTopHeader = e => {
				dispatchCityTopHeader(e.target.innerText)
				this.handleClose()
		
				// фльтр объявлений по клику на город. на главной
				if (allParamsUrl.split('/')[1] === '') {
					getCards(process.env.URL + '/list-hot-adv/' + e.target.innerText)
				} else {
					// на остальных
					getCards(
						process.env.URL +
						'/list-animals/animal_type/' +
						allParamsUrl.split('/')[2] +
						'/advertisement_type/' +
						allParamsUrl.split('/')[3] +
						'/city/' + e.target.innerText + '/count/10'
					)
				}
			}

			return (
				<Dialog
					actions={ actions }
					modal={ true }
					autoScrollBodyContent={ true }
					repositionOnUpdate={ true }
					autoDetectWindowHeight={ true }
					open={ this.state.open }
					contentStyle={ styles.contentStyle }
					actionsContainerStyle={ styles.actionsContainerStyle }
					bodyStyle={ styles.overlayStyle }
				>
					<div className='modalCityWrap'>
						<a href='javascript:void(0)' onClick={ handleCityTopHeader } className='allCitys'>Все регионы</a>
						<div className='modalAllCity'>
							{
								citys.map((elem, idx) => <a href='javascript:void(0)' key={ idx } onClick={ handleCityTopHeader }>{ elem }</a>)
							}
						</div>
					</div>
				</Dialog>
			)
		}

		return (
			<div className={ `regionsBtn ${ this.props.classNameMobile }` }>
				<a
					href='javascript:void(0)'
					onTouchTap={ this.handleOpen }
					className={ `button1 ${ this.props.classesBtn }` }>
					{ this.props.titleBtn }
				</a>
				{ this.props.dialogModal === '01' ? dialogModal01() : '' }
				{ this.props.dialogModal === '02' ? dialogModal02() : '' }
			</div>
		)
	}
}

export default connect(state => ({ state }),
	dispatch => bindActionCreators({ ...actionsFilterCity, ...actionsServerReducer }, dispatch)
)(LoginModal)