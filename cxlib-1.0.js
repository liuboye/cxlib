/**
 * The Javascript library For ComingX
 * Developed By:LBY
 * url: http://www.comingx.com,http://www.liuboye.com
 **/
(function() {
	var Cx = {
		/** Ajax请求* */
		Ajax : {
			Setup : function() {
				$.ajaxSetup({
							beforeSend : function() {
								$("#ajax-img").css({"display":""});
							},
							complete : function(XMLHttpRequest) {
								$("#ajax-img").css({"display":"none"});
								var sessionstatus = XMLHttpRequest
										.getResponseHeader("Session-Status");
								var aclstatus = XMLHttpRequest
										.getResponseHeader("Acl-Status");
								if (sessionstatus == "timeout") {
									window.location.href = "/user/user/login";
								}
								if (aclstatus == "deny") {
									Cx.Notify.ShowError("对不起，您没有权限进行此操作");
								}
							}
						});
			},
			Send : function(arg) {
				if (typeof(arg) != "object") {
					Cx.Notify.ShowError();
					return false;
				}
				var action = {
					"type" : "GET",
					"url" : "",
					"data" : "",
					"dataType" : "json",
					"redirect" : false,
					"redirectUrl" : "",
					"redirectTime" : 2200,
					"back" : false,
					"backTime" : 2200,
					"reload" : false,
					"reloadTime" : 2200,
					"btnDisabled" : false,
					"btn" : "",
					"message" : "操作成功",
					"callback" : Cx.Ajax.AjaxCallBack,
					"callbackStop" : false
				};
				$.extend(true, action, arg);
				action.btn && action.btn.attr("disabled", "disabled");
				$.ajax({
					type : action.type,
					url : action.url,
					data : action.data,
					dataType : action.dataType,
					success : function(result) {
						if (result.error == 0) {
							action.callback(result);
							if (action.callbackStop)
								return true;
							Cx.Notify.ShowSuccess(action.message);
							if (action.redirect) {
								setTimeout("window.location.href='"
												+ action.redirectUrl + "'",
										action.redirectTime);
							} else {
								if (action.back) {
									setTimeout("window.history.back;",
											action.backTime);
								} else {
									if (action.reload) {
										setTimeout("window.location.reload();",
												action.reloadTime);
									}
									action.btn
											&& setTimeout(
													Cx.Dom
															.SelfRemoveDisableAttr(action.btn),
													2000);
								}
							}
							return true;
						} else {
							Cx.Notify.ShowError(result.error);
							action.btn && action.btn.removeAttr("disabled");
							return false;
						}
					},
					error : function() {
						Cx.Notify.ShowInfo("操作失败");
						action.btn && action.btn.removeAttr("disabled");
						return false;
					}
				});
			},
			AjaxCallBack : function() {
				return;
			},
			updateCache : function(id, path) {
				if (!Cx.Object.checkArgumentsExist(arguments)) {
					showErrorMessage();
					return false;
				}
				Cx.Ajax.Send({
							"message" : "缓存更新成功",
							"data" : {
								cacheId : id,
								cachePath : path
							},
							"url" : "/core/cache/clean-cache-by-id",
							"reload" : true
						});
				return;
			}
		},
/** End-Ajax请求* */
		/** Object操作* */
		Object : {
			Array : {
				Sort : function(obj, key, flag) {
					var rs = obj;
					rs = rs.sort(function(a, b) {
								if (flag) { // 正序
									return a[key] - b[key];
								} else { // 倒序
									return b[key] - a[key];
								}
							});
					return rs;
				}
			},
			InArray : function(needle, array, bool) {
				if (typeof needle == "string" || typeof needle == "number") {
					var len = array.length;
					for (var i = 0; i < len; i++) {
						if (needle === array[i]) {
							if (bool) {
								return i;
							}
							return true;
						}
					}
				}
				return false;
			},
			ToArray : function(obj) {
				var result = new Array();
				result.push();
				if (typeof obj != "object") {
					return result;
				}
				for (key in obj) {
					result.push(obj[key]);
				};
				return result;
			},
			RemoveByKey : function(obj, key) {
				for (k in obj) {
					if (k == key) {
						delete obj[k];
					}
				}
			},
			ConsoleList : function(obj) {
				for (key in obj) {
					console.log(typeof obj[key]);
					console.log(obj[key]);
				}
			},
			checkArgumentsExist : function(arguments, length) {
				if (len = arguments.length < length)
					return false;
				for (var i = 0; i < len; i++) {
					if (arguments[i] == "undefined" || arguments[i] == "") {
						return false;
					}
				}
				return true;
			},
			Equal : function(obj1, obj2) {
				if (typeof arguments[0] != typeof arguments[1])
					return false;
				if (arguments[0] === arguments[1])
					return true;
				if (arguments[0] instanceof Object
						&& arguments[1] instanceof Object) {
					for (var key in arguments[0]) {
						if (arguments[0].hasOwnProperty(key)) {
							if (!arguments[1].hasOwnProperty(key))
								return false;
							if (arguments[0][key] === arguments[1][key])
								continue;
							if (typeof arguments[0][key] !== "object")
								return false;
							if (!arguments.callee(arguments[0][key],
									arguments[1][key]))
								return false;
						}
					}
					for (key in arguments[1]) {
						if (arguments[1].hasOwnProperty(key)
								&& !arguments[0].hasOwnProperty(key))
							return false;
					}
					return true;
				}
				return false;
			}
		},
		/** 窗口window操作* */
		Window : {
			BackToPage : function() {
				$("#backPage").click(function() {
							window.history.back();
						});
			},
			FileLoader : {
				isCss : function(file) {
					var att = file.split('.');
					var sub = att[att.length - 1].toLowerCase().substring(0, 3);
					return sub == "css";
				},
				LoadCss : function(file) {
					var oldLinks = document.getElementsByTagName("link");
					for (var i = 0; i < oldLinks.length; i++) {
						if (oldLinks[i].href
								&& oldLinks[i].href.indexOf(file) != -1) {
							return;
						}
					}
					/* 创建link */
					var newCss = document.createElement("link");
					newCss.setAttribute("type", "text/css");
					newCss.setAttribute("rel", "stylesheet");
					newCss.setAttribute("href", file);
					return newCss;
				},
				LoadJs : function(file) {
					var oldScripts = document.getElementsByTagName("script");
					for (var i = 0; i < oldScripts.length; i++) {
						if (oldScripts[i].src
								&& oldScripts[i].src.indexOf(file) != -1) {
							return false;
						}
					}
					/* 创建script */
					var newScript = document.createElement("script");
					newScript.setAttribute("type", "text/javascript");
					newScript.setAttribute("src", file);
					return newScript;
				},
				SelfInsertFile : function(newFile) {
					return function() {
						Cx.Window.FileLoader.InsertFile(newFile);
					}
				},
				InsertFile : function(newFile) {
					var head = document.getElementsByTagName("head")[0];
					head.appendChild(newFile);
					var self = this;
					newFile.onload = newFile.onreadystatechange = function() {
						if (this.readyState && this.readyState == "loading") {
							return;
						}
						self.OnSuccess();
					}
					newFile.onerror = function() {
						head.removeChild(newFile);
						self.OnFailure();
					}
				},
				Load : function(files, duration, random, callback) {
					var files = typeof files == "string" ? [files] : files;
					var newFile, file;
					for (var i = 0; i < files.length; i++) {
						file = files[i];
						if (random) {
							if (file.indexOf("?") == -1) {
								file = file + "?t="
										+ parseInt(Math.random() * 1000);
							} else {
								file = file + "&t="
										+ parseInt(Math.random() * 1000);
							}
						}
						if (this.isCss(file)) {
							if (!(newFile = this.LoadCss(file)))
								continue;
						} else {
							if (!(newFile = this.LoadJs(file)))
								continue;
						}
						if (duration) {
							setTimeout(this.SelfInsertFile(newFile), duration);
						} else {
							this.InsertFile(newFile);
						}
					}
					if (callback) {
						callback();
					}
					return;

				},
				OnSuccess : function() {
					return;
				},
				OnFailure : function() {
					return;
				},
				DefaultSuccess : function() {
					return;
				}
			}

		},
/** End-窗口window操作* */
		/** Dom操作* */
		Dom : {
			AppendAjaxImage : function(){
				var html = "<div id='ajax-img' style='display:none'></div>";
				$("h1.heading").append(html);
			},
			RequireCreated : function() {
				$("div.required").find("label:first")
						.prepend("<font class='need' title='此项必填'>*</font>");
			},
			ChangeOkOrNo : function(e) {
				if (e.hasClass("splashy-gem_okay")) {
					e.removeClass("splashy-gem_okay")
							.addClass("splashy-gem_remove");
				} else {
					e.removeClass("splashy-gem_remove")
							.addClass("splashy-gem_okay");
				}
			},
			SwitchClass : function(e, c1, c2) {
				if (e.hasClass(c1)) {
					e.removeClass(c1).addClass(c2);
				} else {
					e.removeClass(c2).addClass(c1);
				}
			},
			SwitchAttr : function(e, attribute, val1, val2) {
				if (e.attr(attribute) == val1) {
					e.attr(attribute, val2);
				} else {
					e.attr(attribute, val1);
				}
			},
			AddDisableAttr : function(e) {
				e.attr("disabled", "disabled");
			},
			RemoveDisableAttr : function(e) {
				e.removeAttr("disabled");
			},
			SelfRemoveDisableAttr : function(e) {
				return function() {
					Cx.Dom.RemoveDisableAttr(e);
				};
			}
		},
/** End-Dom操作* */
		/** Form操作* */
		Form : {
			GetRadioValue : function(radioName) {
				var Radio = $("input[name='" + radioName + "']")
						.filter(':checked');
				if (Radio.length) {
					return Radio.val();
				}
				return null;
			},
			GetCheckBoxValueByArray : function(checkBoxName,digitFlag){
				var result = new Array();
				var chx = $("input[name='" + checkBoxName + "']:checkbox");
				var len = chx.length;
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						if (chx[i].checked) {
							var tmp = chx[i].value;
							if(digitFlag && !isNaN(tmp)){
								result.push(tmp);
							}
						}
					}
				}
				return result;
			},
			GetCheckBoxValue : function(checkBoxName, sign, flag) {
				var str = "";
				var separate = sign ? sign : ",";
				var chx = $("input[name='" + checkBoxName + "']:checkbox");
				var len = chx.length;
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						if (chx[i].checked) {
							str += separate + chx[i].value;
						}
					}
				}
				if (str == "") {
					return null;
				}
				return str.substring(1);
			},
			FetchAll : function(e, f) {
				var params = new Object();
				var formEle = (typeof e == "object") ? e : $("#" + e);
				var flag = (typeof f == "boolean") ? f : true;
				var formInputs = formEle.children(".form-input");
				var len = formInputs.length;
				if (len == 0) {
					return params;
				};
				var groupObj, controlsObj, inputObj, inputKey, inputVal, validation;
				this.setInputObj = function() {
					(inputObj = controlsObj.find("input:first")).length
							|| (inputObj = controlsObj.find("textarea:first")).length
							|| (inputObj = controlsObj.find("select:first")).length;
				};
				this.setInputKey = function() {
					return inputKey = inputObj.attr("id")
							|| inputObj.attr("name");
				};
				this.setInputVal = function() {
					if (type = inputObj.attr("type")) {
						if (type == "radio") {
							return inputVal = Cx.Form.GetRadioValue(inputKey);
						} else if (type == "checkbox") {
							return inputVal = Cx.Form.GetCheckBoxValue(inputKey);
						}
					}
					return inputVal = inputObj.val();
				};
				for (var i = 0; i < len; i++) {
					groupObj = formInputs.eq(i);
					controlsObj = groupObj.find("div.controls");
					this.setInputObj();
					if (!inputObj)
						continue;
					this.setInputKey();
					if (!inputKey)
						continue;
					this.setInputVal();
					if (flag) {
						validation = groupObj.attr("validation");
						if (!Cx.Validation.IsValid(inputVal, validation)) {
							this.ErrorShow(groupObj, inputObj);
							setTimeout(this.ErrorRemove(groupObj), 2000);
							return false;
						}
					}
					params[inputKey] = inputVal;
				}
				return params;
			},
			ErrorShow : function(groupObj, inputObj) {
				inputObj.focus();
				groupObj.addClass("error");
				var errorObj = groupObj.find("label");
				var errorSelfInfo = groupObj.attr("data-error");
				var errorMsg = Cx.Validation.GetError();
				var errorTitle = errorSelfInfo ? errorSelfInfo : errorMsg;
				errorObj.tooltip({
							"title" : errorTitle,
							"trigger" : "click",
							"placement" : "top-right"
						});
				errorObj.tooltip("show");
			},
			ErrorRemove : function(groupObj) {
				return function() {
					groupObj.removeClass("error");
					groupObj.find("label").tooltip("destroy");
				};
			}
		},
