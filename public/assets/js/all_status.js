window.addEventListener('load',function() {
	let
		d = document,
		method = {
			get:function() {
				let newObj = new Object();
				for(let i = 0, getArr = location.search.substring(1,location.search.length).split('&').map(function(item) {
					return {[item.split('=')[0]]:item.split('=')[1]};
				}); i < getArr.length; i++) newObj = Object.assign(newObj, getArr[i]);
				return newObj;
			}
		},
		visibleBlock = function() {for(let i = 0,content = d.querySelectorAll('.content'); i < content.length; i++) if(content[i].style.display == 'block') return i;},
		statusBar = {
			selector:d.querySelectorAll('.status_bar'),
			mobilePlatform:function(id) {
				new Array('Android','iOS').forEach(function(item) {
					if(navigator.platform.indexOf(item) !== -1) {
						statusBar.selector[visibleBlock()].querySelectorAll('img').forEach(function(item,i) {
							if(i == id) {
								item.classList.add('mobilePlatformVisibleOn');
								item.classList.remove('mobilePlatformVisibleOff');
							} else {
								item.classList.add('mobilePlatformVisibleOff');
								item.classList.remove('mobilePlatformVisibleOn');
							}
						});
						statusBar.selector[visibleBlock()].style.display = 'block';
						for(let i = 0, children = d.querySelectorAll('.content')[visibleBlock()].querySelector('.links') !== null ? d.querySelectorAll('.content')[visibleBlock()].querySelector('.links').children : 0; i < children.length; i++)
							children[i].style.cssText = '\
								float:none;\
								display:block;\
								line-height:2.5;\
							';
					}
				});
			},
			imgTestname:function() {return name.search('_disabled') >= 0 ? true : false},
			imgChild:function(id) {return this.selector[visibleBlock()].querySelectorAll('img')[id];},
			imgGetname:function(id) {
				return this.imgChild(id).src.substring(this.imgChild(id).src.lastIndexOf('/') +1,this.imgChild(id).src.length);
			},
			imgSetname:function(id, name) {
				this.imgChild(id).src = this.imgChild(id).src.substring(0,this.imgChild(id).src.lastIndexOf('/') +1) + name;
			},
			imgRename:function(name) {
				if(this.imgTestname())
					return name.substring(0,name.lastIndexOf('_')) + name.substring(name.lastIndexOf('.'),name.length);
				else
					return name.substring(0,name.lastIndexOf('.')) + '_disabled' + name.substring(name.lastIndexOf('.'),name.length);
			},
			imgGetsize:function(id) {
				return {width:this.imgChild(id).width,height:this.imgChild(id).height};
			},
			imgSetsize:function(id,param) {
				this.imgChild(id).width = param.width;
				this.imgChild(id).height = param.height;
			},
			imgActive:function(id) {
				for(let i = 0; i <= id; i++) if(i % 2 == 0) statusBar.imgSetname(i,'step'+(i/2)+'.svg');
				statusBar.imgSetsize(id,{width:54,height:54});
				this.mobilePlatform(id);
			}
		},
		page = {
			selector:d.querySelectorAll('.content'),
			visiblePage:function(pageId) {
				for(let i = 0; i < this.selector.length; i++) this.selector[i].style.display = pageId != i ? 'none' : 'block';
				//for(let i = 0; i < statusBar.selector.length; i++) if(i % 2 == 0) statusBar.imgSetsize(i,{width:49,height:49});
				this.transactionStatus();
			},
			setStat:function(obj,value, selector = this.selector) {
				Object.keys(obj).forEach(function(key) {
					if(key == 'link') {
						if(obj[key].bool) {
							let link = selector[visibleBlock()].querySelector('.input').querySelector('#' + key);
							link.style.display = 'block';
							link.setAttribute('onclick',"javascript: location.href = '" + obj[key].url + "';");
						}
					}
					else
						page.selector[visibleBlock()].querySelector('.stat').querySelector('#' + key).innerText = obj[key];
				});
			},
			transactionStatus:function() {
				this.selector[visibleBlock()].querySelector('#requestId').innerText = 'Request ID '+method.get().request_id;
			},
			step1:function(obj) {
				// Страница Enter the code
				this.visiblePage(0);
				statusBar.imgActive(2);
				d.querySelector('#authSMSCode').dataset.phoneId = obj.phoneId;
				console.log({phoneNumber:obj.phoneNumber});
				d.querySelectorAll('.phoneNumber').forEach(function(item) {
					item.innerText = obj.phoneNumber;
				});
			},
			step2:function() {
				// Страница Change number
				this.visiblePage(1);
				statusBar.imgActive(2);
			},
			step3:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(4);
				this.setStat(obj);
			},
			step4:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(2);
				this.setStat(obj);
			},
			step5:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(6);
				this.setStat(obj);
			},
			step6:function(obj) {
				this.visiblePage(2);
				/*statusBar.imgActive(6);*/
				statusBar.imgSetname(6,'step3_error.svg');
				this.setStat(obj);
			}
		},
		countdown = function(time,result) {
			console.log('--',result.partner_url,result.ex_transaction_id,'--');
			d.querySelector('#countdown').innerText = time;
			time--;
			if(time == 0)
				window.location.href = result.partner_url + (
					result.partner_url.includes('?') == true ? 
					("&transaction_id=" + result.ex_transaction_id) : 
					("?transaction_id=" + result.ex_transaction_id)
				);
			else 
				setTimeout(function() {
					countdown(time);
				}, 1000);
		}
	
	/* 
	console.log( method.get() );
	console.log( statusBar.imgGetname(0) );
	console.log( statusBar.imgRename( 'step1.svg' ) );
	console.log( statusBar.imgSetname(0,'step1.svg') );
	console.log( statusBar.imgGetsize(0) );
	*/
	
	ajaxData(function(result) {
		d.querySelector('#WrongPhoneNumber').addEventListener('click',function() {
			page.step2();
		});
		d.querySelector('#resendCallConfirmation').addEventListener('click',function() {
			resendCallConfirmation();
		});
		d.querySelector('#checkSMSCode').addEventListener('click',function() {
			checkSMSCode();
		});
		d.querySelector('#setNewPhone').addEventListener('click',function() {
			setNewPhone(result);
		});
		
		console.log( result,'\n\n\n' );
		// Страница, когда методом get никаких переменных не отправлено
		//page.visiblePage(0);
		// Проверка личности

		console.log(result);
		if(result.s == 'TimeOut' || result.card3DS == 'Half3Ds') {
			console.log('// Когда отказ');
			page.step6({status:'Declined',date:result.d,cash:result.iA+' '+result.iC});
		} else if(result.cardStatus == 'Declined' || result.vp_status_outer < 0) {
			console.log('// Когда отказ по причине отсутствия надобности в воде SMS подтверждения');
			page.step6({status:'Declined Error',date:result.d,cash:result.iA+' '+result.iC,details:'     '});
		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == '') {
			console.log('// Verifying и phoneStatusAuthCode пусто');
			page.step3({link:{url:result.KYCUrl,bool:result.KYCNeeded},status:'Completed',date:result.d,cash:result.iA+' '+result.iC});
		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == 'Verifying') {
			console.log('// Идет проверка && номер подтвержден');
			page.step1({request_id:(result.request_id || result.id),phoneId:result.phoneId,phoneNumber:result.phoneNumber});
		} else if(result.s == 'Declined') {
			console.log('// Когда статус проверки неизвестен');
			page.step4({status:'Declined',date:result.d,cash:result.iA+' '+result.iC});
		} else if(result.s == 'Completed' || result.s == 'MoneySend' || result.s == 'Processing') {
			console.log('// Когда все успешно завершено');
			page.step5({status:(
				result.s == 'MoneySend' ? 'Funds have been sent' : result.s
			),date:result.d,cash:result.iA+' '+result.iC});
		} else console.log('Ни одного из условий не выполнено');

		// Обратный отсчет до редиректа partner_url, иначе текст в footer обнуляет
		console.log(123,result.partner_url,result.partner_url.length != '');
		if(result.partner_url.length != '' && (result.s == "TimeOut" || result.s == "Declined" || result.s == "Completed" || result.s == "MoneySend"))
			countdown(15,result);
		else
			d.querySelector('footer.footer center').innerText = '';

		// LOGO
		$.ajax({
			url: "/gw/payment_form.aspx/getUrlInfos",
			type: "post",
			async: true,
			contentType: "application/json; charset=utf-8",
			crossDomain: false,
			dataType: "json",
			data: JSON.stringify({
			  partner: result.partner
			}),
			success: (data) => {
			  const { error_url, logo_url } = data.d
		
			  $(".proccesing-form__text_cancel-payment").attr("href", error_url)
			  $(".header__logo-img").attr("alt", result.partner);
			  $(".header__logo-img").attr("src",`${location.origin}/${logo_url}`);
			} 
		});

		// help users
		(function(result) {
			$.ajax({
				url: "https://wchat.freshchat.com/js/widget.js",
				dataType: "script",
				async: false
			}).then(() => {
				var userToken = result.partner + '_' + result.user_id;
				var MD5 = function (d) { let result = M(V(Y(X(d), 8 * d.length))); return result.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }
	
				userToken = decodeURIComponent((userToken + '').replace(/\+/g, '%20'))
				var userTokenMD5 = MD5(userToken);
	
				window.fcWidget.init({
					token: "b34aadd4-a993-4d87-a841-46b11a609877",
					host: "https://wchat.freshchat.com",
					externalId: userTokenMD5,     // user’s id unique to your system
				});
			});
		})(result);
	});

	// Проверить СМС код
	function checkSMSCode() {
		let host = 'https://indacoin.com';
		$.ajax({
			url: host + "/notify/CheckPhoneAuthCode",
			async: true,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			crossDomain: false,
			data: "{'phoneId':'" + d.querySelector('#authSMSCode').dataset.phoneId + "','authCode':'" + d.querySelector('#authSMSCode').value
				+ "','confirmation_hash':'" + method.get().confirm_code + "','request_id':'" + method.get().request_id + "'}",
			success: function(data) {
				if ((data.d.res == "1") || data.d.res == "true") {
					window.location.reload();
				} else {
					d.querySelector('#errorSMSCode').innerText = 'You have entered an incorrect verification code.';
					/*$("#authSMSCode").siblings(".tip").html(window.t.wrongSMSAuthCode).show();
					setTimeout(function () {
						window.location.reload();
					}, 5000);*/
				}
			}
		});
	}
	// Заказать обратный звонок
	function resendCallConfirmation() {
		let host = 'https://indacoin.com';
		$.ajax({
			url: host + "/notify/ResendCallConfirmation",
			async: true,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			crossDomain: false,
			data: "{'phoneId':'" + $("#phone_id").html().trim() + "','confirmation_hash':'" + getParameterByName('confirm_code') + "','request_id':'" + getParameterByName('request_id') + "'}",
			success: function (data) {
				if (data.d > 0) {
					$('#resendCallDivLink').val(window.t.weWillCall).attr('disabled', 'disabled');
					$('#resendCallDivLink').html(window.t.weWillCall).attr('disabled', 'disabled');
				}
				else {
					$('#resendCallDiv').hide();
				}
			}
		});
	}
	// Новый номер телефона
	function setNewPhone() {
		let host = 'https://indacoin.com';
		$.ajax({
			url: host + "/notify/ChangePhoneNumberForRequest",
			async: true,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			data: "{'new_phone':'" +
			/* $('#inputNewPhone').intlTelInput("getNumber").replace(/[+()-]/g, "").trim() + */
			d.querySelector('#inputNewPhone').value.replace(/[+()-]/g, "").trim() +
			"','confirmation_hash':'" +
			method.get().confirm_code +
			"','request_id':'" +
			method.get().request_id +
			"'}",
			success: function(data) {
				console.log(data,789);
				if (data.d > 0) {
					/*
					$('#changePhoneNumberButton').val(window.t.weWillCall).attr('disabled', 'disabled');
					$('#changePhoneNumberButton').html(window.t.weWillCall).attr('disabled', 'disabled');
					*/
				} else {
					//$('#changePhoneNumberButton').hide();
				}
			}
		});
	}
	// Общий ajax
	function ajaxData(resolve) {
		let host = 'https://indacoin.com';
		(function receiveData() {
			$.ajax({
				async: false,
				url: host + "/Notify/getData",
				method: "POST",
				contentType: "application/json; charset=utf-8",
				crossDomain: false,
				data: "{'requestId':'" +
					method.get().request_id +
					"','confirmCode':'" +
					method.get().confirm_code +
					"'}",
				success: function onSucess(result) {
					resolve(JSON.parse(result.d));
					var NotifyData = $.parseJSON(result.d);
	
					if (NotifyData.s != "TimeOut" && NotifyData.s != "Declined" && NotifyData.s != "Completed" && NotifyData.s != "MoneySend")
						setTimeout(function () {
								receiveData();
						}, ((NotifyData.s == "Verifying" && NotifyData.verify_seconds_count < 20)?10000:30000));
						
	
					/* if (NotifyData.partnerName == "skycoin") {
						var cssId = 'myPartnerCss';  // you could encode the css path itself to generate id..
						if (!document.getElementById(cssId)) {
							var head = document.getElementsByTagName('head')[0];
							var link = document.createElement('link');
							link.id = cssId;
							link.rel = 'stylesheet';
							link.type = 'text/css';
							link.href = '/ex/css/ex_gw/partners/skycoin.css?ver=1.1';
							link.media = 'all';
							head.appendChild(link);
						}
					} */
				}
			});
		})();
	}

});