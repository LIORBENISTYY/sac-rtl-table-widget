(()=>{"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,n(o.key),o)}}function n(e){var n=function(e,n){if("object"!=t(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!=t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==t(n)?n:n+""}function r(t){var e="function"==typeof Map?new Map:void 0;return r=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return function(t,e,n){if(o())return Reflect.construct.apply(null,arguments);var r=[null];r.push.apply(r,e);var a=new(t.bind.apply(t,r));return n&&i(a,n.prototype),a}(t,arguments,a(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),i(n,t)},r(t)}function o(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(o=function(){return!!t})()}function i(t,e){return i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},i(t,e)}function a(t){return a=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},a(t)}var c,u=function(n){function r(){var e,n,i,c;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),n=this,i=a(i=r),e=function(e,n){if(n&&("object"===t(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(e)}(n,o()?Reflect.construct(i,c||[],a(n).constructor):i.apply(n,c));var u=document.createElement("template");return u.innerHTML='\n<br>\n<style>\n    #form {\n        font-family: Arial, sans-serif;\n        width: 400px;\n        margin: 0 auto;\n    }\n\n    a {\n        text-decoration: none;\n    }\n\n    table {\n        width: 100%;\n        border-collapse: collapse;\n        margin-bottom: 10px;\n    }\n\n    td {\n        padding: 1px;\n        text-align: left;\n        font-size: 13px;\n    }\n\n    input[type="text"] {\n        width: 100%;\n        padding: 10px;\n        border: 2px solid #ccc;\n        border-radius: 5px;\n        font-size: 13px;\n        box-sizing: border-box;\n        margin-bottom: 10px;\n    }\n\n    select {\n        width: 100%;\n        padding: 10px;\n        border: 2px solid #ccc;\n        border-radius: 5px;\n        font-size: 13px;\n        box-sizing: border-box;\n        margin-bottom: 10px;\n    }\n\n    input[type="submit"] {\n        background-color: #487cac;\n        color: white;\n        padding: 10px;\n        border: none;\n        border-radius: 5px;\n        font-size: 14px;\n        cursor: pointer;\n        width: 100%;\n    }\n\n    #label {\n        width: 140px;\n    }\n</style>\n<form id="form">\n    <table>\n        <tr>\n        <td>Table Title</td>\n        <td><input id="table_title" type="text"  placeholder="Enter Table Title"></td>\n        </tr>\n    </table>\n    <input value="Update Settings" type="submit">\n    <br>\n    <p>Developed by <a target="_blank" href="https://linkedin.com/in/itsrohitchouhan">Rohit Chouhan</a></p>\n</form>',e._shadowRoot=e.attachShadow({mode:"open"}),e._shadowRoot.appendChild(u.content.cloneNode(!0)),e._shadowRoot.getElementById("form").addEventListener("submit",e._submit.bind(e)),e}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&i(t,e)}(r,n),c=r,(u=[{key:"_submit",value:function(t){t.preventDefault(),this.dispatchEvent(new CustomEvent("propertiesChanged",{detail:{properties:{tableTitle:this.tableTitle}}}))}},{key:"tableTitle",get:function(){return this._shadowRoot.getElementById("table_title").value},set:function(t){this._shadowRoot.getElementById("table_title").value=t}}])&&e(c.prototype,u),Object.defineProperty(c,"prototype",{writable:!1}),c;var c,u}(r(HTMLElement));function l(t){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},l(t)}function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function p(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){var r,o,i;r=t,o=e,i=n[e],(o=b(o))in r?Object.defineProperty(r,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[o]=i})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(){s=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,o=Object.defineProperty||function(t,e,n){t[e]=n.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function f(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,n){return t[e]=n}}function p(t,e,n,r){var i=e&&e.prototype instanceof w?e:w,a=Object.create(i.prototype),c=new R(r||[]);return o(a,"_invoke",{value:S(t,n,c)}),a}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var d="suspendedStart",y="suspendedYield",b="executing",v="completed",m={};function w(){}function g(){}function x(){}var O={};f(O,a,(function(){return this}));var E=Object.getPrototypeOf,_=E&&E(E(D([])));_&&_!==n&&r.call(_,a)&&(O=_);var j=x.prototype=w.prototype=Object.create(O);function T(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(t,e){function n(o,i,a,c){var u=h(t[o],t,i);if("throw"!==u.type){var f=u.arg,p=f.value;return p&&"object"==l(p)&&r.call(p,"__await")?e.resolve(p.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(p).then((function(t){f.value=t,a(f)}),(function(t){return n("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,r){function o(){return new e((function(e,o){n(t,r,e,o)}))}return i=i?i.then(o,o):o()}})}function S(e,n,r){var o=d;return function(i,a){if(o===b)throw Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:t,done:!0}}for(r.method=i,r.arg=a;;){var c=r.delegate;if(c){var u=L(c,r);if(u){if(u===m)continue;return u}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===d)throw o=v,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=b;var l=h(e,n,r);if("normal"===l.type){if(o=r.done?v:y,l.arg===m)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(o=v,r.method="throw",r.arg=l.arg)}}}function L(e,n){var r=n.method,o=e.iterator[r];if(o===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,L(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var i=h(o,e.iterator,n.arg);if("throw"===i.type)return n.method="throw",n.arg=i.arg,n.delegate=null,m;var a=i.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,m):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function D(e){if(e||""===e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}throw new TypeError(l(e)+" is not iterable")}return g.prototype=x,o(j,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:g,configurable:!0}),g.displayName=f(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,u,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},T(P.prototype),f(P.prototype,c,(function(){return this})),e.AsyncIterator=P,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var a=new P(p(t,n,r,o),i);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},T(j),f(j,u,"Generator"),f(j,a,(function(){return this})),f(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=D,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(C),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return c.type="throw",c.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=r.call(a,"catchLoc"),l=r.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),C(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;C(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:D(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),m}},e}function h(t,e,n,r,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void n(t)}c.done?e(u):Promise.resolve(u).then(r,o)}function d(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function a(t){h(i,r,o,a,c,"next",t)}function c(t){h(i,r,o,a,c,"throw",t)}a(void 0)}))}}function y(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,b(r.key),r)}}function b(t){var e=function(t,e){if("object"!=l(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=l(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==l(e)?e:e+""}function v(t){var e="function"==typeof Map?new Map:void 0;return v=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return function(t,e,n){if(m())return Reflect.construct.apply(null,arguments);var r=[null];r.push.apply(r,e);var o=new(t.bind.apply(t,r));return n&&w(o,n.prototype),o}(t,arguments,g(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),w(n,t)},v(t)}function m(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(m=function(){return!!t})()}function w(t,e){return w=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},w(t,e)}function g(t){return g=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},g(t)}(c=document.createElement("script")).src="https://cdn.jsdelivr.net/npm/simple-datatables@9.0.0",document.head.appendChild(c);var x=document.createElement("template");x.innerHTML='\n<style>\n@import "https://fiduswriter.github.io/simple-datatables/demos/dist/css/style.css";\n.card {\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);\n    border-radius:10px;\n}\n\n\n</style>\n<div class="container" style="padding: 20px;">\n<div class="card" style="padding: 20px;">\n    <h3 id="tableTitle"></h3>\n    <table id="myTable" class="table table-striped table-bordered" style="width:100%">\n        <thead id="tableHeader">\n        </thead>\n        <tbody id="tableBody">\n        </tbody>\n    </table>\n</div>\n</div>';var O=function(t){function e(){var t,n,r,o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=this,r=e,r=g(r),t=function(t,e){if(e&&("object"===l(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(n,m()?Reflect.construct(r,o||[],g(n).constructor):r.apply(n,o)))._shadowRoot=t.attachShadow({mode:"open"}),t._shadowRoot.appendChild(x.content.cloneNode(!0)),t._tableTitle=t._shadowRoot.querySelector("#tableTitle"),t._myTable=t._shadowRoot.querySelector("#myTable"),t._props={},t}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&w(t,e)}(e,t),n=e,r=[{key:"connectedCallback",value:(i=d(s().mark((function t(){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this._tableTitle.textContent=this._props.tableTitle;case 1:case"end":return t.stop()}}),t,this)}))),function(){return i.apply(this,arguments)})},{key:"onCustomWidgetBeforeUpdate",value:function(t){this._props=p(p({},this._props),t)}},{key:"onCustomWidgetAfterUpdate",value:function(t){this._tableTitle.textContent=this._props.tableTitle}},{key:"setTableData",value:(o=d(s().mark((function t(e){var n,r,o,i,a,c,u=this;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=e,r=this._shadowRoot.querySelector("#myTable"),o=r.querySelector("thead"),i=r.querySelector("tbody"),o||(o=document.createElement("thead"),r.appendChild(o)),i||(i=document.createElement("tbody"),r.appendChild(i)),o.id="tableHeader",i.id="tableBody",o.innerHTML="",i.innerHTML="",a=Object.keys(n[0]),c=document.createElement("tr"),a.forEach((function(t){var e=document.createElement("th");e.textContent=t.charAt(0).toUpperCase()+t.slice(1),c.appendChild(e)})),o.appendChild(c),n.forEach((function(t){var e=document.createElement("tr");a.forEach((function(n){var r=document.createElement("td");r.textContent=t[n],e.appendChild(r)})),i.appendChild(e)})),console.log(window),setTimeout((function(){new window.simpleDatatables.DataTable(u._myTable,{}).refresh()}),2e3);case 17:case"end":return t.stop()}}),t,this)}))),function(t){return o.apply(this,arguments)})}],r&&y(n.prototype,r),Object.defineProperty(n,"prototype",{writable:!1}),n;var n,r,o,i}(v(HTMLElement));customElements.define("dynamo-table",O),customElements.define("dynamo-table-builder",u)})();
var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
          <style>
          </style>
          <div id="root" style="width: 100%; height: 100%;">
          </div>
        `;
  class FunnelChartPrepped extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");

      this._props = {};

      this.render();
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    set myDataSource(dataBinding) {
      this._myDataSource = dataBinding;
      this.render();
    }

    async render() {
      await getScriptPromisify(
        "https://cdnjs.cloudflare.com/ajax/libs/echarts/5.0.0/echarts.min.js"
      );

      if (!this._myDataSource || this._myDataSource.state !== "success") {
        return;
      }

      const dimension = this._myDataSource.metadata.feeds.dimensions.values[0];
      const measure = this._myDataSource.metadata.feeds.measures.values[0];
      const data = this._myDataSource.data.map((data) => {
        return {
          name: data[dimension].label,
          value: data[measure].raw,
        };
      });

      const myChart = echarts.init(this._root, "wight");
      const option = {
        color: ['#D2EFFF', '#A6E0FF', '#89D1FF', '#1990FF', '#0057D2'],
        title: {
          text: "",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          data: [data],
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 4,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data,
          },
        ],
      };
      myChart.setOption(option);
    }
  }

  customElements.define("github-sap-funnel-chart", FunnelChartPrepped);
})();
