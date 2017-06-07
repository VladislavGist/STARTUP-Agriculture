import express from "express";
let app = express();

//modules
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import cors from "cors";
import moment from "moment";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
require('node-jsx').install();

//ssr
import React from "react";
import ReactDom from "react-dom/server";
import {match} from "react-router";
import {Provider} from "react-redux";
import {ReduxAsyncConnect, LoadOnServer} from "redux-connect";

// import routes from "./routes.jsx"
// import configureStore from "./redux/configureStore.jsx";

//конфиг и пути к файлам в разных сборках
import config from "./config.js";
let port = process.env.NODE_ENV === "dev" ? config.port.dev : config.port.prod;
const secret = config.secret;
let URL_PATH = process.env.NODE_ENV === "dev" ? config.urlPaths.dev : config.urlPaths.prod;
let URL_SERVER_PATH = process.env.NODE_ENV === "dev" ? config.urlServerPath.dev : config.urlServerPath.prod;
let DATABASE = process.env.NODE_ENV === "dev" ? config.sqlDatasDev : config.sqlDatasProd;

import _ from "underscore";

app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: URL_PATH}));

let renderHtml = () => {
	return `<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="UTF-8">
			<title>Oblako.pet</title>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">

			<link rel="apple-touch-icon" sizes="180x180" href="./favicons/apple-touch-icon.png">
			<link rel="icon" type="image/png" href="./favicons/./favicon-32x32.png" sizes="32x32">
			<link rel="icon" type="image/png" href="./favicons/./favicon-16x16.png" sizes="16x16">
			<link rel="manifest" href="./favicons/manifest.json">
			<link rel="mask-icon" href="./favicons/safari-pinned-tab.svg" color="#5bbad5">
			<meta name="theme-color" content="#ffffff">

			<meta content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" name="SKYPE_TOOLBAR">
			<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
			<script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>

			<script src="https://use.fontawesome.com/d12eda1a75.js"></script>
			<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
			<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
			<link rel="stylesheet" type="text/css" href="./bundle.css" />

		</head>
		<body>
			<div id="app"></div>
			<script src="./bundle.js"></script>
			<script type="text/javascript"> (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter44570849 = new Ya.Metrika({ id:44570849, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/44570849" style="position:absolute; left:-9999px;" alt="" /></div>
			</noscript>
		</body>
		</html>
	`;
}

app.get("*", (req, res) => {
	res.sendFile(__dirname + "/public");
	// res.send(renderHtml());
});

//обратная связь
app.get("/sendus", (req, res) => {
	let datas = {
		name: req.query.name,
		email: req.query.email,
		title: req.query.title,
		mess: req.query.mess
	};

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "spanshine.vlad@gmail.com",
			pass: "dc0781907819"
		}
	});

	let mailOptions = {
		from: `Animals ${datas.email}`,
		to: "studio_kseven@mail.ru",
		subject: `Тема письма: ${datas.title}`,
		html: "<p>" + "Имя: " + datas.name + "<br/>" + "Сообщение: " + datas.mess + "<br/>" + "Моя почта: " + datas.email + "</p>"
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if(err) {
			console.log(err);
			res.json(500, {message: "Ошибка отправки письма на почту"})
		} else {
			res.json(200, {message: "Отправлено"});
		}
	});
});

//работа с изображениями
import multer from "multer";
let imgPath = [];
let imgName = [];
let mass = null;
let massZip = null;
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let animalType = req.originalUrl.split("/")[4];
		let advertisementType = req.originalUrl.split("/")[6];

		if(file.mimetype !== "image/jpeg") {
			console.log("Неверный формат файла");
			console.log(file.mimetype);
		} else {
			cb(null, "uploads/" + animalType + "/" + advertisementType);
			imgPath.push(URL_SERVER_PATH + "/" + animalType + "/" + advertisementType);
		}
	},
	filename: (req, file, cb) => {
		let animalType = req.originalUrl.split("/")[4];
		let advertisementType = req.originalUrl.split("/")[6];
		let dateNow = Date.now();

		if(file.mimetype !== "image/jpeg") {
			console.log("Неверный формат файла");
			console.log(file.mimetype);
		} else {
			let random = Math.random(0, 10000);
			cb(null, animalType + "-" + advertisementType + "-" + dateNow + random);
			imgName.push("/" + animalType + "-" + advertisementType + "-" + dateNow + random);
		}
	}
});
let upload = multer({storage: storage});

