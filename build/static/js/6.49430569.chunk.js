(this.webpackJsonpangle=this.webpackJsonpangle||[]).push([[6],{352:function(e,a,t){"use strict";var r=t(47),s=t(27),n=t(369),i=t(359),c=t.n(i),l={isValidName:function(e){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t=e.length;for(e=e.toUpperCase();t--;){var r=e.charAt(t);if(!a.includes(r)&&"'"!==r&&"-"!==r)return!1}return!0},isValidPODName:function(e){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t="0123456789".split("");if(e.length<2)return!1;var r=e.length;for(e=e.toUpperCase();r--;){var s=e.charAt(r);if(!a.includes(s)&&!t.includes(s)&&"-"!==s)return!1}return!0},isValidPassword:function(e){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t="abcdefghijklmnopqrstuvwxyz".split(""),r="0123456789".split(""),s="`~!@#$%^&*()-_=+[{]};:,<.>/?".split("");if(e.length<8)return!1;for(var n=e.length,i=!1,c=!1,l=!1,o=!1;n--;){var d=e.charAt(n);!i&&a.includes(d)&&(i=!0),!c&&t.includes(d)&&(c=!0),!l&&r.includes(d)&&(l=!0),!o&&s.includes(d)&&(o=!0)}return i&&c&&l&&o},validate:function(e){var a=this,t="checkbox"===e.type,r=t?e.checked:e.value;if(!e.name)throw new Error("Input name must not be empty.");var s=e.getAttribute("data-param"),i=JSON.parse(e.getAttribute("data-validate")),l=[];return i&&i.length&&i.forEach((function(e){switch(e){case"required":l[e]=t?!1===r:c.a.isEmpty(r);break;case"email":l[e]=!c.a.isEmail(r);break;case"number":l[e]=!c.a.isNumeric(r);break;case"integer":l[e]=!c.a.isInt(r);break;case"alphanum":l[e]=!c.a.isAlphanumeric(r);break;case"url":l[e]=!c.a.isURL(r);break;case"equalto":var i=document.getElementById(s).value;l[e]=!c.a.equals(r,i);break;case"minlen":l[e]=!c.a.isLength(r,{min:s});break;case"maxlen":l[e]=!c.a.isLength(r,{max:s});break;case"len":var o=JSON.parse(s),d=Object(n.a)(o,2),m=d[0],b=d[1];l[e]=!c.a.isLength(r,{min:m,max:b});break;case"min":l[e]=!c.a.isInt(r,{min:c.a.toInt(s)});break;case"max":l[e]=!c.a.isInt(r,{max:c.a.toInt(s)});break;case"list":var u=JSON.parse(s);l[e]=!c.a.isIn(r,u);break;case"name":l[e]=!a.isValidName(r);break;case"podname":l[e]=!a.isValidPODName(r);break;case"password":l[e]=!a.isValidPassword(r);break;default:throw new Error("Unrecognized validator.")}})),l},bulkValidate:function(e){var a=this,t={},n=!1;return e.forEach((function(e){var i=a.validate(e);t=Object(s.a)(Object(s.a)({},t),{},Object(r.a)({},e.name,i)),n||(n=Object.keys(i).some((function(e){return i[e]})))})),{errors:t,hasError:n}}};a.a=l},438:function(e,a,t){"use strict";t.r(a);var r=t(124),s=t(47),n=t(27),i=t(22),c=t(23),l=t(25),o=t(24),d=t(1),m=t.n(d),b=t(54),u=t(435),h=t(4),p=t(6),f=t(2),j=t.n(f),v=t(11),O=t.n(v),g=t(3),N=t(12),x=t(7),k={className:j.a.string,id:j.a.oneOfType([j.a.string,j.a.number]).isRequired,label:j.a.node,valid:j.a.bool,invalid:j.a.bool,bsSize:j.a.string,htmlFor:j.a.string,cssModule:j.a.object,onChange:j.a.func,children:j.a.oneOfType([j.a.node,j.a.array,j.a.func]),innerRef:j.a.oneOfType([j.a.object,j.a.string,j.a.func])},y=function(e){function a(a){var t;return(t=e.call(this,a)||this).state={files:null},t.onChange=t.onChange.bind(Object(N.a)(t)),t}Object(x.a)(a,e);var t=a.prototype;return t.onChange=function(e){var a=e.target,t=this.props.onChange,r=this.getSelectedFiles(a);"function"===typeof t&&t.apply(void 0,arguments),this.setState({files:r})},t.getSelectedFiles=function(e){if(this.props.multiple&&e.files)return[].slice.call(e.files).map((function(e){return e.name})).join(", ");if(-1!==e.value.indexOf("fakepath")){var a=e.value.split("\\");return a[a.length-1]}return e.value},t.render=function(){var e=this.props,a=e.className,t=e.label,r=e.valid,s=e.invalid,n=e.cssModule,i=e.children,c=(e.bsSize,e.innerRef),l=e.htmlFor,o=(e.type,e.onChange,e.dataBrowse),d=e.hidden,b=Object(p.a)(e,["className","label","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor","type","onChange","dataBrowse","hidden"]),u=Object(g.f)(O()(a,"custom-file"),n),f=Object(g.f)(O()(s&&"is-invalid",r&&"is-valid"),n),j=l||b.id,v=this.state.files;return m.a.createElement("div",{className:u,hidden:d||!1},m.a.createElement("input",Object(h.a)({type:"file"},b,{ref:c,"aria-invalid":s,className:O()(f,Object(g.f)("custom-file-input",n)),onChange:this.onChange})),m.a.createElement("label",{className:Object(g.f)("custom-file-label",n),htmlFor:j,"data-browse":o},v||t||"Choose file"),i)},a}(m.a.Component);y.propTypes=k;var E=y,w={className:j.a.string,id:j.a.oneOfType([j.a.string,j.a.number]).isRequired,type:j.a.string.isRequired,label:j.a.node,inline:j.a.bool,valid:j.a.bool,invalid:j.a.bool,bsSize:j.a.string,htmlFor:j.a.string,cssModule:j.a.object,children:j.a.oneOfType([j.a.node,j.a.array,j.a.func]),innerRef:j.a.oneOfType([j.a.object,j.a.string,j.a.func])};function C(e){var a=e.className,t=e.label,r=e.inline,s=e.valid,n=e.invalid,i=e.cssModule,c=e.children,l=e.bsSize,o=e.innerRef,d=e.htmlFor,b=Object(p.a)(e,["className","label","inline","valid","invalid","cssModule","children","bsSize","innerRef","htmlFor"]),u=b.type,f=Object(g.f)(O()(a,"custom-"+u,!!l&&"custom-"+u+"-"+l),i),j=Object(g.f)(O()(n&&"is-invalid",s&&"is-valid"),i),v=d||b.id;if("select"===u){b.type;var N=Object(p.a)(b,["type"]);return m.a.createElement("select",Object(h.a)({},N,{ref:o,className:O()(j,f),"aria-invalid":n}),c)}if("file"===u)return m.a.createElement(E,e);if("checkbox"!==u&&"radio"!==u&&"switch"!==u)return m.a.createElement("input",Object(h.a)({},b,{ref:o,"aria-invalid":n,className:O()(j,f)}));var x=O()(f,Object(g.f)(O()("custom-control",{"custom-control-inline":r}),i)),k=b.hidden,y=Object(p.a)(b,["hidden"]);return m.a.createElement("div",{className:x,hidden:k||!1},m.a.createElement("input",Object(h.a)({},y,{type:"switch"===u?"checkbox":u,ref:o,"aria-invalid":n,className:O()(j,Object(g.f)("custom-control-input",i))})),m.a.createElement("label",{className:Object(g.f)("custom-control-label",i),htmlFor:v},t),c)}C.propTypes=w;var S=C,F=t(352),L=t(0),T=function(e){Object(l.a)(t,e);var a=Object(o.a)(t);function t(){var e;Object(i.a)(this,t);for(var c=arguments.length,l=new Array(c),o=0;o<c;o++)l[o]=arguments[o];return(e=a.call.apply(a,[this].concat(l))).state={formLogin:{email:"",password:""}},e.validateOnChange=function(a){var t,r=a.target,i=r.form,c="checkbox"===r.type?r.checked:r.value,l=F.a.validate(r);e.setState(Object(s.a)({},i.name,Object(n.a)(Object(n.a)({},e.state[i.name]),{},(t={},Object(s.a)(t,r.name,c),Object(s.a)(t,"errors",Object(n.a)(Object(n.a)({},e.state[i.name].errors),{},Object(s.a)({},r.name,l))),t))))},e.onSubmit=function(a){var t=a.target,i=Object(r.a)(t.elements).filter((function(e){return["INPUT","SELECT"].includes(e.nodeName)})),c=F.a.bulkValidate(i),l=c.errors,o=c.hasError;e.setState(Object(s.a)({},t.name,Object(n.a)(Object(n.a)({},e.state[t.name]),{},{errors:l}))),console.log(o?"Form has errors. Check!":"Form Submitted!"),a.preventDefault()},e.hasError=function(a,t,r){return e.state[a]&&e.state[a].errors&&e.state[a].errors[t]&&e.state[a].errors[t][r]},e}return Object(c.a)(t,[{key:"render",value:function(){return Object(L.jsxs)("div",{className:"block-center mt-4 wd-xl",children:[Object(L.jsxs)("div",{className:"card card-flat",children:[Object(L.jsx)("div",{className:"card-header text-center bg-dark",children:Object(L.jsx)("a",{href:"",children:Object(L.jsx)("img",{className:"block-center rounded",src:"img/logo.png",alt:"Logo"})})}),Object(L.jsxs)("div",{className:"card-body",children:[Object(L.jsx)("p",{className:"text-center py-2",children:"SIGN IN TO CONTINUE."}),Object(L.jsxs)("form",{className:"mb-3",name:"formLogin",onSubmit:this.onSubmit,children:[Object(L.jsx)("div",{className:"form-group",children:Object(L.jsxs)("div",{className:"input-group with-focus",children:[Object(L.jsx)(u.a,{type:"email",name:"email",className:"border-right-0",placeholder:"Enter email",invalid:this.hasError("formLogin","email","required")||this.hasError("formLogin","email","email"),onChange:this.validateOnChange,"data-validate":'["required", "email"]',value:this.state.formLogin.email}),Object(L.jsx)("div",{className:"input-group-append",children:Object(L.jsx)("span",{className:"input-group-text text-muted bg-transparent border-left-0",children:Object(L.jsx)("em",{className:"fa fa-envelope"})})}),this.hasError("formLogin","email","required")&&Object(L.jsx)("span",{className:"invalid-feedback",children:"Field is required"}),this.hasError("formLogin","email","email")&&Object(L.jsx)("span",{className:"invalid-feedback",children:"Field must be valid email"})]})}),Object(L.jsx)("div",{className:"form-group",children:Object(L.jsxs)("div",{className:"input-group with-focus",children:[Object(L.jsx)(u.a,{type:"password",id:"id-password",name:"password",className:"border-right-0",placeholder:"Password",invalid:this.hasError("formLogin","password","required"),onChange:this.validateOnChange,"data-validate":'["required"]',value:this.state.formLogin.password}),Object(L.jsx)("div",{className:"input-group-append",children:Object(L.jsx)("span",{className:"input-group-text text-muted bg-transparent border-left-0",children:Object(L.jsx)("em",{className:"fa fa-lock"})})}),Object(L.jsx)("span",{className:"invalid-feedback",children:"Field is required"})]})}),Object(L.jsxs)("div",{className:"clearfix",children:[Object(L.jsx)(S,{type:"checkbox",id:"rememberme",className:"float-left mt-0",name:"remember",label:"Remember Me"}),Object(L.jsx)("div",{className:"float-right",children:Object(L.jsx)(b.b,{to:"recover",className:"text-muted",children:"Forgot your password?"})})]}),Object(L.jsx)("button",{className:"btn btn-block btn-primary mt-3",type:"submit",children:"Login"})]}),Object(L.jsx)("p",{className:"pt-3 text-center",children:"Need to Signup?"}),Object(L.jsx)(b.b,{to:"register",className:"btn btn-block btn-secondary",children:"Register Now"})]})]}),Object(L.jsxs)("div",{className:"p-3 text-center",children:[Object(L.jsx)("span",{className:"mr-2",children:"\xa9"}),Object(L.jsx)("span",{children:"2020"}),Object(L.jsx)("span",{className:"mx-2",children:"-"}),Object(L.jsx)("span",{children:"Angle"}),Object(L.jsx)("br",{}),Object(L.jsx)("span",{children:"Bootstrap Admin Template"})]})]})}}]),t}(d.Component);a.default=T}}]);
//# sourceMappingURL=6.49430569.chunk.js.map