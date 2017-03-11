import React, {Component} from "react";
import $ from "jquery";
import {connect} from "react-redux";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

//styles
import "./PlaceAnAd.sass";

class PlaceAnAd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animal: {
				value: "cat"
			},
			category: {
				value: "sale"
			}
		};
		this.timer0;
		this.timer1;
		this.timer2;
		this.timer3;
		this.timer4;
	}

	//оптимизировать код ниже возможности нет по причине того, что чтобы увидеть было ли загружено изображение нужен таймер
	componentDidMount() {
		this.timer0 = setInterval(() => {
			if(document.querySelectorAll(".loadingPhoto input")[0].value !== undefined && document.querySelectorAll(".loadingPhoto input")[0].value !== "") {
				this.props.handlePhoto0();
				this.props.onValidatePlaceImage();
				//clearInterval(this.timer0);
			}
		}, 1000);

		this.timer1 = setInterval(() => {
			if(document.querySelectorAll(".loadingPhoto input")[1].value !== undefined && document.querySelectorAll(".loadingPhoto input")[1].value !== "") {
				this.props.handlePhoto1();
				this.props.onValidatePlaceImage();
				//clearInterval(this.timer1);
			}
		}, 1000);

		this.timer2 = setInterval(() => {
			if(document.querySelectorAll(".loadingPhoto input")[2].value !== undefined && document.querySelectorAll(".loadingPhoto input")[2].value !== "") {
				this.props.handlePhoto2();
				this.props.onValidatePlaceImage();
				//clearInterval(this.timer2);
			}
		}, 1000);

		this.timer3 = setInterval(() => {
			if(document.querySelectorAll(".loadingPhoto input")[3].value !== undefined && document.querySelectorAll(".loadingPhoto input")[3].value !== "") {
				this.props.handlePhoto3();
				this.props.onValidatePlaceImage();
				//clearInterval(this.timer3);
			}
		}, 1000);

		this.timer4 = setInterval(() => {
			if(document.querySelectorAll(".loadingPhoto input")[4].value !== undefined && document.querySelectorAll(".loadingPhoto input")[4].value !== "") {
				this.props.handlePhoto4();
				this.props.onValidatePlaceImage();
				//clearInterval(this.timer4);
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer0);
		clearInterval(this.timer1);
		clearInterval(this.timer2);
		clearInterval(this.timer3);
		clearInterval(this.timer4);
		this.props.onResetPlace();
		this.props.onReletMessage();
	}

	//AJAX функция
	getXMLHttpRequest = () => {
		if(window.XMLHttpRequest) {			
			try{ return new XMLHttpRequest(); }
			catch(e) {}

		} else if(window.ActiveXObject) {
			try{ return new ActiveXObject("Microsoft.XMLHTTP"); }	
			catch(e) {}

			try{ return new ActiveXObject("Msxml2.XMLHTTP"); }	
			catch(e) {}
		}
		return null;
	};

	//Добавление объявления
	postMethodAddCard = () => {
		let pSity = this.props.state.validarePlaceAnAd.city,
			pTitleName = this.props.state.validarePlaceAnAd.titleName,
			pPhoneNumber = this.props.state.validarePlaceAnAd.phoneNumber,
			pTextContent = this.props.state.validarePlaceAnAd.phoneNumber,
			pPlacePrice = this.props.state.validarePlaceAnAd.placePrice,
			pPlaceImage = this.props.state.validarePlaceAnAd.placeImage;

		//если все поля объявлени заполнены, то отправить данные
		if(pSity === true && pTitleName === true && pPhoneNumber === true && pTextContent === true && pPlacePrice === true && pPlaceImage === true) {
			let paramsUrl = 
				"animalType=" + this.state.animal.value + "&" +
				"advertisementType=" + this.state.category.value + "&" +
				"city=" + $(".selectCity")[0].childNodes[1].value + "&" +
				"title=" + $("input[name='title']")[0].value + "&" +
				"phoneNumber=" + $("input[name='phoneNumber']")[0].value + "&" +
				"briefDescription=" + $(".briefDescription")[0].childNodes[2].childNodes[1].value + "&" +
				"price=" + $("input[name='price']")[0].value
				;

			let req = this.getXMLHttpRequest();
			req.onreadystatechange = () => {
				if(req.readyState !== 4) {
					
				} else {
					
				}
			};
			req.open("POST", "http://localhost:8091/add-advertisement?", true);
			req.send(paramsUrl);

			//очистка данных формы
			this.props.onResetPlace();
			$(".selectCity")[0].childNodes[1].value = "";
			$("input[name='title']")[0].value = "";
			$("input[name='phoneNumber']")[0].value = "";
			$(".briefDescription")[0].childNodes[2].childNodes[1].nextSibling.value = "";
			$("input[name='price']")[0].value = "";
			document.querySelectorAll(".loadingPhoto input")[0].value = "";
			document.querySelectorAll(".loadingPhoto input")[1].value = "";
			document.querySelectorAll(".loadingPhoto input")[2].value = "";
			document.querySelectorAll(".loadingPhoto input")[3].value = "";
			document.querySelectorAll(".loadingPhoto input")[4].value = "";

			console.log("Отправлено");
		} else {
			console.log("Не отправлено");
		}
	};

	handleChangeAnimalType = (event, index, value) => this.setState({animal: {value: value}});
	handleChangeCategory = (event, index, value) => this.setState({category: {value: value}});

	//функция валидации поля
	//аргументы: принимаемый элемент ввода, регулярное выражение, свойство состояния
	validate = (e, regexp, action) => {
		let el = e.target.value;

		if(el.match(regexp)) {
			[action][0](true);

		} else if(el.length === 0) {
			[action][0](" ");

		} else {
			[action][0](false);
		}
	}

	//reg city
	validateRegCity = e => {
		let regexpName = /^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$/u;
		this.validate(e, regexpName, this.props.onValidateRegCity);
		this.props.onReletMessage();
	}

	//validateTitleName
	validateTitleName = e => {
		let regexpName = /^[а-яА-Я0-9-_\s]{10,50}$/;
		this.validate(e, regexpName, this.props.onValidateTitleName);
		this.props.onReletMessage();
	}

	//validatePhoneNumber
	validateTitlePhoneNumber = e => {
		let regexpName = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
		this.validate(e, regexpName, this.props.onValidatePhoneNumber);
		this.props.onReletMessage();
	} 

	//validatePlaceText
	validatePlaceText = e => {
		let regexpName = /^.{10,200}$/;
		this.validate(e, regexpName, this.props.onValidatePlaceText);
		this.props.onReletMessage();
	}

	//validatePlacePrice
	validatePlacePrice = e => {
		let regexpName = /^[0-9]{2,6}$/;
		this.validate(e, regexpName, this.props.onValidatePlacePrice);
		this.props.onReletMessage();
	}

	render() {
		let element = () => {
			let obj = this.props.state.photosReducer[0],
				idx = [0],
				mass = [];

			for(let i in obj) {
				mass.push(
					<div className={`loadingPhoto ${this.props.state.photosReducer[idx][i] === true ? "activeLabel" : ""}`} key={i}>
						<i className={`fa ${this.props.state.photosReducer[idx][i] === true ? "fa-check modifyColor" : "fa-plus"}`} aria-hidden="true"></i>
						<input type="file" accept="image/jpeg,image/png" className="formImg" />
					</div>
				);
			}

			return (
				<div className="buttonsAddPhoto">
					{
						mass
					}
				</div>
			);
		};

		let style = {
			floatingLabelStyle: {
				"color":"#b1adad"
			},
			labelStyle: {
				"color": "#7c7c7c"
			},
			floatingLabelFocusStyle: {
				"color": "#2396f1"
			},
			underlineFocusStyle: {
				"borderColor": "#2396f1"
			}
		};

		//сообщение об успешной отправке объявления
		let messagePlace = () => {
			return (
				<div className="mesagePlace">
					<i className="fa fa-check-circle" aria-hidden="true"></i>
					<p>Объявление отправлено на модерацию</p>
				</div>
			);
		};

		let pSity = this.props.state.validarePlaceAnAd.city,
			pTitleName = this.props.state.validarePlaceAnAd.titleName,
			pPhoneNumber = this.props.state.validarePlaceAnAd.phoneNumber,
			pTextContent = this.props.state.validarePlaceAnAd.phoneNumber,
			pPlacePrice = this.props.state.validarePlaceAnAd.placePrice,
			pPlaceImage = this.props.state.validarePlaceAnAd.placeImage;
		
		return (
			<div className="placeAnAd">
				<div className="placeTop">
					<p className="modifyTitle">Разместить объявление</p>
					{this.props.state.validarePlaceAnAd.messagePlace === true && pSity === " " && pTitleName === " " && pTextContent === " " && pPlacePrice === " " ? messagePlace() : "" }
				</div>
				<div className="placeContent">
					<div>
						<div className="wrapForm">
							<p className="subtitle">Данные</p>
							<form id="newAnimalForm">

								<SelectField
									floatingLabelStyle={style.floatingLabelStyle}
									labelStyle={style.labelStyle}
									floatingLabelText="Животное"
									value={this.state.animal.value}
									onChange={this.handleChangeAnimalType}
									selectedMenuItemStyle={style.floatingLabelFocusStyle}>
									<MenuItem value={"cat"} primaryText="Кошки" />
									<MenuItem value={"dog"} primaryText="Собаки" />
								</SelectField>

								<SelectField
									floatingLabelStyle={style.floatingLabelStyle}
									labelStyle={style.labelStyle}
									floatingLabelText="Категория"
									value={this.state.category.value}
									onChange={this.handleChangeCategory}
									selectedMenuItemStyle={style.floatingLabelFocusStyle}>
									<MenuItem value={"sale"} primaryText="Продать" />
									<MenuItem value={"gift"} primaryText="Даром" />
									<MenuItem value={"missing"} primaryText="Пропажа" />
									<MenuItem value={"find"} primaryText="Находка" />
								</SelectField>
								
								<TextField 
									hintText=""
									onChange={this.validateRegCity} 
									floatingLabelText="Город"
									className="selectCity" 
									underlineFocusStyle={style.underlineFocusStyle} 
									floatingLabelStyle={style.labelStyle} 
									floatingLabelFocusStyle={style.floatingLabelFocusStyle}
									errorText={this.props.state.validarePlaceAnAd.city === true || this.props.state.validarePlaceAnAd.city === " " ? "" : " "} />

								<TextField 
									hintText="Максимум 50 символов" 
									onChange={this.validateTitleName} 
									floatingLabelText="Название объявления"  
									name="title" 
									underlineFocusStyle={style.underlineFocusStyle} 
									floatingLabelStyle={style.labelStyle} 
									floatingLabelFocusStyle={style.floatingLabelFocusStyle}
									errorText={this.props.state.validarePlaceAnAd.titleName === true || this.props.state.validarePlaceAnAd.titleName === " " ? "" : " "} />

								<TextField 
									hintText="+7 *** *** ** **" 
									onChange={this.validateTitlePhoneNumber}
									floatingLabelText="Номер телефона" 
									name="phoneNumber" 
									underlineFocusStyle={style.underlineFocusStyle} 
									floatingLabelStyle={style.labelStyle} 
									floatingLabelFocusStyle={style.floatingLabelFocusStyle}
									errorText={this.props.state.validarePlaceAnAd.phoneNumber === true || this.props.state.validarePlaceAnAd.phoneNumber === " " ? "" : " "} />

								<TextField 
									hintText="Максимум 200 символов" 
									onChange={this.validatePlaceText}
									underlineFocusStyle={style.underlineFocusStyle} 
									floatingLabelStyle={style.labelStyle} 
									floatingLabelFocusStyle={style.floatingLabelFocusStyle} 
									floatingLabelText="Описание объявления" 
									multiLine={true} 
									rows={1} 
									className="briefDescription"
									errorText={this.props.state.validarePlaceAnAd.textContent === true || this.props.state.validarePlaceAnAd.textContent === " " ? "" : " "} />

								<TextField 
									hintText="Число без пробелов" 
									onChange={this.validatePlacePrice}
									underlineFocusStyle={style.underlineFocusStyle} 
									floatingLabelText="Цена" 
									name="price" 
									floatingLabelStyle={style.labelStyle} 
									floatingLabelFocusStyle={style.floatingLabelFocusStyle}
									errorText={this.props.state.validarePlaceAnAd.placePrice === true || this.props.state.validarePlaceAnAd.placePrice === " " ? "" : " "} />
							</form>
						</div>
					</div>
					<div>
						<div className="wrapPhotos">
							<p className="subtitle">Фотографии</p>
							<p className="photoDescpipt">Добавьте минимум одну фотографию <br /> Минимальное разрешение 1280 x 768 <br /> Формат jpeg или png </p>
							{
								element()
							}
						</div>
					</div>
					<div>
						<a href="javascript:void(0)" className="btnPlace" onClick={this.postMethodAddCard}>
							<i className="fa fa-cloud-upload" aria-hidden="true"></i>
							<span>Разместить</span>
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ({
		state: state
	}),
	dispatch => ({
		handlePhoto0: () => {
			dispatch({type: "ADD_PHOTO0", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		handlePhoto1: () => {
			dispatch({type: "ADD_PHOTO1", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		handlePhoto2: () => {
			dispatch({type: "ADD_PHOTO2", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		handlePhoto3: () => {
			dispatch({type: "ADD_PHOTO3", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		handlePhoto4: () => {
			dispatch({type: "ADD_PHOTO4", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidateRegCity: e => {
			dispatch({type: "VALIDATE_PLACE_CITY", payload: e});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidateTitleName: e => {
			dispatch({type: "VALIDATE_PLACE_TITLENAME", payload: e});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidatePhoneNumber: e => {
			dispatch({type: "VALIDATE_PLACE_PHONENUMBER", payload: e});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidatePlaceText: e => {
			dispatch({type: "VALIDATE_PLACE_TEXT", payload: e});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidatePlacePrice: e => {
			dispatch({type: "VALIDATE_PLCAE_PRICE", payload: e});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onValidatePlaceImage: () => {
			dispatch({type: "VALIDATE_PLCAE_IMAGE", payload: true});
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		},
		onResetPlace: () => {
			dispatch({type: "RESET_PLACE"});
			dispatch({type: "ADD_PHOTO0", payload: false});
			dispatch({type: "ADD_PHOTO1", payload: false});
			dispatch({type: "ADD_PHOTO2", payload: false});
			dispatch({type: "ADD_PHOTO3", payload: false});
			dispatch({type: "ADD_PHOTO4", payload: false});
		},
		onReletMessage: () => {
			dispatch({type: "PLACE_SUCCES_FALSE", payload: false});
		}
	})
)(PlaceAnAd);