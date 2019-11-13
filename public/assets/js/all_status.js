// custom style
(() => {
	let stylesheet = new URL(document.location.href).searchParams.get('stylesheet');
	if(stylesheet) {
		let ref = document.createElement("link");
		ref.setAttribute("rel", "stylesheet");
		ref.setAttribute("type", "text/css");
		ref.setAttribute("href", decodeURIComponent(stylesheet));
		document.head.append(ref);
	}
})();

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
			display:function(){
				let ul = d.querySelectorAll('div.stat ul');
				for(let item of arguments) {
					ul[0].querySelectorAll('li')[item].style.display = 'block';
					ul[1].querySelectorAll('li')[item].style.display = 'block';
				}
			},
			setStat:function(obj,value, selector = this.selector) {
				console.log('setStat: ',obj)
				Object.keys(obj).forEach(function(key) {
					if(key == 'link') {
						function isUrlValid(userInput) {
							userInput = typeof userInput === 'string' ? userInput : '';
							var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
							return res == null ? false : true;
						}
						
						if(obj[key].bool && isUrlValid(obj[key].url)) {
							let link = selector[visibleBlock()].querySelector('.input').querySelector('#' + key);
							link.style.display = 'block';
							link.setAttribute('onclick',"javascript: location.href = '" + obj[key].url + "&back_url=" + encodeURIComponent(window.location.href) + "';");
						}
					}
					else
						page.selector[visibleBlock()].querySelector('.stat').querySelector('#' + key).innerText = obj[key];
				});
			},
			transactionStatus:function() {
				this.selector[visibleBlock()].querySelector('#requestId').innerText = replaceSharp(
					this.selector[visibleBlock()].querySelector('#requestId').innerText,
					method.get().request_id
				);
			},
			step1:function(obj) {
				// Страница Enter the code
				this.visiblePage(0);
				statusBar.imgActive(2);
				d.querySelector('#authSMSCode').dataset.phoneId = obj.phoneId;
				d.querySelectorAll('.phoneNumber').forEach(function(item) {
					item.innerText = obj.phoneNumber;
				});
			},
			step2:function() {
				// Страница Change number
				this.visiblePage(1);
				statusBar.imgActive(2);
				this.display(0,1,2);
			},
			step3:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(4);
				this.setStat(obj);
				this.display(0,1,2);
				
				//this.selector[2].querySelector('.details p').innerText = obj.details
			},
			step4:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(2);
				this.setStat(obj);
				this.display(0,1,2);
			},
			step5:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(6);
				this.setStat(obj);
				this.display(0,1,2,3);
			},
			step5_2:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(6);
				this.setStat(obj);
				this.display(0,1,2);
			},
			step6:function(obj) {
				this.visiblePage(2);
				/*statusBar.imgActive(6);*/
				statusBar.imgSetname(6,'step3_error.svg');
				this.setStat(obj);
				this.display(0,1,2);
			},
			step7:function(obj) {
				// Страница Transaction status
				this.visiblePage(2);
				statusBar.imgActive(1);
				this.setStat(obj);
				this.display(0,1,2);
			},
		},
		countdown = function(time,result) {
			console.log('--',result.partner_url,result.ex_transaction_id,'--');
			let countd = d.querySelector('#countdown');
			countd.innerText = countd.innerText.replace( new RegExp(countd.dataset.count,'g') ,time);
			countd.dataset.count = time;
			time--;
			if(time == 0)
				window.location.href = result.partner_url + (
					result.partner_url.includes('?') ? 
					"&transaction_id=" + result.ex_transaction_id : 
					"?transaction_id=" + result.ex_transaction_id
				);
			else 
				setTimeout(function() {
					countdown(time,result);
				}, 1000);
		},
		replaceSharp = function(str,inner) {return str.replace('###',inner)}

	window.pageHTML = id => {
		page.visiblePage(id);
		return page.selector[id];
	}

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
		setNewPhone();
	});
	ajaxData(function(result) {
		// Для партнера "quube"
		(function() {
			if(result.partnerName === 'quube') {
				let menu = d.querySelectorAll('.mobileMenu li');
				menu[2].style.display = 'none';
			}
		})();

		console.log( 'getData: ',result,'\n' );
		// Страница, когда методом get никаких переменных не отправлено
		//page.visiblePage(0);
		// Проверка личности
		function mobgetcurrenciesinfo(params) {
			// result.amount_alt_to_send+' '+result.oC 
			return new Promise(function(resolve) {
				if( params.alt_currency_id > 0 ) {
					if(sessionStorage.getItem('cur_id_'+params.alt_currency_id) === null) {
						$.get('https://indacoin.com/api/mobgetcurrenciesinfo/1', function(data) {
							let arr = [];
							for(let key in data) arr.push(data[key]);
							if(!arr.some(function(item) {
								return item.cur_id === params.alt_currency_id;
							})) {
								resolve({summ:params.amount_alt_to_send,fee:params.iC});
								
							} else {
								for(let key in data) {
									if(data[key].cur_id == params.alt_currency_id) {
										sessionStorage.setItem('cur_id_'+params.alt_currency_id,JSON.stringify(data[key]));
										resolve({summ:params.amount_alt_to_send,fee:data[key].short_name});
									}
								}
							}
						});
					} else {
						resolve({summ:params.amount_alt_to_send,fee:JSON.parse(sessionStorage.getItem('cur_id_'+params.alt_currency_id)).short_name});
					}
				} else {
					resolve({summ:params.oA,fee:params.oC});
				}
			});
		}
		if(result.s == 'Completed' || result.s == 'MoneySend' || result.s == 'Processing') {
			console.log('// When everything is completed successfully');
			mobgetcurrenciesinfo(result).then(function(data) {
				let status = {status:(
					result.s == 'MoneySend' ? langSet('status','MoneySend') : result.s
				)};
				
				if(result.iC === data.fee) {
					var send = {date:result.d,cashIn:result.iA+' '+result.iC};
					page.step5_2(Object.assign(status,send));
				} else {
					var send = {date:result.d,cashIn:result.iA+' '+result.iC,cashOut:data.summ + ' ' + data.fee};
					page.step5(Object.assign(status,send));
				}
			});
		} else if(result.s == 'TimeOut' || result.card3DS == 'Half3Ds') {
			
			console.log('// When failure');
			page.step6({status:'Declined',date:result.d,cashIn:result.iA+' '+result.iC});
		} else if(result.cardStatus == 'Declined' || result.vp_status_outer < 0) {
			console.log('// When refusal due to lack of need to enter SMS confirmation');
			page.step6({status:'Denied by bank',date:result.d,cashIn:result.iA+' '+result.iC});
		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == '') {
			
			console.log('// Verifying and phoneStatusAuthCode is empty');
			page.step3({link:{url:result.KYCUrl,bool:( result.KYCNeeded || result.kyc_required )},status:'Verifying',date:result.d,cashIn:result.iA+' '+result.iC});
		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == 'Verifying') {
			console.log('// Checking && number confirmed');
			page.step1({request_id:(result.request_id || result.id),phoneId:result.phoneId,phoneNumber:result.phoneNumber});
		} else if(result.s == 'Declined') {
			console.log('// When the verification status is unknown');
			page.step4({status:'Declined',date:result.d,cashIn:result.iA+' '+result.iC});
		} else {
			
			console.log('None of the conditions are met');
			page.step7({status:'Waiting',date:result.d,cashIn:result.iA+' '+result.iC});
		}

		// Обратный отсчет до редиректа partner_url, иначе текст в footer обнуляет
		if(result.partner_url.length > 0 && (result.s == "TimeOut" || result.s == "Declined" || result.s == "Completed" || result.s == "MoneySend")) {
			countdown(15,result);
			$("#videoRecord").hide();
		} else {
			d.querySelector('footer.footer center').style.visibility = 'hidden';
		}

		// LOGO
		$.ajax({
			url: "https://indacoin.com/gw/payment_form.aspx/getUrlInfos",
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


		(() => {
			function copy() {
				let
					range = document.createRange(),
					selection = window.getSelection(),
					greenText = "Address copied...";
				range.selectNodeContents(this);
				selection.removeAllRanges();
				selection.addRange(range);
				document.execCommand('copy');
				window.getSelection().removeAllRanges();
				this.innerHTML = `<font style="color: #2cdcfe;">${greenText}</font>`;
				setTimeout(() => {
					copyURL.innerText = window.location.href;
					copyURL.onclick = copy;
				}, 2500);
				copyURL.onclick = null;
			};
			let copyURL = document.querySelector('.copyURL');
			copyURL.innerText = window.location.href;
			copyURL.onclick = copy;
		})();
		
		(() => {
			let button = document.querySelector('.input .GoToBack');
			if(result.partner_url) {
				button.style.display = 'block';
				let span = document.querySelector('.input .GoToBack .partnerName');
				span.innerText = result.partnerName;
				button.onclick = () => document.location.href = result.partner_url;
			} else {
				button.style.display = 'none';
			}
		})();
		
	});

	// Установка языка
	
	function langSet(id,customLang = null) {
		if(customLang !== null) {
			d.querySelector('#'+id).dataset.translationPath = 'custom.'+customLang;
			return langJson[localStorage.getItem('language').toLocaleUpperCase()].custom[customLang];
		}
		let 
			select = d.querySelector('li.menuLang'),
			langTag = d.querySelectorAll('.lang');
		let dataset = d.querySelectorAll('[data-translation-path]');
		function associations(key) {
			let associations = {
				"ar":"Arabic",
				"de":"German",
				"en":"English",
				"es":"Spanish",
				"fr":"French",
				"it":"Italian",
				"pt":"Portuguese",
				"ru":"Russian",
				"tr":"Turkish",
			};
			return associations[key.toLowerCase()];
		}
		function insertTranslate(set = localStorage.getItem('language') !== null ? localStorage.getItem('language') : 'en') {
			//select.querySelector('font.menuLang').innerText = associations(set);
			for(let i = 0; i < dataset.length; i++) {
				let ds = dataset[i].dataset.translationPath.split('.');
				if(dataset[i].tagName == 'INPUT') {
					dataset[i].placeholder = langJson[set.toUpperCase()][ds[0]][ds[1]];
				} else {
					dataset[i].innerHTML = langJson[set.toUpperCase()][ds[0]][ds[1]];
				}
			}
		}
		insertTranslate();
		
		select.querySelectorAll('li').forEach(function(item,i,arr) {
			item.addEventListener('click',function() {
				insertTranslate( this.dataset.langSelect );
				// Задерживает выбор языка в localStorage на случай перезагрузки страницы
				localStorage.setItem('language', this.dataset.langSelect || this.dataset.langnameShort.toLowerCase()  );
			});
		});

	}
	langSet();

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
			data: "{'phoneId':'" + NotifyData.phoneId + "','confirmation_hash':'" + method.get().confirm_code + "','request_id':'" + method.get().request_id + "'}",
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
		let data = {"d":"{\"id\":7475826,\"d\":\"13.11.2019 19:54:02\",\"s\":\"Verifying\",\"p\":0.0,\"iT\":60,\"iC\":\"USD\",\"iA\":40.00000000,\"iAd\":\"2854339\",\"oT\":44,\"oC\":\"100\",\"oA\":0.00372783,\"oAd\":\"17RJToikwMpBuarmrdgsbtTVtjgWNib7zB\",\"cnf\":-1,\"eP\":\"f1fe0c62-2bc5-4223-9198-d7e61fb58086\",\"pF\":10730.10300000,\"direction\":-1.0,\"verifyPI\":2854339,\"verifyStatus\":1,\"cardId\":178357,\"cardStatus\":\"Verifying\",\"cardAuthCodeStatus\":\"Verifying\",\"cardAuthCode\":\"\",\"card3DS\":\"Secured3Ds\",\"phoneId\":0,\"phoneGatewayList\":0,\"phoneNumber\":\"\",\"smsCode\":\"\",\"phoneStatusAuthCode\":\"\",\"cashoutExternalTransactionId\":\"\",\"verifyStatusAddInfo\":null,\"partner\":null,\"couponId\":0,\"user_id\":698070,\"partner_id\":2177,\"partner_url\":\"\",\"FBreward\":0.00000000,\"TWTreward\":0.00000000,\"gatewayUserId\":\"pastoremik85@gmail.com\",\"partnerName\":\"wikipays\",\"ex_transaction_id\":\"932857\",\"video_verification_id\":-1,\"id_add_status\":0,\"alt_currency_id\":100,\"amount_alt_to_send\":0.00372783,\"phone_count\":1,\"verify_seconds_count\":1500,\"vp_status_outer\":1,\"kyc_required\":0,\"indacoin_score\":\"\\\\\\\\0.348\",\"card_score\":\"{\\\"ip_address\\\":{\\\"risk\\\":0.01,\\\"country\\\":{\\\"is_high_risk\\\":false,\\\"confidence\\\":99,\\\"is_in_european_union\\\":true,\\\"iso_code\\\":\\\"IT\\\",\\\"geoname_id\\\":3175395,\\\"names\\\":{\\\"pt-BR\\\":\\\"Itália\\\",\\\"ru\\\":\\\"Италия\\\",\\\"zh-CN\\\":\\\"意大利\\\",\\\"de\\\":\\\"Italien\\\",\\\"en\\\":\\\"Italy\\\",\\\"es\\\":\\\"Italia\\\",\\\"fr\\\":\\\"Italie\\\",\\\"ja\\\":\\\"イタリア共和国\\\"}},\\\"location\\\":{\\\"local_time\\\":\\\"2019-11-13T08:54:33+01:00\\\",\\\"accuracy_radius\\\":200,\\\"latitude\\\":41.8904,\\\"longitude\\\":12.5124,\\\"time_zone\\\":\\\"Europe/Rome\\\"},\\\"city\\\":{\\\"confidence\\\":10,\\\"geoname_id\\\":3169070,\\\"names\\\":{\\\"de\\\":\\\"Rom\\\",\\\"en\\\":\\\"Rome\\\",\\\"es\\\":\\\"Roma\\\",\\\"fr\\\":\\\"Rome\\\",\\\"ja\\\":\\\"ローマ\\\",\\\"pt-BR\\\":\\\"Roma\\\",\\\"ru\\\":\\\"Рим\\\",\\\"zh-CN\\\":\\\"罗马市\\\"}},\\\"continent\\\":{\\\"code\\\":\\\"EU\\\",\\\"geoname_id\\\":6255148,\\\"names\\\":{\\\"pt-BR\\\":\\\"Europa\\\",\\\"ru\\\":\\\"Европа\\\",\\\"zh-CN\\\":\\\"欧洲\\\",\\\"de\\\":\\\"Europa\\\",\\\"en\\\":\\\"Europe\\\",\\\"es\\\":\\\"Europa\\\",\\\"fr\\\":\\\"Europe\\\",\\\"ja\\\":\\\"ヨーロッパ\\\"}},\\\"postal\\\":{\\\"confidence\\\":1,\\\"code\\\":\\\"00179\\\"},\\\"registered_country\\\":{\\\"is_in_european_union\\\":true,\\\"iso_code\\\":\\\"IT\\\",\\\"geoname_id\\\":3175395,\\\"names\\\":{\\\"ja\\\":\\\"イタリア共和国\\\",\\\"pt-BR\\\":\\\"Itália\\\",\\\"ru\\\":\\\"Италия\\\",\\\"zh-CN\\\":\\\"意大利\\\",\\\"de\\\":\\\"Italien\\\",\\\"en\\\":\\\"Italy\\\",\\\"es\\\":\\\"Italia\\\",\\\"fr\\\":\\\"Italie\\\"}},\\\"subdivisions\\\":[{\\\"confidence\\\":30,\\\"iso_code\\\":\\\"62\\\",\\\"geoname_id\\\":3174976,\\\"names\\\":{\\\"ru\\\":\\\"Лацио\\\",\\\"zh-CN\\\":\\\"拉齐奥\\\",\\\"de\\\":\\\"Latium\\\",\\\"en\\\":\\\"Latium\\\",\\\"es\\\":\\\"Lacio\\\",\\\"fr\\\":\\\"Latium\\\",\\\"ja\\\":\\\"ラツィオ州\\\",\\\"pt-BR\\\":\\\"Lácio\\\"}},{\\\"iso_code\\\":\\\"RM\\\",\\\"geoname_id\\\":3169069,\\\"names\\\":{\\\"de\\\":\\\"Rom\\\",\\\"en\\\":\\\"Rome\\\",\\\"es\\\":\\\"Roma\\\",\\\"fr\\\":\\\"Rome\\\"}}],\\\"traits\\\":{\\\"static_ip_score\\\":1,\\\"user_type\\\":\\\"cellular\\\",\\\"autonomous_system_number\\\":1267,\\\"autonomous_system_organization\\\":\\\"Wind Tre S.p.A.\\\",\\\"domain\\\":\\\"infuturo.it\\\",\\\"isp\\\":\\\"Wind Tre\\\",\\\"organization\\\":\\\"WindTre\\\",\\\"ip_address\\\":\\\"151.19.33.181\\\",\\\"network\\\":\\\"151.19.33.176/28\\\"}},\\\"credit_card\\\":{\\\"issuer\\\":{\\\"name\\\":\\\"Skrill\\\",\\\"phone_number\\\":\\\"442033082520\\\"},\\\"brand\\\":\\\"Mastercard\\\",\\\"country\\\":\\\"GB\\\",\\\"is_issued_in_billing_address_country\\\":false,\\\"is_prepaid\\\":true,\\\"is_virtual\\\":false,\\\"type\\\":\\\"debit\\\"},\\\"email\\\":{\\\"first_seen\\\":\\\"2019-11-01\\\",\\\"is_free\\\":true,\\\"is_high_risk\\\":false},\\\"shipping_address\\\":{\\\"latitude\\\":43.1479,\\\"longitude\\\":12.1097,\\\"distance_to_ip_location\\\":143,\\\"distance_to_billing_address\\\":0,\\\"is_in_ip_country\\\":true},\\\"billing_address\\\":{\\\"latitude\\\":43.1479,\\\"longitude\\\":12.1097,\\\"distance_to_ip_location\\\":143,\\\"is_in_ip_country\\\":true},\\\"id\\\":\\\"c22127d8-bad0-4583-96b6-370d982c68b5\\\",\\\"risk_score\\\":77.44,\\\"funds_remaining\\\":5.096,\\\"queries_remaining\\\":339}\",\"emailage_score\":\"{\\\"userdefinedrecordid\\\":\\\"\\\",\\\"email\\\":\\\"pastoremik85@gmail.com\\\",\\\"ipaddress\\\":\\\"151.19.33.181\\\",\\\"eName\\\":\\\"\\\",\\\"emailAge\\\":\\\"\\\",\\\"email_creation_days\\\":\\\"\\\",\\\"domainAge\\\":\\\"1995-08-13T04:00:00Z\\\",\\\"domain_creation_days\\\":\\\"8857\\\",\\\"firstVerificationDate\\\":\\\"2019-11-01T21:04:10Z\\\",\\\"first_seen_days\\\":\\\"11\\\",\\\"lastVerificationDate\\\":\\\"2019-11-01T21:04:10Z\\\",\\\"status\\\":\\\"Verified\\\",\\\"country\\\":\\\"US\\\",\\\"fraudRisk\\\":\\\"500 Moderate\\\",\\\"EAScore\\\":\\\"500\\\",\\\"EAReason\\\":\\\"Limited History for Email\\\",\\\"EAStatusID\\\":\\\"2\\\",\\\"EAReasonID\\\":8,\\\"EAAdviceID\\\":\\\"4\\\",\\\"EAAdvice\\\":\\\"Moderate Fraud Risk\\\",\\\"EARiskBandID\\\":\\\"3\\\",\\\"EARiskBand\\\":\\\"Fraud Score 301 to 600\\\",\\\"dob\\\":\\\"\\\",\\\"gender\\\":\\\"\\\",\\\"location\\\":\\\"\\\",\\\"smfriends\\\":\\\"\\\",\\\"totalhits\\\":\\\"2\\\",\\\"uniquehits\\\":\\\"2\\\",\\\"imageurl\\\":\\\"\\\",\\\"emailExists\\\":\\\"Yes\\\",\\\"domainExists\\\":\\\"Yes\\\",\\\"company\\\":\\\"\\\",\\\"title\\\":\\\"\\\",\\\"billriskcountry\\\":\\\"No\\\",\\\"source_industry\\\":\\\"\\\",\\\"fraud_type\\\":\\\"\\\",\\\"fraudemail\\\":null,\\\"fraudphone\\\":null,\\\"fraudaddress\\\":null,\\\"fraudpostal\\\":null,\\\"fraudzip\\\":null,\\\"addressmatch\\\":null,\\\"postalcity\\\":null,\\\"postalregion\\\":null,\\\"transidentifier\\\":null,\\\"customeridentifiermatch\\\":null,\\\"namematch\\\":\\\"U\\\",\\\"domainname\\\":\\\"gmail.com\\\",\\\"domaincompany\\\":\\\"Google\\\",\\\"domaincountryname\\\":\\\"United States\\\",\\\"domaincategory\\\":\\\"Webmail\\\",\\\"domaincorporate\\\":\\\"No\\\",\\\"domainrisklevel\\\":\\\"Moderate\\\",\\\"domainrelevantinfo\\\":\\\"Valid Webmail Domain from United States\\\",\\\"domainrisklevelID\\\":\\\"3\\\",\\\"domainrelevantinfoID\\\":\\\"508\\\",\\\"domaincountrymatch\\\":\\\"No\\\",\\\"domainriskcountry\\\":\\\"No\\\",\\\"smlinks\\\":[],\\\"ip_risklevelid\\\":\\\"3\\\",\\\"ip_risklevel\\\":\\\"Moderate\\\",\\\"ip_riskreasonid\\\":\\\"311\\\",\\\"ip_riskreason\\\":\\\"Moderate By Proxy Reputation And Country Code\\\",\\\"ip_reputation\\\":\\\"Good\\\",\\\"ip_anonymousdetected\\\":\\\"No\\\",\\\"ip_isp\\\":\\\"wind tres.p.a.\\\",\\\"ip_org\\\":\\\"\\\",\\\"ip_userType\\\":\\\"mobile\\\",\\\"ip_netSpeedCell\\\":\\\"broadband\\\",\\\"ip_corporateProxy\\\":\\\"No\\\",\\\"ip_continentCode\\\":\\\"eu\\\",\\\"ip_country\\\":\\\"Italy\\\",\\\"ip_countryCode\\\":\\\"IT\\\",\\\"ip_countryconf\\\":\\\"99\\\",\\\"ip_region\\\":\\\"perugia\\\",\\\"ip_regionconf\\\":\\\"99\\\",\\\"ip_city\\\":\\\"perugia\\\",\\\"ip_cityconf\\\":\\\"99\\\",\\\"ip_postalcode\\\":\\\"06129\\\",\\\"ip_postalconf\\\":\\\"99\\\",\\\"ip_callingcode\\\":\\\"\\\",\\\"ip_metroCode\\\":\\\"\\\",\\\"ip_riskscore\\\":\\\"\\\",\\\"ip_latitude\\\":\\\"43.0668\\\",\\\"ip_longitude\\\":\\\"12.3558\\\",\\\"ip_map\\\":\\\"https://app.emailage.com/query/GoogleMaps?latLng=43.0668,12.3558\u0026radius=\u0026title=perugia,perugia,Italy\\\",\\\"ipcountrymatch\\\":\\\"Yes\\\",\\\"ipriskcountry\\\":\\\"\\\",\\\"ipdistancekm\\\":null,\\\"ipdistancemil\\\":null,\\\"ipaccuracyradius\\\":null,\\\"iptimezone\\\":\\\"100\\\",\\\"ipasnum\\\":\\\"1267 wind telecomunicazioni spa\\\",\\\"ipdomain\\\":\\\"infuturo.it\\\",\\\"custphoneInbillingloc\\\":\\\"Not Found\\\",\\\"shipforward\\\":\\\"\\\",\\\"citypostalmatch\\\":\\\"\\\",\\\"shipcitypostalmatch\\\":\\\"\\\",\\\"deviceIdRiskLevel\\\":null,\\\"lastflaggedon\\\":\\\"\\\",\\\"phone_status\\\":\\\"Valid\\\",\\\"phoneowner\\\":null,\\\"phoneownertype\\\":null,\\\"phonecarriertype\\\":null,\\\"phonecarriernetworkcode\\\":null,\\\"phonecarriername\\\":null,\\\"phoneownermatch\\\":null,\\\"ip_proxytype\\\":\\\"\\\",\\\"ip_proxydescription\\\":\\\"\\\",\\\"issuerBank\\\":null,\\\"issuerBrand\\\":null,\\\"issuerCountry\\\":null,\\\"cardCategory\\\":null,\\\"cardType\\\":null}\",\"requests_count\":0,\"kycTemp\":698070,\"KYCUrl\":\"https://indacoin.com/iframe/kyc_frame_new.aspx?access_token={at}\u0026user_id=56285\u0026lang=en\",\"KYCNeeded\":true}"}
		resolve( JSON.parse(data.d) );
		/*
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
					window.NotifyData = NotifyData;
					if (NotifyData.s != "TimeOut" && NotifyData.s != "Declined" && NotifyData.s != "Completed" && NotifyData.s != "MoneySend")
						setTimeout(function () {
								receiveData();
						}, ((NotifyData.s == "Verifying" && NotifyData.verify_seconds_count < 20)?10000:30000));
						
					if(NotifyData.id_add_status && NotifyData.id_add_status > 0) {
						$("#videoRecord").show();
					} else {
						$("#videoRecord").hide();
					}
				}
			});
		})();
		*/
		
	}

});