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
				let arr = [0,1,2];
				if(obj.reasonText) {
					arr.push(4);
				}
				this.display(...arr);
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
				let arr = [0,1,2];
				if(obj.reasonText) {
					arr.push(4);
				}
				this.display(...arr);
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
		// page.visiblePage(0);
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
			//console.log('// When everything is completed successfully');
			mobgetcurrenciesinfo(result).then(function(data) {
				let status = {status:(
					result.s == 'MoneySend' ? langSet('status','MoneySend') : result.s
				)};
				ym(56424850, 'reachGoal', 'successful_buying');
				
				if(result.iC === data.fee) {
					var send = {date:result.d,cashIn:result.iA+' '+result.iC};
					page.step5_2(Object.assign(status,send));
				} else {
					var send = {date:result.d,cashIn:result.iA+' '+result.iC,cashOut:data.summ + ' ' + data.fee};
					page.step5(Object.assign(status,send));
				}
			});
		} else if(result.s == 'TimeOut' || result.card3DS == 'Half3Ds') {
			//console.log('// When failure');
			if(esult.card3DS == 'Half3Ds') {
				ym(56424850, 'reachGoal', 'other_rejected');
			}
			let obj = {status:'Declined',date:result.d,cashIn:result.iA+' '+result.iC}
			if(result.reason_text) {
				obj.reasonText = result.reason_text;
			}
			page.step6(obj);
			


		} else if(result.cardStatus == 'Declined' || result.vp_status_outer < 0) {
			//console.log('// When refusal due to lack of need to enter SMS confirmation');
			ym(56424850, 'reachGoal', 'bank_rejected');
			let obj = {status:'Denied by bank',date:result.d,cashIn:result.iA+' '+result.iC};
			if(result.reason_text) {
				obj.reasonText = result.reason_text;
			}
			page.step6(obj);


		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == '') {
			//console.log('// Verifying and phoneStatusAuthCode is empty');
			ym(56424850, 'reachGoal', 'bank_rejected');
			if(!(result.KYCNeeded || result.kyc_required)) {
				ym(56424850, 'reachGoal', 'kyc_failure');
			}

			page.step3({link:{url:result.KYCUrl,bool:( result.KYCNeeded || result.kyc_required )},status:'Verifying',date:result.d,cashIn:result.iA+' '+result.iC});


		} else if(result.s == 'Verifying' && result.phoneStatusAuthCode == 'Verifying') {
			//console.log('// Checking && number confirmed');
			page.step1({request_id:(result.request_id || result.id),phoneId:result.phoneId,phoneNumber:result.phoneNumber});


		} else if(result.s == 'Declined') {
			//console.log('// When the verification status is unknown');
			ym(56424850, 'reachGoal', 'another_rejected');
			let obj = {status:'Declined',date:result.d,cashIn:result.iA+' '+result.iC};
			if(result.reason_text) {
				obj.reasonText = result.reason_text;
			}
			page.step4(obj);


		} else {
			//console.log('None of the conditions are met');
			ym(56424850, 'reachGoal', 'another_rejected');
			page.step7({status:'Waiting',date:result.d,cashIn:result.iA+' '+result.iC});
		}

		// Обратный отсчет до редиректа partner_url, иначе текст в footer обнуляет
		if(result.partner_url.length > 0 && (result.s == "TimeOut" || result.s == "Declined" || result.s == "Completed" || result.s == "MoneySend")) {
			countdown(15,result);
			$("#videoRecord").hide();
		} else {
			d.querySelector('footer.footer center').style.visibility = 'hidden';
		}

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
		
		let getUrlInfos = new Promise(resolve => {
			$.ajax({
				url: "https://indacoin.com/gw/payment_form.aspx/getUrlInfos",
				type: "post",
				async: true,
				contentType: "application/json; charset=utf-8",
				crossDomain: false,
				dataType: "json",
				data: JSON.stringify({
				partner: result.partnerName || result.partner
				}),
				success: (data) => {
					resolve(data.d);
				} 
			});
		});
		
		getUrlInfos.then(data => {
			console.log(789,data)
			let button = document.querySelector('.input .GoToBack');
			if(result.partner_url) {
				button.style.display = 'block';
				let span = document.querySelector('.input .GoToBack .partnerName');
				span.innerText = data.visible_name || result.partnerName || result.partner;

				button.onclick = () => document.location.href = result.partner_url.indexOf('transaction_id') > -1
				? result.partner_url
				: result.partner_url + `${result.ex_transaction_id && `?transaction_id=${result.ex_transaction_id}`}`;
			} else {
				button.style.display = 'none';
			}
		});

		// LOGO
		getUrlInfos.then(data => {
			const { error_url, logo_url } = data;
			$(".proccesing-form__text_cancel-payment").attr("href", error_url)
			$(".header__logo-img").attr("alt", result.partner);
			$(".header__logo-img").attr("src",`${location.origin}/${logo_url}`);
		});
		
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
		/*let data = {"d":"{\"id\":7475235,\"d\":\"12.11.2019 12:21:34\",\"s\":\"Declined\",\"p\":0.0,\"iT\":60,\"iC\":\"USD\",\"iA\":50.00000000,\"iAd\":\"2853509\",\"oT\":44,\"oC\":\"USD\",\"oA\":42.50000000,\"oAd\":\"\",\"cnf\":-1,\"eP\":\"38d8ffb1-b104-408e-91e8-96db8a6411f3\",\"pF\":1.17650000,\"direction\":-1.0,\"verifyPI\":2853509,\"verifyStatus\":-1,\"cardId\":178135,\"cardStatus\":\"Declined\",\"cardAuthCodeStatus\":\"Verifying\",\"cardAuthCode\":\"\",\"card3DS\":\"Secured3Ds\",\"phoneId\":179692,\"phoneGatewayList\":16,\"phoneNumber\":\"972526952**\",\"smsCode\":\"****\",\"phoneStatusAuthCode\":\"Verifying\",\"cashoutExternalTransactionId\":\"\",\"verifyStatusAddInfo\":null,\"partner\":null,\"couponId\":0,\"user_id\":697768,\"partner_id\":1009,\"partner_url\":\"\",\"FBreward\":0.00000000,\"TWTreward\":0.00000000,\"gatewayUserId\":\"user_1383394\",\"partnerName\":\"waves\",\"ex_transaction_id\":\"932260\",\"video_verification_id\":-1,\"id_add_status\":0,\"alt_currency_id\":2,\"amount_alt_to_send\":50.00000000,\"phone_count\":4,\"verify_seconds_count\":173957,\"vp_status_outer\":-1,\"kyc_required\":0,\"indacoin_score\":\"\\\\\\\\0.132\\\\\\\\0.136\",\"card_score\":\"{\\\"ip_address\\\":{\\\"risk\\\":0.01,\\\"country\\\":{\\\"is_high_risk\\\":false,\\\"confidence\\\":99,\\\"iso_code\\\":\\\"IL\\\",\\\"geoname_id\\\":294640,\\\"names\\\":{\\\"ja\\\":\\\"イスラエル国\\\",\\\"pt-BR\\\":\\\"Israel\\\",\\\"ru\\\":\\\"Израиль\\\",\\\"zh-CN\\\":\\\"以色列\\\",\\\"de\\\":\\\"Israel\\\",\\\"en\\\":\\\"Israel\\\",\\\"es\\\":\\\"Israel\\\",\\\"fr\\\":\\\"Israël\\\"}},\\\"location\\\":{\\\"local_time\\\":\\\"2019-11-12T14:22:00+02:00\\\",\\\"accuracy_radius\\\":50,\\\"latitude\\\":32.0678,\\\"longitude\\\":34.7647,\\\"time_zone\\\":\\\"Asia/Jerusalem\\\"},\\\"city\\\":{\\\"confidence\\\":10,\\\"geoname_id\\\":293397,\\\"names\\\":{\\\"ru\\\":\\\"Тель-Авив\\\",\\\"zh-CN\\\":\\\"特拉维夫\\\",\\\"de\\\":\\\"Tel Aviv\\\",\\\"en\\\":\\\"Tel Aviv\\\",\\\"es\\\":\\\"Tel Aviv\\\",\\\"fr\\\":\\\"Tel-Aviv\\\",\\\"ja\\\":\\\"テルアビブ\\\",\\\"pt-BR\\\":\\\"Tel Aviv\\\"}},\\\"continent\\\":{\\\"code\\\":\\\"AS\\\",\\\"geoname_id\\\":6255147,\\\"names\\\":{\\\"zh-CN\\\":\\\"亚洲\\\",\\\"de\\\":\\\"Asien\\\",\\\"en\\\":\\\"Asia\\\",\\\"es\\\":\\\"Asia\\\",\\\"fr\\\":\\\"Asie\\\",\\\"ja\\\":\\\"アジア\\\",\\\"pt-BR\\\":\\\"Ásia\\\",\\\"ru\\\":\\\"Азия\\\"}},\\\"registered_country\\\":{\\\"iso_code\\\":\\\"IL\\\",\\\"geoname_id\\\":294640,\\\"names\\\":{\\\"fr\\\":\\\"Israël\\\",\\\"ja\\\":\\\"イスラエル国\\\",\\\"pt-BR\\\":\\\"Israel\\\",\\\"ru\\\":\\\"Израиль\\\",\\\"zh-CN\\\":\\\"以色列\\\",\\\"de\\\":\\\"Israel\\\",\\\"en\\\":\\\"Israel\\\",\\\"es\\\":\\\"Israel\\\"}},\\\"subdivisions\\\":[{\\\"confidence\\\":20,\\\"iso_code\\\":\\\"TA\\\",\\\"geoname_id\\\":293396,\\\"names\\\":{\\\"en\\\":\\\"Tel Aviv\\\",\\\"fr\\\":\\\"Tel-Aviv\\\"}}],\\\"traits\\\":{\\\"static_ip_score\\\":0.6,\\\"user_count\\\":1,\\\"user_type\\\":\\\"cellular\\\",\\\"autonomous_system_number\\\":1680,\\\"autonomous_system_organization\\\":\\\"Cellcom Fixed Line Communication L.P.\\\",\\\"isp\\\":\\\"013 Netvision\\\",\\\"organization\\\":\\\"013 Netvision\\\",\\\"ip_address\\\":\\\"109.253.166.65\\\",\\\"network\\\":\\\"109.253.166.64/31\\\"}},\\\"credit_card\\\":{\\\"issuer\\\":{\\\"name\\\":\\\"EUROPAY (EUROCARD) ISRAEL LTD.\\\",\\\"matches_provided_name\\\":true,\\\"phone_number\\\":\\\"972 3 636 46 36\\\"},\\\"brand\\\":\\\"Mastercard\\\",\\\"country\\\":\\\"IL\\\",\\\"is_issued_in_billing_address_country\\\":true,\\\"is_prepaid\\\":false,\\\"is_virtual\\\":false,\\\"type\\\":\\\"credit\\\"},\\\"shipping_address\\\":{\\\"latitude\\\":31.5,\\\"longitude\\\":34.75,\\\"distance_to_ip_location\\\":63,\\\"distance_to_billing_address\\\":0,\\\"is_in_ip_country\\\":true},\\\"billing_address\\\":{\\\"latitude\\\":31.5,\\\"longitude\\\":34.75,\\\"distance_to_ip_location\\\":63,\\\"is_in_ip_country\\\":true},\\\"id\\\":\\\"4cf7d25c-6ae2-442d-ba40-3d72407a75d1\\\",\\\"risk_score\\\":1.12,\\\"funds_remaining\\\":9.22,\\\"queries_remaining\\\":614}\",\"emailage_score\":\"\",\"requests_count\":0,\"reason_text\":\"\",\"KYCUrl\":\"\"}"}
		resolve( JSON.parse(data.d) );*/
		
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
		
		
		
	}

});