/** End-Form操作* */
		/** Table操作* */
		Table : {
			TrsSelectAll : function() {
				var chx = $("table tr td").find("input.selectBox");
				var len = chx.length;
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						chx[i].checked = !chx[i].checked;
					}
				}
				return;
			},
			TrsSelectNone : function() {
				var chx = $("table tr td").find("input.selectBox");
				var len = chx.length;
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						if (chx[i].checked) {
							chx[i].checked = !chx[i].checked;
						}
					}
				}
				return;
			},
			GetTrsSelected : function() {
				var chx = $("table tr td").find("input.selectBox");
				var len = chx.length;
				var str = "";
				if (len > 0) {
					for (var i = 0; i < len; i++) {
						if (chx[i].checked) {
							str += "," + chx[i].value;
						}
					}
				}
				if (str == "") {
					return null;
				}
				return str.substring(1);
			}
		},
/** End-Table操作* */
		/** 消息notify */
		Notify : {
			init : function(message, type, autoClose, duration) {
				var duration = typeof(duration) == 'undefined' ? 2 : duration;
				Cx.External.Notification.Show({
							type : type,
							message : message,
							autoClose : autoClose,
							duration : duration
						});
				return;
			},
			ShowWarning : function(message, duration) {
				var msg = typeof(message) == "undefined" ? "警告" : message;
				Cx.Notify.init(msg, "warning", true, duration);
				return true;
			},
			ShowInfo : function(message, duration) {
				var msg = typeof(message) == "undefined" ? "提示" : message;
				Cx.Notify.init(msg, "information", true, duration);
				return true;
			},
			ShowSuccess : function(message, duration) {
				var msg = typeof(message) == "undefined" ? "操作成功" : message;
				Cx.Notify.init(msg, "success", true, duration);
				return true;
			},
			ShowError : function(message, duration) {
				var msg = typeof(message) == "undefined" ? "操作失败" : message;
				Cx.Notify.init(msg, "error", true, duration);
				return true;
			},
			CloseInfo : function(duration){
				Cx.External.Notification.Close(duration);
				return;
			}
		},