//подключение к базе
let mysql = require("mysql");

let pool = mysql.createPool({
	connectionLimit: 2000,
	host: DATABASE.host,
	user: DATABASE.user,
	password: DATABASE.password,
	database: DATABASE.database
});

//работа с базой данных
// pool.getConnection((err, connection) => {
// 	if(err) {
// 		console.log(err);
// 	} else {
	// }
// });

//модерация объявлений. изменить статус
app.get("/replaceStatusCard", (req, res) => {
	let cardId = req.query.cardid, newStatus = req.query.status;
	pool.query(`UPDATE cards SET status='${newStatus}' WHERE card_id=${cardId}`, (err,result, fields) => {
		if(err) {
			console.log("Ошибка при изменении статуса обявления");
			console.log(err);
			res.json(500, {message: "error"});
		} else {
			console.log("Статус объявления изменен");
			res.json(200, {message: "Статус объявления изменен"});
		}
	});
});

//модерация объявлений. вывести все
app.get("/moderate", (req, res) => {
	pool.query("SELECT * FROM cards WHERE status='verified'; ", (err, results, fields) => {
		if(err) {
			console.log("Ошибка при получении объявлений для модерации");
			res.end();
		} else {
			console.log("Объявления отданы");
			res.write(JSON.stringify(results));
			res.end();
		}
	});
});

//удалени объявлений
moment.locale("ru");
	
