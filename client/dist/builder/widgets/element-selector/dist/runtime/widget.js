System.register(["jimu-core","jimu-for-builder","jimu-layouts/layout-runtime","jimu-theme","jimu-ui"],(function(e,t){var s={},i={},o={},a={},n={};return{setters:[function(e){s.APP_FRAME_NAME_IN_BUILDER=e.APP_FRAME_NAME_IN_BUILDER,s.AppMode=e.AppMode,s.BrowserSizeMode=e.BrowserSizeMode,s.GuideLevels=e.GuideLevels,s.GuideManager=e.GuideManager,s.LayoutItemType=e.LayoutItemType,s.PagePart=e.PagePart,s.React=e.React,s.ReactRedux=e.ReactRedux,s.WidgetType=e.WidgetType,s.classNames=e.classNames,s.createSelector=e.createSelector,s.css=e.css,s.defaultMessages=e.defaultMessages,s.getAppStore=e.getAppStore,s.injectIntl=e.injectIntl,s.jsx=e.jsx,s.polished=e.polished},function(e){i.helpUtils=e.helpUtils,i.utils=e.utils},function(e){o.searchUtils=e.searchUtils},function(e){a.withTheme=e.withTheme},function(e){n.Button=e.Button,n.Collapse=e.Collapse,n.Icon=e.Icon,n.Loading=e.Loading,n.LoadingType=e.LoadingType,n.Popper=e.Popper,n.Tab=e.Tab,n.Tabs=e.Tabs,n.TextInput=e.TextInput,n.defaultMessages=e.defaultMessages}],execute:function(){e((()=>{var e={1245:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><path fill="#000" fill-rule="evenodd" d="M2.596 6.357c.39-.59.944-1.055 1.595-1.337L15.544.094a1.14 1.14 0 0 1 .91 0L30 5.97V23.66a3.6 3.6 0 0 1-.596 1.983 3.65 3.65 0 0 1-1.595 1.337l-11.353 4.927a1.14 1.14 0 0 1-.91 0L2 26.029V8.34a3.6 3.6 0 0 1 .596-1.984m3.419 15.162q.014.024.037.038l9.594 5.351a.72.72 0 0 0 .705 0l9.144-5.103a1 1 0 0 0 .37-.356.95.95 0 0 0 .135-.488v-9.89a.85.85 0 0 0-.122-.438.9.9 0 0 0-.331-.32l-9.497-5.3a.1.1 0 0 0-.104 0l-2.415 1.348a.1.1 0 0 0-.026.025.066.066 0 0 0 .026.092l8.947 4.992c.39.218.716.532.941.91.226.378.345.807.345 1.243v5.514q0 .121-.062.226a.46.46 0 0 1-.172.165l-5.633 3.145a3.9 3.9 0 0 1-1.899.49c-.666 0-1.32-.169-1.898-.49L8.972 19.81a1.46 1.46 0 0 1-.542-.524 1.4 1.4 0 0 1-.198-.715V11.76a.07.07 0 0 1 .07-.068q.018 0 .035.009l7.651 4.268q.076.043.121.117a.3.3 0 0 1 .045.16v2.526q0 .019.009.034a.07.07 0 0 0 .06.033.1.1 0 0 0 .035-.009l1.972-1.1c.28-.156.511-.38.673-.651.161-.27.247-.577.247-.89v-.964c0-.278-.076-.55-.22-.79-.144-.241-.35-.44-.598-.58L9.65 9.011a.89.89 0 0 0-.86 0L6.052 10.54a.104.104 0 0 0-.052.088v10.842q0 .027.015.05" clip-rule="evenodd"></path></svg>'},2018:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1M1 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm3 2h8V4H4zm8 3H4V7h8zm-8 3h6v-1H4z" clip-rule="evenodd"></path></svg>'},655:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2.146 4.653a.485.485 0 0 1 .708 0L8 10.24l5.146-5.587a.485.485 0 0 1 .708 0 .54.54 0 0 1 0 .738l-5.5 5.956a.485.485 0 0 1-.708 0l-5.5-5.956a.54.54 0 0 1 0-.738" clip-rule="evenodd"></path></svg>'},4064:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M13.854 11.347a.486.486 0 0 1-.708 0L8 5.76l-5.146 5.587a.485.485 0 0 1-.708 0 .54.54 0 0 1 0-.738l5.5-5.956a.485.485 0 0 1 .708 0l5.5 5.956a.54.54 0 0 1 0 .738" clip-rule="evenodd"></path></svg>'},170:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-1.27 4.936a6.5 6.5 0 1 1 .707-.707l4.136 4.137a.5.5 0 1 1-.707.707z" clip-rule="evenodd"></path></svg>'},6745:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m1 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.676 2.228H7.34c-.213-1.138.621-2.13 1.375-3.025C9.28 6.532 9.8 5.914 9.8 5.328 9.8 4.5 9.2 3.9 7.976 3.9c-.816 0-1.572.36-2.268 1.092l-.648-.6C5.852 3.552 6.788 3 8.096 3c1.692 0 2.772.864 2.772 2.244 0 .864-.652 1.628-1.3 2.387-.71.831-1.413 1.655-1.244 2.597m.3 2.172c0 .48-.348.792-.768.792-.432 0-.78-.312-.78-.792s.348-.804.78-.804c.42 0 .768.324.768.804" clip-rule="evenodd"></path></svg>'},5508:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6.5 7.5A.5.5 0 0 1 7 7h1.5v4.5h1a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h1V8H7a.5.5 0 0 1-.5-.5"></path><path fill="#000" fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14" clip-rule="evenodd"></path></svg>'},9244:e=>{"use strict";e.exports=s},4108:e=>{"use strict";e.exports=i},1496:e=>{"use strict";e.exports=o},1888:e=>{"use strict";e.exports=a},4321:e=>{"use strict";e.exports=n}},t={};function r(s){var i=t[s];if(void 0!==i)return i.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var l={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(l),r.d(l,{__set_webpack_public_path__:()=>oe,default:()=>ie});var e=r(9244),t=r(4321),s=r(4108),i=r(1888),o=r(2018),a=r.n(o),n=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const p=t=>{const s=window.SVG,{className:i}=t,o=n(t,["className"]),r=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:r,src:a()},o)):e.React.createElement("svg",Object.assign({className:r},o))};class c extends e.React.PureComponent{constructor(t){super(t),this.onSelectItem=e=>{this.stopBubble(e),this.props.onSelect&&this.props.onSelect(this.props.item)},this.beginDrag=t=>{if(this.props.appMode!==e.AppMode.Design)return;const{item:s}=this.props;if(t.dataTransfer&&t.dataTransfer.setData("exbWidget",s.name||s.id),window._dragging_widget_item=Object.assign(Object.assign({},s),{count:this.uniqueId}),this.uniqueId++,!this.appFrameDoc){const t=document.querySelector(`iframe[name="${e.APP_FRAME_NAME_IN_BUILDER}"]`);this.appFrameDoc=t.contentDocument||t.contentWindow.document}this.appFrameDoc&&this.appFrameDoc.documentElement.classList.add("exb-h5-dragging")},this.endDrag=e=>{window._dragging_widget_item=null,this.appFrameDoc&&this.appFrameDoc.documentElement.classList.remove("exb-h5-dragging")},this.MemoChildFunctionComponent=e.React.memo((({item:t,fullLine:s})=>this.props.children?(0,e.jsx)("div",{className:"w-100 h-100"},this.props.children(t,s)):null)),this.uniqueId=0}stopBubble(e){e&&e.stopPropagation?e.stopPropagation():window.event&&(window.event.cancelBubble=!0)}maskStyle(){return e.css`
      position: absolute;
      user-select: none;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      cursor: default;

      &.can-drag {
        cursor: pointer;

        &:active {
          cursor: grabbing;
        }
      }
    `}render(){const{item:t,fullLine:s,appMode:i}=this.props,o=this.MemoChildFunctionComponent;return(0,e.jsx)("div",{className:(0,e.classNames)({"col-6":!s,col:s,[this.props.className]:!!this.props.className}),draggable:i===e.AppMode.Design,onClick:this.onSelectItem,onDragStart:this.beginDrag,onDragEnd:this.endDrag,key:t.name,title:t.label,"data-widget-name":t.name},"function"==typeof this.props.children?(0,e.jsx)(o,{item:t,fullLine:s}):this.props.children,(0,e.jsx)("div",{className:(0,e.classNames)({"can-drag":i===e.AppMode.Design}),css:this.maskStyle()}))}}const d="This area lists widgets that have been configured but not on the current canvas. They may exist in other device modes.",u="Insert widget",m="Pending",g="About this widget",h="Take a tour";var f=r(5508),v=r.n(f),b=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const x=t=>{const s=window.SVG,{className:i}=t,o=b(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:v()},o)):e.React.createElement("svg",Object.assign({className:a},o))},w=()=>{const t={color:"#fff",bg:"#5f5fff",shadow:"0 2px 12px 0 rgba(95,95,255,0.40)"},s={color:"#fff",bg:"#4949ff"};return e.css`
    width: 240px;
    padding: 1rem;
    h1, h2, h3, h4, h5, h6 {
      color: var(--ref-palette-neutral-1000);
    }
    .btn-primary {
      min-width: 100px;
      color: ${t.color}!important;
      background-color: ${t.bg}!important;
      border: 1px solid transparent;
      box-shadow: ${t.shadow}!important;
      &:hover {
        color: ${s.color}!important;
        background-color: ${s.bg}!important;
        border: 1px solid transparent!important;
      }
    }
  `};const y=e.ReactRedux.connect((e=>{var t;return{browserSizeMode:null===(t=e.appStateInBuilder)||void 0===t?void 0:t.browserSizeMode}}))((0,e.injectIntl)((function(s){var i,o;const{widgetItem:a,intl:n}=s,[r,l]=e.React.useState(!1),p=e.React.useRef(),c=e.React.useMemo((()=>n.formatMessage({id:"widgetHelpIconLabel",defaultMessage:g})),[n]),d=e.React.useMemo((()=>n.formatMessage({id:"widgetGuideStart",defaultMessage:h})),[n]);return(0,e.jsx)(e.React.Fragment,null,(0,e.jsx)(t.Button,{type:"tertiary",className:"widget-help-btn",icon:!0,size:"sm",title:c,onClick:()=>{l(!r)},ref:p},(0,e.jsx)(x,null),(0,e.jsx)("span",{className:"sr-only"},d),(0,e.jsx)(t.Popper,{showArrow:!0,css:w,open:r,placement:"right",offset:[0,10],reference:p.current,toggle:()=>{l(!1)}},(0,e.jsx)("h5",null,null==a?void 0:a.label),(0,e.jsx)("p",null,null==a?void 0:a.description),(null===(o=null===(i=null==a?void 0:a.manifest)||void 0===i?void 0:i.properties)||void 0===o?void 0:o.hasGuide)&&s.browserSizeMode===e.BrowserSizeMode.Large&&(0,e.jsx)(t.Button,{className:"float-right",type:"primary",size:"sm",onClick:t=>{var s;e.GuideManager.getInstance().startGuide({id:a.uri,type:null===(s=a.manifest.properties)||void 0===s?void 0:s.guideType,level:e.GuideLevels.Widget}),l(!1)}},d))))})));var j=r(1245),I=r.n(j),S=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const M=t=>{const s=window.SVG,{className:i}=t,o=S(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:I()},o)):e.React.createElement("svg",Object.assign({className:a},o))};class N extends e.React.PureComponent{constructor(){super(...arguments),this.getListItemJSX=({item:t,appMode:s})=>{if(!t)return(0,e.jsx)("div",{className:"col-6",style:{visibility:"hidden"}});const i=this.Item;return(0,e.jsx)(c,{item:t,fullLine:!1,className:"widget-card-item mt-2",appMode:s},(()=>(0,e.jsx)(i,{item:t,hideLabel:!1})))},this.getRequireEnterpriseIconTooltip=e=>{if((null==e?void 0:e.length)>0){const s=e.join(", ");return this.props.intl.formatMessage({id:"requireEnterpriseAndUserTypeExtensions",defaultMessage:t.defaultMessages.requireEnterpriseAndUserTypeExtensions},{userTypeExtensions:s})}return this.props.intl.formatMessage({id:"requireEnterprise",defaultMessage:t.defaultMessages.requireEnterprise})},this.getCustomWidgetItemDetailUrl=t=>{var s;const i=null===(s=(0,e.getAppStore)().getState())||void 0===s?void 0:s.portalUrl;return t&&i?`${i.replace(/\/sharing\/rest/,"").replace(/\/$/,"")}/home/item.html?id=${t}`:null},this.Item=({item:s,hideLabel:i})=>{var o,a,n,r,l,c,d;const u=`${s.name}-requireEnterprise`;return(0,e.jsx)("div",{className:(0,e.classNames)("d-flex justify-content-center w-100 h-100 widget-card-item-content",{"align-items-start":!i,"align-items-center":i,"pt-0":i}),key:s.name,"aria-label":s.label,"aria-describedby":(null===(o=s.manifest)||void 0===o?void 0:o.requireEnterprise)&&u,tabIndex:0,role:"button"},(0,e.jsx)("div",{className:(0,e.classNames)("d-flex flex-column",{"h-100":!i})},(null===(n=null===(a=s.manifest)||void 0===a?void 0:a.properties)||void 0===n?void 0:n.hasGuide)&&(0,e.jsx)(y,{widgetItem:s}),(null===(r=s.manifest)||void 0===r?void 0:r.requireEnterprise)&&(0,e.jsx)(t.Button,{tag:"div",id:u,title:this.getRequireEnterpriseIconTooltip(null===(l=s.manifest)||void 0===l?void 0:l.requiredUserTypeExtensions),type:"tertiary",className:"widget-enterprise-btn",disableHoverEffect:!0,disableRipple:!0,icon:!0,size:"sm"},(0,e.jsx)(M,null)),s.itemId&&(0,e.jsx)(t.Button,{type:"tertiary",className:"widget-help-btn",icon:!0,size:"sm",title:this.props.intl.formatMessage({id:"details",defaultMessage:t.defaultMessages.details}),href:this.getCustomWidgetItemDetailUrl(s.itemId),target:"_blank"},(0,e.jsx)(p,null)),(0,e.jsx)("div",{className:"d-flex justify-content-center"},(0,e.jsx)("div",{className:"widget-card-image"},s.icon&&(0,e.jsx)(t.Icon,{className:"w-100",icon:s.icon,size:20,autoFlip:null===(d=null===(c=s.manifest)||void 0===c?void 0:c.properties)||void 0===d?void 0:d.flipIcon}))),!i&&(0,e.jsx)("div",{className:(0,e.classNames)("widget-card-name flex-grow-1 d-flex align-items-center mt-0")},(0,e.jsx)("span",{className:"text-center text-truncate widget-card-name-content"},s.label,"\u200e"))))}}render(){return this.getListItemJSX(this.props)}}function O(e,t){return!!e&&(!t||e.toLocaleLowerCase().includes(t.toLocaleLowerCase()))}function L(e){var t,s,i;const o=Object.keys((null===(t=null==e?void 0:e.appRuntimeInfo)||void 0===t?void 0:t.sectionNavInfos)||{}).map((t=>{var s;return null===(s=e.appRuntimeInfo.sectionNavInfos[t])||void 0===s?void 0:s.currentViewId}));return"insert"===(o[0]||"insert")&&(null===(i=null===(s=null==e?void 0:e.widgetsState)||void 0===s?void 0:s["left-sidebar"])||void 0===i?void 0:i.collapse)}var P=r(4064),R=r.n(P),C=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const T=t=>{const s=window.SVG,{className:i}=t,o=C(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:R()},o)):e.React.createElement("svg",Object.assign({className:a},o))};var E=r(655),V=r.n(E),B=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const W=t=>{const s=window.SVG,{className:i}=t,o=B(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:V()},o)):e.React.createElement("svg",Object.assign({className:a},o))};var z=r(6745),$=r.n(z),k=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const D=t=>{const s=window.SVG,{className:i}=t,o=k(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:$()},o)):e.React.createElement("svg",Object.assign({className:a},o))},_=s.utils.CUSTOM_GROUP;class G extends e.React.PureComponent{isLoading(e){return!e}getGroupLabel(e){return s.utils.getWidgetsGroupLabel(e,this.props.intl)}getCommonGroups(e){const t={};return(e||[]).forEach((e=>{e.group!==_&&(t[e.group]||(t[e.group]={label:this.getGroupLabel(e.group),groupId:e.group,itemList:[]}),t[e.group].itemList.push(e))})),t}getCustomGroup(e,t){return{label:this.getGroupLabel(_),groupId:_,itemList:(t||[]).concat((null==e?void 0:e.filter((e=>e.group===_)))||[])}}render(){const i=this.props.commonWidgetList||[];return(0,e.jsx)("div",{className:"flex-column bg-default d-flex w-100 h-100"},(0,e.jsx)("div",{className:"jimu-builder-panel--content choose-widget-popup-content text-overlay"},this.isLoading(this.props.commonWidgetList)?(0,e.jsx)("div",{className:"loading-container w-100 h-100"},(0,e.jsx)(t.Loading,{type:t.LoadingType.Secondary})):(0,e.jsx)("div",null,Object.values(this.getCommonGroups(i.concat([s.utils.getPlaceholderItemForWidgetsList(this.props.intl),s.utils.getSectionItemForWidgetsList(this.props.intl)]))).sort(((e,t)=>e.groupId-t.groupId)).map(((t,s)=>(0,e.jsx)(U,{key:s,group:t,appMode:this.props.appMode,searchValue:this.props.searchValue,intl:this.props.intl}))),s.utils.showCustomWidgets(i)&&(0,e.jsx)(U,{group:this.getCustomGroup(i,this.props.remoteCustomWidgetList),appMode:this.props.appMode,searchValue:this.props.searchValue,isLoading:this.isLoading(this.props.remoteCustomWidgetList),intl:this.props.intl}))))}}class A extends e.React.PureComponent{constructor(e){super(e),this.getCustomWidgetUrl=()=>{var e,t;(null===(e=this.props.group)||void 0===e?void 0:e.groupId)===_&&(null===(t=s.helpUtils.getBuildAppsHelpLink("add-custom-widgets"))||void 0===t||t.then((e=>{e&&this.setState({customWidgetHref:e})})))},this.toggle=()=>{this.setState({isOpen:!this.state.isOpen})},this.getItemList=()=>O(this.props.group.label,this.props.searchValue)?this.props.group.itemList:this.props.group.itemList.filter((e=>O(e.label,this.props.searchValue))),this.state={isOpen:!0,customWidgetHref:"#"}}componentDidMount(){this.getCustomWidgetUrl()}componentDidUpdate(e){if(e.portalSelf!==this.props.portalSelf&&this.getCustomWidgetUrl(),e.searchValue!==this.props.searchValue){const e=this.getItemList();this.setState({isOpen:!this.props.searchValue||e.length>0})}}render(){if(!this.props.group)return null;const s=this.getItemList();return(0,e.jsx)("div",{className:"container-fluid mb-5 mt-2 px-4",role:"group","aria-label":this.props.group.label},(0,e.jsx)("div",{className:"w-100 d-flex justify-content-between"},(0,e.jsx)("h6",{className:"new-elements-title w-75 text-break",title:this.props.group.label},this.props.group.label),(0,e.jsx)("div",{className:"d-flex justify-content-end"},this.props.group.groupId===_&&(0,e.jsx)(t.Button,{icon:!0,size:"sm",type:"tertiary",title:this.props.intl.formatMessage({id:"help",defaultMessage:t.defaultMessages.help}),href:this.state.customWidgetHref,target:"_blank"},(0,e.jsx)(D,null)),(0,e.jsx)(t.Button,{icon:!0,size:"sm",type:"tertiary",onClick:this.toggle},this.state.isOpen?(0,e.jsx)(T,null):(0,e.jsx)(W,null)))),(0,e.jsx)(t.Collapse,{wrapperClassName:"row no-gutters",isOpen:this.state.isOpen},this.props.isLoading?(0,e.jsx)("div",{className:"loading-container w-100 h-100"},(0,e.jsx)(t.Loading,{type:t.LoadingType.Secondary})):s.sort(((e,t)=>e.order-t.order)).map(((t,s)=>t?(0,e.jsx)(N,{item:t,hideLabel:!1,intl:this.props.intl,appMode:this.props.appMode,key:s}):(0,e.jsx)("div",{className:"col-6",style:{visibility:"hidden"},key:s})))))}}const U=e.ReactRedux.connect((e=>({portalSelf:e.portalSelf})))(A),F=(0,i.withTheme)(G);var q=r(1496);class H extends e.React.PureComponent{constructor(){super(...arguments),this.getListItemJSX=t=>{if(!t)return(0,e.jsx)("div",{className:"col-6",style:{visibility:"hidden"}});const s=this.Item;return(0,e.jsx)("div",{key:t.name||t.id},(0,e.jsx)(c,{item:t,fullLine:!0,appMode:this.props.appMode,className:"draggable-element p-0 mb-3"},(()=>(0,e.jsx)(s,{item:t}))))},this.Item=({item:s})=>{var i,o;const a="string"==typeof s.icon?s.icon:s.icon&&s.icon.svg,n="string"==typeof s.icon?null:s.icon&&s.icon.properties&&s.icon.properties.color;return(0,e.jsx)("div",{title:s.label,className:"d-flex align-items-center pending-elements-item px-2","aria-label":s.label,tabIndex:0,role:"button"},(0,e.jsx)("div",{className:"pending-elements-item-icon-container d-flex justify-content-center align-items-center"},(0,e.jsx)(t.Icon,{className:"pending-elements-item-icon",icon:a,color:n,autoFlip:null===(o=null===(i=s.manifest)||void 0===i?void 0:i.properties)||void 0===o?void 0:o.flipIcon})),(0,e.jsx)("div",{className:"text-truncate pending-elements-item-label"},s.label))}}render(){return(0,e.jsx)("div",{className:"w-100"},this.getListItemJSX(this.props.item))}}const X=(0,i.withTheme)(H);class J extends e.React.PureComponent{constructor(){super(...arguments),this.convertLayoutItemToElementItem=(t,s)=>{var i,o,a;const n=null===(i=(0,e.getAppStore)().getState().appStateInBuilder)||void 0===i?void 0:i.appConfig,r=n.layouts[t.layoutId].content[t.layoutItemId],l=q.searchUtils.getWidgetIdThatUseTheLayoutId(n,t.layoutId);if(r.type===e.LayoutItemType.Widget){const i=r.widgetId,o=n.widgets[i];let a;a=l&&n.widgets[l].manifest.widgetType!==e.WidgetType.Layout?Object.keys(n.widgets[l].layouts).length>1&&n.layouts[t.layoutId].label?n.widgets[l].label+"-"+n.layouts[t.layoutId].label+"-"+o.label:n.widgets[l].label+"-"+o.label:o.label;const p=o&&o.icon?"string"==typeof o.icon?o.icon:o.icon.asMutable({deep:!0}):"./widgets/element-selector/dist/runtime/assets/section.svg";return{id:r.widgetId,itemType:e.LayoutItemType.Widget,layoutInfo:t,isFromCurrentSizeMode:s,label:a,uri:o&&o.uri,icon:p,isPending:!0,manifest:o&&o.manifest&&o.manifest.asMutable({deep:!0})}}if(r.type===e.LayoutItemType.Section){const i=r.sectionId,a=null===(o=n.sections)||void 0===o?void 0:o[i],l=a&&a.icon?"string"==typeof a.icon?a.icon:a.icon.asMutable({deep:!0}):"./widgets/element-selector/dist/runtime/assets/section.svg";return{id:i,itemType:e.LayoutItemType.Section,layoutInfo:t,isFromCurrentSizeMode:s,label:a&&a.label,uri:"",icon:l,isPending:!0,manifest:{properties:{}}}}if(r.type===e.LayoutItemType.ScreenGroup){const i=r.screenGroupId,o=null===(a=n.screenGroups)||void 0===a?void 0:a[i],l=o&&o.icon?"string"==typeof o.icon?o.icon:o.icon.asMutable({deep:!0}):"./widgets/element-selector/dist/runtime/assets/screen-group.svg";return{id:i,itemType:e.LayoutItemType.ScreenGroup,layoutInfo:t,isFromCurrentSizeMode:s,label:o&&o.label,uri:"",icon:l,isPending:!0,manifest:{properties:{}}}}return null}}render(){var t,s;const i=null===(t=(0,e.getAppStore)().getState().appStateInBuilder)||void 0===t?void 0:t.appConfig;if(null==i||!(null===(s=this.props.layouts)||void 0===s?void 0:s[this.props.layoutId]))return null;if(this.props.activeOptsSectionViewId&&"insert"!==this.props.activeOptsSectionViewId)return null;const o=this.props.layoutId,a=o?q.searchUtils.getPendingLayoutItemsFromOtherSizeModeInPage(i,this.props.currentPageId,this.props.browserSizeMode,this.props.activePagePart):[],n=o?q.searchUtils.getPendingLayoutItemsFromOtherSizeModeInDialog(i,this.props.currentDialogId,this.props.browserSizeMode):[],r=a.map((e=>this.convertLayoutItemToElementItem(e,!1))).concat(n.map((e=>this.convertLayoutItemToElementItem(e,!1)))),l=o?q.searchUtils.getPendingLayoutItemsInPage(i,this.props.currentPageId,this.props.browserSizeMode,this.props.activePagePart):[],p=o?q.searchUtils.getPendingLayoutItemsInDialog(i,this.props.currentDialogId,this.props.browserSizeMode):[],c=l.map((e=>this.convertLayoutItemToElementItem(e,!0))).concat(p.map((e=>this.convertLayoutItemToElementItem(e,!0)))),u=r.concat(c).filter((e=>O(e.label,this.props.searchValue)));return(0,e.jsx)("div",{className:"flex-column bg-default d-flex px-4 pb-4"},0===u.length&&(0,e.jsx)("div",{className:"pt-1 text-white-50 text-left text-break"},this.props.intl.formatMessage({id:"pendingElementsInfo",defaultMessage:d})),u.map((t=>(0,e.jsx)(X,{key:t.id,item:t,appMode:this.props.appMode}))))}}const K=(0,e.createSelector)([e=>L(e),e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo.currentPageId},e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo.currentDialogId},e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo.appMode},e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.browserSizeMode},e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo.activePagePart},e=>{var t,s,i;return null===(i=null===(s=null===(t=e.appRuntimeInfo)||void 0===t?void 0:t.sectionNavInfos)||void 0===s?void 0:s["opts-section"])||void 0===i?void 0:i.currentViewId},e=>{var t;return null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appConfig}],((t,s,i,o,a,n,r,l)=>{var p,c,d,u,m,g,h,f,v,b;if(!t||!l)return{};let x;return x=n===e.PagePart.Header?null===(c=null===(p=l.header)||void 0===p?void 0:p.layout)||void 0===c?void 0:c[a]:n===e.PagePart.Footer?null===(u=null===(d=l.footer)||void 0===d?void 0:d.layout)||void 0===u?void 0:u[a]:n===e.PagePart.Body?null===(h=null===(g=null===(m=l.pages)||void 0===m?void 0:m[s])||void 0===g?void 0:g.layout)||void 0===h?void 0:h[a]:null===(b=null===(v=null===(f=l.dialogs)||void 0===f?void 0:f[i])||void 0===v?void 0:v.layout)||void 0===b?void 0:b[a],{currentPageId:s,currentDialogId:i,appMode:o,browserSizeMode:a,activePagePart:n,layouts:l.layouts,layoutId:x,activeOptsSectionViewId:r}})),Q=e.ReactRedux.connect(K)((0,i.withTheme)(J));var Y=r(170),Z=r.n(Y),ee=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(e);o<i.length;o++)t.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(e,i[o])&&(s[i[o]]=e[i[o]])}return s};const te=t=>{const s=window.SVG,{className:i}=t,o=ee(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:Z()},o)):e.React.createElement("svg",Object.assign({className:a},o))};class se extends e.React.PureComponent{constructor(t){super(t),this.onSearchIconClick=e=>{this.setState({isSearchInputShown:!this.state.isSearchInputShown})},this.onSearchValueChange=e=>{this.setState({searchValue:e.target.value})},this.handleTabsChange=e=>{this.setState({activeTab:e})},this.MemoNewElements=e.React.memo((t=>(0,e.jsx)(F,{commonWidgetList:t.commonWidgetList,remoteCustomWidgetList:t.remoteCustomWidgetList,appMode:t.appMode,intl:t.intl,searchValue:t.searchValue}))),this.MemoPendingElements=e.React.memo((t=>(0,e.jsx)(Q,{intl:t.intl,searchValue:t.searchValue}))),this.state={commonWidgetList:null,remoteCustomWidgetList:null,isSearchInputShown:!1,searchValue:"",activeTab:"new"}}componentDidMount(){s.utils.fetchCommonWidgetList().then((e=>{this.setState({commonWidgetList:e})})),s.utils.fetchRemoteCustomWidgetList().then((e=>{this.setState({remoteCustomWidgetList:e})}))}componentDidUpdate(e,t){t.isSearchInputShown!==this.state.isSearchInputShown&&this.state.isSearchInputShown&&this.searchInput&&(this.searchInput.focus(),this.searchInput.select())}render(){const s=this.MemoNewElements,i=this.MemoPendingElements,o=this.props.intl.formatMessage({id:"search",defaultMessage:e.defaultMessages.search});return(0,e.jsx)("div",{css:(a=this.props.theme,e.css`
  .widget-builder-header-insert-elements {
    .text-dark-600{
      color: ${a.ref.palette.neutral[1e3]};
    }
    .mb-10{
      margin-bottom: ${e.polished.rem(10)};
    }
    .mb-18{
      margin-bottom: ${e.polished.rem(18)};
    }
    .title{
      padding: 18px 16px 8px 16px !important;
      font-size: 1rem !important;
      font-weight: 500;
      .search-icon{
        cursor: pointer;
        width: 30px;
      }
    }
    .search-input{
      height: 26px;
      border-radius: 2px;
    }
    .loading-container{
      position: relative;
    }
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    text-align: left;
    /* border-right: 1px solid ${a.ref.palette.neutral[700]}; */
    .collapse-btn{
      cursor: pointer;
      .jimu-icon{
        vertical-align: top;
      }
    }
    .jimu-nav{
      flex-shrink: 0;
      flex-grow: 0;
    }
    .new-elements-title{
      font-weight: 600;
      color: ${a.ref.palette.neutral[1e3]};
      margin-bottom: ${e.polished.rem(8)};
    }
    .jimu-nav{
      height: ${e.polished.rem(43)} !important;
    }
    .jimu-tab{
      height: calc(100% - 50px);
    }
    .with-search-input.jimu-tab{
      height: calc(100% - 90px);
    }
    .tab-content{
      overflow: auto;
      padding-top: ${e.polished.rem(18)};
    }

    .draggable-element:hover{
      .pending-elements-item{
        background-color: ${a.ref.palette.neutral[600]};
      }
    }

    .pending-elements-item{
      height: ${e.polished.rem(32)};
      background: ${a.sys.color.secondary.main};

      .pending-elements-item-icon-container{
        margin-right: ${e.polished.rem(8)};
        .pending-elements-item-icon{
          width: ${e.polished.rem(16)};
          height: ${e.polished.rem(16)};
          color: ${a.ref.palette.neutral[1100]};
        }
      }
      .pending-elements-item-label{
        max-width: ${e.polished.rem(180)};
        color: ${a.ref.palette.neutral[1100]};
        line-height: ${e.polished.rem(32)};
        font-size: ${e.polished.rem(13)};
      }
    }

    .btn{
      .jimu-icon{
        margin: 0;
      }
    }
    .jimu-builder-panel--header {
      padding: ${a.sys.spacing(2)} ${a.sys.spacing(4)};
      display: flex;
      flex-direction: row;
      align-items: center;
      h3 {
        margin: 0;
        line-height: 1.5;
        flex-grow: 1;
      }
    }
    .jimu-builder-panel--content {
      height: 100%;
      overflow: auto;
      .widget-card-item{
        height: 80px;
        font-size: 13px;

        user-select: none;
        cursor: pointer;
        .widget-card-item-content{
          position: relative;
          padding-top: 16px;
          background-color: ${a.ref.palette.neutral[500]};
        }
        &:hover .widget-card-item-content{
          background-color: ${a.ref.palette.neutral[600]};
        }
        .widget-card-image{
          width: 20px;
          height: 20px;
          &:after{
            display: none;
          }
        }

        .widget-card-name{
          max-width: 100px;
          margin: 0 auto;
          .widget-card-name-content{
            line-height: 1rem;
            max-height:2rem;
            white-space: normal;
          }
        }

        .widget-help-btn {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1;
        }

        .widget-enterprise-btn {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
      }

      .row {
        .col-6:nth-of-type(2n) {
          padding-left: ${a.sys.spacing(1)};
        }
        .col-6:nth-of-type(2n+1) {
          padding-right: ${a.sys.spacing(1)};
        }

        .col {
          flex-basis: 100%;
        }
      }
    }
    &.widget-popup-hide-animation{
      transition: transform 0.3s ease-out;
      &.from-left {
        transform: translateX(-100%);
      }
      &.from-right {
        transform: translateX(100%);
      }
    }
    &.widget-popup-show-animation{
      transition: transform 0.3s ease-in;
      &.from-left {
        transform: translateX(0%);
      }
      &.from-right {
        transform: translateX(0%);
      }
    }
    &.from-left {
      left: 0;
    }
    &.from-right {
      right: 0;
    }
  }`)},(0,e.jsx)("div",{className:"jimu-builder-panel widget-builder-header-insert-elements from-left flex-column bg-default"},(0,e.jsx)("div",{className:"jimu-builder-panel--header d-flex flex-row justify-content-between hint-paper title"},(0,e.jsx)("div",{className:"flex-grow-1 m-0 text-truncate text-left",title:this.props.intl.formatMessage({id:"element",defaultMessage:u})},this.props.intl.formatMessage({id:"element",defaultMessage:u})),(0,e.jsx)("div",{className:"search-icon d-flex align-items-start justify-content-end",onClick:this.onSearchIconClick},(0,e.jsx)(t.Button,{size:"sm",icon:!0,type:"tertiary",title:o,"aria-label":o,"aria-pressed":this.state.isSearchInputShown},(0,e.jsx)(te,{size:"m"})))),(0,e.jsx)("div",{className:"w-100 px-4"},this.state.isSearchInputShown&&(0,e.jsx)("div",null,(0,e.jsx)(t.TextInput,{value:this.state.searchValue,onChange:this.onSearchValueChange,className:"search-input my-2",placeholder:this.props.intl.formatMessage({id:"search",defaultMessage:e.defaultMessages.search}),ref:e=>{this.searchInput=e},allowClear:!0,"aria-label":this.props.intl.formatMessage({id:"search",defaultMessage:e.defaultMessages.search})}))),(0,e.jsx)(t.Tabs,{type:"underline",fill:!0,className:(0,e.classNames)({"with-search-input":this.state.isSearchInputShown}),defaultValue:"new",onChange:this.handleTabsChange},(0,e.jsx)(t.Tab,{id:"new",className:"w-50",title:this.props.intl.formatMessage({id:"new",defaultMessage:e.defaultMessages.new})},(0,e.jsx)(s,{commonWidgetList:this.state.commonWidgetList,remoteCustomWidgetList:this.state.remoteCustomWidgetList,appMode:this.props.appMode,intl:this.props.intl,searchValue:this.state.searchValue})),(0,e.jsx)(t.Tab,{id:"pending",className:"w-50",title:this.props.intl.formatMessage({id:"pending",defaultMessage:m})},"pending"===this.state.activeTab&&(0,e.jsx)(i,{intl:this.props.intl,searchValue:this.state.searchValue})))));var a}}se.mapExtraStateProps=e=>{var t,s,i;return L(e)?{appMode:null===(t=e.appStateInBuilder)||void 0===t?void 0:t.appRuntimeInfo.appMode,appPath:e.appPath,browserSizeMode:null===(s=e.appStateInBuilder)||void 0===s?void 0:s.browserSizeMode,activePagePart:null===(i=e.appStateInBuilder)||void 0===i?void 0:i.appRuntimeInfo.activePagePart}:{}};const ie=se;function oe(e){r.p=e}})(),l})())}}}));