/** End-消息notify */
		/** Validation验证 */
		Validation : {
			ruleName : "", // 验证名称
			param : "", // 验证参数
			value : "", // 要验证的值
			error : "", // 错误信息
			Init : function(value, validations) {
				return this;
			},
			IsValid : function(value, validations) {
				var type = typeof validations;
				if (type == "undefined")
					return true;
				validations = type == "string"
						? eval("(" + validations + ")")
						: validations;
				this.value = value;
				for (key in validations) {
					this.param = validations[key];
					this.ruleName = key.toLowerCase();
					if (!this.Validate()) {
						this.error = this.SetError();
						return false;
					}
					this.error = "";
				}
				return true;
			},
			GetError : function() {
				return this.error;
			},
			SetError : function() {
				switch (this.ruleName) {
					case "required" :
						return "此项不能为空";
						break;
					case "number" :
						return "请输入一个数字";
						break;
					case "alnum" :
						return "此项只能为数字或字母";
						break;
					case "alpha" :
						return "此项只能为字母";
						break;
					case "digits" :
						return "请输入一个整数";
						break;
					case "maxlength" :
						return "此项最大长度不能超过" + this.param + "位";
						break;
					case "minlength" :
						return "此项最小长度不能少于" + this.param + "位";
						break;
					case "rangelength" :
						return "此项长度必须介于" + this.param[0] + "位到"
								+ this.param[1] + "位之间";
						break;
					case "max" :
						return "请输入一个不大于" + this.param + "的数";
						break;
					case "min" :
						return "请输入一个不小于" + this.param + "的数";
						break;
					case "range" :
						return "请输入一个介于" + this.param[0] + "和" + this.param[1]
								+ "之间的数";
						break;
					case "commanum" :
						return "输入的格式不正确";
						break;
					case "email" :
						return "请输入一个正确的电子邮件地址";
						break;
					case "phone" :
						return "请输入一个正确的手机号码";
						break;
					default :
						return true;
						break;
				}
			},
			/** name：验证方法；param：验证规则；value : 要验证的值* */
			Validate : function() {
				switch (this.ruleName) {
					case "required" :
						return $.trim(this.value).length > 0;
						break;
					case "number" :
						return this.IsNumber(this.value);
						break;
					case "alpha" :
						return this.IsAlpha(this.value);
						break;
					case "alnum" :
						return this.IsAlnum(this.value);
						break;
					case "digits" :
						return this.IsDigits(this.value);
						break;
					case "maxlength" :
						var length = $.trim(this.value).length;
						return length <= this.param;
						break;
					case "minlength" :
						var length = $.trim(this.value).length;
						return length >= this.param;
						break;
					case "rangelength" :
						var length = $.trim(this.value).length;
						return length >= this.param[0]
								&& length <= this.param[1];
						break;
					case "max" :
						return this.value <= this.param;
						break;
					case "min" :
						return this.value >= this.param;
						break;
					case "range" :
						return this.value >= this.param[0]
								&& value <= this.param[1];
						break;
					case "commanum" :
						return this.IsCommaNum(this.value);
						break;
					case "email" :
						return this.IsEmail(this.value);
						break;
					case "phone" :
						return this.IsMobile(this.value);
						break;
					default :
						return true;
						break;
				}
			},
			IsNumber : function(v) {
				return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v);
			},
			IsDigits : function(v) {
				return /^-?[1-9]\d*|0$/.test(v);
			},
			IsAlnum : function(v) {
				return /^[0-9A-Za-z]+$/.test(v);
			},
			IsAlpha : function(v) {
				return /^[A-Za-z]+$/.test(v);
			},
			IsCommaNum : function(v) {
				return /^(\d+[,])*(\d+)$/.test(v);
			},
			IsEmail : function(v) {
				var regInvalid = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
				var regValid = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
				return (!regInvalid.test(v) && regValid.test(v));
			},
			IsMobile : function(v) {
				return /^1[3|4|5|8][0-9]\d{4,8}$/.test(v);
			}
		},
