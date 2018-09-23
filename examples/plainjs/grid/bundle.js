(function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};

	var n="function"===typeof Symbol&&Symbol.for,p=n?Symbol.for("react.element"):60103,q=n?Symbol.for("react.portal"):60106,r=n?Symbol.for("react.fragment"):60107,t=n?Symbol.for("react.strict_mode"):60108,u=n?Symbol.for("react.profiler"):60114,v=n?Symbol.for("react.provider"):60109,w=n?Symbol.for("react.context"):60110,x=n?Symbol.for("react.async_mode"):60111,y=n?Symbol.for("react.forward_ref"):60112;var z="function"===typeof Symbol&&Symbol.iterator;function A(a,b,d,c,e,g,h,f){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var k=[d,c,e,g,h,f],l=0;a=Error(b.replace(/%s/g,function(){return k[l++]}));a.name="Invariant Violation";}a.framesToPop=1;throw a;}}
	function B(a){for(var b=arguments.length-1,d="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)d+="&args[]="+encodeURIComponent(arguments[c+1]);A(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",d);}var C={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},D={};
	function E(a,b,d){this.props=a;this.context=b;this.refs=D;this.updater=d||C;}E.prototype.isReactComponent={};E.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?B("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState");};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F(){}F.prototype=E.prototype;function G(a,b,d){this.props=a;this.context=b;this.refs=D;this.updater=d||C;}var H=G.prototype=new F;
	H.constructor=G;objectAssign(H,E.prototype);H.isPureReactComponent=!0;var I={current:null,currentDispatcher:null},J=Object.prototype.hasOwnProperty,K={key:!0,ref:!0,__self:!0,__source:!0};
	function L(a,b,d){var c=void 0,e={},g=null,h=null;if(null!=b)for(c in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(g=""+b.key),b)J.call(b,c)&&!K.hasOwnProperty(c)&&(e[c]=b[c]);var f=arguments.length-2;if(1===f)e.children=d;else if(1<f){for(var k=Array(f),l=0;l<f;l++)k[l]=arguments[l+2];e.children=k;}if(a&&a.defaultProps)for(c in f=a.defaultProps,f)void 0===e[c]&&(e[c]=f[c]);return {$$typeof:p,type:a,key:g,ref:h,props:e,_owner:I.current}}
	function M(a,b){return {$$typeof:p,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function N(a){return "object"===typeof a&&null!==a&&a.$$typeof===p}function escape(a){var b={"=":"=0",":":"=2"};return "$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var O=/\/+/g,P=[];function Q(a,b,d,c){if(P.length){var e=P.pop();e.result=a;e.keyPrefix=b;e.func=d;e.context=c;e.count=0;return e}return {result:a,keyPrefix:b,func:d,context:c,count:0}}
	function R(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>P.length&&P.push(a);}
	function S(a,b,d,c){var e=typeof a;if("undefined"===e||"boolean"===e)a=null;var g=!1;if(null===a)g=!0;else switch(e){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case p:case q:g=!0;}}if(g)return d(c,a,""===b?"."+T(a,0):b),1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var h=0;h<a.length;h++){e=a[h];var f=b+T(e,h);g+=S(e,f,d,c);}else if(null===a||"object"!==typeof a?f=null:(f=z&&a[z]||a["@@iterator"],f="function"===typeof f?f:null),"function"===typeof f)for(a=f.call(a),h=
	0;!(e=a.next()).done;)e=e.value,f=b+T(e,h++),g+=S(e,f,d,c);else"object"===e&&(d=""+a,B("31","[object Object]"===d?"object with keys {"+Object.keys(a).join(", ")+"}":d,""));return g}function U(a,b,d){return null==a?0:S(a,"",b,d)}function T(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function V(a,b){a.func.call(a.context,b,a.count++);}
	function aa(a,b,d){var c=a.result,e=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?W(a,c,d,function(a){return a}):null!=a&&(N(a)&&(a=M(a,e+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(O,"$&/")+"/")+d)),c.push(a));}function W(a,b,d,c,e){var g="";null!=d&&(g=(""+d).replace(O,"$&/")+"/");b=Q(b,g,c,e);U(a,aa,b);R(b);}function ba(a,b){var d=I.currentDispatcher;null===d?B("277"):void 0;return d.readContext(a,b)}
	var X={Children:{map:function(a,b,d){if(null==a)return a;var c=[];W(a,c,null,b,d);return c},forEach:function(a,b,d){if(null==a)return a;b=Q(null,null,b,d);U(a,V,b);R(b);},count:function(a){return U(a,function(){return null},null)},toArray:function(a){var b=[];W(a,b,null,function(a){return a});return b},only:function(a){N(a)?void 0:B("143");return a}},createRef:function(){return {current:null}},Component:E,PureComponent:G,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:w,_calculateChangedBits:b,
	_currentValue:a,_currentValue2:a,Provider:null,Consumer:null,unstable_read:null};a.Provider={$$typeof:v,_context:a};a.Consumer=a;a.unstable_read=ba.bind(null,a);return a},forwardRef:function(a){return {$$typeof:y,render:a}},Fragment:r,StrictMode:t,unstable_AsyncMode:x,unstable_Profiler:u,createElement:L,cloneElement:function(a,b,d){null===a||void 0===a?B("267",a):void 0;var c=void 0,e=objectAssign({},a.props),g=a.key,h=a.ref,f=a._owner;if(null!=b){void 0!==b.ref&&(h=b.ref,f=I.current);void 0!==b.key&&(g=""+b.key);
	var k=void 0;a.type&&a.type.defaultProps&&(k=a.type.defaultProps);for(c in b)J.call(b,c)&&!K.hasOwnProperty(c)&&(e[c]=void 0===b[c]&&void 0!==k?k[c]:b[c]);}c=arguments.length-2;if(1===c)e.children=d;else if(1<c){k=Array(c);for(var l=0;l<c;l++)k[l]=arguments[l+2];e.children=k;}return {$$typeof:p,type:a.type,key:g,ref:h,props:e,_owner:f}},createFactory:function(a){var b=L.bind(null,a);b.type=a;return b},isValidElement:N,version:"16.5.2",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:I,
	assign:objectAssign}},Y={default:X},Z=Y&&X||Y;var react_production_min=Z.default||Z;

	var react = createCommonjsModule(function (module) {

	{
	  module.exports = react_production_min;
	}
	});
	var react_1 = react.Component;
	var react_2 = react.createContext;
	var react_3 = react.createElement;
	var react_4 = react.Fragment;

	var schedule_production_min = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports,"__esModule",{value:!0});var c=null,e=!1,f=!1,g="object"===typeof performance&&"function"===typeof performance.now,l={timeRemaining:g?function(){var a=h()-performance.now();return 0<a?a:0}:function(){var a=h()-Date.now();return 0<a?a:0},didTimeout:!1};function m(){if(!e){var a=c.timesOutAt;f?n():f=!0;p(q,a);}}function r(){var a=c,b=c.next;if(c===b)c=null;else{var d=c.previous;c=d.next=b;b.previous=d;}a.next=a.previous=null;a=a.callback;a(l);}
	function q(a){e=!0;l.didTimeout=a;try{if(a)for(;null!==c;){var b=exports.unstable_now();if(c.timesOutAt<=b){do r();while(null!==c&&c.timesOutAt<=b)}else break}else if(null!==c){do r();while(null!==c&&0<h()-exports.unstable_now())}}finally{e=!1,null!==c?m(c):f=!1;}}
	var t=Date,u="function"===typeof setTimeout?setTimeout:void 0,v="function"===typeof clearTimeout?clearTimeout:void 0,w="function"===typeof requestAnimationFrame?requestAnimationFrame:void 0,x="function"===typeof cancelAnimationFrame?cancelAnimationFrame:void 0,y,z;function A(a){y=w(function(b){v(z);a(b);});z=u(function(){x(y);a(exports.unstable_now());},100);}if(g){var B=performance;exports.unstable_now=function(){return B.now()};}else exports.unstable_now=function(){return t.now()};var p,n,h;
	if("undefined"===typeof window){var C=-1;p=function(a){C=setTimeout(a,0,!0);};n=function(){clearTimeout(C);};h=function(){return 0};}else if(window._schedMock){var D=window._schedMock;p=D[0];n=D[1];h=D[2];}else{"undefined"!==typeof console&&("function"!==typeof w&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),"function"!==typeof x&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));
	var E=null,F=!1,G=-1,H=!1,I=!1,J=0,K=33,L=33;h=function(){return J};var M="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(a){if(a.source===window&&a.data===M){F=!1;var b=exports.unstable_now();a=!1;if(0>=J-b)if(-1!==G&&G<=b)a=!0;else{H||(H=!0,A(N));return}G=-1;b=E;E=null;if(null!==b){I=!0;try{b(a);}finally{I=!1;}}}},!1);var N=function(a){H=!1;var b=a-J+L;b<L&&K<L?(8>b&&(b=8),L=b<K?K:b):K=b;J=a+L;F||(F=!0,window.postMessage(M,"*"));};p=function(a,
	b){E=a;G=b;I?window.postMessage(M,"*"):H||(H=!0,A(N));};n=function(){E=null;F=!1;G=-1;};}exports.unstable_scheduleWork=function(a,b){var d=exports.unstable_now();b=void 0!==b&&null!==b&&null!==b.timeout&&void 0!==b.timeout?d+b.timeout:d+5E3;a={callback:a,timesOutAt:b,next:null,previous:null};if(null===c)c=a.next=a.previous=a,m(c);else{d=null;var k=c;do{if(k.timesOutAt>b){d=k;break}k=k.next;}while(k!==c);null===d?d=c:d===c&&(c=a,m(c));b=d.previous;b.next=d.previous=a;a.next=d;a.previous=b;}return a};
	exports.unstable_cancelScheduledWork=function(a){var b=a.next;if(null!==b){if(b===a)c=null;else{a===c&&(c=b);var d=a.previous;d.next=b;b.previous=d;}a.next=a.previous=null;}};
	});

	unwrapExports(schedule_production_min);
	var schedule_production_min_1 = schedule_production_min.unstable_now;
	var schedule_production_min_2 = schedule_production_min.unstable_scheduleWork;
	var schedule_production_min_3 = schedule_production_min.unstable_cancelScheduledWork;

	var schedule = createCommonjsModule(function (module) {

	{
	  module.exports = schedule_production_min;
	}
	});

	function ca(a,b,c,d,e,f,g,h){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var k=[c,d,e,f,g,h],l=0;a=Error(b.replace(/%s/g,function(){return k[l++]}));a.name="Invariant Violation";}a.framesToPop=1;throw a;}}
	function t$1(a){for(var b=arguments.length-1,c="https://reactjs.org/docs/error-decoder.html?invariant="+a,d=0;d<b;d++)c+="&args[]="+encodeURIComponent(arguments[d+1]);ca(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",c);}react?void 0:t$1("227");function da(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l);}catch(m){this.onError(m);}}
	var ea=!1,fa=null,ha=!1,ia=null,ja={onError:function(a){ea=!0;fa=a;}};function ka(a,b,c,d,e,f,g,h,k){ea=!1;fa=null;da.apply(ja,arguments);}function la(a,b,c,d,e,f,g,h,k){ka.apply(this,arguments);if(ea){if(ea){var l=fa;ea=!1;fa=null;}else t$1("198"),l=void 0;ha||(ha=!0,ia=l);}}var ma=null,na={};
	function oa(){if(ma)for(var a in na){var b=na[a],c=ma.indexOf(a);-1<c?void 0:t$1("96",a);if(!pa[c]){b.extractEvents?void 0:t$1("97",a);pa[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;qa.hasOwnProperty(h)?t$1("99",h):void 0;qa[h]=f;var k=f.phasedRegistrationNames;if(k){for(e in k)k.hasOwnProperty(e)&&ra(k[e],g,h);e=!0;}else f.registrationName?(ra(f.registrationName,g,h),e=!0):e=!1;e?void 0:t$1("98",d,a);}}}}
	function ra(a,b,c){sa[a]?t$1("100",a):void 0;sa[a]=b;ta[a]=b.eventTypes[c].dependencies;}var pa=[],qa={},sa={},ta={},ua=null,va=null,wa=null;function xa(a,b,c,d){b=a.type||"unknown-event";a.currentTarget=wa(d);la(b,c,void 0,a);a.currentTarget=null;}function ya(a,b){null==b?t$1("30"):void 0;if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);return a}return Array.isArray(b)?[a].concat(b):[a,b]}
	function za(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a);}var Aa=null;function Ba(a,b){if(a){var c=a._dispatchListeners,d=a._dispatchInstances;if(Array.isArray(c))for(var e=0;e<c.length&&!a.isPropagationStopped();e++)xa(a,b,c[e],d[e]);else c&&xa(a,b,c,d);a._dispatchListeners=null;a._dispatchInstances=null;a.isPersistent()||a.constructor.release(a);}}function Ca(a){return Ba(a,!0)}function Da(a){return Ba(a,!1)}
	var Ea={injectEventPluginOrder:function(a){ma?t$1("101"):void 0;ma=Array.prototype.slice.call(a);oa();},injectEventPluginsByName:function(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];na.hasOwnProperty(c)&&na[c]===d||(na[c]?t$1("102",c):void 0,na[c]=d,b=!0);}b&&oa();}};
	function Fa(a,b){var c=a.stateNode;if(!c)return null;var d=ua(c);if(!d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1;}if(a)return null;c&&"function"!==typeof c?t$1("231",b,typeof c):void 0;
	return c}function Ga(a,b){null!==a&&(Aa=ya(Aa,a));a=Aa;Aa=null;if(a&&(b?za(a,Ca):za(a,Da),Aa?t$1("95"):void 0,ha))throw b=ia,ha=!1,ia=null,b;}var Ha=Math.random().toString(36).slice(2),Ia="__reactInternalInstance$"+Ha,Ja="__reactEventHandlers$"+Ha;function Ka(a){if(a[Ia])return a[Ia];for(;!a[Ia];)if(a.parentNode)a=a.parentNode;else return null;a=a[Ia];return 7===a.tag||8===a.tag?a:null}function La(a){a=a[Ia];return !a||7!==a.tag&&8!==a.tag?null:a}
	function Ma(a){if(7===a.tag||8===a.tag)return a.stateNode;t$1("33");}function Na(a){return a[Ja]||null}function Oa(a){do a=a.return;while(a&&7!==a.tag);return a?a:null}function Pa(a,b,c){if(b=Fa(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=ya(c._dispatchListeners,b),c._dispatchInstances=ya(c._dispatchInstances,a);}
	function Qa(a){if(a&&a.dispatchConfig.phasedRegistrationNames){for(var b=a._targetInst,c=[];b;)c.push(b),b=Oa(b);for(b=c.length;0<b--;)Pa(c[b],"captured",a);for(b=0;b<c.length;b++)Pa(c[b],"bubbled",a);}}function Ra(a,b,c){a&&c&&c.dispatchConfig.registrationName&&(b=Fa(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=ya(c._dispatchListeners,b),c._dispatchInstances=ya(c._dispatchInstances,a));}function Ta(a){a&&a.dispatchConfig.registrationName&&Ra(a._targetInst,null,a);}
	function Ua(a){za(a,Qa);}var Va=!("undefined"===typeof window||!window.document||!window.document.createElement);function Wa(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ya={animationend:Wa("Animation","AnimationEnd"),animationiteration:Wa("Animation","AnimationIteration"),animationstart:Wa("Animation","AnimationStart"),transitionend:Wa("Transition","TransitionEnd")},Za={},$a={};
	Va&&($a=document.createElement("div").style,"AnimationEvent"in window||(delete Ya.animationend.animation,delete Ya.animationiteration.animation,delete Ya.animationstart.animation),"TransitionEvent"in window||delete Ya.transitionend.transition);function ab(a){if(Za[a])return Za[a];if(!Ya[a])return a;var b=Ya[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in $a)return Za[a]=b[c];return a}
	var bb=ab("animationend"),cb=ab("animationiteration"),db=ab("animationstart"),eb=ab("transitionend"),fb="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gb=null,hb=null,ib=null;
	function jb(){if(ib)return ib;var a,b=hb,c=b.length,d,e="value"in gb?gb.value:gb.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return ib=e.slice(a,1<d?1-d:void 0)}function kb(){return !0}function lb(){return !1}
	function z$1(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:!1===c.returnValue)?kb:lb;this.isPropagationStopped=lb;return this}
	objectAssign(z$1.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=kb);},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=kb);},persist:function(){this.isPersistent=kb;},isPersistent:lb,destructor:function(){var a=this.constructor.Interface,
	b;for(b in a)this[b]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null;this.isPropagationStopped=this.isDefaultPrevented=lb;this._dispatchInstances=this._dispatchListeners=null;}});z$1.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};
	z$1.extend=function(a){function b(){}function c(){return d.apply(this,arguments)}var d=this;b.prototype=d.prototype;var e=new b;objectAssign(e,c.prototype);c.prototype=e;c.prototype.constructor=c;c.Interface=objectAssign({},d.Interface,a);c.extend=d.extend;mb(c);return c};mb(z$1);function nb(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}function ob(a){a instanceof this?void 0:t$1("279");a.destructor();10>this.eventPool.length&&this.eventPool.push(a);}
	function mb(a){a.eventPool=[];a.getPooled=nb;a.release=ob;}var pb=z$1.extend({data:null}),qb=z$1.extend({data:null}),rb=[9,13,27,32],sb=Va&&"CompositionEvent"in window,tb=null;Va&&"documentMode"in document&&(tb=document.documentMode);
	var ub=Va&&"TextEvent"in window&&!tb,vb=Va&&(!sb||tb&&8<tb&&11>=tb),wb=String.fromCharCode(32),xb={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",
	captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},yb=!1;
	function zb(a,b){switch(a){case "keyup":return -1!==rb.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "blur":return !0;default:return !1}}function Ab(a){a=a.detail;return "object"===typeof a&&"data"in a?a.data:null}var Bb=!1;function Cb(a,b){switch(a){case "compositionend":return Ab(b);case "keypress":if(32!==b.which)return null;yb=!0;return wb;case "textInput":return a=b.data,a===wb&&yb?null:a;default:return null}}
	function Db(a,b){if(Bb)return "compositionend"===a||!sb&&zb(a,b)?(a=jb(),ib=hb=gb=null,Bb=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return vb&&"ko"!==b.locale?null:b.data;default:return null}}
	var Eb={eventTypes:xb,extractEvents:function(a,b,c,d){var e=void 0;var f=void 0;if(sb)b:{switch(a){case "compositionstart":e=xb.compositionStart;break b;case "compositionend":e=xb.compositionEnd;break b;case "compositionupdate":e=xb.compositionUpdate;break b}e=void 0;}else Bb?zb(a,c)&&(e=xb.compositionEnd):"keydown"===a&&229===c.keyCode&&(e=xb.compositionStart);e?(vb&&"ko"!==c.locale&&(Bb||e!==xb.compositionStart?e===xb.compositionEnd&&Bb&&(f=jb()):(gb=d,hb="value"in gb?gb.value:gb.textContent,Bb=
	!0)),e=pb.getPooled(e,b,c,d),f?e.data=f:(f=Ab(c),null!==f&&(e.data=f)),Ua(e),f=e):f=null;(a=ub?Cb(a,c):Db(a,c))?(b=qb.getPooled(xb.beforeInput,b,c,d),b.data=a,Ua(b)):b=null;return null===f?b:null===b?f:[f,b]}},Fb=null,Gb=null,Hb=null;function Ib(a){if(a=va(a)){"function"!==typeof Fb?t$1("280"):void 0;var b=ua(a.stateNode);Fb(a.stateNode,a.type,b);}}function Jb(a){Gb?Hb?Hb.push(a):Hb=[a]:Gb=a;}function Kb(){if(Gb){var a=Gb,b=Hb;Hb=Gb=null;Ib(a);if(b)for(a=0;a<b.length;a++)Ib(b[a]);}}
	function Lb(a,b){return a(b)}function Mb(a,b,c){return a(b,c)}function Nb(){}var Ob=!1;function Pb(a,b){if(Ob)return a(b);Ob=!0;try{return Lb(a,b)}finally{if(Ob=!1,null!==Gb||null!==Hb)Nb(),Kb();}}var Qb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Rb(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return "input"===b?!!Qb[a.type]:"textarea"===b?!0:!1}
	function Sb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}function Tb(a){if(!Va)return !1;a="on"+a;var b=a in document;b||(b=document.createElement("div"),b.setAttribute(a,"return;"),b="function"===typeof b[a]);return b}function Ub(a){var b=a.type;return (a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
	function Vb(a){var b=Ub(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a);}});Object.defineProperty(a,b,{enumerable:c.enumerable});return {getValue:function(){return d},setValue:function(a){d=""+a;},stopTracking:function(){a._valueTracker=
	null;delete a[b];}}}}function Wb(a){a._valueTracker||(a._valueTracker=Vb(a));}function Xb(a){if(!a)return !1;var b=a._valueTracker;if(!b)return !0;var c=b.getValue();var d="";a&&(d=Ub(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}
	var Yb=react.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Zb=/^(.*)[\\\/]/,C$1="function"===typeof Symbol&&Symbol.for,$b=C$1?Symbol.for("react.element"):60103,ac=C$1?Symbol.for("react.portal"):60106,bc=C$1?Symbol.for("react.fragment"):60107,cc=C$1?Symbol.for("react.strict_mode"):60108,dc=C$1?Symbol.for("react.profiler"):60114,ec=C$1?Symbol.for("react.provider"):60109,fc=C$1?Symbol.for("react.context"):60110,gc=C$1?Symbol.for("react.async_mode"):60111,hc=C$1?Symbol.for("react.forward_ref"):60112,ic=C$1?Symbol.for("react.placeholder"):
	60113,jc="function"===typeof Symbol&&Symbol.iterator;function kc(a){if(null===a||"object"!==typeof a)return null;a=jc&&a[jc]||a["@@iterator"];return "function"===typeof a?a:null}
	function lc(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case gc:return "AsyncMode";case bc:return "Fragment";case ac:return "Portal";case dc:return "Profiler";case cc:return "StrictMode";case ic:return "Placeholder"}if("object"===typeof a){switch(a.$$typeof){case fc:return "Context.Consumer";case ec:return "Context.Provider";case hc:var b=a.render;b=b.displayName||b.name||"";return a.displayName||(""!==b?"ForwardRef("+b+")":
	"ForwardRef")}if("function"===typeof a.then&&(a=1===a._reactStatus?a._reactResult:null))return lc(a)}return null}function mc(a){var b="";do{a:switch(a.tag){case 4:case 0:case 1:case 2:case 3:case 7:case 10:var c=a._debugOwner,d=a._debugSource,e=lc(a.type);var f=null;c&&(f=lc(c.type));c=e;e="";d?e=" (at "+d.fileName.replace(Zb,"")+":"+d.lineNumber+")":f&&(e=" (created by "+f+")");f="\n    in "+(c||"Unknown")+e;break a;default:f="";}b+=f;a=a.return;}while(a);return b}
	var nc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,pc=Object.prototype.hasOwnProperty,qc={},rc={};
	function sc(a){if(pc.call(rc,a))return !0;if(pc.call(qc,a))return !1;if(nc.test(a))return rc[a]=!0;qc[a]=!0;return !1}function tc(a,b,c,d){if(null!==c&&0===c.type)return !1;switch(typeof b){case "function":case "symbol":return !0;case "boolean":if(d)return !1;if(null!==c)return !c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return "data-"!==a&&"aria-"!==a;default:return !1}}
	function uc(a,b,c,d){if(null===b||"undefined"===typeof b||tc(a,b,c,d))return !0;if(d)return !1;if(null!==c)switch(c.type){case 3:return !b;case 4:return !1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return !1}function D$1(a,b,c,d,e){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;}var E$1={};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){E$1[a]=new D$1(a,0,!1,a,null);});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];E$1[b]=new D$1(b,1,!1,a[1],null);});["contentEditable","draggable","spellCheck","value"].forEach(function(a){E$1[a]=new D$1(a,2,!1,a.toLowerCase(),null);});
	["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){E$1[a]=new D$1(a,2,!1,a,null);});"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){E$1[a]=new D$1(a,3,!1,a.toLowerCase(),null);});["checked","multiple","muted","selected"].forEach(function(a){E$1[a]=new D$1(a,3,!0,a,null);});
	["capture","download"].forEach(function(a){E$1[a]=new D$1(a,4,!1,a,null);});["cols","rows","size","span"].forEach(function(a){E$1[a]=new D$1(a,6,!1,a,null);});["rowSpan","start"].forEach(function(a){E$1[a]=new D$1(a,5,!1,a.toLowerCase(),null);});var vc=/[\-:]([a-z])/g;function wc(a){return a[1].toUpperCase()}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(vc,
	wc);E$1[b]=new D$1(b,1,!1,a,null);});"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(vc,wc);E$1[b]=new D$1(b,1,!1,a,"http://www.w3.org/1999/xlink");});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(vc,wc);E$1[b]=new D$1(b,1,!1,a,"http://www.w3.org/XML/1998/namespace");});E$1.tabIndex=new D$1("tabIndex",1,!1,"tabindex",null);
	function xc(a,b,c,d){var e=E$1.hasOwnProperty(b)?E$1[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(uc(b,c,e,d)&&(c=null),d||null===e?sc(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))));}
	function yc(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return ""}}function zc(a,b){var c=b.checked;return objectAssign({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}
	function Bc(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=yc(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value};}function Cc(a,b){b=b.checked;null!=b&&xc(a,"checked",b,!1);}
	function Dc(a,b){Cc(a,b);var c=yc(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c;}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?Ec(a,b.type,c):b.hasOwnProperty("defaultValue")&&Ec(a,b.type,yc(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked);}
	function Fc(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b;}c=a.name;""!==c&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c);}
	function Ec(a,b,c){if("number"!==b||a.ownerDocument.activeElement!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c);}var Gc={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Hc(a,b,c){a=z$1.getPooled(Gc.change,a,b,c);a.type="change";Jb(c);Ua(a);return a}var Ic=null,Jc=null;function Kc(a){Ga(a,!1);}
	function Lc(a){var b=Ma(a);if(Xb(b))return a}function Mc(a,b){if("change"===a)return b}var Nc=!1;Va&&(Nc=Tb("input")&&(!document.documentMode||9<document.documentMode));function Oc(){Ic&&(Ic.detachEvent("onpropertychange",Pc),Jc=Ic=null);}function Pc(a){"value"===a.propertyName&&Lc(Jc)&&(a=Hc(Jc,a,Sb(a)),Pb(Kc,a));}function Qc(a,b,c){"focus"===a?(Oc(),Ic=b,Jc=c,Ic.attachEvent("onpropertychange",Pc)):"blur"===a&&Oc();}function Rc(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return Lc(Jc)}
	function Sc(a,b){if("click"===a)return Lc(b)}function Tc(a,b){if("input"===a||"change"===a)return Lc(b)}
	var Uc={eventTypes:Gc,_isInputEventSupported:Nc,extractEvents:function(a,b,c,d){var e=b?Ma(b):window,f=void 0,g=void 0,h=e.nodeName&&e.nodeName.toLowerCase();"select"===h||"input"===h&&"file"===e.type?f=Mc:Rb(e)?Nc?f=Tc:(f=Rc,g=Qc):(h=e.nodeName)&&"input"===h.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)&&(f=Sc);if(f&&(f=f(a,b)))return Hc(f,c,d);g&&g(a,e,b);"blur"===a&&(a=e._wrapperState)&&a.controlled&&"number"===e.type&&Ec(e,"number",e.value);}},Vc=z$1.extend({view:null,detail:null}),Wc={Alt:"altKey",
	Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Xc(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Wc[a])?!!b[a]:!1}function Yc(){return Xc}
	var Zc=0,$c=0,ad=!1,bd=!1,cd=Vc.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Yc,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)},movementX:function(a){if("movementX"in a)return a.movementX;var b=Zc;Zc=a.screenX;return ad?"mousemove"===a.type?a.screenX-b:0:(ad=!0,0)},movementY:function(a){if("movementY"in a)return a.movementY;
	var b=$c;$c=a.screenY;return bd?"mousemove"===a.type?a.screenY-b:0:(bd=!0,0)}}),dd=cd.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),ed={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",
	dependencies:["pointerout","pointerover"]}},fd={eventTypes:ed,extractEvents:function(a,b,c,d){var e="mouseover"===a||"pointerover"===a,f="mouseout"===a||"pointerout"===a;if(e&&(c.relatedTarget||c.fromElement)||!f&&!e)return null;e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||e.parentWindow:window;f?(f=b,b=(b=c.relatedTarget||c.toElement)?Ka(b):null):f=null;if(f===b)return null;var g=void 0,h=void 0,k=void 0,l=void 0;if("mouseout"===a||"mouseover"===a)g=cd,h=ed.mouseLeave,k=ed.mouseEnter,l="mouse";
	else if("pointerout"===a||"pointerover"===a)g=dd,h=ed.pointerLeave,k=ed.pointerEnter,l="pointer";var m=null==f?e:Ma(f);e=null==b?e:Ma(b);a=g.getPooled(h,f,c,d);a.type=l+"leave";a.target=m;a.relatedTarget=e;c=g.getPooled(k,b,c,d);c.type=l+"enter";c.target=e;c.relatedTarget=m;d=b;if(f&&d)a:{b=f;e=d;l=0;for(g=b;g;g=Oa(g))l++;g=0;for(k=e;k;k=Oa(k))g++;for(;0<l-g;)b=Oa(b),l--;for(;0<g-l;)e=Oa(e),g--;for(;l--;){if(b===e||b===e.alternate)break a;b=Oa(b);e=Oa(e);}b=null;}else b=null;e=b;for(b=[];f&&f!==e;){l=
	f.alternate;if(null!==l&&l===e)break;b.push(f);f=Oa(f);}for(f=[];d&&d!==e;){l=d.alternate;if(null!==l&&l===e)break;f.push(d);d=Oa(d);}for(d=0;d<b.length;d++)Ra(b[d],"bubbled",a);for(d=f.length;0<d--;)Ra(f[d],"captured",c);return [a,c]}},gd=Object.prototype.hasOwnProperty;function hd(a,b){return a===b?0!==a||0!==b||1/a===1/b:a!==a&&b!==b}
	function id(a,b){if(hd(a,b))return !0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return !1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return !1;for(d=0;d<c.length;d++)if(!gd.call(b,c[d])||!hd(a[c[d]],b[c[d]]))return !1;return !0}function jd(a){var b=a;if(a.alternate)for(;b.return;)b=b.return;else{if(0!==(b.effectTag&2))return 1;for(;b.return;)if(b=b.return,0!==(b.effectTag&2))return 1}return 5===b.tag?2:3}function kd(a){2!==jd(a)?t$1("188"):void 0;}
	function ld(a){var b=a.alternate;if(!b)return b=jd(a),3===b?t$1("188"):void 0,1===b?null:a;for(var c=a,d=b;;){var e=c.return,f=e?e.alternate:null;if(!e||!f)break;if(e.child===f.child){for(var g=e.child;g;){if(g===c)return kd(e),a;if(g===d)return kd(e),b;g=g.sibling;}t$1("188");}if(c.return!==d.return)c=e,d=f;else{g=!1;for(var h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling;}if(!g){for(h=f.child;h;){if(h===c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling;}g?
	void 0:t$1("189");}}c.alternate!==d?t$1("190"):void 0;}5!==c.tag?t$1("188"):void 0;return c.stateNode.current===c?a:b}function md(a){a=ld(a);if(!a)return null;for(var b=a;;){if(7===b.tag||8===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return;}b.sibling.return=b.return;b=b.sibling;}}return null}
	var nd=z$1.extend({animationName:null,elapsedTime:null,pseudoElement:null}),od=z$1.extend({clipboardData:function(a){return "clipboardData"in a?a.clipboardData:window.clipboardData}}),pd=Vc.extend({relatedTarget:null});function qd(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}
	var rd={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},sd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",
	116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},td=Vc.extend({key:function(a){if(a.key){var b=rd[a.key]||a.key;if("Unidentified"!==b)return b}return "keypress"===a.type?(a=qd(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?sd[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Yc,charCode:function(a){return "keypress"===
	a.type?qd(a):0},keyCode:function(a){return "keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return "keypress"===a.type?qd(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),ud=cd.extend({dataTransfer:null}),vd=Vc.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Yc}),wd=z$1.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),xd=cd.extend({deltaX:function(a){return "deltaX"in a?a.deltaX:"wheelDeltaX"in
	a?-a.wheelDeltaX:0},deltaY:function(a){return "deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null}),yd=[["abort","abort"],[bb,"animationEnd"],[cb,"animationIteration"],[db,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],
	["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],
	["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[eb,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],zd={},Ad={};function Bd(a,b){var c=a[0];a=a[1];var d="on"+(a[0].toUpperCase()+a.slice(1));b={phasedRegistrationNames:{bubbled:d,captured:d+"Capture"},dependencies:[c],isInteractive:b};zd[a]=b;Ad[c]=b;}
	[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["auxclick","auxClick"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],
	["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(a){Bd(a,!0);});yd.forEach(function(a){Bd(a,!1);});
	var Cd={eventTypes:zd,isInteractiveTopLevelEventType:function(a){a=Ad[a];return void 0!==a&&!0===a.isInteractive},extractEvents:function(a,b,c,d){var e=Ad[a];if(!e)return null;switch(a){case "keypress":if(0===qd(c))return null;case "keydown":case "keyup":a=td;break;case "blur":case "focus":a=pd;break;case "click":if(2===c.button)return null;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":a=cd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":a=
	ud;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":a=vd;break;case bb:case cb:case db:a=nd;break;case eb:a=wd;break;case "scroll":a=Vc;break;case "wheel":a=xd;break;case "copy":case "cut":case "paste":a=od;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":a=dd;break;default:a=z$1;}b=a.getPooled(e,b,c,d);Ua(b);return b}},Dd=Cd.isInteractiveTopLevelEventType,
	Ed=[];function Fd(a){var b=a.targetInst,c=b;do{if(!c){a.ancestors.push(c);break}var d;for(d=c;d.return;)d=d.return;d=5!==d.tag?null:d.stateNode.containerInfo;if(!d)break;a.ancestors.push(c);c=Ka(d);}while(c);for(c=0;c<a.ancestors.length;c++){b=a.ancestors[c];var e=Sb(a.nativeEvent);d=a.topLevelType;for(var f=a.nativeEvent,g=null,h=0;h<pa.length;h++){var k=pa[h];k&&(k=k.extractEvents(d,b,f,e))&&(g=ya(g,k));}Ga(g,!1);}}var Gd=!0;
	function F$1(a,b){if(!b)return null;var c=(Dd(a)?Hd:Id).bind(null,a);b.addEventListener(a,c,!1);}function Jd(a,b){if(!b)return null;var c=(Dd(a)?Hd:Id).bind(null,a);b.addEventListener(a,c,!0);}function Hd(a,b){Mb(Id,a,b);}
	function Id(a,b){if(Gd){var c=Sb(b);c=Ka(c);null===c||"number"!==typeof c.tag||2===jd(c)||(c=null);if(Ed.length){var d=Ed.pop();d.topLevelType=a;d.nativeEvent=b;d.targetInst=c;a=d;}else a={topLevelType:a,nativeEvent:b,targetInst:c,ancestors:[]};try{Pb(Fd,a);}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,10>Ed.length&&Ed.push(a);}}}var Kd={},Ld=0,Md="_reactListenersID"+(""+Math.random()).slice(2);
	function Nd(a){Object.prototype.hasOwnProperty.call(a,Md)||(a[Md]=Ld++,Kd[a[Md]]={});return Kd[a[Md]]}function Od(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}function Qd(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
	function Rd(a,b){var c=Qd(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return {node:c,offset:b-a};a=d;}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode;}c=void 0;}c=Qd(c);}}function Sd(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Sd(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
	function Td(){for(var a=window,b=Od();b instanceof a.HTMLIFrameElement;){try{a=b.contentDocument.defaultView;}catch(c){break}b=Od(a.document);}return b}function Ud(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
	var Vd=Va&&"documentMode"in document&&11>=document.documentMode,Wd={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Xd=null,Yd=null,Zd=null,$d=!1;
	function ae(a,b){var c=b.window===b?b.document:9===b.nodeType?b:b.ownerDocument;if($d||null==Xd||Xd!==Od(c))return null;c=Xd;"selectionStart"in c&&Ud(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset});return Zd&&id(Zd,c)?null:(Zd=c,a=z$1.getPooled(Wd.select,Yd,a,b),a.type="select",a.target=Xd,Ua(a),a)}
	var be={eventTypes:Wd,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:9===d.nodeType?d:d.ownerDocument,f;if(!(f=!e)){a:{e=Nd(e);f=ta.onSelect;for(var g=0;g<f.length;g++){var h=f[g];if(!e.hasOwnProperty(h)||!e[h]){e=!1;break a}}e=!0;}f=!e;}if(f)return null;e=b?Ma(b):window;switch(a){case "focus":if(Rb(e)||"true"===e.contentEditable)Xd=e,Yd=b,Zd=null;break;case "blur":Zd=Yd=Xd=null;break;case "mousedown":$d=!0;break;case "contextmenu":case "mouseup":case "dragend":return $d=!1,ae(c,d);case "selectionchange":if(Vd)break;
	case "keydown":case "keyup":return ae(c,d)}return null}};Ea.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));ua=Na;va=La;wa=Ma;Ea.injectEventPluginsByName({SimpleEventPlugin:Cd,EnterLeaveEventPlugin:fd,ChangeEventPlugin:Uc,SelectEventPlugin:be,BeforeInputEventPlugin:Eb});function ce(a){var b="";react.Children.forEach(a,function(a){null!=a&&(b+=a);});return b}
	function de(a,b){a=objectAssign({children:void 0},b);if(b=ce(b.children))a.children=b;return a}function ee(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0);}else{c=""+yc(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e]);}null!==b&&(b.selected=!0);}}
	function fe(a,b){null!=b.dangerouslySetInnerHTML?t$1("91"):void 0;return objectAssign({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function ge(a,b){var c=b.value;null==c&&(c=b.defaultValue,b=b.children,null!=b&&(null!=c?t$1("92"):void 0,Array.isArray(b)&&(1>=b.length?void 0:t$1("93"),b=b[0]),c=b),null==c&&(c=""));a._wrapperState={initialValue:yc(c)};}
	function he(a,b){var c=yc(b.value),d=yc(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d);}function ie(a){var b=a.textContent;b===a._wrapperState.initialValue&&(a.value=b);}var je={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
	function ke(a){switch(a){case "svg":return "http://www.w3.org/2000/svg";case "math":return "http://www.w3.org/1998/Math/MathML";default:return "http://www.w3.org/1999/xhtml"}}function le(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?ke(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
	var me=void 0,ne=function(a){return "undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)});}:a}(function(a,b){if(a.namespaceURI!==je.svg||"innerHTML"in a)a.innerHTML=b;else{me=me||document.createElement("div");me.innerHTML="<svg>"+b+"</svg>";for(b=me.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild);}});
	function oe(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b;}
	var pe={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
	floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qe=["Webkit","ms","Moz","O"];Object.keys(pe).forEach(function(a){qe.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pe[b]=pe[a];});});
	function re(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--");var e=c;var f=b[c];e=null==f||"boolean"===typeof f||""===f?"":d||"number"!==typeof f||0===f||pe.hasOwnProperty(e)&&pe[e]?(""+f).trim():f+"px";"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e;}}var se=objectAssign({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
	function te(a,b){b&&(se[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML?t$1("137",a,""):void 0),null!=b.dangerouslySetInnerHTML&&(null!=b.children?t$1("60"):void 0,"object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML?void 0:t$1("61")),null!=b.style&&"object"!==typeof b.style?t$1("62",""):void 0);}
	function ue(a,b){if(-1===a.indexOf("-"))return "string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return !1;default:return !0}}
	function ve(a,b){a=9===a.nodeType||11===a.nodeType?a:a.ownerDocument;var c=Nd(a);b=ta[b];for(var d=0;d<b.length;d++){var e=b[d];if(!c.hasOwnProperty(e)||!c[e]){switch(e){case "scroll":Jd("scroll",a);break;case "focus":case "blur":Jd("focus",a);Jd("blur",a);c.blur=!0;c.focus=!0;break;case "cancel":case "close":Tb(e)&&Jd(e,a);break;case "invalid":case "submit":case "reset":break;default:-1===fb.indexOf(e)&&F$1(e,a);}c[e]=!0;}}}function we(){}var xe=null,ye=null;
	function ze(a,b){switch(a){case "button":case "input":case "select":case "textarea":return !!b.autoFocus}return !1}function Ae(a,b){return "textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}function Be(a){for(a=a.nextSibling;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}
	function Ce(a){for(a=a.firstChild;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}var De=[],Ee=-1;function G$1(a){0>Ee||(a.current=De[Ee],De[Ee]=null,Ee--);}function H$1(a,b){Ee++;De[Ee]=a.current;a.current=b;}var Fe={},I$1={current:Fe},J$1={current:!1},Ge=Fe;
	function He(a,b){var c=a.type.contextTypes;if(!c)return Fe;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function K$1(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Ie(a){G$1(J$1,a);G$1(I$1,a);}function Je(a){G$1(J$1,a);G$1(I$1,a);}
	function Ke(a,b,c){I$1.current!==Fe?t$1("168"):void 0;H$1(I$1,b,a);H$1(J$1,c,a);}function Le(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)e in a?void 0:t$1("108",lc(b)||"Unknown",e);return objectAssign({},c,d)}function Me(a){var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||Fe;Ge=I$1.current;H$1(I$1,b,a);H$1(J$1,J$1.current,a);return !0}
	function Ne(a,b,c){var d=a.stateNode;d?void 0:t$1("169");c?(b=Le(a,b,Ge),d.__reactInternalMemoizedMergedChildContext=b,G$1(J$1,a),G$1(I$1,a),H$1(I$1,b,a)):G$1(J$1,a);H$1(J$1,c,a);}var Oe=null,Pe=null;function Qe(a){return function(b){try{return a(b)}catch(c){}}}
	function Re(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return !1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)return !0;try{var c=b.inject(a);Oe=Qe(function(a){return b.onCommitFiberRoot(c,a)});Pe=Qe(function(a){return b.onCommitFiberUnmount(c,a)});}catch(d){}return !0}
	function Se(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=null;this.index=0;this.ref=null;this.pendingProps=b;this.firstContextDependency=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.effectTag=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childExpirationTime=this.expirationTime=0;this.alternate=null;}function Te(a){a=a.prototype;return !(!a||!a.isReactComponent)}
	function Ue(a,b,c){var d=a.alternate;null===d?(d=new Se(a.tag,b,a.key,a.mode),d.type=a.type,d.stateNode=a.stateNode,d.alternate=a,a.alternate=d):(d.pendingProps=b,d.effectTag=0,d.nextEffect=null,d.firstEffect=null,d.lastEffect=null);d.childExpirationTime=a.childExpirationTime;d.expirationTime=b!==a.pendingProps?c:a.expirationTime;d.child=a.child;d.memoizedProps=a.memoizedProps;d.memoizedState=a.memoizedState;d.updateQueue=a.updateQueue;d.firstContextDependency=a.firstContextDependency;d.sibling=a.sibling;
	d.index=a.index;d.ref=a.ref;return d}
	function Ve(a,b,c){var d=a.type,e=a.key;a=a.props;var f=void 0;if("function"===typeof d)f=Te(d)?2:4;else if("string"===typeof d)f=7;else a:switch(d){case bc:return We(a.children,b,c,e);case gc:f=10;b|=3;break;case cc:f=10;b|=2;break;case dc:return d=new Se(15,a,e,b|4),d.type=dc,d.expirationTime=c,d;case ic:f=16;break;default:if("object"===typeof d&&null!==d)switch(d.$$typeof){case ec:f=12;break a;case fc:f=11;break a;case hc:f=13;break a;default:if("function"===typeof d.then){f=4;break a}}t$1("130",
	null==d?d:typeof d,"");}b=new Se(f,a,e,b);b.type=d;b.expirationTime=c;return b}function We(a,b,c,d){a=new Se(9,a,d,b);a.expirationTime=c;return a}function Xe(a,b,c){a=new Se(8,a,null,b);a.expirationTime=c;return a}function Ye(a,b,c){b=new Se(6,null!==a.children?a.children:[],a.key,b);b.expirationTime=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
	function Ze(a,b){a.didError=!1;var c=a.earliestPendingTime;0===c?a.earliestPendingTime=a.latestPendingTime=b:c>b?a.earliestPendingTime=b:a.latestPendingTime<b&&(a.latestPendingTime=b);$e(b,a);}function $e(a,b){var c=b.earliestSuspendedTime,d=b.latestSuspendedTime,e=b.earliestPendingTime,f=b.latestPingedTime;e=0!==e?e:f;0===e&&(0===a||d>a)&&(e=d);a=e;0!==a&&0!==c&&c<a&&(a=c);b.nextExpirationTimeToWorkOn=e;b.expirationTime=a;}var af=!1;
	function bf(a){return {baseState:a,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function cf(a){return {baseState:a.baseState,firstUpdate:a.firstUpdate,lastUpdate:a.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}
	function df(a){return {expirationTime:a,tag:0,payload:null,callback:null,next:null,nextEffect:null}}function ef(a,b){null===a.lastUpdate?a.firstUpdate=a.lastUpdate=b:(a.lastUpdate.next=b,a.lastUpdate=b);}
	function ff(a,b){var c=a.alternate;if(null===c){var d=a.updateQueue;var e=null;null===d&&(d=a.updateQueue=bf(a.memoizedState));}else d=a.updateQueue,e=c.updateQueue,null===d?null===e?(d=a.updateQueue=bf(a.memoizedState),e=c.updateQueue=bf(c.memoizedState)):d=a.updateQueue=cf(e):null===e&&(e=c.updateQueue=cf(d));null===e||d===e?ef(d,b):null===d.lastUpdate||null===e.lastUpdate?(ef(d,b),ef(e,b)):(ef(d,b),e.lastUpdate=b);}
	function gf(a,b){var c=a.updateQueue;c=null===c?a.updateQueue=bf(a.memoizedState):hf(a,c);null===c.lastCapturedUpdate?c.firstCapturedUpdate=c.lastCapturedUpdate=b:(c.lastCapturedUpdate.next=b,c.lastCapturedUpdate=b);}function hf(a,b){var c=a.alternate;null!==c&&b===c.updateQueue&&(b=a.updateQueue=cf(b));return b}
	function jf(a,b,c,d,e,f){switch(c.tag){case 1:return a=c.payload,"function"===typeof a?a.call(f,d,e):a;case 3:a.effectTag=a.effectTag&-1025|64;case 0:a=c.payload;e="function"===typeof a?a.call(f,d,e):a;if(null===e||void 0===e)break;return objectAssign({},d,e);case 2:af=!0;}return d}
	function kf(a,b,c,d,e){af=!1;b=hf(a,b);for(var f=b.baseState,g=null,h=0,k=b.firstUpdate,l=f;null!==k;){var m=k.expirationTime;if(m>e){if(null===g&&(g=k,f=l),0===h||h>m)h=m;}else l=jf(a,b,k,l,c,d),null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastEffect?b.firstEffect=b.lastEffect=k:(b.lastEffect.nextEffect=k,b.lastEffect=k));k=k.next;}m=null;for(k=b.firstCapturedUpdate;null!==k;){var r=k.expirationTime;if(r>e){if(null===m&&(m=k,null===g&&(f=l)),0===h||h>r)h=r;}else l=jf(a,b,k,l,c,d),
	null!==k.callback&&(a.effectTag|=32,k.nextEffect=null,null===b.lastCapturedEffect?b.firstCapturedEffect=b.lastCapturedEffect=k:(b.lastCapturedEffect.nextEffect=k,b.lastCapturedEffect=k));k=k.next;}null===g&&(b.lastUpdate=null);null===m?b.lastCapturedUpdate=null:a.effectTag|=32;null===g&&null===m&&(f=l);b.baseState=f;b.firstUpdate=g;b.firstCapturedUpdate=m;a.expirationTime=h;a.memoizedState=l;}
	function lf(a,b,c){null!==b.firstCapturedUpdate&&(null!==b.lastUpdate&&(b.lastUpdate.next=b.firstCapturedUpdate,b.lastUpdate=b.lastCapturedUpdate),b.firstCapturedUpdate=b.lastCapturedUpdate=null);mf(b.firstEffect,c);b.firstEffect=b.lastEffect=null;mf(b.firstCapturedEffect,c);b.firstCapturedEffect=b.lastCapturedEffect=null;}function mf(a,b){for(;null!==a;){var c=a.callback;if(null!==c){a.callback=null;var d=b;"function"!==typeof c?t$1("191",c):void 0;c.call(d);}a=a.nextEffect;}}
	function nf(a,b){return {value:a,source:b,stack:mc(b)}}var of={current:null},pf=null,qf=null,rf=null;function sf(a,b){var c=a.type._context;H$1(of,c._currentValue,a);c._currentValue=b;}function tf(a){var b=of.current;G$1(of,a);a.type._context._currentValue=b;}function uf(a){pf=a;rf=qf=null;a.firstContextDependency=null;}
	function vf(a,b){if(rf!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)rf=a,b=1073741823;b={context:a,observedBits:b,next:null};null===qf?(null===pf?t$1("277"):void 0,pf.firstContextDependency=qf=b):qf=qf.next=b;}return a._currentValue}var wf={},L$1={current:wf},xf={current:wf},yf={current:wf};function zf(a){a===wf?t$1("174"):void 0;return a}
	function Af(a,b){H$1(yf,b,a);H$1(xf,a,a);H$1(L$1,wf,a);var c=b.nodeType;switch(c){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:le(null,"");break;default:c=8===c?b.parentNode:b,b=c.namespaceURI||null,c=c.tagName,b=le(b,c);}G$1(L$1,a);H$1(L$1,b,a);}function Bf(a){G$1(L$1,a);G$1(xf,a);G$1(yf,a);}function Cf(a){zf(yf.current);var b=zf(L$1.current);var c=le(b,a.type);b!==c&&(H$1(xf,a,a),H$1(L$1,c,a));}function Df(a){xf.current===a&&(G$1(L$1,a),G$1(xf,a));}var Ef=(new react.Component).refs;
	function Ff(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:objectAssign({},b,c);a.memoizedState=c;d=a.updateQueue;null!==d&&0===a.expirationTime&&(d.baseState=c);}
	var Jf={isMounted:function(a){return (a=a._reactInternalFiber)?2===jd(a):!1},enqueueSetState:function(a,b,c){a=a._reactInternalFiber;var d=Gf();d=Hf(d,a);var e=df(d);e.payload=b;void 0!==c&&null!==c&&(e.callback=c);ff(a,e);If(a,d);},enqueueReplaceState:function(a,b,c){a=a._reactInternalFiber;var d=Gf();d=Hf(d,a);var e=df(d);e.tag=1;e.payload=b;void 0!==c&&null!==c&&(e.callback=c);ff(a,e);If(a,d);},enqueueForceUpdate:function(a,b){a=a._reactInternalFiber;var c=Gf();c=Hf(c,a);var d=df(c);d.tag=2;void 0!==
	b&&null!==b&&(d.callback=b);ff(a,d);If(a,c);}};function Kf(a,b,c,d,e,f,g){a=a.stateNode;return "function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!id(c,d)||!id(e,f):!0}function Lf(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Jf.enqueueReplaceState(b,b.state,null);}
	function Mf(a,b,c,d){var e=a.stateNode,f=K$1(b)?Ge:I$1.current;e.props=c;e.state=a.memoizedState;e.refs=Ef;e.context=He(a,f);f=a.updateQueue;null!==f&&(kf(a,f,c,e,d),e.state=a.memoizedState);f=b.getDerivedStateFromProps;"function"===typeof f&&(Ff(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,"function"===typeof e.componentWillMount&&
	e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Jf.enqueueReplaceState(e,e.state,null),f=a.updateQueue,null!==f&&(kf(a,f,c,e,d),e.state=a.memoizedState));"function"===typeof e.componentDidMount&&(a.effectTag|=4);}var Nf=Array.isArray;
	function Of(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;var d=void 0;c&&(2!==c.tag&&3!==c.tag?t$1("110"):void 0,d=c.stateNode);d?void 0:t$1("147",a);var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Ef&&(b=d.refs={});null===a?delete b[e]:b[e]=a;};b._stringRef=e;return b}"string"!==typeof a?t$1("284"):void 0;c._owner?void 0:t$1("254",a);}return a}
	function Pf(a,b){"textarea"!==a.type&&t$1("31","[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b,"");}
	function Qf(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.effectTag=8;}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b,c){a=Ue(a,b,c);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.effectTag=
	2,c):d;b.effectTag=2;return c}function g(b){a&&null===b.alternate&&(b.effectTag=2);return b}function h(a,b,c,d){if(null===b||8!==b.tag)return b=Xe(c,a.mode,d),b.return=a,b;b=e(b,c,d);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.type===c.type)return d=e(b,c.props,d),d.ref=Of(a,b,c),d.return=a,d;d=Ve(c,a.mode,d);d.ref=Of(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||6!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
	Ye(c,a.mode,d),b.return=a,b;b=e(b,c.children||[],d);b.return=a;return b}function m(a,b,c,d,f){if(null===b||9!==b.tag)return b=We(c,a.mode,d,f),b.return=a,b;b=e(b,c,d);b.return=a;return b}function r(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Xe(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case $b:return c=Ve(b,a.mode,c),c.ref=Of(a,null,b),c.return=a,c;case ac:return b=Ye(b,a.mode,c),b.return=a,b}if(Nf(b)||kc(b))return b=We(b,a.mode,c,null),b.return=
	a,b;Pf(a,b);}return null}function A(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case $b:return c.key===e?c.type===bc?m(a,b,c.props.children,d,e):k(a,b,c,d):null;case ac:return c.key===e?l(a,b,c,d):null}if(Nf(c)||kc(c))return null!==e?null:m(a,b,c,d,null);Pf(a,c);}return null}function S(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);
	if("object"===typeof d&&null!==d){switch(d.$$typeof){case $b:return a=a.get(null===d.key?c:d.key)||null,d.type===bc?m(b,a,d.props.children,e,d.key):k(b,a,d,e);case ac:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Nf(d)||kc(d))return a=a.get(c)||null,m(b,a,d,e,null);Pf(b,d);}return null}function B(e,g,h,k){for(var l=null,m=null,p=g,u=g=0,q=null;null!==p&&u<h.length;u++){p.index>u?(q=p,p=null):q=p.sibling;var v=A(e,p,h[u],k);if(null===v){null===p&&(p=q);break}a&&p&&null===v.alternate&&b(e,
	p);g=f(v,g,u);null===m?l=v:m.sibling=v;m=v;p=q;}if(u===h.length)return c(e,p),l;if(null===p){for(;u<h.length;u++)if(p=r(e,h[u],k))g=f(p,g,u),null===m?l=p:m.sibling=p,m=p;return l}for(p=d(e,p);u<h.length;u++)if(q=S(p,e,u,h[u],k))a&&null!==q.alternate&&p.delete(null===q.key?u:q.key),g=f(q,g,u),null===m?l=q:m.sibling=q,m=q;a&&p.forEach(function(a){return b(e,a)});return l}function P(e,g,h,k){var l=kc(h);"function"!==typeof l?t$1("150"):void 0;h=l.call(h);null==h?t$1("151"):void 0;for(var m=l=null,p=g,u=g=
	0,q=null,v=h.next();null!==p&&!v.done;u++,v=h.next()){p.index>u?(q=p,p=null):q=p.sibling;var x=A(e,p,v.value,k);if(null===x){p||(p=q);break}a&&p&&null===x.alternate&&b(e,p);g=f(x,g,u);null===m?l=x:m.sibling=x;m=x;p=q;}if(v.done)return c(e,p),l;if(null===p){for(;!v.done;u++,v=h.next())v=r(e,v.value,k),null!==v&&(g=f(v,g,u),null===m?l=v:m.sibling=v,m=v);return l}for(p=d(e,p);!v.done;u++,v=h.next())v=S(p,e,u,v.value,k),null!==v&&(a&&null!==v.alternate&&p.delete(null===v.key?u:v.key),g=f(v,g,u),null===
	m?l=v:m.sibling=v,m=v);a&&p.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===bc&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case $b:a:{l=f.key;for(k=d;null!==k;){if(k.key===l)if(9===k.tag?f.type===bc:k.type===f.type){c(a,k.sibling);d=e(k,f.type===bc?f.props.children:f.props,h);d.ref=Of(a,k,f);d.return=a;a=d;break a}else{c(a,k);break}else b(a,k);k=k.sibling;}f.type===bc?(d=We(f.props.children,
	a.mode,h,f.key),d.return=a,a=d):(h=Ve(f,a.mode,h),h.ref=Of(a,d,f),h.return=a,a=h);}return g(a);case ac:a:{for(k=f.key;null!==d;){if(d.key===k)if(6===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[],h);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling;}d=Ye(f,a.mode,h);d.return=a;a=d;}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&8===d.tag?(c(a,d.sibling),d=e(d,f,h),d.return=
	a,a=d):(c(a,d),d=Xe(f,a.mode,h),d.return=a,a=d),g(a);if(Nf(f))return B(a,d,f,h);if(kc(f))return P(a,d,f,h);l&&Pf(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 2:case 3:case 0:h=a.type,t$1("152",h.displayName||h.name||"Component");}return c(a,d)}}var Rf=Qf(!0),Sf=Qf(!1),Tf=null,Uf=null,Vf=!1;function Wf(a,b){var c=new Se(7,null,null,0);c.type="DELETED";c.stateNode=b;c.return=a;c.effectTag=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c;}
	function Xf(a,b){switch(a.tag){case 7:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 8:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;default:return !1}}function Yf(a){if(Vf){var b=Uf;if(b){var c=b;if(!Xf(a,b)){b=Be(c);if(!b||!Xf(a,b)){a.effectTag|=2;Vf=!1;Tf=a;return}Wf(Tf,c);}Tf=a;Uf=Ce(b);}else a.effectTag|=2,Vf=!1,Tf=a;}}
	function Zf(a){for(a=a.return;null!==a&&7!==a.tag&&5!==a.tag;)a=a.return;Tf=a;}function $f(a){if(a!==Tf)return !1;if(!Vf)return Zf(a),Vf=!0,!1;var b=a.type;if(7!==a.tag||"head"!==b&&"body"!==b&&!Ae(b,a.memoizedProps))for(b=Uf;b;)Wf(a,b),b=Be(b);Zf(a);Uf=Tf?Be(a.stateNode):null;return !0}function ag(){Uf=Tf=null;Vf=!1;}
	function bg(a){switch(a._reactStatus){case 1:return a._reactResult;case 2:throw a._reactResult;case 0:throw a;default:throw a._reactStatus=0,a.then(function(b){if(0===a._reactStatus){a._reactStatus=1;if("object"===typeof b&&null!==b){var c=b.default;b=void 0!==c&&null!==c?c:b;}a._reactResult=b;}},function(b){0===a._reactStatus&&(a._reactStatus=2,a._reactResult=b);}),a;}}var cg=Yb.ReactCurrentOwner;function M$1(a,b,c,d){b.child=null===a?Sf(b,null,c,d):Rf(b,a.child,c,d);}
	function dg(a,b,c,d,e){c=c.render;var f=b.ref;if(!J$1.current&&b.memoizedProps===d&&f===(null!==a?a.ref:null))return eg(a,b,e);c=c(d,f);M$1(a,b,c,e);b.memoizedProps=d;return b.child}function fg(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.effectTag|=128;}function gg(a,b,c,d,e){var f=K$1(c)?Ge:I$1.current;f=He(b,f);uf(b,e);c=c(d,f);b.effectTag|=1;M$1(a,b,c,e);b.memoizedProps=d;return b.child}
	function hg(a,b,c,d,e){if(K$1(c)){var f=!0;Me(b);}else f=!1;uf(b,e);if(null===a)if(null===b.stateNode){var g=K$1(c)?Ge:I$1.current,h=c.contextTypes,k=null!==h&&void 0!==h;h=k?He(b,g):Fe;var l=new c(d,h);b.memoizedState=null!==l.state&&void 0!==l.state?l.state:null;l.updater=Jf;b.stateNode=l;l._reactInternalFiber=b;k&&(k=b.stateNode,k.__reactInternalMemoizedUnmaskedChildContext=g,k.__reactInternalMemoizedMaskedChildContext=h);Mf(b,c,d,e);d=!0;}else{g=b.stateNode;h=b.memoizedProps;g.props=h;var m=g.context;
	k=K$1(c)?Ge:I$1.current;k=He(b,k);var r=c.getDerivedStateFromProps;(l="function"===typeof r||"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||m!==k)&&Lf(b,g,d,k);af=!1;var A=b.memoizedState;m=g.state=A;var S=b.updateQueue;null!==S&&(kf(b,S,d,g,e),m=b.memoizedState);h!==d||A!==m||J$1.current||af?("function"===typeof r&&(Ff(b,c,r,d),m=b.memoizedState),(h=af||Kf(b,c,h,d,A,m,k))?(l||"function"!==
	typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.effectTag|=4)):("function"===typeof g.componentDidMount&&(b.effectTag|=4),b.memoizedProps=d,b.memoizedState=m),g.props=d,g.state=m,g.context=k,d=h):("function"===typeof g.componentDidMount&&(b.effectTag|=4),d=!1);}else g=b.stateNode,h=
	b.memoizedProps,g.props=h,m=g.context,k=K$1(c)?Ge:I$1.current,k=He(b,k),r=c.getDerivedStateFromProps,(l="function"===typeof r||"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||m!==k)&&Lf(b,g,d,k),af=!1,m=b.memoizedState,A=g.state=m,S=b.updateQueue,null!==S&&(kf(b,S,d,g,e),A=b.memoizedState),h!==d||m!==A||J$1.current||af?("function"===typeof r&&(Ff(b,c,r,d),A=b.memoizedState),(r=af||Kf(b,c,h,d,
	m,A,k))?(l||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,A,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,A,k)),"function"===typeof g.componentDidUpdate&&(b.effectTag|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.effectTag|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&m===a.memoizedState||(b.effectTag|=4),"function"!==
	typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&m===a.memoizedState||(b.effectTag|=256),b.memoizedProps=d,b.memoizedState=A),g.props=d,g.state=A,g.context=k,d=r):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&m===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&m===a.memoizedState||(b.effectTag|=256),d=!1);return ig(a,b,c,d,f,e)}
	function ig(a,b,c,d,e,f){fg(a,b);var g=0!==(b.effectTag&64);if(!d&&!g)return e&&Ne(b,c,!1),eg(a,b,f);d=b.stateNode;cg.current=b;var h=g?null:d.render();b.effectTag|=1;null!==a&&g&&(M$1(a,b,null,f),b.child=null);M$1(a,b,h,f);b.memoizedState=d.state;b.memoizedProps=d.props;e&&Ne(b,c,!0);return b.child}function jg(a){var b=a.stateNode;b.pendingContext?Ke(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Ke(a,b.context,!1);Af(a,b.containerInfo);}
	function ng(a,b){if(a&&a.defaultProps){b=objectAssign({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);}return b}
	function og(a,b,c,d){null!==a?t$1("155"):void 0;var e=b.pendingProps;if("object"===typeof c&&null!==c&&"function"===typeof c.then){c=bg(c);var f=c;f="function"===typeof f?Te(f)?3:1:void 0!==f&&null!==f&&f.$$typeof?14:4;f=b.tag=f;var g=ng(c,e);switch(f){case 1:return gg(a,b,c,g,d);case 3:return hg(a,b,c,g,d);case 14:return dg(a,b,c,g,d);default:t$1("283",c);}}f=He(b,I$1.current);uf(b,d);f=c(e,f);b.effectTag|=1;if("object"===typeof f&&null!==f&&"function"===typeof f.render&&void 0===f.$$typeof){b.tag=2;K$1(c)?
	(g=!0,Me(b)):g=!1;b.memoizedState=null!==f.state&&void 0!==f.state?f.state:null;var h=c.getDerivedStateFromProps;"function"===typeof h&&Ff(b,c,h,e);f.updater=Jf;b.stateNode=f;f._reactInternalFiber=b;Mf(b,c,e,d);return ig(a,b,c,!0,g,d)}b.tag=0;M$1(a,b,f,d);b.memoizedProps=e;return b.child}
	function eg(a,b,c){null!==a&&(b.firstContextDependency=a.firstContextDependency);var d=b.childExpirationTime;if(0===d||d>c)return null;null!==a&&b.child!==a.child?t$1("153"):void 0;if(null!==b.child){a=b.child;c=Ue(a,a.pendingProps,a.expirationTime);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Ue(a,a.pendingProps,a.expirationTime),c.return=b;c.sibling=null;}return b.child}
	function pg(a,b,c){var d=b.expirationTime;if(!J$1.current&&(0===d||d>c)){switch(b.tag){case 5:jg(b);ag();break;case 7:Cf(b);break;case 2:K$1(b.type)&&Me(b);break;case 3:K$1(b.type._reactResult)&&Me(b);break;case 6:Af(b,b.stateNode.containerInfo);break;case 12:sf(b,b.memoizedProps.value);}return eg(a,b,c)}b.expirationTime=0;switch(b.tag){case 4:return og(a,b,b.type,c);case 0:return gg(a,b,b.type,b.pendingProps,c);case 1:var e=b.type._reactResult;d=b.pendingProps;a=gg(a,b,e,ng(e,d),c);b.memoizedProps=d;return a;
	case 2:return hg(a,b,b.type,b.pendingProps,c);case 3:return e=b.type._reactResult,d=b.pendingProps,a=hg(a,b,e,ng(e,d),c),b.memoizedProps=d,a;case 5:jg(b);d=b.updateQueue;null===d?t$1("282"):void 0;e=b.memoizedState;e=null!==e?e.element:null;kf(b,d,b.pendingProps,null,c);d=b.memoizedState.element;if(d===e)ag(),b=eg(a,b,c);else{e=b.stateNode;if(e=(null===a||null===a.child)&&e.hydrate)Uf=Ce(b.stateNode.containerInfo),Tf=b,e=Vf=!0;e?(b.effectTag|=2,b.child=Sf(b,null,d,c)):(M$1(a,b,d,c),ag());b=b.child;}return b;
	case 7:Cf(b);null===a&&Yf(b);d=b.type;e=b.pendingProps;var f=null!==a?a.memoizedProps:null,g=e.children;Ae(d,e)?g=null:null!==f&&Ae(d,f)&&(b.effectTag|=16);fg(a,b);1073741823!==c&&b.mode&1&&e.hidden?(b.expirationTime=1073741823,b.memoizedProps=e,b=null):(M$1(a,b,g,c),b.memoizedProps=e,b=b.child);return b;case 8:return null===a&&Yf(b),b.memoizedProps=b.pendingProps,null;case 16:return null;case 6:return Af(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Rf(b,null,d,c):M$1(a,b,d,c),b.memoizedProps=
	d,b.child;case 13:return dg(a,b,b.type,b.pendingProps,c);case 14:return e=b.type._reactResult,d=b.pendingProps,a=dg(a,b,e,ng(e,d),c),b.memoizedProps=d,a;case 9:return d=b.pendingProps,M$1(a,b,d,c),b.memoizedProps=d,b.child;case 10:return d=b.pendingProps.children,M$1(a,b,d,c),b.memoizedProps=d,b.child;case 15:return d=b.pendingProps,M$1(a,b,d.children,c),b.memoizedProps=d,b.child;case 12:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;b.memoizedProps=e;sf(b,f);if(null!==g){var h=g.value;
	f=h===f&&(0!==h||1/h===1/f)||h!==h&&f!==f?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0;if(0===f){if(g.children===e.children&&!J$1.current){b=eg(a,b,c);break a}}else for(g=b.child,null!==g&&(g.return=b);null!==g;){h=g.firstContextDependency;if(null!==h){do{if(h.context===d&&0!==(h.observedBits&f)){if(2===g.tag||3===g.tag){var k=df(c);k.tag=2;ff(g,k);}if(0===g.expirationTime||g.expirationTime>c)g.expirationTime=c;k=g.alternate;null!==k&&(0===k.expirationTime||
	k.expirationTime>c)&&(k.expirationTime=c);for(var l=g.return;null!==l;){k=l.alternate;if(0===l.childExpirationTime||l.childExpirationTime>c)l.childExpirationTime=c,null!==k&&(0===k.childExpirationTime||k.childExpirationTime>c)&&(k.childExpirationTime=c);else if(null!==k&&(0===k.childExpirationTime||k.childExpirationTime>c))k.childExpirationTime=c;else break;l=l.return;}}k=g.child;h=h.next;}while(null!==h)}else k=12===g.tag?g.type===b.type?null:g.child:g.child;if(null!==k)k.return=g;else for(k=g;null!==
	k;){if(k===b){k=null;break}g=k.sibling;if(null!==g){g.return=k.return;k=g;break}k=k.return;}g=k;}}M$1(a,b,e.children,c);b=b.child;}return b;case 11:return f=b.type,d=b.pendingProps,e=d.children,uf(b,c),f=vf(f,d.unstable_observedBits),e=e(f),b.effectTag|=1,M$1(a,b,e,c),b.memoizedProps=d,b.child;default:t$1("156");}}function qg(a){a.effectTag|=4;}var rg=void 0,sg=void 0,tg=void 0;rg=function(){};
	sg=function(a,b,c,d,e){var f=a.memoizedProps;if(f!==d){var g=b.stateNode;zf(L$1.current);a=null;switch(c){case "input":f=zc(g,f);d=zc(g,d);a=[];break;case "option":f=de(g,f);d=de(g,d);a=[];break;case "select":f=objectAssign({},f,{value:void 0});d=objectAssign({},d,{value:void 0});a=[];break;case "textarea":f=fe(g,f);d=fe(g,d);a=[];break;default:"function"!==typeof f.onClick&&"function"===typeof d.onClick&&(g.onclick=we);}te(c,d);g=c=void 0;var h=null;for(c in f)if(!d.hasOwnProperty(c)&&f.hasOwnProperty(c)&&null!=f[c])if("style"===
	c){var k=f[c];for(g in k)k.hasOwnProperty(g)&&(h||(h={}),h[g]="");}else"dangerouslySetInnerHTML"!==c&&"children"!==c&&"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&"autoFocus"!==c&&(sa.hasOwnProperty(c)?a||(a=[]):(a=a||[]).push(c,null));for(c in d){var l=d[c];k=null!=f?f[c]:void 0;if(d.hasOwnProperty(c)&&l!==k&&(null!=l||null!=k))if("style"===c)if(k){for(g in k)!k.hasOwnProperty(g)||l&&l.hasOwnProperty(g)||(h||(h={}),h[g]="");for(g in l)l.hasOwnProperty(g)&&k[g]!==l[g]&&(h||
	(h={}),h[g]=l[g]);}else h||(a||(a=[]),a.push(c,h)),h=l;else"dangerouslySetInnerHTML"===c?(l=l?l.__html:void 0,k=k?k.__html:void 0,null!=l&&k!==l&&(a=a||[]).push(c,""+l)):"children"===c?k===l||"string"!==typeof l&&"number"!==typeof l||(a=a||[]).push(c,""+l):"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&(sa.hasOwnProperty(c)?(null!=l&&ve(e,c),a||k===l||(a=[])):(a=a||[]).push(c,l));}h&&(a=a||[]).push("style",h);e=a;(b.updateQueue=e)&&qg(b);}};tg=function(a,b,c,d){c!==d&&qg(b);};
	function ug(a,b){var c=b.source,d=b.stack;null===d&&null!==c&&(d=mc(c));null!==c&&lc(c.type);b=b.value;null!==a&&2===a.tag&&lc(a.type);try{console.error(b);}catch(e){setTimeout(function(){throw e;});}}function vg(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null);}catch(c){wg(a,c);}else b.current=null;}
	function xg(a){"function"===typeof Pe&&Pe(a);switch(a.tag){case 2:case 3:vg(a);var b=a.stateNode;if("function"===typeof b.componentWillUnmount)try{b.props=a.memoizedProps,b.state=a.memoizedState,b.componentWillUnmount();}catch(c){wg(a,c);}break;case 7:vg(a);break;case 6:yg(a);}}function zg(a){return 7===a.tag||5===a.tag||6===a.tag}
	function Ag(a){a:{for(var b=a.return;null!==b;){if(zg(b)){var c=b;break a}b=b.return;}t$1("160");c=void 0;}var d=b=void 0;switch(c.tag){case 7:b=c.stateNode;d=!1;break;case 5:b=c.stateNode.containerInfo;d=!0;break;case 6:b=c.stateNode.containerInfo;d=!0;break;default:t$1("161");}c.effectTag&16&&(oe(b,""),c.effectTag&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||zg(c.return)){c=null;break a}c=c.return;}c.sibling.return=c.return;for(c=c.sibling;7!==c.tag&&8!==c.tag;){if(c.effectTag&2)continue b;
	if(null===c.child||6===c.tag)continue b;else c.child.return=c,c=c.child;}if(!(c.effectTag&2)){c=c.stateNode;break a}}for(var e=a;;){if(7===e.tag||8===e.tag)if(c)if(d){var f=b,g=e.stateNode,h=c;8===f.nodeType?f.parentNode.insertBefore(g,h):f.insertBefore(g,h);}else b.insertBefore(e.stateNode,c);else d?(f=b,g=e.stateNode,8===f.nodeType?(h=f.parentNode,h.insertBefore(g,f)):(h=f,h.appendChild(g)),null===h.onclick&&(h.onclick=we)):b.appendChild(e.stateNode);else if(6!==e.tag&&null!==e.child){e.child.return=
	e;e=e.child;continue}if(e===a)break;for(;null===e.sibling;){if(null===e.return||e.return===a)return;e=e.return;}e.sibling.return=e.return;e=e.sibling;}}
	function yg(a){for(var b=a,c=!1,d=void 0,e=void 0;;){if(!c){c=b.return;a:for(;;){null===c?t$1("160"):void 0;switch(c.tag){case 7:d=c.stateNode;e=!1;break a;case 5:d=c.stateNode.containerInfo;e=!0;break a;case 6:d=c.stateNode.containerInfo;e=!0;break a}c=c.return;}c=!0;}if(7===b.tag||8===b.tag){a:for(var f=b,g=f;;)if(xg(g),null!==g.child&&6!==g.tag)g.child.return=g,g=g.child;else{if(g===f)break;for(;null===g.sibling;){if(null===g.return||g.return===f)break a;g=g.return;}g.sibling.return=g.return;g=g.sibling;}e?
	(f=d,g=b.stateNode,8===f.nodeType?f.parentNode.removeChild(g):f.removeChild(g)):d.removeChild(b.stateNode);}else if(6===b.tag?(d=b.stateNode.containerInfo,e=!0):xg(b),null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return;b=b.return;6===b.tag&&(c=!1);}b.sibling.return=b.return;b=b.sibling;}}
	function Bg(a,b){switch(b.tag){case 2:case 3:break;case 7:var c=b.stateNode;if(null!=c){var d=b.memoizedProps,e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[Ja]=d;"input"===a&&"radio"===d.type&&null!=d.name&&Cc(c,d);ue(a,e);b=ue(a,d);for(e=0;e<f.length;e+=2){var g=f[e],h=f[e+1];"style"===g?re(c,h):"dangerouslySetInnerHTML"===g?ne(c,h):"children"===g?oe(c,h):xc(c,g,h,b);}switch(a){case "input":Dc(c,d);break;case "textarea":he(c,d);break;case "select":a=c._wrapperState.wasMultiple,
	c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?ee(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?ee(c,!!d.multiple,d.defaultValue,!0):ee(c,!!d.multiple,d.multiple?[]:"",!1));}}}break;case 8:null===b.stateNode?t$1("162"):void 0;b.stateNode.nodeValue=b.memoizedProps;break;case 5:break;case 15:break;case 16:break;default:t$1("163");}}function Cg(a,b,c){c=df(c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Dg(d);ug(a,b);};return c}
	function Eg(a,b,c){c=df(c);c.tag=3;var d=a.stateNode;null!==d&&"function"===typeof d.componentDidCatch&&(c.callback=function(){null===Fg?Fg=new Set([this]):Fg.add(this);var c=b.value,d=b.stack;ug(a,b);this.componentDidCatch(c,{componentStack:null!==d?d:""});});return c}
	function Gg(a){switch(a.tag){case 2:K$1(a.type)&&Ie(a);var b=a.effectTag;return b&1024?(a.effectTag=b&-1025|64,a):null;case 3:return K$1(a.type._reactResult)&&Ie(a),b=a.effectTag,b&1024?(a.effectTag=b&-1025|64,a):null;case 5:return Bf(a),Je(a),b=a.effectTag,0!==(b&64)?t$1("285"):void 0,a.effectTag=b&-1025|64,a;case 7:return Df(a),null;case 16:return b=a.effectTag,b&1024?(a.effectTag=b&-1025|64,a):null;case 6:return Bf(a),null;case 12:return tf(a),null;default:return null}}
	var Hg={readContext:vf},Ig=Yb.ReactCurrentOwner,Jg=0,Kg=0,Lg=!1,N$1=null,Mg=null,O$1=0,Ng=!1,Q$1=null,Og=!1,Fg=null;function Pg(){if(null!==N$1)for(var a=N$1.return;null!==a;){var b=a;switch(b.tag){case 2:var c=b.type.childContextTypes;null!==c&&void 0!==c&&Ie(b);break;case 3:c=b.type._reactResult.childContextTypes;null!==c&&void 0!==c&&Ie(b);break;case 5:Bf(b);Je(b);break;case 7:Df(b);break;case 6:Bf(b);break;case 12:tf(b);}a=a.return;}Mg=null;O$1=0;Ng=!1;N$1=null;}
	function Qg(a){for(;;){var b=a.alternate,c=a.return,d=a.sibling;if(0===(a.effectTag&512)){var e=b;b=a;var f=b.pendingProps;switch(b.tag){case 0:case 1:break;case 2:K$1(b.type)&&Ie(b);break;case 3:K$1(b.type._reactResult)&&Ie(b);break;case 5:Bf(b);Je(b);f=b.stateNode;f.pendingContext&&(f.context=f.pendingContext,f.pendingContext=null);if(null===e||null===e.child)$f(b),b.effectTag&=-3;rg(b);break;case 7:Df(b);var g=zf(yf.current),h=b.type;if(null!==e&&null!=b.stateNode)sg(e,b,h,f,g),e.ref!==b.ref&&(b.effectTag|=
	128);else if(f){var k=zf(L$1.current);if($f(b)){f=b;e=f.stateNode;var l=f.type,m=f.memoizedProps,r=g;e[Ia]=f;e[Ja]=m;h=void 0;g=l;switch(g){case "iframe":case "object":F$1("load",e);break;case "video":case "audio":for(l=0;l<fb.length;l++)F$1(fb[l],e);break;case "source":F$1("error",e);break;case "img":case "image":case "link":F$1("error",e);F$1("load",e);break;case "form":F$1("reset",e);F$1("submit",e);break;case "details":F$1("toggle",e);break;case "input":Bc(e,m);F$1("invalid",e);ve(r,"onChange");break;case "select":e._wrapperState=
	{wasMultiple:!!m.multiple};F$1("invalid",e);ve(r,"onChange");break;case "textarea":ge(e,m),F$1("invalid",e),ve(r,"onChange");}te(g,m);l=null;for(h in m)m.hasOwnProperty(h)&&(k=m[h],"children"===h?"string"===typeof k?e.textContent!==k&&(l=["children",k]):"number"===typeof k&&e.textContent!==""+k&&(l=["children",""+k]):sa.hasOwnProperty(h)&&null!=k&&ve(r,h));switch(g){case "input":Wb(e);Fc(e,m,!0);break;case "textarea":Wb(e);ie(e,m);break;case "select":case "option":break;default:"function"===typeof m.onClick&&
	(e.onclick=we);}h=l;f.updateQueue=h;f=null!==h?!0:!1;f&&qg(b);}else{m=b;e=h;r=f;l=9===g.nodeType?g:g.ownerDocument;k===je.html&&(k=ke(e));k===je.html?"script"===e?(e=l.createElement("div"),e.innerHTML="<script>\x3c/script>",l=e.removeChild(e.firstChild)):"string"===typeof r.is?l=l.createElement(e,{is:r.is}):(l=l.createElement(e),"select"===e&&r.multiple&&(l.multiple=!0)):l=l.createElementNS(k,e);e=l;e[Ia]=m;e[Ja]=f;a:for(m=e,r=b,l=r.child;null!==l;){if(7===l.tag||8===l.tag)m.appendChild(l.stateNode);
	else if(6!==l.tag&&null!==l.child){l.child.return=l;l=l.child;continue}if(l===r)break;for(;null===l.sibling;){if(null===l.return||l.return===r)break a;l=l.return;}l.sibling.return=l.return;l=l.sibling;}r=e;l=h;m=f;var A=g,S=ue(l,m);switch(l){case "iframe":case "object":F$1("load",r);g=m;break;case "video":case "audio":for(g=0;g<fb.length;g++)F$1(fb[g],r);g=m;break;case "source":F$1("error",r);g=m;break;case "img":case "image":case "link":F$1("error",r);F$1("load",r);g=m;break;case "form":F$1("reset",r);F$1("submit",
	r);g=m;break;case "details":F$1("toggle",r);g=m;break;case "input":Bc(r,m);g=zc(r,m);F$1("invalid",r);ve(A,"onChange");break;case "option":g=de(r,m);break;case "select":r._wrapperState={wasMultiple:!!m.multiple};g=objectAssign({},m,{value:void 0});F$1("invalid",r);ve(A,"onChange");break;case "textarea":ge(r,m);g=fe(r,m);F$1("invalid",r);ve(A,"onChange");break;default:g=m;}te(l,g);k=void 0;var B=l,P=r,v=g;for(k in v)if(v.hasOwnProperty(k)){var p=v[k];"style"===k?re(P,p):"dangerouslySetInnerHTML"===k?(p=p?p.__html:void 0,
	null!=p&&ne(P,p)):"children"===k?"string"===typeof p?("textarea"!==B||""!==p)&&oe(P,p):"number"===typeof p&&oe(P,""+p):"suppressContentEditableWarning"!==k&&"suppressHydrationWarning"!==k&&"autoFocus"!==k&&(sa.hasOwnProperty(k)?null!=p&&ve(A,k):null!=p&&xc(P,k,p,S));}switch(l){case "input":Wb(r);Fc(r,m,!1);break;case "textarea":Wb(r);ie(r,m);break;case "option":null!=m.value&&r.setAttribute("value",""+yc(m.value));break;case "select":g=r;g.multiple=!!m.multiple;r=m.value;null!=r?ee(g,!!m.multiple,
	r,!1):null!=m.defaultValue&&ee(g,!!m.multiple,m.defaultValue,!0);break;default:"function"===typeof g.onClick&&(r.onclick=we);}(f=ze(h,f))&&qg(b);b.stateNode=e;}null!==b.ref&&(b.effectTag|=128);}else null===b.stateNode?t$1("166"):void 0;break;case 8:e&&null!=b.stateNode?tg(e,b,e.memoizedProps,f):("string"!==typeof f&&(null===b.stateNode?t$1("166"):void 0),e=zf(yf.current),zf(L$1.current),$f(b)?(f=b,h=f.stateNode,e=f.memoizedProps,h[Ia]=f,(f=h.nodeValue!==e)&&qg(b)):(h=b,f=(9===e.nodeType?e:e.ownerDocument).createTextNode(f),
	f[Ia]=h,b.stateNode=f));break;case 13:case 14:break;case 16:break;case 9:break;case 10:break;case 15:break;case 6:Bf(b);rg(b);break;case 12:tf(b);break;case 11:break;case 4:t$1("167");default:t$1("156");}b=N$1=null;f=a;if(1073741823===O$1||1073741823!==f.childExpirationTime){h=0;for(e=f.child;null!==e;){g=e.expirationTime;m=e.childExpirationTime;if(0===h||0!==g&&g<h)h=g;if(0===h||0!==m&&m<h)h=m;e=e.sibling;}f.childExpirationTime=h;}if(null!==b)return b;null!==c&&0===(c.effectTag&512)&&(null===c.firstEffect&&
	(c.firstEffect=a.firstEffect),null!==a.lastEffect&&(null!==c.lastEffect&&(c.lastEffect.nextEffect=a.firstEffect),c.lastEffect=a.lastEffect),1<a.effectTag&&(null!==c.lastEffect?c.lastEffect.nextEffect=a:c.firstEffect=a,c.lastEffect=a));}else{a=Gg(a,O$1);if(null!==a)return a.effectTag&=511,a;null!==c&&(c.firstEffect=c.lastEffect=null,c.effectTag|=512);}if(null!==d)return d;if(null!==c)a=c;else break}return null}function Rg(a){var b=pg(a.alternate,a,O$1);null===b&&(b=Qg(a));Ig.current=null;return b}
	function Sg(a,b,c){Lg?t$1("243"):void 0;Lg=!0;Ig.currentDispatcher=Hg;var d=a.nextExpirationTimeToWorkOn;if(d!==O$1||a!==Mg||null===N$1)Pg(),Mg=a,O$1=d,N$1=Ue(Mg.current,null,O$1),a.pendingCommitExpirationTime=0;var e=!1;do{try{if(b)for(;null!==N$1&&!Tg();)N$1=Rg(N$1);else for(;null!==N$1;)N$1=Rg(N$1);}catch(r){if(null===N$1)e=!0,Dg(r);else{null===N$1?t$1("271"):void 0;var f=N$1,g=f.return;if(null===g)e=!0,Dg(r);else{a:{var h=g,k=f,l=r;g=O$1;k.effectTag|=512;k.firstEffect=k.lastEffect=null;Ng=!0;l=nf(l,k);do{switch(h.tag){case 5:h.effectTag|=
	1024;h.expirationTime=g;g=Cg(h,l,g);gf(h,g);break a;case 2:case 3:k=l;var m=h.stateNode;if(0===(h.effectTag&64)&&null!==m&&"function"===typeof m.componentDidCatch&&(null===Fg||!Fg.has(m))){h.effectTag|=1024;h.expirationTime=g;g=Eg(h,k,g);gf(h,g);break a}}h=h.return;}while(null!==h)}N$1=Qg(f);continue}}}break}while(1);Lg=!1;rf=qf=pf=Ig.currentDispatcher=null;if(e)Mg=null,a.finishedWork=null;else if(null!==N$1)a.finishedWork=null;else{b=a.current.alternate;null===b?t$1("281"):void 0;Mg=null;if(Ng){e=a.latestPendingTime;
	f=a.latestSuspendedTime;g=a.latestPingedTime;if(0!==e&&e>d||0!==f&&f>d||0!==g&&g>d){a.didError=!1;c=a.latestPingedTime;0!==c&&c<=d&&(a.latestPingedTime=0);c=a.earliestPendingTime;b=a.latestPendingTime;c===d?a.earliestPendingTime=b===d?a.latestPendingTime=0:b:b===d&&(a.latestPendingTime=c);c=a.earliestSuspendedTime;b=a.latestSuspendedTime;0===c?a.earliestSuspendedTime=a.latestSuspendedTime=d:c>d?a.earliestSuspendedTime=d:b<d&&(a.latestSuspendedTime=d);$e(d,a);a.expirationTime=a.expirationTime;return}if(!a.didError&&
	!c){a.didError=!0;a.nextExpirationTimeToWorkOn=d;d=a.expirationTime=1;a.expirationTime=d;return}}a.pendingCommitExpirationTime=d;a.finishedWork=b;}}
	function wg(a,b){var c;a:{Lg&&!Og?t$1("263"):void 0;for(c=a.return;null!==c;){switch(c.tag){case 2:case 3:var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromCatch||"function"===typeof d.componentDidCatch&&(null===Fg||!Fg.has(d))){a=nf(b,a);a=Eg(c,a,1);ff(c,a);If(c,1);c=void 0;break a}break;case 5:a=nf(b,a);a=Cg(c,a,1);ff(c,a);If(c,1);c=void 0;break a}c=c.return;}5===a.tag&&(c=nf(b,a),c=Cg(a,c,1),ff(a,c),If(a,1));c=void 0;}return c}
	function Hf(a,b){0!==Kg?a=Kg:Lg?a=Og?1:O$1:b.mode&1?(a=Ug?2+10*(((a-2+15)/10|0)+1):2+25*(((a-2+500)/25|0)+1),null!==Mg&&a===O$1&&(a+=1)):a=1;Ug&&(0===Vg||a>Vg)&&(Vg=a);return a}
	function If(a,b){a:{if(0===a.expirationTime||a.expirationTime>b)a.expirationTime=b;var c=a.alternate;null!==c&&(0===c.expirationTime||c.expirationTime>b)&&(c.expirationTime=b);var d=a.return;if(null===d&&5===a.tag)a=a.stateNode;else{for(;null!==d;){c=d.alternate;if(0===d.childExpirationTime||d.childExpirationTime>b)d.childExpirationTime=b;null!==c&&(0===c.childExpirationTime||c.childExpirationTime>b)&&(c.childExpirationTime=b);if(null===d.return&&5===d.tag){a=d.stateNode;break a}d=d.return;}a=null;}}if(null!==
	a){!Lg&&0!==O$1&&b<O$1&&Pg();Ze(a,b);if(!Lg||Og||Mg!==a){b=a;a=a.expirationTime;if(null===b.nextScheduledRoot)b.expirationTime=a,null===T$1?(U$1=T$1=b,b.nextScheduledRoot=b):(T$1=T$1.nextScheduledRoot=b,T$1.nextScheduledRoot=U$1);else if(c=b.expirationTime,0===c||a<c)b.expirationTime=a;V$1||(W$1?Wg&&(Y$1=b,Z$1=1,Xg(b,1,!0)):1===a?Yg(1,null):Zg(b,a));}$g>ah&&($g=0,t$1("185"));}}function bh(a,b,c,d,e){var f=Kg;Kg=1;try{return a(b,c,d,e)}finally{Kg=f;}}
	var U$1=null,T$1=null,ch=0,dh=void 0,V$1=!1,Y$1=null,Z$1=0,Vg=0,eh=!1,fh=!1,gh=null,hh=null,W$1=!1,Wg=!1,Ug=!1,ih=null,jh=schedule.unstable_now(),kh=(jh/10|0)+2,lh=kh,ah=50,$g=0,mh=null,nh=1;function oh(){kh=((schedule.unstable_now()-jh)/10|0)+2;}function Zg(a,b){if(0!==ch){if(b>ch)return;null!==dh&&schedule.unstable_cancelScheduledWork(dh);}ch=b;a=schedule.unstable_now()-jh;dh=schedule.unstable_scheduleWork(ph,{timeout:10*(b-2)-a});}function Gf(){if(V$1)return lh;qh();if(0===Z$1||1073741823===Z$1)oh(),lh=kh;return lh}
	function qh(){var a=0,b=null;if(null!==T$1)for(var c=T$1,d=U$1;null!==d;){var e=d.expirationTime;if(0===e){null===c||null===T$1?t$1("244"):void 0;if(d===d.nextScheduledRoot){U$1=T$1=d.nextScheduledRoot=null;break}else if(d===U$1)U$1=e=d.nextScheduledRoot,T$1.nextScheduledRoot=e,d.nextScheduledRoot=null;else if(d===T$1){T$1=c;T$1.nextScheduledRoot=U$1;d.nextScheduledRoot=null;break}else c.nextScheduledRoot=d.nextScheduledRoot,d.nextScheduledRoot=null;d=c.nextScheduledRoot;}else{if(0===a||e<a)a=e,b=d;if(d===T$1)break;if(1===a)break;
	c=d;d=d.nextScheduledRoot;}}Y$1=b;Z$1=a;}function ph(a){if(a.didTimeout&&null!==U$1){oh();var b=U$1;do{var c=b.expirationTime;0!==c&&kh>=c&&(b.nextExpirationTimeToWorkOn=kh);b=b.nextScheduledRoot;}while(b!==U$1)}Yg(0,a);}
	function Yg(a,b){hh=b;qh();if(null!==hh)for(oh(),lh=kh;null!==Y$1&&0!==Z$1&&(0===a||a>=Z$1)&&(!eh||kh>=Z$1);)Xg(Y$1,Z$1,kh>=Z$1),qh(),oh(),lh=kh;else for(;null!==Y$1&&0!==Z$1&&(0===a||a>=Z$1);)Xg(Y$1,Z$1,!0),qh();null!==hh&&(ch=0,dh=null);0!==Z$1&&Zg(Y$1,Z$1);hh=null;eh=!1;$g=0;mh=null;if(null!==ih)for(a=ih,ih=null,b=0;b<a.length;b++){var c=a[b];try{c._onComplete();}catch(d){fh||(fh=!0,gh=d);}}if(fh)throw a=gh,gh=null,fh=!1,a;}
	function Xg(a,b,c){V$1?t$1("245"):void 0;V$1=!0;if(null===hh||c){var d=a.finishedWork;null!==d?rh(a,d,b):(a.finishedWork=null,Sg(a,!1,c),d=a.finishedWork,null!==d&&rh(a,d,b));}else d=a.finishedWork,null!==d?rh(a,d,b):(a.finishedWork=null,Sg(a,!0,c),d=a.finishedWork,null!==d&&(Tg()?a.finishedWork=d:rh(a,d,b)));V$1=!1;}
	function rh(a,b,c){var d=a.firstBatch;if(null!==d&&d._expirationTime<=c&&(null===ih?ih=[d]:ih.push(d),d._defer)){a.finishedWork=b;a.expirationTime=0;return}a.finishedWork=null;a===mh?$g++:(mh=a,$g=0);Og=Lg=!0;a.current===b?t$1("177"):void 0;c=a.pendingCommitExpirationTime;0===c?t$1("261"):void 0;a.pendingCommitExpirationTime=0;d=b.expirationTime;var e=b.childExpirationTime;d=0===d||0!==e&&e<d?e:d;a.didError=!1;0===d?(a.earliestPendingTime=0,a.latestPendingTime=0,a.earliestSuspendedTime=0,a.latestSuspendedTime=
	0,a.latestPingedTime=0):(e=a.latestPendingTime,0!==e&&(e<d?a.earliestPendingTime=a.latestPendingTime=0:a.earliestPendingTime<d&&(a.earliestPendingTime=a.latestPendingTime)),e=a.earliestSuspendedTime,0===e?Ze(a,d):d>a.latestSuspendedTime?(a.earliestSuspendedTime=0,a.latestSuspendedTime=0,a.latestPingedTime=0,Ze(a,d)):d<e&&Ze(a,d));$e(0,a);Ig.current=null;1<b.effectTag?null!==b.lastEffect?(b.lastEffect.nextEffect=b,d=b.firstEffect):d=b:d=b.firstEffect;xe=Gd;e=Td();if(Ud(e)){if("selectionStart"in e)var f=
	{start:e.selectionStart,end:e.selectionEnd};else a:{f=(f=e.ownerDocument)&&f.defaultView||window;var g=f.getSelection&&f.getSelection();if(g&&0!==g.rangeCount){f=g.anchorNode;var h=g.anchorOffset,k=g.focusNode;g=g.focusOffset;try{f.nodeType,k.nodeType;}catch(Xa){f=null;break a}var l=0,m=-1,r=-1,A=0,S=0,B=e,P=null;b:for(;;){for(var v;;){B!==f||0!==h&&3!==B.nodeType||(m=l+h);B!==k||0!==g&&3!==B.nodeType||(r=l+g);3===B.nodeType&&(l+=B.nodeValue.length);if(null===(v=B.firstChild))break;P=B;B=v;}for(;;){if(B===
	e)break b;P===f&&++A===h&&(m=l);P===k&&++S===g&&(r=l);if(null!==(v=B.nextSibling))break;B=P;P=B.parentNode;}B=v;}f=-1===m||-1===r?null:{start:m,end:r};}else f=null;}f=f||{start:0,end:0};}else f=null;ye={focusedElem:e,selectionRange:f};Gd=!1;for(Q$1=d;null!==Q$1;){e=!1;f=void 0;try{for(;null!==Q$1;){if(Q$1.effectTag&256){var p=Q$1.alternate;a:switch(h=Q$1,h.tag){case 2:case 3:if(h.effectTag&256&&null!==p){var u=p.memoizedProps,x=p.memoizedState,R=h.stateNode;R.props=h.memoizedProps;R.state=h.memoizedState;var yh=R.getSnapshotBeforeUpdate(u,
	x);R.__reactInternalSnapshotBeforeUpdate=yh;}break a;case 5:case 7:case 8:case 6:break a;default:t$1("163");}}Q$1=Q$1.nextEffect;}}catch(Xa){e=!0,f=Xa;}e&&(null===Q$1?t$1("178"):void 0,wg(Q$1,f),null!==Q$1&&(Q$1=Q$1.nextEffect));}for(Q$1=d;null!==Q$1;){p=!1;u=void 0;try{for(;null!==Q$1;){var w=Q$1.effectTag;w&16&&oe(Q$1.stateNode,"");if(w&128){var y=Q$1.alternate;if(null!==y){var q=y.ref;null!==q&&("function"===typeof q?q(null):q.current=null);}}switch(w&14){case 2:Ag(Q$1);Q$1.effectTag&=-3;break;case 6:Ag(Q$1);Q$1.effectTag&=-3;Bg(Q$1.alternate,
	Q$1);break;case 4:Bg(Q$1.alternate,Q$1);break;case 8:x=Q$1,yg(x),x.return=null,x.child=null,x.alternate&&(x.alternate.child=null,x.alternate.return=null);}Q$1=Q$1.nextEffect;}}catch(Xa){p=!0,u=Xa;}p&&(null===Q$1?t$1("178"):void 0,wg(Q$1,u),null!==Q$1&&(Q$1=Q$1.nextEffect));}q=ye;y=Td();w=q.focusedElem;u=q.selectionRange;if(y!==w&&w&&w.ownerDocument&&Sd(w.ownerDocument.documentElement,w)){null!==u&&Ud(w)&&(y=u.start,q=u.end,void 0===q&&(q=y),"selectionStart"in w?(w.selectionStart=y,w.selectionEnd=Math.min(q,w.value.length)):
	(p=w.ownerDocument||document,y=(p&&p.defaultView||window).getSelection(),x=w.textContent.length,q=Math.min(u.start,x),u=void 0===u.end?q:Math.min(u.end,x),!y.extend&&q>u&&(x=u,u=q,q=x),x=Rd(w,q),R=Rd(w,u),x&&R&&(1!==y.rangeCount||y.anchorNode!==x.node||y.anchorOffset!==x.offset||y.focusNode!==R.node||y.focusOffset!==R.offset)&&(p=p.createRange(),p.setStart(x.node,x.offset),y.removeAllRanges(),q>u?(y.addRange(p),y.extend(R.node,R.offset)):(p.setEnd(R.node,R.offset),y.addRange(p)))));y=[];for(q=w;q=
	q.parentNode;)1===q.nodeType&&y.push({element:q,left:q.scrollLeft,top:q.scrollTop});"function"===typeof w.focus&&w.focus();for(w=0;w<y.length;w++)q=y[w],q.element.scrollLeft=q.left,q.element.scrollTop=q.top;}ye=null;Gd=!!xe;xe=null;a.current=b;for(Q$1=d;null!==Q$1;){d=!1;w=void 0;try{for(y=c;null!==Q$1;){var Sa=Q$1.effectTag;if(Sa&36){var oc=Q$1.alternate;q=Q$1;p=y;switch(q.tag){case 2:case 3:var X=q.stateNode;if(q.effectTag&4)if(null===oc)X.props=q.memoizedProps,X.state=q.memoizedState,X.componentDidMount();
	else{var Ih=oc.memoizedProps,Jh=oc.memoizedState;X.props=q.memoizedProps;X.state=q.memoizedState;X.componentDidUpdate(Ih,Jh,X.__reactInternalSnapshotBeforeUpdate);}var kg=q.updateQueue;null!==kg&&(X.props=q.memoizedProps,X.state=q.memoizedState,lf(q,kg,X,p));break;case 5:var lg=q.updateQueue;if(null!==lg){u=null;if(null!==q.child)switch(q.child.tag){case 7:u=q.child.stateNode;break;case 2:case 3:u=q.child.stateNode;}lf(q,lg,u,p);}break;case 7:var Kh=q.stateNode;null===oc&&q.effectTag&4&&ze(q.type,q.memoizedProps)&&
	Kh.focus();break;case 8:break;case 6:break;case 15:break;case 16:break;default:t$1("163");}}if(Sa&128){var Ac=Q$1.ref;if(null!==Ac){var mg=Q$1.stateNode;switch(Q$1.tag){case 7:var Pd=mg;break;default:Pd=mg;}"function"===typeof Ac?Ac(Pd):Ac.current=Pd;}}var Lh=Q$1.nextEffect;Q$1.nextEffect=null;Q$1=Lh;}}catch(Xa){d=!0,w=Xa;}d&&(null===Q$1?t$1("178"):void 0,wg(Q$1,w),null!==Q$1&&(Q$1=Q$1.nextEffect));}Lg=Og=!1;"function"===typeof Oe&&Oe(b.stateNode);Sa=b.expirationTime;b=b.childExpirationTime;b=0===Sa||0!==b&&b<Sa?b:Sa;0===b&&(Fg=
	null);a.expirationTime=b;a.finishedWork=null;}function Tg(){return eh?!0:null===hh||hh.timeRemaining()>nh?!1:eh=!0}function Dg(a){null===Y$1?t$1("246"):void 0;Y$1.expirationTime=0;fh||(fh=!0,gh=a);}function sh(a,b){var c=W$1;W$1=!0;try{return a(b)}finally{(W$1=c)||V$1||Yg(1,null);}}function th(a,b){if(W$1&&!Wg){Wg=!0;try{return a(b)}finally{Wg=!1;}}return a(b)}function uh(a,b,c){if(Ug)return a(b,c);W$1||V$1||0===Vg||(Yg(Vg,null),Vg=0);var d=Ug,e=W$1;W$1=Ug=!0;try{return a(b,c)}finally{Ug=d,(W$1=e)||V$1||Yg(1,null);}}
	function vh(a){if(!a)return Fe;a=a._reactInternalFiber;a:{2!==jd(a)||2!==a.tag&&3!==a.tag?t$1("170"):void 0;var b=a;do{switch(b.tag){case 5:b=b.stateNode.context;break a;case 2:if(K$1(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}break;case 3:if(K$1(b.type._reactResult)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return;}while(null!==b);t$1("171");b=void 0;}if(2===a.tag){var c=a.type;if(K$1(c))return Le(a,c,b)}else if(3===a.tag&&(c=a.type._reactResult,K$1(c)))return Le(a,
	c,b);return b}function wh(a,b,c,d,e){var f=b.current;c=vh(c);null===b.context?b.context=c:b.pendingContext=c;b=e;e=df(d);e.payload={element:a};b=void 0===b?null:b;null!==b&&(e.callback=b);ff(f,e);If(f,d);return d}function xh(a,b,c,d){var e=b.current,f=Gf();e=Hf(f,e);return wh(a,b,c,e,d)}function zh(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 7:return a.child.stateNode;default:return a.child.stateNode}}
	function Ah(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return {$$typeof:ac,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
	Fb=function(a,b,c){switch(b){case "input":Dc(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Na(d);e?void 0:t$1("90");Xb(d);Dc(d,e);}}}break;case "textarea":he(a,c);break;case "select":b=c.value,null!=b&&ee(a,!!c.multiple,b,!1);}};
	function Bh(a){var b=2+25*(((Gf()-2+500)/25|0)+1);b<=Jg&&(b=Jg+1);this._expirationTime=Jg=b;this._root=a;this._callbacks=this._next=null;this._hasChildren=this._didComplete=!1;this._children=null;this._defer=!0;}Bh.prototype.render=function(a){this._defer?void 0:t$1("250");this._hasChildren=!0;this._children=a;var b=this._root._internalRoot,c=this._expirationTime,d=new Ch;wh(a,b,null,c,d._onCommit);return d};
	Bh.prototype.then=function(a){if(this._didComplete)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a);}};
	Bh.prototype.commit=function(){var a=this._root._internalRoot,b=a.firstBatch;this._defer&&null!==b?void 0:t$1("251");if(this._hasChildren){var c=this._expirationTime;if(b!==this){this._hasChildren&&(c=this._expirationTime=b._expirationTime,this.render(this._children));for(var d=null,e=b;e!==this;)d=e,e=e._next;null===d?t$1("251"):void 0;d._next=e._next;this._next=b;a.firstBatch=this;}this._defer=!1;b=c;V$1?t$1("253"):void 0;Y$1=a;Z$1=b;Xg(a,b,!0);Yg(1,null);b=this._next;this._next=null;b=a.firstBatch=b;null!==
	b&&b._hasChildren&&b.render(b._children);}else this._next=null,this._defer=!1;};Bh.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++)(0, a[b])();}};function Ch(){this._callbacks=null;this._didCommit=!1;this._onCommit=this._onCommit.bind(this);}Ch.prototype.then=function(a){if(this._didCommit)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a);}};
	Ch.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++){var c=a[b];"function"!==typeof c?t$1("191",c):void 0;c();}}};
	function Dh(a,b,c){b=new Se(5,null,null,b?3:0);a={current:b,containerInfo:a,pendingChildren:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,didError:!1,pendingCommitExpirationTime:0,finishedWork:null,timeoutHandle:-1,context:null,pendingContext:null,hydrate:c,nextExpirationTimeToWorkOn:0,expirationTime:0,firstBatch:null,nextScheduledRoot:null};this._internalRoot=b.stateNode=a;}
	Dh.prototype.render=function(a,b){var c=this._internalRoot,d=new Ch;b=void 0===b?null:b;null!==b&&d.then(b);xh(a,c,null,d._onCommit);return d};Dh.prototype.unmount=function(a){var b=this._internalRoot,c=new Ch;a=void 0===a?null:a;null!==a&&c.then(a);xh(null,b,null,c._onCommit);return c};Dh.prototype.legacy_renderSubtreeIntoContainer=function(a,b,c){var d=this._internalRoot,e=new Ch;c=void 0===c?null:c;null!==c&&e.then(c);xh(b,d,a,e._onCommit);return e};
	Dh.prototype.createBatch=function(){var a=new Bh(this),b=a._expirationTime,c=this._internalRoot,d=c.firstBatch;if(null===d)c.firstBatch=a,a._next=null;else{for(c=null;null!==d&&d._expirationTime<=b;)c=d,d=d._next;a._next=d;null!==c&&(c._next=a);}return a};function Eh(a){return !(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}Lb=sh;Mb=uh;Nb=function(){V$1||0===Vg||(Yg(Vg,null),Vg=0);};
	function Fh(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new Dh(a,!1,b)}
	function Gh(a,b,c,d,e){Eh(c)?void 0:t$1("200");var f=c._reactRootContainer;if(f){if("function"===typeof e){var g=e;e=function(){var a=zh(f._internalRoot);g.call(a);};}null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e);}else{f=c._reactRootContainer=Fh(c,d);if("function"===typeof e){var h=e;e=function(){var a=zh(f._internalRoot);h.call(a);};}th(function(){null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e);});}return zh(f._internalRoot)}
	function Hh(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;Eh(b)?void 0:t$1("200");return Ah(a,b,null,c)}
	var Mh={createPortal:Hh,findDOMNode:function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternalFiber;void 0===b&&("function"===typeof a.render?t$1("188"):t$1("268",Object.keys(a)));a=md(b);a=null===a?null:a.stateNode;return a},hydrate:function(a,b,c){return Gh(null,a,b,!0,c)},render:function(a,b,c){return Gh(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){null==a||void 0===a._reactInternalFiber?t$1("38"):void 0;return Gh(a,b,c,!1,d)},unmountComponentAtNode:function(a){Eh(a)?
	void 0:t$1("40");return a._reactRootContainer?(th(function(){Gh(null,null,a,!1,function(){a._reactRootContainer=null;});}),!0):!1},unstable_createPortal:function(){return Hh.apply(void 0,arguments)},unstable_batchedUpdates:sh,unstable_interactiveUpdates:uh,flushSync:function(a,b){V$1?t$1("187"):void 0;var c=W$1;W$1=!0;try{return bh(a,b)}finally{W$1=c,Yg(1,null);}},unstable_flushControlled:function(a){var b=W$1;W$1=!0;try{bh(a);}finally{(W$1=b)||V$1||Yg(1,null);}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[La,
	Ma,Na,Ea.injectEventPluginsByName,qa,Ua,function(a){za(a,Ta);},Jb,Kb,Id,Ga]},unstable_createRoot:function(a,b){Eh(a)?void 0:t$1("278");return new Dh(a,!0,null!=b&&!0===b.hydrate)}};(function(a){var b=a.findFiberByHostInstance;return Re(objectAssign({},a,{findHostInstanceByFiber:function(a){a=md(a);return null===a?null:a.stateNode},findFiberByHostInstance:function(a){return b?b(a):null}}))})({findFiberByHostInstance:Ka,bundleType:0,version:"16.5.2",rendererPackageName:"react-dom"});
	var Nh={default:Mh},Oh=Nh&&Mh||Nh;var reactDom_production_min=Oh.default||Oh;

	var reactDom = createCommonjsModule(function (module) {

	function checkDCE() {
	  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	  if (
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
	  ) {
	    return;
	  }
	  try {
	    // Verify that the code above has been dead code eliminated (DCE'd).
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    // DevTools shouldn't crash React, no matter what.
	    // We should still report in case we break this code.
	    console.error(err);
	  }
	}

	{
	  // DCE check should happen before ReactDOM bundle executes so that
	  // DevTools can report bad minification during injection.
	  checkDCE();
	  module.exports = reactDom_production_min;
	}
	});
	var reactDom_1 = reactDom.render;

	function assertNever(_, msg) {
	    throw new Error(msg);
	}
	const originUp = {
	    focusOrigin: 'up',
	};
	const originDown = {
	    focusOrigin: 'down',
	};
	const originLeft = {
	    focusOrigin: 'left',
	};
	const originRight = {
	    focusOrigin: 'right',
	};
	function findFieldCoordinates(fieldMap, label, maxX, maxY) {
	    for (let y = 0; y <= maxY; y++) {
	        for (let x = 0; x <= maxX; x++) {
	            if (label === fieldMap[y][x]) {
	                return [x, y];
	            }
	        }
	    }
	    return null;
	}
	function focusDown(fieldMap, getTabRegistry, x, y, maxX, maxY, origin) {
	    const tabRegistry = getTabRegistry();
	    if (y === maxY || tabRegistry == null) {
	        return false;
	    }
	    const yCandidate = y + 1;
	    const nextField = fieldMap[yCandidate][x];
	    return ((nextField != null && tabRegistry.focus(nextField, origin)) ||
	        focusDown(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin));
	}
	function focusLeft(fieldMap, getTabRegistry, x, y, maxX, maxY, origin) {
	    const tabRegistry = getTabRegistry();
	    if (x === 0 || tabRegistry == null) {
	        return false;
	    }
	    const xCandidate = x - 1;
	    const nextField = fieldMap[y][xCandidate];
	    return ((nextField != null && tabRegistry.focus(nextField, origin)) ||
	        focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
	        focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
	        focusLeft(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin));
	}
	function focusRight(fieldMap, getTabRegistry, x, y, maxX, maxY, origin) {
	    const tabRegistry = getTabRegistry();
	    if (x === maxX || tabRegistry == null) {
	        return false;
	    }
	    const xCandidate = x + 1;
	    const nextField = fieldMap[y][xCandidate];
	    return ((nextField != null && tabRegistry.focus(nextField, origin)) ||
	        focusUp(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
	        focusDown(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin) ||
	        focusRight(fieldMap, getTabRegistry, xCandidate, y, maxX, maxY, origin));
	}
	function focusUp(fieldMap, getTabRegistry, x, y, maxX, maxY, origin) {
	    const tabRegistry = getTabRegistry();
	    if (y === 0 || tabRegistry == null) {
	        return false;
	    }
	    const yCandidate = y - 1;
	    const nextField = fieldMap[yCandidate][x];
	    return ((nextField != null && tabRegistry.focus(nextField, origin)) ||
	        focusUp(fieldMap, getTabRegistry, x, yCandidate, maxX, maxY, origin));
	}
	function createNavigationHandler(fieldMap, getTabRegistry) {
	    const maxY = fieldMap.length - 1;
	    const maxX = fieldMap[0].length - 1;
	    return (label, arrowKey) => {
	        const coordinates = findFieldCoordinates(fieldMap, label, maxX, maxY);
	        if (coordinates == null) {
	            return;
	        }
	        const x = coordinates[0];
	        const y = coordinates[1];
	        switch (arrowKey) {
	            case 'ArrowUp':
	                return focusUp(fieldMap, getTabRegistry, x, y, maxX, maxY, originDown);
	            case 'ArrowDown':
	                return focusDown(fieldMap, getTabRegistry, x, y, maxX, maxY, originUp);
	            case 'ArrowLeft':
	                return focusLeft(fieldMap, getTabRegistry, x, y, maxX, maxY, originRight);
	            case 'ArrowRight':
	                return focusRight(fieldMap, getTabRegistry, x, y, maxX, maxY, originLeft);
	            default:
	                return assertNever(arrowKey, `Unknown arrowKey: ${arrowKey}`);
	        }
	    };
	}

	/**
	 * The base error for this package.
	 */
	class CollectionError extends Error {
	    constructor(message) {
	        super(message);
	        this.name = 'CollectionError';
	        Object.setPrototypeOf(this, CollectionError.prototype);
	    }
	}

	/**
	 * Error type for sets.
	 */
	class SetError extends CollectionError {
	    constructor(message) {
	        super(message);
	        this.name = 'SetError';
	        Object.setPrototypeOf(this, SetError.prototype);
	    }
	    /**
	     * Error thrown when trying to set a new value
	     * that already exists.
	     */
	    static duplicate(value) {
	        return new SetError(`The value ${value} does already exist`);
	    }
	    /**
	     * Error thrown when trying to set a new value
	     * that already exists.
	     */
	    static noElements() {
	        return new SetError('The set is empty');
	    }
	    /**
	     * Error thrown when trying to set a new value
	     * that already exists.
	     */
	    static notExists(value) {
	        return new SetError(`The value ${value} does not exist`);
	    }
	}

	/**
	 * Internal data structure used to model doubly linked items.
	 */
	class DoubleLinkedItem {
	    constructor(value, prev, next) {
	        this.value = value;
	        this.prev = prev;
	        this.next = next;
	    }
	}

	/**
	 * Doubly Linked Ordered Set.
	 */
	class DoublyLinkedOrderedSet {
	    constructor(values) {
	        /**
	         * Adds `value` to the set.
	         */
	        this.internalAdd = (value) => {
	            const lastItem = this.lastItem;
	            const item = new DoubleLinkedItem(value, lastItem, null);
	            if (lastItem != null) {
	                lastItem.next = item;
	            }
	            this.arrayList.push(item);
	            this.valueMap.set(value, item);
	        };
	        /**
	         * Enables iterating in `for..of` loops.
	         */
	        this[Symbol.iterator] = function* () {
	            if (this.isEmpty) {
	                return;
	            }
	            let item = this.firstItem;
	            while (item != null) {
	                yield item.value;
	                item = item.next;
	            }
	            return;
	        };
	        /**
	         * Adds `value` to the set.
	         * If the `value` already exist a `SetError` is thrown.
	         */
	        this.add = (value) => {
	            if (this.valueMap.has(value)) {
	                throw new SetError(`The value: ${value} already exists`);
	            }
	            this.internalAdd(value);
	        };
	        /**
	         * Returns an entries iterator.
	         */
	        this.entries = function* () {
	            if (this.isEmpty) {
	                return null;
	            }
	            let item = this.firstItem;
	            while (item != null) {
	                yield [item.value, item.value];
	                item = item.next;
	            }
	            return null;
	        };
	        this.arrayList = [];
	        this.valueMap = new Map();
	        if (values != null) {
	            for (const value of Array.from(values)) {
	                this.add(value);
	            }
	        }
	    }
	    /**
	     * The first value of the ordered set.
	     * Throws a `SetError` if the set is empty.
	     */
	    get first() {
	        const firstItem = this.firstItem;
	        if (firstItem == null) {
	            throw SetError.noElements();
	        }
	        return firstItem.value;
	    }
	    /**
	     * The first internal data structure item of the ordered set.
	     * Throws a `SetError` if the set is empty.
	     */
	    get firstItem() {
	        if (this.isEmpty) {
	            return null;
	        }
	        return this.arrayList[0];
	    }
	    /**
	     * The property is true if the set is empty.
	     */
	    get isEmpty() {
	        return this.size === 0;
	    }
	    /**
	     * The last value of the set.
	     * Throws a `SetError` if the set is empty.
	     */
	    get last() {
	        const lastItem = this.lastItem;
	        if (lastItem == null) {
	            throw SetError.noElements();
	        }
	        return lastItem.value;
	    }
	    /**
	     * The last internal data structure item of the ordered set.
	     * Throws a `SetError` if the set is empty.
	     */
	    get lastItem() {
	        if (this.isEmpty) {
	            return null;
	        }
	        return this.arrayList[this.arrayList.length - 1];
	    }
	    /**
	     * The amount of values in the set.
	     */
	    get size() {
	        return this.arrayList.length;
	    }
	    /**
	     * Constructs an empty `DoublyLinkedOrderedSet`.
	     */
	    static empty() {
	        return new DoublyLinkedOrderedSet();
	    }
	    /**
	     * Constructs a `DoublyLinkedOrderedSet` from an Iterable.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    static from(values) {
	        return new DoublyLinkedOrderedSet(values);
	    }
	    /**
	     * Constructs a `DoublyLinkedOrderedSet` from
	     * with a value from each argument.
	     * If no arguments are provided it constructs an empty set.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    static of(...values) {
	        return DoublyLinkedOrderedSet.from(values);
	    }
	    /**
	     * Sets `value` `afterValue`.
	     * If `value` already exist a `SetError` is thrown.
	     * If `afterValue` does not exist a `SetError` is thrown.
	     */
	    addAfter(value, afterValue) {
	        if (this.valueMap.has(value)) {
	            throw SetError.duplicate(value);
	        }
	        const afterItem = this.valueMap.get(afterValue);
	        if (afterItem == null) {
	            throw SetError.notExists(afterValue);
	        }
	        const afterIdx = this.arrayList.indexOf(afterItem);
	        if (afterIdx === -1) {
	            throw new Error(`The after value exist in valueMap but item does not exist in internal array list`);
	        }
	        const newItem = new DoubleLinkedItem(value, afterItem, afterItem.next);
	        if (afterItem.next != null) {
	            afterItem.next.prev = newItem;
	        }
	        afterItem.next = newItem;
	        this.arrayList.splice(afterIdx + 1, 0, newItem);
	        this.valueMap.set(value, newItem);
	    }
	    /**
	     * Sets `value` `beforeValue`.
	     * If `value` already exist a `SetError` is thrown.
	     * If `beforeValue` does not exist a `SetError` is thrown.
	     */
	    addBefore(value, beforeValue) {
	        if (this.valueMap.has(value)) {
	            throw SetError.duplicate(value);
	        }
	        const beforeItem = this.valueMap.get(beforeValue);
	        if (beforeItem == null) {
	            throw SetError.notExists(beforeValue);
	        }
	        const beforeIdx = this.arrayList.indexOf(beforeItem);
	        if (beforeIdx === -1) {
	            throw new Error(`The after value exist in valueMap but item does not exist in internal array list`);
	        }
	        const newItem = new DoubleLinkedItem(value, beforeItem.prev, beforeItem);
	        if (beforeItem.prev != null) {
	            beforeItem.prev.next = newItem;
	        }
	        beforeItem.prev = newItem;
	        this.arrayList.splice(beforeIdx, 0, newItem);
	        this.valueMap.set(value, newItem);
	    }
	    /**
	     * Clears the set for all values.
	     */
	    clear() {
	        this.arrayList = [];
	        this.valueMap.clear();
	    }
	    /**
	     * Deletes a single `value` from the set.
	     * If the value does not exist, a `SetError` is thrown.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    delete(value) {
	        const item = this.valueMap.get(value);
	        if (item == null) {
	            throw new SetError(`The value ${value} does not exist`);
	        }
	        const idx = this.arrayList.indexOf(item);
	        if (idx === -1) {
	            throw new SetError(`The value ${value} was not found in internal array but in valueMap`);
	        }
	        if (item.prev != null) {
	            item.prev.next = item.next;
	        }
	        if (item.next != null) {
	            item.next.prev = item.prev;
	        }
	        this.arrayList.splice(idx, 1);
	        this.valueMap.delete(value);
	    }
	    /**
	     * Enables to call `iter` on each value in the set.
	     */
	    forEeach(iter) {
	        this.arrayList.forEach((e, i) => iter(e.value, i));
	    }
	    /**
	     * Returns true if `value` exists in the set, otherwise false.
	     */
	    has(value) {
	        return this.valueMap.has(value);
	    }
	    /**
	     * Returns the value after `value`.
	     * If `value` does not exist a `SetError` is thrown.
	     * If `value` is the _last_ value `null` is returned.
	     */
	    next(value) {
	        const item = this.valueMap.get(value);
	        if (item == null) {
	            throw SetError.notExists(value);
	        }
	        if (item.next == null) {
	            return null;
	        }
	        return item.next.value;
	    }
	    /**
	     * Returns the value before `value`.
	     * If `value` does not exist a `SetError` is thrown.
	     * If `value` is the _first_ value `null` is returned.
	     */
	    prev(value) {
	        const item = this.valueMap.get(value);
	        if (item == null) {
	            throw SetError.notExists(value);
	        }
	        if (item.prev == null) {
	            return null;
	        }
	        return item.prev.value;
	    }
	    /**
	     * Overwrites an `existingValue` with `newValue`.
	     * If `newValue` already exist a `SetError` is thrown.
	     * If `existingValue` does not exist a `SetError` is thrown.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    set(existingValue, newValue) {
	        if (this.valueMap.has(newValue)) {
	            throw SetError.duplicate(newValue);
	        }
	        const item = this.valueMap.get(existingValue);
	        if (item == null) {
	            throw SetError.notExists(existingValue);
	        }
	        item.value = newValue;
	        this.valueMap.delete(existingValue);
	        this.valueMap.set(newValue, item);
	    }
	    /**
	     * Moves `existingValue` after `afterValue` in the set.
	     * If any of `existingValue` or `afterValue` don't exist
	     * a `SetError` is thrown.
	     */
	    setAfter(existingValue, afterValue) {
	        if (!this.valueMap.has(existingValue)) {
	            throw SetError.notExists(existingValue);
	        }
	        const afterItem = this.valueMap.get(afterValue);
	        if (afterItem == null) {
	            throw SetError.notExists(afterValue);
	        }
	        if (existingValue === afterValue) {
	            throw SetError.duplicate(existingValue);
	        }
	        this.delete(existingValue);
	        this.addAfter(existingValue, afterValue);
	    }
	    /**
	     * Moves `existingValue` before `beforeValue` in the set.
	     * If any of `existingValue` or `beforeValue` don't exist
	     * a `SetError` is thrown.
	     */
	    setBefore(existingValue, beforeValue) {
	        if (!this.valueMap.has(existingValue)) {
	            throw SetError.notExists(existingValue);
	        }
	        const beforeItem = this.valueMap.get(beforeValue);
	        if (beforeItem == null) {
	            throw SetError.notExists(beforeValue);
	        }
	        if (existingValue === beforeValue) {
	            throw SetError.duplicate(existingValue);
	        }
	        this.delete(existingValue);
	        this.addBefore(existingValue, beforeValue);
	    }
	    /**
	     * Returns string representation of the values in the set.
	     */
	    toString() {
	        if (this.arrayList.length > 3) {
	            return 'DoublyLinkedOrderedSet[\n' + this.arrayList.map(e => '    ' + e.value).join(',\n') + '\n]';
	        }
	        else {
	            return `DoublyLinkedOrderedSet[${this.arrayList.map(e => e.value).join(', ')}]`;
	        }
	    }
	    /**
	     * Returns an iterator of the values in the set.
	     */
	    values() {
	        return this[Symbol.iterator]();
	    }
	}

	const focusOriginNone = { focusOrigin: 'none' };
	const focusOriginNext = { focusOrigin: 'next' };
	const focusOriginPrev = { focusOrigin: 'prev' };
	const focusOriginChild = { focusOrigin: 'child' };
	/**
	 * Library class for controlling complex nested linked structures.
	 */
	class TabRegistry {
	    /**
	     * Constructs a registry with optional parent registry.
	     */
	    constructor(options) {
	        /**
	         * When this is true, the registry won't jump boundries
	         * but just focus the opposite end of the tab registry.
	         */
	        this.cycle = false;
	        /**
	         * Indicator for if focus cycle is running.
	         * This is used for detect infinite loops.
	         */
	        this.focusCycleStartKey = null;
	        /**
	         * Enabling iterating through all the focusers.
	         */
	        this[Symbol.iterator] = function* () {
	            if (this.isEmpty) {
	                return;
	            }
	            let key = this.firstKey;
	            while (key) {
	                if (key instanceof TabRegistry) {
	                    yield* Array.from(key);
	                }
	                else {
	                    yield this.focuserMap.get(key);
	                }
	                key = this.getNextKey(key);
	            }
	        };
	        /**
	         * Returns an iterator of all the `keys` in this registry.
	         */
	        this.keys = function* () {
	            if (this.registry.isEmpty) {
	                return;
	            }
	            let key = this.registry.first;
	            while (key) {
	                yield key;
	                key = this.getNextKey(key);
	            }
	        };
	        /**
	         * Returns an iterator of all the `keys` in this
	         * and all nested registries.
	         */
	        this.keysRecursive = function* () {
	            if (this.registry.isEmpty) {
	                return;
	            }
	            let key = this.registry.first;
	            while (key) {
	                const focuser = this.focuserMap.get(key);
	                if (focuser instanceof TabRegistry) {
	                    yield* Array.from(focuser.keysRecursive());
	                }
	                else {
	                    yield key;
	                }
	                key = this.getNextKey(key);
	            }
	        };
	        this.focuserMap = new Map();
	        this.registry = new DoublyLinkedOrderedSet();
	        this.internalParentRegistry = null;
	        if (options == null) {
	            this.cycle = false;
	            this.focusParentOnChildOrigin = false;
	        }
	        else {
	            this.cycle = options.cycle === true;
	            this.focusParentOnChildOrigin = options.focusParentOnChildOrigin === true;
	        }
	    }
	    get first() {
	        const first = this.firstKey;
	        if (first == null) {
	            return null;
	        }
	        return this.focuserMap.get(first);
	    }
	    /**
	     * The first key of the registry.
	     * Is `null` if registry is empty.
	     */
	    get firstKey() {
	        if (this.isEmpty) {
	            return null;
	        }
	        return this.registry.first;
	    }
	    /**
	     * Property is `true` when tab cycling is enabled.
	     */
	    get isCycleEnabled() {
	        return this.cycle === true;
	    }
	    /**
	     * Property is `true` if the registry is empty.
	     */
	    get isEmpty() {
	        return this.registry.isEmpty;
	    }
	    get last() {
	        const last = this.lastKey;
	        if (last == null) {
	            return null;
	        }
	        return this.focuserMap.get(last);
	    }
	    /**
	     * The last key of the registry.
	     * Is `null` if registry is empty.
	     */
	    get lastKey() {
	        if (this.isEmpty) {
	            return null;
	        }
	        return this.registry.last;
	    }
	    get parentRegistry() {
	        return this.internalParentRegistry;
	    }
	    /**
	     * Constructs any empty registry with default options.
	     */
	    static empty() {
	        return new TabRegistry();
	    }
	    /**
	     * Construct registry from nested map structure.
	     */
	    static fromMap(map, options) {
	        const registry = new TabRegistry(options);
	        map.forEach((value, key) => {
	            if (value instanceof Map) {
	                const r = TabRegistry.fromMap(value);
	                registry.add(key, r);
	            }
	            else {
	                registry.add(key, value);
	            }
	        });
	        return registry;
	    }
	    /**
	     * Pretty print all the keys recursively.
	     */
	    _toString(iterable, padding, level) {
	        const lvl = level == null ? 1 : level;
	        let result = '';
	        let first = true;
	        for (const key of Array.from(iterable)) {
	            if (first) {
	                first = false;
	            }
	            else {
	                result += ',\n';
	            }
	            const val = this.focuserMap.get(key);
	            if (val instanceof TabRegistry) {
	                result += this._toString.call(val, val.keys(), padding + '    ', lvl + 1);
	            }
	            else {
	                result += padding + key;
	            }
	        }
	        return result;
	    }
	    /**
	     * Add a `focuser` to the registry referenced by `key`.
	     */
	    add(key, focuser) {
	        this.registry.add(key);
	        this.focuserMap.set(key, focuser);
	        if (focuser instanceof TabRegistry) {
	            focuser.setParentRegistry(key, this);
	        }
	    }
	    /**
	     * Add a `focuser` to the registry after the `afterKey`
	     * referenced by `key`.
	     */
	    addAfter(key, focuser, afterKey) {
	        this.registry.addAfter(key, afterKey);
	        this.focuserMap.set(key, focuser);
	        if (focuser instanceof TabRegistry) {
	            focuser.setParentRegistry(key, this);
	        }
	    }
	    /**
	     * Add a `focuser` to the registry before the `beforeKey`
	     * referenced by `key`.
	     */
	    addBefore(key, focuser, beforeKey) {
	        this.registry.addBefore(key, beforeKey);
	        this.focuserMap.set(key, focuser);
	        if (focuser instanceof TabRegistry) {
	            focuser.setParentRegistry(key, this);
	        }
	    }
	    /**
	     * Delete `key` from the registry.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    delete(key) {
	        this.registry.delete(key);
	        this.focuserMap.delete(key);
	    }
	    /**
	     * Disable tab cycling.
	     */
	    disableCycle() {
	        this.cycle = false;
	        return this;
	    }
	    /**
	     * Enable tab cycling.
	     */
	    enableCycle() {
	        this.cycle = true;
	        return this;
	    }
	    /**
	     * Execute focuser for `key`.
	     * Returns `true` if the focuser was successful.
	     * Returns `false` if the focuser does not exist.
	     */
	    focus(key, options) {
	        const opts = options || focusOriginNone;
	        if (this.focusParentOnChildOrigin && opts.focusOrigin === 'child') {
	            return this.focusParent();
	        }
	        let internalKey = key;
	        if (internalKey == null) {
	            if (options != null && options.focusOrigin === 'next') {
	                internalKey = this.lastKey;
	            }
	            else {
	                internalKey = this.firstKey;
	            }
	            if (internalKey == null) {
	                return false;
	            }
	        }
	        const focuser = this.focuserMap.get(internalKey);
	        if (focuser == null) {
	            return false;
	        }
	        return focuser instanceof TabRegistry ? focuser.focus(undefined, opts) : focuser(opts);
	    }
	    /**
	     * Execute first focuser in the registry.
	     * If the first entry is not focusable recursive through
	     * the registry until a focuser returns `true`.
	     *
	     * Returns `true` if a focuser is successful.
	     * Returns `false` if no focuser was sucessful.
	     */
	    focusFirst() {
	        if (this.registry.isEmpty) {
	            return false;
	        }
	        const first = this.registry.first;
	        const focuser = this.focuserMap.get(first);
	        if (focuser == null) {
	            return false;
	        }
	        const result = focuser instanceof TabRegistry ? focuser.focusFirst() : focuser(focusOriginPrev);
	        if (result) {
	            return true;
	        }
	        else {
	            if (this.cycle && this.focusCycleStartKey == null) {
	                this.focusCycleStartKey = first;
	            }
	            return this.focusNext(first);
	        }
	    }
	    /**
	     * Excute focuser that matches the `keys` path
	     * from the first key in the registry.
	     */
	    focusFirstIn(keys) {
	        if (this.registry.isEmpty) {
	            return false;
	        }
	        const first = this.registry.first;
	        if (first == null) {
	            return false;
	        }
	        return this.focusIn([first, ...keys], focusOriginPrev);
	    }
	    /**
	     * Execute focuser that matchs the `keys` path
	     * the first key will be the root identifier.
	     */
	    focusIn(keys, options) {
	        let key = keys.shift();
	        if (key == null) {
	            return false;
	        }
	        let registry = this;
	        while (registry.has(key)) {
	            const focuser = registry.get(key);
	            if (focuser == null) {
	                return false;
	            }
	            const k = keys.shift();
	            if (k != null) {
	                key = k;
	                if (focuser instanceof TabRegistry) {
	                    registry = focuser;
	                }
	                else {
	                    return false;
	                }
	            }
	            else {
	                if (focuser instanceof TabRegistry) {
	                    return focuser.focus(undefined, options);
	                }
	                else {
	                    if (options == null) {
	                        return focuser(focusOriginNone);
	                    }
	                    else {
	                        return focuser(options);
	                    }
	                }
	            }
	        }
	        return false;
	    }
	    /**
	     * Execute last focuser in the registry.
	     * If the last entry is not focusable recursive backwards through
	     * the registry until a focuser returns `true`.
	     *
	     * Returns `true` if a focuser is successful.
	     * Returns `false` if no focuser was sucessful.
	     */
	    focusLast() {
	        if (this.registry.isEmpty) {
	            return false;
	        }
	        const last = this.registry.last;
	        const focuser = this.focuserMap.get(last);
	        if (focuser == null) {
	            return false;
	        }
	        const result = focuser instanceof TabRegistry ? focuser.focusLast() : focuser(focusOriginNext);
	        if (result) {
	            return true;
	        }
	        else {
	            if (this.cycle && this.focusCycleStartKey == null) {
	                this.focusCycleStartKey = last;
	            }
	            return this.focusPrev(last);
	        }
	    }
	    /**
	     * Excute focuser that matches the `keys` path
	     * from the last key in the registry.
	     */
	    focusLastIn(keys) {
	        if (this.registry.isEmpty) {
	            return false;
	        }
	        const last = this.registry.last;
	        if (last == null) {
	            return false;
	        }
	        return this.focusIn([last, ...keys], focusOriginNext);
	    }
	    /**
	     * Execute the focuser after `key`.
	     * If the focuser was not successful recurse through
	     * the registry until a focuser returns `true`.
	     *
	     * Returns `true` if a focuser is successful.
	     * Returns `false` if no focuser was sucessful.
	     */
	    focusNext(key) {
	        // remember to unset the focusCycleStartKey
	        // for every return path of this function
	        // if cycly is enabled.
	        let focuser;
	        let current;
	        let next = this.getNextKey(key);
	        const totalCount = this.registry.size;
	        for (let i = totalCount; i > 0; i--) {
	            if (next == null) {
	                break;
	            }
	            current = next;
	            focuser = this.focuserMap.get(current);
	            next = this.getNextKey(current);
	            if (focuser == null) {
	                continue;
	            }
	            const result = focuser instanceof TabRegistry ? focuser.focusFirst() : focuser(focusOriginPrev);
	            if (result) {
	                this.focusCycleStartKey = null;
	                return true;
	            }
	            // stop cycling if we have seen the key before.
	            if (this.cycle && current === this.focusCycleStartKey) {
	                this.focusCycleStartKey = null;
	                return false;
	            }
	        }
	        if (this.cycle) {
	            // if no cycle start key has been set before
	            // then set it to the key this focusNext loop was started with.
	            if (this.focusCycleStartKey == null) {
	                this.focusCycleStartKey = key;
	                // if the focus cycle start key is the same as
	                // the key we started this loop with
	            }
	            else if (this.focusCycleStartKey === key) {
	                this.focusCycleStartKey = null;
	                return false;
	            }
	            return this.focusFirst();
	        }
	        if (this.internalParentRegistry != null) {
	            this.focusCycleStartKey = null;
	            this.internalParentRegistry.focusNext(this.parentRegistryKey);
	            return true;
	        }
	        this.focusCycleStartKey = null;
	        return false;
	    }
	    /**
	     * Excute focuser that matches the `keys` path
	     * from the key after the first key in `keys`.
	     */
	    focusNextIn(keys) {
	        const key = keys.shift();
	        if (key == null) {
	            return false;
	        }
	        const next = this.getNextKey(key);
	        if (next == null) {
	            return false;
	        }
	        return this.focusIn([next, ...keys], focusOriginPrev);
	    }
	    /**
	     * Focus the parent registry.
	     */
	    focusParent() {
	        if (this.internalParentRegistry != null) {
	            return this.internalParentRegistry.focus(undefined, focusOriginChild);
	        }
	        return false;
	    }
	    /**
	     * Execute the focuser before `key`.
	     * If the focuser was not successful recurse backwards through
	     * the registry until a focuser returns `true`.
	     *
	     * Returns `true` if a focuser is successful.
	     * Returns `false` if no focuser was sucessful.
	     */
	    focusPrev(key) {
	        // remember to unset the focusCycleStartKey
	        // for every return path of this function
	        // if cycly is enabled.
	        let focuser;
	        let current;
	        let prev = this.getPrevKey(key);
	        const totalCount = this.registry.size;
	        for (let i = totalCount; i > 0; i--) {
	            if (prev == null) {
	                break;
	            }
	            current = prev;
	            focuser = this.focuserMap.get(prev);
	            prev = this.getPrevKey(prev);
	            if (focuser == null) {
	                continue;
	            }
	            const result = focuser instanceof TabRegistry ? focuser.focusLast() : focuser(focusOriginNext);
	            if (result) {
	                this.focusCycleStartKey = null;
	                return true;
	            }
	            // stop cycling if we have seen the key before.
	            if (this.cycle && current === this.focusCycleStartKey) {
	                this.focusCycleStartKey = null;
	                return false;
	            }
	        }
	        if (this.cycle) {
	            // if no cycle start key has been set before
	            // then set it to the key this focusPrev loop was started with.
	            if (this.focusCycleStartKey == null) {
	                this.focusCycleStartKey = key;
	                // if the focus cycle start key is the same as
	                // the key we started this loop with
	            }
	            else if (this.focusCycleStartKey === key) {
	                this.focusCycleStartKey = null;
	                return false;
	            }
	            return this.focusLast();
	        }
	        if (this.internalParentRegistry != null) {
	            this.focusCycleStartKey = null;
	            this.internalParentRegistry.focusPrev(this.parentRegistryKey);
	            return true;
	        }
	        this.focusCycleStartKey = null;
	        return false;
	    }
	    /**
	     * Excute focuser that matches the `keys` path
	     * from the key before the first key in `keys`.
	     */
	    focusPrevIn(keys) {
	        const key = keys.shift();
	        if (key == null) {
	            return false;
	        }
	        const prev = this.getPrevKey(key);
	        if (prev == null) {
	            return false;
	        }
	        return this.focusIn([prev, ...keys], focusOriginNext);
	    }
	    /**
	     * Returns focuser for `key` if it exists
	     * otherwise return `null`.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    get(key) {
	        const focuser = this.focuserMap.get(key);
	        if (focuser == null) {
	            return null;
	        }
	        else {
	            return focuser;
	        }
	    }
	    /**
	     * Returns the forcuser after `key` if it exists
	     * otherwise return `null`.
	     */
	    getNext(key) {
	        const next = this.getNextKey(key);
	        if (next == null) {
	            return null;
	        }
	        const focuser = this.focuserMap.get(next);
	        if (focuser == null) {
	            return null;
	        }
	        return focuser;
	    }
	    /**
	     * Returns the key next to the key parameter.
	     */
	    getNextKey(key) {
	        return this.registry.next(key);
	    }
	    /**
	     * Returns the forcuser before `key` if it exists
	     * otherwise return `null`.
	     */
	    getPrev(key) {
	        const prev = this.getPrevKey(key);
	        if (prev == null) {
	            return null;
	        }
	        const focuser = this.focuserMap.get(prev);
	        if (focuser == null) {
	            return null;
	        }
	        return focuser;
	    }
	    /**
	     * Returns the key previous to the key parameter.
	     */
	    getPrevKey(key) {
	        return this.registry.prev(key);
	    }
	    /**
	     * Returns whether or not the focuser for `key` exists.
	     */
	    has(key) {
	        return this.focuserMap.has(key);
	    }
	    /**
	     * Test if nested focuser that matchs the `keys` path
	     * from the first key exist.
	     */
	    hasIn(keys) {
	        let key = keys.shift();
	        if (key == null) {
	            return false;
	        }
	        let registry = this;
	        while (registry.has(key)) {
	            const focuser = registry.get(key);
	            if (focuser == null) {
	                return false;
	            }
	            const k = keys.shift();
	            if (k != null) {
	                key = k;
	                if (focuser instanceof TabRegistry) {
	                    registry = focuser;
	                }
	                else {
	                    return false;
	                }
	            }
	            else {
	                return true;
	            }
	        }
	        return false;
	    }
	    /**
	     * Returns whether or not there exists a focuser after `key`.
	     */
	    hasNext(key) {
	        if (!this.registry.has(key)) {
	            return false;
	        }
	        return this.getNextKey(key) != null;
	    }
	    /**
	     * Returns whether or not there exists a focuser prev `key`.
	     */
	    hasPrev(key) {
	        if (!this.registry.has(key)) {
	            return false;
	        }
	        return this.getPrevKey(key) != null;
	    }
	    /**
	     * Move a focuser to the next spot in the registry.
	     */
	    moveNext(key) {
	        const focuser = this.focuserMap.get(key);
	        if (focuser == null) {
	            throw new Error(`Focuser for ${key} was not found`);
	        }
	        const next = this.getNextKey(key);
	        if (next != null) {
	            this.registry.setAfter(key, next);
	        }
	    }
	    /**
	     * Move a focuser to the previous spot in the registry.
	     */
	    movePrev(key) {
	        const focuser = this.focuserMap.get(key);
	        if (focuser == null) {
	            throw new Error(`Focuser for ${key} was not found`);
	        }
	        const prev = this.getPrevKey(key);
	        if (prev != null) {
	            this.registry.setBefore(key, prev);
	        }
	    }
	    /**
	     * Overwrite focuser for `key`.
	     * It throws if `key` does not exist.
	     */
	    // tslint:disable-next-line:no-reserved-keywords
	    set(key, focuser) {
	        const existingFocuser = this.focuserMap.get(key);
	        if (existingFocuser == null) {
	            throw new Error(`Key does not exist: ${key}`);
	        }
	        else {
	            this.focuserMap.set(key, focuser);
	        }
	    }
	    /**
	     * Set the `key` of this registry from
	     * the `parentRegistry`.
	     */
	    setParentRegistry(parentRegistryKey, parentRegistry) {
	        this.internalParentRegistry = parentRegistry;
	        this.parentRegistryKey = parentRegistryKey;
	    }
	    /**
	     * Returns a string representation of this
	     * and all nested registries.
	     */
	    toString() {
	        return 'TabRegistry[\n' + this._toString(this.registry, '    ') + '\n' + ']';
	    }
	}

	// tslint:disable-next-line:variable-name
	function filterPropKeys(props, filterFn) {
	    const propKeys = Object.keys(props);
	    return propKeys
	        .filter((propKey) => {
	        return filterFn(propKey);
	    })
	        .reduce((carry, propKey) => {
	        const intrinsicProp = propKey;
	        carry[intrinsicProp] = props[intrinsicProp];
	        return carry;
	    }, {});
	}

	function hasNameProperty(obj) {
	    return obj != null && typeof obj.name === 'string';
	}
	function stringToKey(str) {
	    const numValue = Number(str);
	    return (Number.isNaN(numValue) || String(numValue) !== str ? str : numValue);
	}
	const NavigationContext = react_2(null);
	class TabBoundary extends react_1 {
	    constructor(props) {
	        super(props);
	        this.parentRegistry = null;
	        this.filterPropKeys = (propKey) => {
	            switch (propKey) {
	                case 'as':
	                case 'boundaryKey':
	                case 'cycle':
	                case 'focusParentOnEscape':
	                case 'focusParentOnChildOrigin':
	                    return false;
	                default:
	                    return true;
	            }
	        };
	        this.onKeyDown = (e) => {
	            if (e.key === 'Tab' && hasNameProperty(e.target)) {
	                e.preventDefault();
	                e.stopPropagation();
	                if (e.shiftKey) {
	                    this.tabRegistry.focusPrev(stringToKey(e.target.name));
	                }
	                else {
	                    this.tabRegistry.focusNext(stringToKey(e.target.name));
	                }
	            }
	            else if (e.key === 'Escape' && this.props.focusParentOnEscape) {
	                e.preventDefault();
	                e.stopPropagation();
	                this.tabRegistry.focusParent();
	            }
	            if (this.props.onKeyDown != null) {
	                this.props.onKeyDown(e);
	            }
	        };
	        this.tabRegistry = new TabRegistry({
	            cycle: props.cycle,
	            focusParentOnChildOrigin: props.focusParentOnChildOrigin,
	        });
	    }
	    componentWillReceiveProps(nextProps) {
	        const tabRegistry = this.parentRegistry;
	        if (tabRegistry != null) {
	            if (this.props.cycle !== nextProps.cycle) {
	                nextProps.cycle ? tabRegistry.enableCycle() : tabRegistry.disableCycle();
	            }
	            if (this.props.focusParentOnChildOrigin !== nextProps.focusParentOnChildOrigin) {
	                tabRegistry.focusParentOnChildOrigin = nextProps.focusParentOnChildOrigin === true;
	            }
	            if (this.props.boundaryKey !== nextProps.boundaryKey) {
	                if (this.props.boundaryKey != null) {
	                    tabRegistry.delete(this.props.boundaryKey);
	                }
	                if (nextProps.boundaryKey != null) {
	                    tabRegistry.add(nextProps.boundaryKey, this.tabRegistry);
	                }
	            }
	        }
	    }
	    componentWillUnmount() {
	        if (this.parentRegistry != null) {
	            if (this.props.boundaryKey != null) {
	                this.parentRegistry.delete(this.props.boundaryKey);
	            }
	            this.parentRegistry = null;
	        }
	    }
	    render() {
	        const props = filterPropKeys(this.props, this.filterPropKeys);
	        const comp = this.props.as == null ? 'div' : this.props.as;
	        const children = react_3(comp, Object.assign({}, props, { onKeyDown: this.onKeyDown }), this.props.children);
	        return (react_3(NavigationContext.Consumer, null, tabRegistry => {
	            if (this.parentRegistry != null && this.props.boundaryKey != null && tabRegistry !== tabRegistry) {
	                this.parentRegistry.delete(this.props.boundaryKey);
	            }
	            if (tabRegistry != null && this.props.boundaryKey != null) {
	                tabRegistry.add(this.props.boundaryKey, this.tabRegistry);
	            }
	            this.parentRegistry = tabRegistry || null;
	            return react_3(NavigationContext.Provider, { value: this.tabRegistry }, children);
	        }));
	    }
	}

	class Grid extends react_1 {
	    constructor(props) {
	        super(props);
	        this.tabRegistry = null;
	        this.filterPropKeys = (propKey) => {
	            switch (propKey) {
	                case 'as':
	                case 'children':
	                case 'fieldMap':
	                case 'focusKey':
	                    return false;
	                default:
	                    return true;
	            }
	        };
	        this.getTabRegistry = () => {
	            if (this.tabRegistry == null) {
	                throw new Error(`tabRegistry was not found on context of ${this.props.focusKey}`);
	            }
	            const tabRegistry = this.tabRegistry.get(this.props.focusKey);
	            if (!(tabRegistry instanceof TabRegistry)) {
	                throw new Error(`tabRegistry of ${this.props.focusKey} was not found`);
	            }
	            return tabRegistry;
	        };
	        this.state = {
	            navigationHandler: createNavigationHandler(props.fieldMap, this.getTabRegistry),
	        };
	    }
	    componentWillReceiveProps(nextProps) {
	        if (this.props.fieldMap !== nextProps.fieldMap) {
	            this.setState(_ => ({
	                navigationHandler: createNavigationHandler(nextProps.fieldMap, this.getTabRegistry),
	            }));
	        }
	    }
	    render() {
	        const props = filterPropKeys(this.props, this.filterPropKeys);
	        return (react_3(NavigationContext.Consumer, null, tabRegistry => {
	            this.tabRegistry = tabRegistry;
	            return (react_3(TabBoundary, Object.assign({}, props, { as: this.props.as, boundaryKey: this.props.focusKey }), this.props.children(this.state.navigationHandler)));
	        }));
	    }
	}

	const styles = {
	    border: 'none',
	    display: 'inline',
	    float: 'left',
	    fontSize: 0,
	    height: 0,
	    lineHeight: 0,
	    margin: 0,
	    outline: 'none',
	    padding: 0,
	    width: 0,
	};
	class Focuser extends react_1 {
	    constructor() {
	        super(...arguments);
	        this.refFocuser = null;
	        this.tabRegistry = null;
	        this.onKeyDown = (e) => {
	            if (this.props.disabled) {
	                return;
	            }
	            let shouldPrevent = false;
	            if (e.key === 'Enter') {
	                if (this.props.onEnter != null) {
	                    shouldPrevent = true;
	                    this.props.onEnter(e);
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'Enter');
	                }
	            }
	            else if (e.key === ' ') {
	                if (this.props.onSpace != null) {
	                    shouldPrevent = true;
	                    this.props.onSpace(e);
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'Space');
	                }
	            }
	            else if (e.key === 'Escape') {
	                if (this.props.onEscape != null) {
	                    shouldPrevent = true;
	                    this.props.onEscape(e);
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'Escape');
	                }
	            }
	            else if (e.key === 'Delete') {
	                if (this.props.onDelete != null) {
	                    shouldPrevent = true;
	                    this.props.onDelete(e);
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'Delete');
	                }
	            }
	            else if (e.key === 'ArrowUp') {
	                if (this.props.onArrowUp != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowUp(e);
	                }
	                if (this.props.onArrowKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowKeys(this.props.focusKey, 'ArrowUp');
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'ArrowUp');
	                }
	            }
	            else if (e.key === 'ArrowDown') {
	                if (this.props.onArrowDown != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowDown(e);
	                }
	                if (this.props.onArrowKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowKeys(this.props.focusKey, 'ArrowDown');
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'ArrowDown');
	                }
	            }
	            else if (e.key === 'ArrowLeft') {
	                if (this.props.onArrowLeft != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowLeft(e);
	                }
	                if (this.props.onArrowKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowKeys(this.props.focusKey, 'ArrowLeft');
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'ArrowLeft');
	                }
	            }
	            else if (e.key === 'ArrowRight') {
	                if (this.props.onArrowRight != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowRight(e);
	                }
	                if (this.props.onArrowKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onArrowKeys(this.props.focusKey, 'ArrowRight');
	                }
	                if (this.props.onNavigationKeys != null) {
	                    shouldPrevent = true;
	                    this.props.onNavigationKeys(this.props.focusKey, 'ArrowRight');
	                }
	            }
	            else if (e.key === 'Tab') {
	                if (e.shiftKey) {
	                    if (this.tabRegistry != null) {
	                        shouldPrevent = true;
	                        this.tabRegistry.focusPrev(this.props.focusKey);
	                    }
	                    if (this.props.onNavigationKeys != null) {
	                        shouldPrevent = true;
	                        this.props.onNavigationKeys(this.props.focusKey, 'ShiftTab');
	                    }
	                }
	                else {
	                    if (this.tabRegistry != null) {
	                        shouldPrevent = true;
	                        this.tabRegistry.focusNext(this.props.focusKey);
	                    }
	                    if (this.props.onNavigationKeys != null) {
	                        shouldPrevent = true;
	                        this.props.onNavigationKeys(this.props.focusKey, 'Tab');
	                    }
	                }
	            }
	            else if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)) {
	                shouldPrevent = true;
	            }
	            if (shouldPrevent) {
	                e.preventDefault();
	                e.stopPropagation();
	            }
	        };
	        this.setFocuserRef = (ref) => {
	            this.refFocuser = ref;
	        };
	        this.focus = (opts) => {
	            if (this.props.disabled || this.tabRegistry == null || this.refFocuser == null) {
	                return false;
	            }
	            this.refFocuser.focus();
	            if (this.props.onFocus) {
	                this.props.onFocus(opts);
	            }
	            return true;
	        };
	    }
	    componentWillUnmount() {
	        if (this.tabRegistry != null) {
	            this.tabRegistry.delete(this.props.focusKey);
	            this.tabRegistry = null;
	        }
	    }
	    render() {
	        return (react_3(NavigationContext.Consumer, null, tabRegistry => {
	            if (this.tabRegistry != null && this.tabRegistry !== tabRegistry) {
	                this.tabRegistry.delete(this.props.focusKey);
	            }
	            if (tabRegistry != null && this.tabRegistry !== tabRegistry) {
	                tabRegistry.add(this.props.focusKey, this.focus);
	            }
	            this.tabRegistry = tabRegistry;
	            return (react_3("input", { autoComplete: "off", autoFocus: this.props.autoFocus, defaultValue: "", disabled: this.props.disabled, key: "focuser", name: String(this.props.focusKey), onBlur: this.props.onBlur, onKeyDown: this.onKeyDown, ref: this.setFocuserRef, style: styles, tabIndex: -1 }));
	        }));
	    }
	}

	class Section extends react_1 {
	    constructor() {
	        super(...arguments);
	        this.refFocuser = null;
	        this.tabRegistry = null;
	        this.filterPropKeys = (propKey) => {
	            switch (propKey) {
	                case 'as':
	                case 'autoFocus':
	                case 'cycle':
	                case 'disabled':
	                case 'focusKey':
	                case 'navigationHandler':
	                case 'onFocus':
	                    return false;
	                default:
	                    return true;
	            }
	        };
	        this.navigationHandler = (_, arrowKey) => {
	            if (this.props.navigationHandler != null) {
	                this.props.navigationHandler(this.props.focusKey, arrowKey);
	            }
	        };
	        this.onClick = (e) => {
	            e.preventDefault();
	            e.stopPropagation();
	            if (this.refFocuser != null) {
	                this.refFocuser.focus({
	                    focusOrigin: 'mouse',
	                });
	            }
	        };
	        this.onEnterKey = () => {
	            if (this.tabRegistry != null) {
	                this.tabRegistry.focusIn([this.props.focusKey, 'section'], {
	                    focusOrigin: 'parent',
	                });
	            }
	        };
	        this.onEscapeKey = () => {
	            if (this.tabRegistry != null) {
	                const reg = this.tabRegistry.get(this.props.focusKey);
	                if (reg instanceof TabRegistry) {
	                    reg.focusParent();
	                }
	            }
	        };
	        this.setFocuserRef = (ref) => {
	            this.refFocuser = ref;
	        };
	    }
	    render() {
	        const navigationHandler = this.props.navigationHandler == null ? undefined : this.navigationHandler;
	        const boundaryProps = filterPropKeys(this.props, this.filterPropKeys);
	        return (react_3(NavigationContext.Consumer, null, tabRegistry => {
	            this.tabRegistry = tabRegistry;
	            return (react_3(TabBoundary, Object.assign({ className: "section-container" }, boundaryProps, { as: this.props.as, boundaryKey: this.props.focusKey, onClick: this.onClick }),
	                react_3(Focuser, { autoFocus: this.props.autoFocus, disabled: this.props.disabled, focusKey: 'section-focuser', onArrowKeys: navigationHandler, onEnter: this.onEnterKey, onEscape: this.onEscapeKey, onFocus: this.props.onFocus, ref: this.setFocuserRef }),
	                react_3(TabBoundary, { boundaryKey: "section", className: "section", cycle: this.props.cycle, focusParentOnChildOrigin: true, focusParentOnEscape: true }, this.props.children)));
	        }));
	    }
	}

	const fieldMap = [['section1', 'section2'], ['section3', 'section4']];
	class App extends react_1 {
	    constructor() {
	        super(...arguments);
	        this.renderGrid = navigationHandler => {
	            return (react_3("div", { className: "grid-content" },
	                react_3("div", { className: "row" },
	                    react_3(Section, { autoFocus: true, focusKey: "section1", navigationHandler: navigationHandler },
	                        react_3(Section, { focusKey: "inner-section1" })),
	                    react_3(Section, { focusKey: "section2", navigationHandler: navigationHandler },
	                        react_3("div", null))),
	                react_3("div", { className: "row" },
	                    react_3(Section, { focusKey: "section3", navigationHandler: navigationHandler },
	                        react_3("div", null)),
	                    react_3(Section, { focusKey: "section4", navigationHandler: navigationHandler },
	                        react_3("div", null)))));
	        };
	    }
	    render() {
	        return (react_3(TabBoundary, null,
	            react_3(Grid, { className: "grid", fieldMap: fieldMap, focusKey: "grid" }, this.renderGrid)));
	    }
	}
	reactDom_1(react_3(App), document.querySelector('#root'));

}());