setInterval(() => {
	let nowTime = moment().format("LTS"), nowDay = moment().format("ll");

	if(nowTime == "00:00:00" && nowTime != "00:00:05") {

		//удаление изображений на сервере
		pool.query(`SELECT imgPath FROM cards WHERE data_delete='${nowDay}';`, (err, results, fields) => {
			if(err) {
				console.log("Ошибка удаления файлов");
				console.log(err);
			} else {
				
				//функция поиска и удаления файлов
				let delteImages = (firstFilder, secondFolder, name) => {
					let myPath = `./uploads/${firstFilder}/${secondFolder}/${name}`;
					fs.unlink(myPath, err => {
						if(err) {
							console.log(err);
							paths = [];
						} else {
							console.log(myPath + " удален");
							paths = [];
						}
					});
				};

				//пути в чистом виде
				let paths = [];
				for(let i = 0; i < results.length; i++) {
					paths.push(results[i].imgPath + " ");
				}
				let finalPaths = _.compact(paths).join("");
				//пути без хостов
				let array = _.compact(finalPaths.replace(/http:.{2,}?\//g, "").split(" "));
				//массив путей со слешами. убираем их
				let array2 = _.map(array, e => {
					return e.replace(/\//g, " ");
				});
				//массив путей без слешей. на каждое слово вызываем функцию удаления
				let array3 = _.each(array2, e => {
					let massStr = e.split(" ");
					console.log(massStr);
					//запуск функции поиска и удаления
					//аргумены: папка, папка, имя файла
					delteImages(massStr[0], massStr[1], massStr[2]);
				});
			}
		});

		//удаление объявлений в базе
		pool.query(`DELETE FROM cards WHERE data_delete='${nowDay}';`, 
		(err, results, fields) => {
			if(err) {
				console.log("Ошибка удаления объявлений");
				console.log(err);
			} else {
				console.log("Объявления удалены");
			}
		});
	}


}, 1000)

//регистрация
app.post("/registr", (req, res) => {
	//получает от пользователя: имя, телефон, пароль, город, емейл
	let reqData = {
		"name": req.param("name"),
		"surname": req.param("surname"),
		"phone": req.param("phone").replace(/\s/g, ""),
		"password": req.param("password"),
		"city": req.param("city"),
		"email": req.param("email").replace(/\s/g, "")
	};

	console.log(reqData);

	//проверяем нет ли пользователям с таким же номером телефона
	pool.query(`SELECT COUNT(phoneNumber) FROM users WHERE phoneNumber='${reqData["phone"]}';`, (err, results, fields) => {
		if(err) {
			res.json({error: "Ошибка ответа от базы данных"});

		} else if(results[0]['COUNT(phoneNumber)'] > 0) {		//проверяем нет ли пользователям с таким же номером телефона
			res.json({message: "Пользователь с таким номером телефона уже существует"});	

		} else {
			//регистрируем нового пользователя
			pool.query(`INSERT INTO users VALUES(NULL, '${reqData["name"]}', '${reqData["surname"]}', '${reqData["phone"]}', '${reqData["city"]}', '${reqData["password"]}', 'PRIVATE_SELLER', '${reqData["email"]}', NULL);`, (err, results, fields) => {
				if(err) {
					res.json("Ошибка при регистрации нового пользователя");

				} else {
					//подписываем данные с ключем. отправляем клиенту данные
					// token: jwt.sign(reqData, secret) - не понятно зачем нужен jwt
					return res.json({
						message: "Вы успешно зарегистрированы"
					});
				}
			});
		}
	});
});

//аунтификация. вход в приложение
app.get("/protected",
	(req, res) => {
		// expressJwt({secret})
		let password = req.query.password, phone = req.query.phone;

		//идем в базу ищем такого-то пользователя с таким-то паролем
		pool.query(`SELECT COUNT(password) FROM users WHERE password='${password}';`, (err, results, fields) => {
			//если пользователь с таким именем и паролем найден кладем данные в свойства объекта
			if(err) {
				res.json(500, {error: "Ошибка при проверке пароля"});
			} else {
				if(results[0]['COUNT(password)'] > 0) {
					pool.query(`SELECT COUNT(phoneNumber) FROM users WHERE phoneNumber='${phone}' `, (err, results, fields) => {
						if(err) {
							res.json(500, {error: "Ошибка при проверке номера телефона"});
						} else {
							if(results[0]['COUNT(phoneNumber)'] > 0) {
								pool.query(`SELECT user_id, name, surname, phoneNumber, city, accountType, rules FROM users WHERE password='${password}' AND phoneNumber='${phone}'`, (err, results, fields) => {
									if(err) {
										res.json(500, {error: "Ошибка при получении данных пользователя"});
									} else {
										if(results.length !== 0) {
											res.json(200, {results});
										} else {
											res.json(404, {error: "Неверные данные или пользователь не существует"});
										}
									}
								});
							} else {
								res.json(404, {error: "Неверные данные или пользователь не существует"});
							}
						}
					});
				} else {
					res.json(404, {error: "Неверные данные или пользователь не существует"});
				}
			}
		});
	}
);

//обновление инф. в аккаунте пользователя
app.get("/updateDatasAccount", (req, res) => {
	pool.query(`SELECT user_id, name, surname, phoneNumber, city, accountType, rules FROM users WHERE user_id='${req.query.userid}';`, (err, results, fields) => {
		if(err) {
			console.log(err);
		} else {
			res.json(200, results);
		}
	});
});

//активные объявления пользователя
app.get("/userCardsAccepted", (req, res) => {
	pool.query(`SELECT * FROM cards WHERE user_id='${req.query.userid}' AND status='accepted' ORDER BY(card_id) DESC;`, (err, results, fields) => {
		if(err) {
			console.log("Ошибка при получении объявлений");
		} else {
			res.json(results);
		}
	});
});

//завершенные и объявления с отказом
app.get("/userCardsComplAndRejected", (req, res) => {
	pool.query(`SELECT * FROM cards WHERE user_id='${req.query.userid}' AND (status='сompleted' OR status='rejected') ORDER BY(card_id) DESC;`, (err, results, fields) => {
		if(err) {
			console.log("Ошибка при получении объявлений");
		} else {
			res.json(results);
		}
	});
});

//изменение данных пользователя
app.get("/updateUserData", (req, res) => {
	let userId = req.query.userId,
		parametr = req.query.parametr,
		value = req.query.value;

	pool.query(`UPDATE users SET ${parametr}=${value} WHERE user_id=${userId};`, (err, results, fields) => {
		if(err) {
			console.log(err);
			console.log("Информация о пользователе не изменена");
			res.json(500, {messsage: "Ошибка"});
		} else {
			console.log("Информация о пользователе успешно изменена");
			res.json(200, {message: "Изменено"});
		}
	});
});

//заверш. объяв.
app.get("/completeCard", (req, res) => {
	let cardId = req.param("cardId");
	pool.query(`UPDATE cards SET status='сompleted' WHERE card_id=${cardId};`, (err, results, fields) => {
		if(err) {
			console.log("Ошибка остановки объявления");
			res.end();
		} else {
			console.log("Объявление остановленно");
			res.end();
		}
	});
});  

//cards на главной
app.get("/list-hot-adv/:city", (req, res) => {
	console.log("/list-hot-adv");
	let func = city => {
		if(city != "Все регионы") {
			return `AND city = "${city}" `;
		} else {
			return '';
		}
	};
	
	pool.query(`SELECT * FROM cards WHERE status='accepted' AND advType IN('missing', 'find', 'gift', 'buy') ${func(req.params.city)} ORDER BY(card_id) DESC LIMIT 15`, (err, results, fields) => {
		res.write(JSON.stringify(results));
		res.end();
	});
});

//cards категорий
app.get("/list-animals/animal_type/:animaltype/advertisement_type/:advertisementtype/city/:city/count/:count", (req, res) => {
	let func = city => {
		if(city != "Все регионы") {
			return `AND city = "${city}" `;
		} else {
			return '';
		}
	};

	pool.query(`SELECT * FROM cards WHERE status='accepted' AND animalType = '${req.params.animaltype}' AND advType = '${req.params.advertisementtype}' ${func(req.params.city)} ORDER BY(card_id) DESC LIMIT ${req.params.count}`, (err, results, fields) => {
		res.write(JSON.stringify(results));
		res.end();
	});
});

//скрытие кнопки
app.get("/list-animals/animal_type/:animaltype/advertisement_type/:advertisementtype/city/:city/count/:count/allcount", (req, res) => {
	let func = city => {
		if(city != "Все регионы") {
			return `AND city = "${city}" `;
		} else {
			return '';
		}
	};

	pool.query(`SELECT COUNT(card_id) FROM cards WHERE status='accepted' AND animalType = '${req.params.animaltype}' AND advType = '${req.params.advertisementtype}' ${func(req.params.city)} ORDER BY(card_id) DESC LIMIT ${req.params.count}`, (err, results, fields) => {
		res.write(JSON.stringify(results));
		res.end();
	});
});

//подача card
app.post("/add-advertisement?", (req, res) => {

	pool.query(`INSERT INTO cards VALUES(
		NULL,
		'${req.param("title")}',
		'${req.param("briefDescription")}',
		'${req.param("city")}',
		'${req.param("userName")}',
		'${req.param("status")}',
		'${req.param("phoneNumber").replace(/\s/g, "")}',
		0,
		'${req.param("price")}',
		'${massZip}',
		'${req.param("animalType")}',
		'${req.param("advertisementType")}',
		0,
		'${req.param("userId")}',
		'verified',
		'${req.param("dataDelete")}')`, 
		(err, results, fields) => {
			if(err) {
				console.log("Ошибка подачи объявления");
				console.log(err);
			} else {
				console.log("--------------Объявление загружено---------");
				console.log(mass);
				massZip = null;
				mass = null;
				imgPath = [];
				imgName = [];
				console.log("--------------Объявление загружено CLOSE---------");
				res.end();
			}
	});
});

//img
app.post("/add-advertisement/img/animalType/:animalType/advertisementType/:advertisementType", upload.array("photo"), (req, res) => {
	mass = _.zip(imgPath, imgName);
	massZip = mass.join(" ").replace(/,/g, "");
	console.log("-----------POST------------");
	console.log(massZip);
	console.log("-----------POST CLOSE------------");
	res.end();
});

//счетчик просмотров card
app.get("/updatecardviews/:cardId", (req, res) => {
	pool.query(`UPDATE cards SET views = views + 1 WHERE card_id = ${req.params.cardId}`, (err, results, fields) => {
		if(err) {
			console.log("Ошибка изменения объявления");
		} else {
			res.end();
			console.log("Объявление c id " + req.params.cardId + " успешно изменено");
		}
	});
});

app.listen(port, () => {
	console.log("Listetining server. Port " + port + " " + URL_PATH);
});