/** End-Validation验证* */
		/** External lib* */
		External : {
			Notification : {
				Show : function(params) {
					// options array
					var options = {
						'showAfter' : 0, // number of sec to wait after page
											// loads
						'duration' : 0, // display duration
						'autoClose' : false, // flag to autoClose
												// notification message
						'type' : 'success', // type of info message
											// error/success/info/warning
						'message' : '', // message to dispaly
						'link_notification' : '', // link flag to show extra
													// description
						'description' : '' // link to desciption to display on
											// clicking link message
					};
					// Extending array from params
					$.extend(true, options, params);

					var msgclass = 'succ_bg'; // default success message will
												// shown
					if (options['type'] == 'error') {
						msgclass = 'error_bg'; // over write the message to
												// error message
					} else if (options['type'] == 'information') {
						msgclass = 'info_bg'; // over write the message to
												// information message
					} else if (options['type'] == 'warning') {
						msgclass = 'warn_bg'; // over write the message to
												// warning message
					}

					// Parent Div container
					var container = '<div id="info_message" class="'
							+ msgclass
							+ '"><div class="center_auto"><div class="info_message_text message_area">';
					container += options['message'];
					container += '</div><div class="info_close_btn button_area" onclick="return Cx.External.Notification.Close()"></div><div class="clearboth"></div>';
					container += '</div><div class="info_more_descrption"></div></div>';

					$notification = $(container);

					// Appeding notification to Body
					$('body').append($notification);

					var divHeight = $('div#info_message').height();
					// see CSS top to minus of div height
					$('div#info_message').css({
								top : '-' + divHeight + 'px'
							});

					// showing notification message, default it will be hidden
					$('div#info_message').show();

					// Slide Down notification message after startAfter seconds
					Cx.External.Notification.SlideDown(options['showAfter'],
							options['autoClose'], options['duration']);

					$('.link_notification').on('click', function() {
						$('.info_more_descrption').html(options['description'])
								.slideDown('fast');
					});

				},
				// function to close notification message
				// slideUp the message
				Close : function(duration) {
					var divHeight = $('div#info_message').height();
					setTimeout(function() {
								$('div#info_message').animate({
											top : '-' + divHeight
										});
								// removing the notification from body
								setTimeout(function() {
											$('div#info_message').remove();
										}, 300);// self edit 200 to 300 at
												// 2013/8/8 by LBY
							}, parseInt(duration * 1000));
				},
				// sliding down the notification
				SlideDown : function(startAfter, autoClose, duration) {
					setTimeout(function() {
								$('div#info_message').animate({
											top : 0
										}, "normal"); // self add normal at
														// 2013/8/8 by LBY
								if (autoClose) {
									setTimeout(function() {
												Cx.External.Notification
														.Close(duration);
											}, duration);
								}
							}, parseInt(startAfter * 1000));
				}
			}
/** Notification结束* */
		}
/** External lib结束* */
	};
	window.Cx = Cx;
})()
