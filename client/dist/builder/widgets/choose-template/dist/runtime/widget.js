System.register(["jimu-core","jimu-for-builder","jimu-for-builder/service","jimu-for-builder/templates","jimu-theme","jimu-ui"],(function(e,t){var s={},i={},r={},a={},n={},o={};return{setters:[function(e){s.BrowserSizeMode=e.BrowserSizeMode,s.Immutable=e.Immutable,s.React=e.React,s.ReactRedux=e.ReactRedux,s.SessionManager=e.SessionManager,s.appActions=e.appActions,s.appConfigUtils=e.appConfigUtils,s.classNames=e.classNames,s.css=e.css,s.defaultMessages=e.defaultMessages,s.getAppStore=e.getAppStore,s.hooks=e.hooks,s.i18n=e.i18n,s.jimuHistory=e.jimuHistory,s.jsx=e.jsx,s.lodash=e.lodash,s.polished=e.polished,s.portalUrlUtils=e.portalUrlUtils,s.privilegeUtils=e.privilegeUtils,s.queryString=e.queryString,s.semver=e.semver,s.urlUtils=e.urlUtils,s.utils=e.utils,s.version=e.version},function(e){i.ExpressModeSwitch=e.ExpressModeSwitch,i.builderActions=e.builderActions,i.defaultMessages=e.defaultMessages,i.utils=e.utils},function(e){r.SearchType=e.SearchType,r.appServices=e.appServices},function(e){a.getAppTemplates=e.getAppTemplates},function(e){n.useTheme=e.useTheme,n.utils=e.utils},function(e){o.AlertPopup=e.AlertPopup,o.Button=e.Button,o.ButtonGroup=e.ButtonGroup,o.Card=e.Card,o.CollapsablePanel=e.CollapsablePanel,o.Image=e.Image,o.Loading=e.Loading,o.Nav=e.Nav,o.NavItem=e.NavItem,o.NavLink=e.NavLink,o.Navbar=e.Navbar,o.TextInput=e.TextInput,o.defaultMessages=e.defaultMessages}],execute:function(){e((()=>{var e={7213:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M16 2.443 5.851 14 0 8.115l1.45-1.538 4.31 4.334L14.463 1z" clip-rule="evenodd"></path></svg>'},505:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2 4h12v7H2zM0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4 10a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z" clip-rule="evenodd"></path></svg>'},9165:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M10 5H6v9h4zM6 3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" clip-rule="evenodd"></path></svg>'},8243:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M12 3H4v11h8zM4 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" clip-rule="evenodd"></path></svg>'},3760:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12"><path fill="#fff" d="M11.569 4.808 10.5 6.683v2.79a.67.67 0 0 1-.667.652h-.458V2.906a.285.285 0 0 0-.281-.281H4.5V.491a.105.105 0 0 1 .158-.093L6.566 1.5h3.267a.667.667 0 0 1 .667.668v1.657l.953.551a.31.31 0 0 1 .116.432M4.5 6.75h3V4.5h-3zm2.858 1.875H2.906a.285.285 0 0 1-.281-.281V1.5h-.457a.67.67 0 0 0-.668.668v2.707L.416 6.75a.32.32 0 0 0 .117.431l.967.54V9.45a.67.67 0 0 0 .668.675H5.4l1.943 1.125a.105.105 0 0 0 .143-.038.1.1 0 0 0 .014-.052V8.764a.143.143 0 0 0-.142-.139"></path></svg>'},2838:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="m8.745 8 6.1 6.1a.527.527 0 1 1-.745.746L8 8.746l-6.1 6.1a.527.527 0 1 1-.746-.746l6.1-6.1-6.1-6.1a.527.527 0 0 1 .746-.746l6.1 6.1 6.1-6.1a.527.527 0 0 1 .746.746z"></path></svg>'},2030:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M13 1a2 2 0 0 1 2 2v6.5a.5.5 0 0 1-1 0V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6.5a.5.5 0 0 1 0 1H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm-1.849 10.151a.517.517 0 0 1 .73 0l2.923 2.923a.517.517 0 0 1-.73.73l-2.923-2.922a.517.517 0 0 1 0-.73M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6" clip-rule="evenodd"></path></svg>'},170:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-1.27 4.936a6.5 6.5 0 1 1 .707-.707l4.136 4.137a.5.5 0 1 1-.707.707z" clip-rule="evenodd"></path></svg>'},8996:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 2.125 14.334 14H1.667zm-.882-.47a1 1 0 0 1 1.765 0l6.333 11.874A1 1 0 0 1 14.334 15H1.667a1 1 0 0 1-.882-1.47zM8 4.874a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0L8.9 5.87a.905.905 0 0 0-.9-.995m1 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0" clip-rule="evenodd"></path></svg>'},1740:e=>{e.exports="data:image/png;base64,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"},6488:e=>{e.exports="data:image/png;base64,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"},9244:e=>{"use strict";e.exports=s},4108:e=>{"use strict";e.exports=i},9860:e=>{"use strict";e.exports=r},6884:e=>{"use strict";e.exports=a},1888:e=>{"use strict";e.exports=n},4321:e=>{"use strict";e.exports=o}},t={};function l(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,l),r.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var s in t)l.o(t,s)&&!l.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.p="";var c={};return l.p=window.jimuConfig.baseUrl,(()=>{"use strict";l.r(c),l.d(c,{__set_webpack_public_path__:()=>He,default:()=>Qe});var e=l(9244);const t="3b5fbfab35f149a7992a7bde10d8ad9e",s="1.12.0";var i,r,a;!function(e){e.Default="Default",e.My="My",e.Favorites="Favorites",e.MyGroup="MyGroup",e.ArcGisOnline="ArcGisOnline",e.LivingAtlas="LivingAtlas",e.MyOrganization="MyOrganization"}(i||(i={})),function(e){e.MyPortalTemplate="MyPortalTemplate",e.MyTemplate="MyTemplate",e.EsriGroup="EsriGroup",e.ArcGISOnline="ArcGISOnline",e.Favorites="Favorites",e.LivingAtlas="LivingAtlas",e.MyGroup="MyGroup",e.MyOrganization="MyOrganization"}(r||(r={})),function(e){e.Published="Published",e.Draft="Draft",e.Changed="Changed"}(a||(a={}));var n=l(4108),o=l(9860),p=l(4321);const h={_widgetLabel:"Create a new experience",untitledExperience:"Untitled experience",templateListTitle:"Templates",searchPlaceholder:"Search",create:"Create",chooseTemplateDefault:"Default",my:"My templates",shared:"Shared templates",choseTemplate:"Select a template to start",templateSummary:"This is the summary of the item.",publicTemplate:"Public",noTemplatesAvailable:"No templates available. ",myFavorites:"My favorites",createError:"There was a problem when create new application.",noResource:"Resource does not exist or is inaccessible",warningPopUpTitle:"Warning",templateMultiPages:"Multi-pages",viewTemplateDetail:"View details",newTemplateMark:"New",createdByESRI:"Created by ESRI",categoriesBusinessAnalyst:"Business Analyst",categoriesClimate:"Weather and climate",categoriesDisaster:"Disaster",categoriesData:"Data",categoriesPopulation:"Population",categoriesInfrastructure:"Infrastructure",categoriesTourism:"Tourism",categoriesDocument:"Document",categoriesNoteworthy:"New and noteworthy",categoriesGeography:"Geography",categoriesSpecies:"Species",categories3D:"3D",categoriesPeople:"People",categoriesEnvironment:"Environment",fullscreenFixed:"Fullscreen fixed",createNewApp:"Create new app",largeDevices:"Large screen devices",mediumDevices:"Medium screen devices",smallDevices:"Small screen devices"};var d=l(2030),u=l.n(d),m=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const g=t=>{const s=window.SVG,{className:i}=t,r=m(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:u()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var A=l(8996),f=l.n(A),w=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const v=t=>{const s=window.SVG,{className:i}=t,r=w(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:f()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var b=l(3760),x=l.n(b),y=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const T=t=>{const s=window.SVG,{className:i}=t,r=y(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:x()},r)):e.React.createElement("svg",Object.assign({className:a},r))},{AppHigherVersionStateType:k,checkAppHigherVersionState:E}=e.utils;class O extends e.React.PureComponent{constructor(t){super(t),this.onCreateClick=()=>{const{name:e,isExperiencesTemplate:t}=this.props.info;if(t)return this.props.crateAppByTemplate(this.props.info),!1;this.props.onCreateClick(e)},this.clickThumbnailToCreate=()=>{const{name:e}=this.props.info;this.checkThumbnailIsAdd()&&this.props.onCreateClick(e)},this.checkThumbnailIsAdd=()=>{const{name:e,isExperiencesTemplate:t}=this.props.info;return!(t||"default"!==e&&"default2"!==e)},this.nls=e=>{const t=Object.assign({},h,p.defaultMessages);return this.props.intl?this.props.intl.formatMessage({id:e,defaultMessage:t[e]}):e},this.getStyle=()=>{var t,s,i;const{theme:r}=this.props,a=r?r.ref.palette.neutral[900]:"",n=r?r.ref.palette.white:"";return e.css`
      width: ${e.polished.rem(240)};
      height: ${e.polished.rem(260)};
      margin: 0 ${e.polished.rem(14)}  ${e.polished.rem(30)}  ${e.polished.rem(14)};
      display: flex;
      flex-direction: column;
      .app-version-remind {
        color: var(--sys-color-warning-main);
        .jimu-icon {
          margin-right: 0;
        }
      }
      .item-icon-con {
        height: ${e.polished.rem(30)};
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
        padding-left: ${e.polished.rem(8)};
        padding-right: ${e.polished.rem(8)};
        .esri-mark {
          background: var(--sys-color-primary-main);
          border-radius: 50%;
          text-align: center;
          height: ${e.polished.rem(18)};
          width: ${e.polished.rem(18)};
          line-height: ${e.polished.rem(17)};
          box-sizing: border-box;
          padding: 0 ${e.polished.rem(3)};
        }
        .right-icon-con {

        }
      }
      .new-oblique-filled {
        height: ${e.polished.rem(18)};
        line-height: ${e.polished.rem(18)};
        padding: 0 ${e.polished.rem(6)};
        font-size: 10px;
        color: var(--ref-palette-white);
        z-index: 10;
        background: var(--sys-color-warning-main);
        font-weight: bold;
        border-radius: 0 ${e.polished.rem(3)} ${e.polished.rem(3)} ${e.polished.rem(3)};
        text-align: center;
      }
      .image-container {
        position: relative;
        height: ${e.polished.rem(160)};
        width: ${e.polished.rem(240)};
        > img {
          width: 100%;
          max-width: 100%;
          max-height: 100%;
        }
        flex-shrink: 0;
        flex-grow: 0;

        .flip-image{
          transform: scaleX(-1);
        }
        .description {
          display: none;
          position: absolute;
          padding: ${e.polished.rem(16)};
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: ${e.polished.rgba(n,.5)};
          color: ${r.ref.palette.black};
          font-size: 13px;
          .content {
            overflow: hidden;
            width: 100%;
            height: 100%;
            overflow-y:auto;
          }
        }
        &:hover .description{
          display: block;
        }
        .description-cursor {
          cursor: pointer;
        }
        .padding-top {
          padding-top: ${e.polished.rem(30)};
        }
        .multi-pages {
          height: ${e.polished.rem(26)};
          line-height: ${e.polished.rem(26)};
          color: ${null===(t=null==r?void 0:r.ref.palette)||void 0===t?void 0:t.black};
          font-size: ${e.polished.rem(13)};
          padding: 0 ${e.polished.rem(14)};
          bottom: 0;
          right: 0;
          background: ${null===(i=null===(s=null==r?void 0:r.sys.color)||void 0===s?void 0:s.primary)||void 0===i?void 0:i.dark};
        }
      }
      .action-button {
        max-width:${e.polished.rem(154)};
        color:${r.ref.palette.black};
        display: block;
      }
      .template-info-con {
        padding: 0;
        border: none;
        background: transparent;
        flex-shrink: 1;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
        &:focus {
          .description {
            display: block;
          }
        }
        .title {
          padding: ${e.polished.rem(16)} ${e.polished.rem(12)} 0 ${e.polished.rem(12)};
          ${Object.assign({},e.polished.ellipsis())}
          font-size: ${e.polished.rem(16)};
          color:${r.ref.palette.neutral[1100]};
          text-align: left;
          .text-truncate {
            width: 0;
          }
        }
      }
      .info{
        padding: 0 ${e.polished.rem(12)} ${e.polished.rem(12)} ${e.polished.rem(12)};
        display: flex;
        flex-shrink: 1;
        flex-direction: column;
        justify-content: space-between;
        .tools-con {
          border-top: 1px solid var(--ref-palette-neutral-700);
          padding-top: ${e.polished.rem(12)};
          a.jimu-btn:hover {
            color: var(--ref-palette-black);
          }
        }
      }
      .buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon-btn:first-of-type {
          margin-left: -4px;
        }
      }
      &.disabled {
        > img {
          opacity: 0.6;
        }
        .jimu-icon {
          color: ${a};
          cursor: default;
        }
        .info{
          .title {
            color: ${r.ref.palette.neutral[1e3]};
          }
        }
      }
    `},this.getPublishStatus=e=>{let t;return(e.typeKeywords||[]).forEach((e=>{if(null==e?void 0:e.includes("status:")){switch(e.split(": ")[1]){case a.Published:case a.Changed:t=a.Published;break;case a.Draft:t=a.Draft}}})),t},this.showDesc=()=>{this.setState({showDesc:!0})},this.hideDesc=()=>{this.setState({showDesc:!1})},this.initPreviewUrl=()=>{const{isExperiencesTemplate:t,id:s,name:i,isPortalRequest:r,isArcGisOnlineRequest:a}=this.props.info;let n="";if(t||a||r){n=e.urlUtils.getAppUrl({appId:s,isTemplate:!0,isArcGisOnlineTemplate:a,isPortalRequest:r});const t=(0,e.getAppStore)().getState().queryObject,i=(null==n?void 0:n.includes("?"))?"&":"?";n=`${n}${(null==t?void 0:t.__env__)?`${i}__env__=${null==t?void 0:t.__env__}`:""}`}else{n=e.urlUtils.getAppUrl({appId:s,isTemplate:!0,isArcGisOnlineTemplate:a,isPortalRequest:!1,isDraft:!1,defaultTemplateName:i});const t=(0,e.getAppStore)().getState().queryObject,r=null==t?void 0:t.webmap,o=null==t?void 0:t.webscene,l=r?`&webmap=${r}`:o?`&webscene=${o}`:"";n=`${n}${l}`,l&&(n=n.replace(/\/\.\.\//g,encodeURIComponent("/../")))}this.setState({previewUrl:n})},this.getVersionRemindString=()=>{const{info:e}=this.props;switch(E(e)){case k.Both:return this.nls("templateVersionRemind");case k.Draft:return this.nls("draftTemplateVersionRemind");case k.Published:return this.nls("publishedTemplateVersionRemind")}},this.checkIsShowItemMarkContent=()=>{const{isNewTemplate:e,isArcGisOnlineRequest:t,isEsriGroupTemplate:s}=this.props.info;return e||s&&t},this.checkIsAppCanCreate=()=>{const{capabilities:e,info:t}=this.props,s=this.getPublishStatus(t);return!(null==t?void 0:t.origin)&&(e.canCreateExperience&&s!==a.Draft)},this.isRTL=(0,e.getAppStore)().getState().appContext.isRTL,this.state={showDesc:!1,previewUrl:"",thumbnail:""}}componentDidMount(){this.initPreviewUrl()}componentDidUpdate(){this.initPreviewUrl()}render(){const{disabled:t,style:s}=this.props,{title:i,image:r,snippet:a,flipThumbnail:n,isMultiplePage:o,isNewTemplate:l,isArcGisOnlineRequest:c,isEsriGroupTemplate:h}=this.props.info,{showDesc:d,previewUrl:u}=this.state,{capabilities:m,info:A}=this.props,f=d&&(null==r?void 0:r.gifSrc),w=E(A),b=h&&c,x=this.checkIsAppCanCreate();return(0,e.jsx)("div",{css:this.getStyle(),className:(0,e.classNames)("template bg-secondary",{disabled:t}),style:s},(0,e.jsx)(p.Button,{type:"tertiary",className:"template-info-con flex-grow-1 p-0",disableHoverEffect:!0,disableRipple:!0},(0,e.jsx)("div",{className:"image-container position-relative",onMouseEnter:this.showDesc,onMouseLeave:this.hideDesc},(0,e.jsx)("div",{className:"item-icon-con position-absolute w-100 d-flex align-items-center"},(0,e.jsx)("div",{className:"left-icon-con flex-grow-1"},l&&(0,e.jsx)("div",{className:"new-oblique-filled d-inline-block mr-1",title:this.nls("newTemplateMark")},this.nls("newTemplateMark")),b&&(0,e.jsx)("div",{className:"d-flex align-items-center esri-mark mr-1",title:this.nls("createdByESRI")},(0,e.jsx)(T,{"aria-hidden":"true",size:"s"}))),(0,e.jsx)("div",{className:"right-icon-con"})),(0,e.jsx)(p.Image,{src:f?r.gifSrc:r.src,alt:i,className:this.isRTL&&n?"flip-image":""}),o&&(0,e.jsx)("div",{className:"multi-pages position-absolute"},this.nls("templateMultiPages")),(0,e.jsx)("div",{className:(0,e.classNames)("description",{"description-cursor":this.checkThumbnailIsAdd(),"padding-top":this.checkIsShowItemMarkContent()}),onClick:this.clickThumbnailToCreate},(0,e.jsx)("div",{tabIndex:-1,className:"content"},(0,e.jsx)("div",null,a||this.nls("templateSummary"))))),(0,e.jsx)("div",{className:"title d-flex flex-grow-1 w-100"},(0,e.jsx)("div",{className:"flex-grow-1 text-truncate",title:i},i),w!==k.None&&(0,e.jsx)("div",{className:"ml-2 app-version-remind",title:this.getVersionRemindString()},(0,e.jsx)(v,{"aria-hidden":"true"})))),(0,e.jsx)("div",{className:"info"},(0,e.jsx)("div",{className:"buttons tools-con d-flex"},(0,e.jsx)("div",{className:"flex-grow-1"},x&&(0,e.jsx)(p.Button,{disabled:t,size:"sm",className:"action-button text-truncate",type:"primary",onClick:this.onCreateClick,title:this.nls("create")},this.nls("create")," ")),m.canViewExperience&&(0,e.jsx)(p.Button,{size:"sm",icon:!0,type:"tertiary",title:this.nls("preview"),href:u,target:"_blank"},(0,e.jsx)(g,{"aria-hidden":"true",size:16})))))}}O.defaultProps={disabled:!1};const S=O;class j extends e.React.PureComponent{constructor(){super(...arguments),this.nls=e=>this.props.intl?this.props.intl.formatMessage({id:e,defaultMessage:h[e]}):e,this.getStyle=()=>{var t;const{theme:s}=this.props;return e.css`
      & {
        width: 100%;
        top: 25%;
        left: 0;
      }
      .empty-message {
        text-align: center;
        font-size: ${e.polished.rem(22)};
        line-height: ${e.polished.rem(22)};
        color: ${null===(t=null==s?void 0:s.ref.palette)||void 0===t?void 0:t.neutral[1e3]};
        margin-top: ${e.polished.rem(30)};
      }
      .icon-con img{
        display: block;
        text-align: center;
        width: 26.7%;
        margin: 0 auto;
        opacity: 0.6;
      }
      @media (min-width: 1600px) {
        .icon-con img{
          width: 20%;
        }
      }
    `}}render(){return(0,e.jsx)("div",{css:this.getStyle(),className:"choose-template-empty-con position-absolute","data-testid":"empty"},(0,e.jsx)("div",{className:"icon-con"},(0,e.jsx)(p.Image,{src:l(6488),"data-testid":"empty-icon"})),(0,e.jsx)("p",{className:"empty-message"},this.nls("noTemplatesAvailable")))}}function R(e){return Object.keys(e).some((t=>{let s=e[t];if(!s)return!1;s&&s.toParam&&(s=s.toParam());switch(s.constructor.name){case"Array":case"Object":case"Date":case"Function":case"Boolean":case"String":case"Number":return!1;default:return!0}}))}function D(e){const t={};return Object.keys(e).forEach((s=>{var i,r;let a=e[s];if(a&&a.toParam&&(a=a.toParam()),!a&&0!==a&&"boolean"!=typeof a&&"string"!=typeof a)return;let n;switch(a.constructor.name){case"Array":const e=null===(r=null===(i=a[0])||void 0===i?void 0:i.constructor)||void 0===r?void 0:r.name;n="Array"===e?a:"Object"===e?JSON.stringify(a):a.join(",");break;case"Object":n=JSON.stringify(a);break;case"Date":n=a.valueOf();break;case"Function":n=null;break;case"Boolean":n=a+"";break;default:n=a}(n||0===n||"string"==typeof n||Array.isArray(n))&&(t[s]=n)})),t}function I(e,t){return Array.isArray(t)&&t[0]&&Array.isArray(t[0])?t.map((t=>I(e,t))).join("&"):encodeURIComponent(e)+"="+encodeURIComponent(t)}function C(e){const t=D(e);return Object.keys(t).map((e=>I(e,t[e]))).join("&")}const N=globalThis.FormData;globalThis.File,globalThis.Blob;class P extends Error{constructor(e,t,s,i,r){super(e);const a=new.target.prototype;Object.setPrototypeOf(this,a),e=e||"UNKNOWN_ERROR",t=t||"UNKNOWN_ERROR_CODE",this.name="ArcGISRequestError",this.message="UNKNOWN_ERROR_CODE"===t?e:`${t}: ${e}`,this.originalMessage=e,this.code=t,this.response=s,this.url=i,this.options=r}}function M(e){console&&console.warn&&console.warn.apply(console,[e])}const B="@esri/arcgis-rest-js";class G extends P{constructor(e="AUTHENTICATION_ERROR",t="AUTHENTICATION_ERROR_CODE",s,i,r){super(e,t,s,i,r),this.name="ArcGISAuthError",this.message="AUTHENTICATION_ERROR_CODE"===t?e:`${t}: ${e}`;const a=new.target.prototype;Object.setPrototypeOf(this,a)}retry(e,t=1){let s=0;const i=(r,a)=>{s+=1,e(this.url,this.options).then((e=>{const t=Object.assign(Object.assign({},this.options),{authentication:e});return U(this.url,t)})).then((e=>{r(e)})).catch((e=>{"ArcGISAuthError"===e.name&&s<t?i(r,a):e.name===this.name&&e.message===this.message&&s>=t?a(this):a(e)}))};return new Promise(((e,t)=>{i(e,t)}))}}function U(e,t){const s=globalThis.DEFAULT_ARCGIS_REQUEST_OPTIONS||{httpMethod:"POST",params:{f:"json"}},i=Object.assign(Object.assign(Object.assign({httpMethod:"POST"},s),t),{params:Object.assign(Object.assign({},s.params),t.params),headers:Object.assign(Object.assign({},s.headers),t.headers)}),{httpMethod:r,rawResponse:a}=i,n=Object.assign({f:"json"},i.params);let o=null;const l={method:r,signal:i.signal,credentials:i.credentials||"same-origin"};let c;if(i.headers&&i.headers["X-Esri-Auth-Client-Id"]&&e.indexOf("/oauth2/platformSelf")>-1&&(l.credentials="include"),"string"==typeof i.authentication){const e=i.authentication;c={portal:"https://www.arcgis.com/sharing/rest",getToken:()=>Promise.resolve(e)},i.authentication.startsWith("AAPK")||i.authentication.startsWith("AATK")||i.suppressWarnings||globalThis.ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING||(M("Using an oAuth 2.0 access token directly in the token option is discouraged. Consider using ArcGISIdentityManager or Application session. See https://esriurl.com/arcgis-rest-js-direct-token-warning for more information."),globalThis.ARCGIS_REST_JS_SUPPRESS_TOKEN_WARNING=!0)}else c=i.authentication;const p=e;return(c?c.getToken(e).catch((t=>(t.url=e,t.options=i,o=t,Promise.resolve("")))):Promise.resolve("")).then((t=>{t.length&&(n.token=t),c&&c.getDomainCredentials&&(l.credentials=c.getDomainCredentials(e));const s={};if("GET"===l.method){n.token&&i.hideToken&&"undefined"==typeof window&&(s["X-Esri-Authorization"]=`Bearer ${n.token}`,delete n.token);const r=""===C(n)?e:e+"?"+C(n);i.maxUrlLength&&r.length>i.maxUrlLength||n.token&&i.hideToken?(l.method="POST",t.length&&i.hideToken&&(n.token=t,delete s["X-Esri-Authorization"])):e=r}const r=new RegExp("/items/.+/updateResources").test(e);return"POST"===l.method&&(l.body=function(e,t){const s=R(e)||t,i=D(e);if(s){const e=new N;return Object.keys(i).forEach((t=>{if("undefined"!=typeof Blob&&i[t]instanceof Blob){const s=i.fileName||i[t].name||t;e.append(t,i[t],s)}else e.append(t,i[t])})),e}return C(e)}(n,r)),l.headers=Object.assign(Object.assign({},s),i.headers),("undefined"==typeof window||window&&void 0===window.document)&&!l.headers.referer&&(l.headers.referer=B),R(n)||r||(l.headers["Content-Type"]="application/x-www-form-urlencoded"),globalThis.fetch?globalThis.fetch(e,l):Promise.resolve({fetch:globalThis.fetch,Headers:globalThis.Headers,Response:globalThis.Response,Request:globalThis.Request}).then((({fetch:t})=>t(e,l)))})).then((t=>{if(!t.ok)return t.json().then((s=>{const{status:r,statusText:a}=t,{message:n,details:o}=s.error,l=`${n}. ${o?o.join(" "):""}`.trim();throw new P(l,`HTTP ${r} ${a}`,s,e,i)})).catch((s=>{if("ArcGISRequestError"===s.name)throw s;const{status:r,statusText:a}=t;throw new P(a,`HTTP ${r}`,t,e,i)}));if(a)return t;switch(n.f){case"json":case"geojson":return t.json();case"html":case"text":return t.text();default:return t.blob()}})).then((t=>{if("json"!==n.f&&"geojson"!==n.f||a)return t;{const s=function(e,t,s,i,r){if(e.code>=400){const{message:s,code:r}=e;throw new P(s,r,e,t,i)}if(e.error){const{message:s,code:a,messageCode:n}=e.error,o=n||a||"UNKNOWN_ERROR_CODE";if(498===a||499===a)throw r||new G(s,o,e,t,i);throw new P(s,o,e,t,i)}if("failed"===e.status||"failure"===e.status){let s,r="UNKNOWN_ERROR_CODE";try{s=JSON.parse(e.statusMessage).message,r=JSON.parse(e.statusMessage).code}catch(t){s=e.statusMessage||e.message}throw new P(s,r,e,t,i)}return e}(t,p,0,i,o);if(o){const t=e.toLowerCase().split(/\/rest(\/admin)?\/services\//)[0];i.authentication.federatedServers[t]={token:[],expires:new Date(Date.now()+864e5)},o=null}return s}}))}function L(e,t={params:{f:"json"}}){return U(e,t).catch((e=>e instanceof G&&t.authentication&&"string"!=typeof t.authentication&&t.authentication.canRefresh&&t.authentication.refreshCredentials?e.retry((()=>t.authentication.refreshCredentials()),1):Promise.reject(e)))}var F,z;!function(e){e.TOKEN_REFRESH_FAILED="TOKEN_REFRESH_FAILED",e.GENERATE_TOKEN_FOR_SERVER_FAILED="GENERATE_TOKEN_FOR_SERVER_FAILED",e.REFRESH_TOKEN_EXCHANGE_FAILED="REFRESH_TOKEN_EXCHANGE_FAILED",e.NOT_FEDERATED="NOT_FEDERATED",e.UNKNOWN_ERROR_CODE="UNKNOWN_ERROR_CODE"}(F||(F={}));class q extends Error{constructor(e="UNKNOWN_ERROR",t=F.UNKNOWN_ERROR_CODE,s,i,r){super(e);const a=new.target.prototype;Object.setPrototypeOf(this,a),this.name="ArcGISTokenRequestError",this.message=`${t}: ${e}`,this.originalMessage=e,this.code=t,this.response=s,this.url=i,this.options=r}}class _ extends Error{constructor(){super("The user has denied your authorization request.");const e=new.target.prototype;Object.setPrototypeOf(this,e),this.name="ArcGISAccessDeniedError"}}Error;function Q(e){return"string"!=typeof e||"/"===(e=e.trim())[e.length-1]&&(e=e.slice(0,-1)),e}!function(e){e.ArcGISRequestError="ArcGISRequestError",e.ArcGISAuthError="ArcGISAuthError",e.ArcGISAccessDeniedError="ArcGISAccessDeniedError",e.ArcGISTokenRequestError="ArcGISTokenRequestError"}(z||(z={}));const H=3e5;function W(e,t){const s=t;return s.rawResponse=!1,L(e,s).then((e=>{if("token"in e&&"expires"in e)return{token:e.token,username:t.params.username,expires:new Date(e.expires)};const s={token:e.access_token,username:e.username,expires:new Date(Date.now()+1e3*e.expires_in-H),ssl:!0===e.ssl};return e.refresh_token&&(s.refreshToken=e.refresh_token),e.refresh_token_expires_in&&(s.refreshTokenExpires=new Date(Date.now()+1e3*e.refresh_token_expires_in-H)),s}))}function $(e){return!e||e.length<=0?{}:e.replace(/^#/,"").replace(/^\?/,"").split("&").reduce(((e,t)=>{const{key:s,value:i}=function(e){const[t,s]=e.split("=");return{key:decodeURIComponent(t),value:decodeURIComponent(s)}}(t);return e[s]=i,e}),{})}const V=/^https?:\/\/(\S+)\.arcgis\.com.+/;function J(e){return V.test(e)}function Y(e){if(!V.test(e))return null;const t=e.match(V)[1].split(".").pop();return t.includes("dev")?"dev":t.includes("qa")?"qa":"production"}function K(e,t){const s=Q(function(e){if(!V.test(e))return e;switch(Y(e)){case"dev":return"https://devext.arcgis.com/sharing/rest";case"qa":return"https://qaext.arcgis.com/sharing/rest";default:return"https://www.arcgis.com/sharing/rest"}}(t)).replace(/https?:\/\//,""),i=Q(e).replace(/https?:\/\//,"");return new RegExp(i,"i").test(s)}function X(e,t=window){return!t&&window&&(t=window),t.btoa(String.fromCharCode.apply(null,e)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Z(e){!e&&window&&(e=window);return X(e.crypto.getRandomValues(new Uint8Array(32)))}class ee{constructor(e){if(this.clientId=e.clientId,this._refreshToken=e.refreshToken,this._refreshTokenExpires=e.refreshTokenExpires,this._username=e.username,this.password=e.password,this._token=e.token,this._tokenExpires=e.tokenExpires,this.portal=e.portal?Q(e.portal):"https://www.arcgis.com/sharing/rest",this.ssl=e.ssl,this.provider=e.provider||"arcgis",this.tokenDuration=e.tokenDuration||20160,this.redirectUri=e.redirectUri,this.server=e.server,this.referer=e.referer,this.federatedServers={},this.trustedDomains=[],e.server){const t=this.getServerRootUrl(e.server);this.federatedServers[t]={token:e.token,expires:e.tokenExpires}}this._pendingTokenRequests={}}get token(){return this._token}get tokenExpires(){return this._tokenExpires}get refreshToken(){return this._refreshToken}get refreshTokenExpires(){return this._refreshTokenExpires}get username(){return this._username?this._username:this._user&&this._user.username?this._user.username:void 0}get canRefresh(){return!(!this.username||!this.password)||!!(this.clientId&&this.refreshToken&&this.redirectUri)}static beginOAuth2(e,t){!t&&window&&(t=window);const{portal:s,provider:i,clientId:r,expiration:a,redirectUri:n,popup:o,popupWindowFeatures:l,locale:c,params:p,style:h,pkce:d,state:u}=Object.assign({portal:"https://www.arcgis.com/sharing/rest",provider:"arcgis",expiration:20160,popup:!0,popupWindowFeatures:"height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes",locale:"",style:"",pkce:!0},e),m=u||Z(t),g=`ARCGIS_REST_JS_AUTH_STATE_${r}`;t.localStorage.setItem(g,m);let A=`${Q(s)}/oauth2/authorize`;const f={client_id:r,response_type:d?"code":"token",expiration:a,redirect_uri:n,state:JSON.stringify({id:m,originalUrl:t.location.href}),locale:c,style:h};let w;if("arcgis"!==i&&(A=`${Q(s)}/oauth2/social/authorize`,f.socialLoginProviderName=i,f.autoAccountCreateForSocial=!0),d){const e=Z(t),s=`ARCGIS_REST_JS_CODE_VERIFIER_${r}`;t.localStorage.setItem(s,e),w=function(e,t=window){if(!t&&window&&(t=window),e&&t.isSecureContext&&t.crypto&&t.crypto.subtle){const s=(new t.TextEncoder).encode(e);return t.crypto.subtle.digest("SHA-256",s).then((e=>X(new Uint8Array(e),t)))}return Promise.resolve(null)}(e,t).then((function(t){f.code_challenge_method=t?"S256":"plain",f.code_challenge=t||e}))}else w=Promise.resolve();return w.then((()=>(A=`${A}?${C(f)}`,p&&(A=`${A}&${C(p)}`),o?new Promise(((e,i)=>{t.addEventListener(`arcgis-rest-js-popup-auth-${r}`,(t=>{if("access_denied"===t.detail.error){const e=new _;return i(e),e}if(t.detail.errorMessage){const e=new G(t.detail.errorMessage,t.detail.error);return i(e),e}e(new ee({clientId:r,portal:s,ssl:t.detail.ssl,token:t.detail.token,tokenExpires:t.detail.expires,username:t.detail.username,refreshToken:t.detail.refreshToken,refreshTokenExpires:t.detail.refreshTokenExpires,redirectUri:n}))}),{once:!0}),t.open(A,"oauth-window",l),t.dispatchEvent(new CustomEvent("arcgis-rest-js-popup-auth-start"))})):void(t.location.href=A))))}static completeOAuth2(e,t){!t&&window&&(t=window);const{portal:s,clientId:i,popup:r,pkce:a,redirectUri:n}=Object.assign({portal:"https://www.arcgis.com/sharing/rest",popup:!0,pkce:!0},e),o=`ARCGIS_REST_JS_AUTH_STATE_${i}`,l=t.localStorage.getItem(o),c=$(a?t.location.search.replace(/^\?/,""):t.location.hash.replace(/^#/,"")),p=c&&c.state?JSON.parse(c.state):void 0;function h(e,s,a){return t.localStorage.removeItem(o),r&&t.opener?(t.opener.dispatchEvent(new CustomEvent(`arcgis-rest-js-popup-auth-${i}`,{detail:{error:s,errorMessage:e}})),void t.close()):(a&&t.history.replaceState(t.history.state,"",a),"access_denied"===s?Promise.reject(new _):Promise.reject(new G(e,s)))}function d(e,a){return t.localStorage.removeItem(o),r&&t.opener?(t.opener.dispatchEvent(new CustomEvent(`arcgis-rest-js-popup-auth-${i}`,{detail:Object.assign({},e)})),void t.close()):(t.history.replaceState(t.history.state,"",a),new ee({clientId:i,portal:s,ssl:e.ssl,token:e.token,tokenExpires:e.expires,username:e.username,refreshToken:e.refreshToken,refreshTokenExpires:e.refreshTokenExpires,redirectUri:n||location.href.replace(location.search,"")}))}if(!l||!p)return h("No authentication state was found, call `ArcGISIdentityManager.beginOAuth2(...)` to start the authentication process.","no-auth-state");if(p.id!==l)return h("Saved client state did not match server sent state.","mismatched-auth-state");if(c.error){const e=c.error;return h(c.error_description||"Unknown error",e,p.originalUrl)}if(a&&c.code){const e=Q(`${s}/oauth2/token/`),r=`ARCGIS_REST_JS_CODE_VERIFIER_${i}`,a=t.localStorage.getItem(r);return t.localStorage.removeItem(r),W(e,{httpMethod:"POST",params:{client_id:i,code_verifier:a,grant_type:"authorization_code",redirect_uri:n||location.href.replace(location.search,""),code:c.code}}).then((e=>d(Object.assign(Object.assign({},e),p),p.originalUrl))).catch((e=>h(e.originalMessage,e.code,p.originalUrl)))}return!a&&c.access_token?Promise.resolve(d(Object.assign({token:c.access_token,expires:new Date(Date.now()+1e3*parseInt(c.expires_in,10)),ssl:"true"===c.ssl,username:c.username},p),p.originalUrl)):h("Unknown error","oauth-error",p.originalUrl)}static fromParent(e,t){let s;return!t&&window&&(t=window),new Promise(((i,r)=>{s=e=>{if(e.source===t.parent&&e.data)try{return i(ee.parentMessageHandler(e))}catch(e){return r(e)}},t.addEventListener("message",s,!1),t.parent.postMessage({type:"arcgis:auth:requestCredential"},e)})).then((e=>(t.removeEventListener("message",s,!1),e)))}static authorize(e,t){const{portal:s,clientId:i,expiration:r,redirectUri:a,state:n}=Object.assign({portal:"https://arcgis.com/sharing/rest",expiration:20160},e),o={client_id:i,expiration:r,response_type:"code",redirect_uri:a};n&&(o.state=n);const l=`${s}/oauth2/authorize?${C(o)}`;t.writeHead(301,{Location:l}),t.end()}static exchangeAuthorizationCode(e,t){const{portal:s,clientId:i,redirectUri:r}=Object.assign({portal:"https://www.arcgis.com/sharing/rest"},e);return W(`${s}/oauth2/token`,{params:{grant_type:"authorization_code",client_id:i,redirect_uri:r,code:t}}).then((e=>new ee({clientId:i,portal:s,ssl:e.ssl,redirectUri:r,refreshToken:e.refreshToken,refreshTokenExpires:e.refreshTokenExpires,token:e.token,tokenExpires:e.expires,username:e.username}))).catch((e=>{throw new q(e.message,F.REFRESH_TOKEN_EXCHANGE_FAILED,e.response,e.url,e.options)}))}static deserialize(e){const t=JSON.parse(e);return new ee({clientId:t.clientId,refreshToken:t.refreshToken,refreshTokenExpires:t.refreshTokenExpires?new Date(t.refreshTokenExpires):void 0,username:t.username,password:t.password,token:t.token,tokenExpires:t.tokenExpires?new Date(t.tokenExpires):void 0,portal:t.portal,ssl:t.ssl,tokenDuration:t.tokenDuration,redirectUri:t.redirectUri,server:t.server})}static fromCredential(e,t){const s=void 0===e.ssl||e.ssl,i=e.expires||Date.now()+72e5;return t.hasServer?new ee({server:e.server,ssl:s,token:e.token,username:e.userId,tokenExpires:new Date(i)}):new ee({portal:Q(e.server.includes("sharing/rest")?e.server:e.server+"/sharing/rest"),ssl:s,token:e.token,username:e.userId,tokenExpires:new Date(i)})}static parentMessageHandler(e){if("arcgis:auth:credential"===e.data.type)return new ee(e.data.credential);if("arcgis:auth:error"===e.data.type){const t=new Error(e.data.error.message);throw t.name=e.data.error.name,t}throw new Error("Unknown message type.")}static destroy(e){return function(e){const t=`${Q(e.portal||"https://www.arcgis.com/sharing/rest")}/oauth2/revokeToken/`,s=e.token,i=e.clientId;delete e.portal,delete e.clientId,delete e.token;const r=Object.assign(Object.assign({},e),{httpMethod:"POST",params:{client_id:i,auth_token:s}});return L(t,r).then((e=>{if(!e.success)throw new P("Unable to revoke token",500,e,t,r);return e}))}({clientId:e.clientId,portal:e.portal,token:e.refreshToken||e.token})}static fromToken(e){const t=new ee(e);return t.getUser().then((()=>t))}static signIn(e){const t=new ee(e);return t.getUser().then((()=>t))}toCredential(){return{expires:this.tokenExpires.getTime(),server:this.server||this.portal,ssl:this.ssl,token:this.token,userId:this.username}}getUser(e){if(this._pendingUserRequest)return this._pendingUserRequest;if(this._user)return Promise.resolve(this._user);{const t=`${this.portal}/community/self`,s=Object.assign(Object.assign({httpMethod:"GET",authentication:this},e),{rawResponse:!1});return this._pendingUserRequest=L(t,s).then((e=>(this._user=e,this._pendingUserRequest=null,e))),this._pendingUserRequest}}getPortal(e){if(this._pendingPortalRequest)return this._pendingPortalRequest;if(this._portalInfo)return Promise.resolve(this._portalInfo);{const t=`${this.portal}/portals/self`,s=Object.assign(Object.assign({httpMethod:"GET",authentication:this},e),{rawResponse:!1});return this._pendingPortalRequest=L(t,s).then((e=>(this._portalInfo=e,this._pendingPortalRequest=null,e))),this._pendingPortalRequest}}getUsername(){return this.username?Promise.resolve(this.username):this.getUser().then((e=>e.username))}getToken(e,t){return function(e,t){const s=J(e),i=J(t),r=Y(e),a=Y(t);return!(!s||!i||r!==a)}(this.portal,e)||new RegExp(this.portal,"i").test(e)?this.getFreshToken(t):this.getTokenForServer(e,t)}validateAppAccess(e){return this.getToken(this.portal).then((t=>function(e,t,s="https://www.arcgis.com/sharing/rest"){return L(`${s}/oauth2/validateAppAccess`,{method:"POST",params:{f:"json",client_id:t,token:e}})}(t,e)))}toJSON(){return{clientId:this.clientId,refreshToken:this.refreshToken,refreshTokenExpires:this.refreshTokenExpires||void 0,username:this.username,password:this.password,token:this.token,tokenExpires:this.tokenExpires||void 0,portal:this.portal,ssl:this.ssl,tokenDuration:this.tokenDuration,redirectUri:this.redirectUri,server:this.server}}serialize(){return JSON.stringify(this)}enablePostMessageAuth(e,t){!t&&window&&(t=window),this._hostHandler=this.createPostMessageHandler(e),t.addEventListener("message",this._hostHandler,!1)}disablePostMessageAuth(e){!e&&window&&(e=window),e.removeEventListener("message",this._hostHandler,!1)}refreshCredentials(e){return this._user=null,this.username&&this.password?this.refreshWithUsernameAndPassword(e):this.clientId&&this.refreshToken?this.refreshWithRefreshToken():Promise.reject(new q("Unable to refresh token. No refresh token or password present.",F.TOKEN_REFRESH_FAILED))}getServerRootUrl(e){const[t]=Q(e).split(/\/rest(\/admin)?\/services(?:\/|#|\?|$)/),[s,i,r]=t.match(/(https?:\/\/)(.+)/),[a,...n]=r.split("/");return`${i}${a.toLowerCase()}/${n.join("/")}`}getDomainCredentials(e){return this.trustedDomains&&this.trustedDomains.length&&this.trustedDomains.some((t=>e.startsWith(t)))?"include":"same-origin"}signOut(){return ee.destroy(this)}createPostMessageHandler(e){return t=>{const s=e.indexOf(t.origin)>-1,i="arcgis:auth:requestCredential"===t.data.type,r=this.tokenExpires.getTime()>Date.now();if(s&&i){let e={};if(r){e={type:"arcgis:auth:credential",credential:this.toJSON()}}else e={type:"arcgis:auth:error",error:{name:"tokenExpiredError",message:"Token was expired, and not returned to the child application"}};t.source.postMessage(e,t.origin)}}}getTokenForServer(e,t){const s=this.getServerRootUrl(e),i=this.federatedServers[s];return i&&i.expires&&i.expires.getTime()>Date.now()?Promise.resolve(i.token):(this._pendingTokenRequests[s]||(this._pendingTokenRequests[s]=this.fetchAuthorizedDomains().then((()=>L(`${s}/rest/info`,{credentials:this.getDomainCredentials(e)}).then((i=>{if(i.owningSystemUrl){if(K(i.owningSystemUrl,this.portal))return L(`${i.owningSystemUrl}/sharing/rest/info`,t);throw new q(`${e} is not federated with ${this.portal}.`,F.NOT_FEDERATED)}if(i.authInfo&&void 0!==this.federatedServers[s])return Promise.resolve({authInfo:i.authInfo});throw new q(`${e} is not federated with any portal and is not explicitly trusted.`,F.NOT_FEDERATED)})).then((e=>this.token&&this.tokenExpires.getTime()<Date.now()?this.server?this.refreshCredentials().then((()=>({token:this.token,expires:this.tokenExpires}))):this.refreshCredentials().then((()=>this.generateTokenForServer(e.authInfo.tokenServicesUrl,s))):this.generateTokenForServer(e.authInfo.tokenServicesUrl,s))).then((e=>(this.federatedServers[s]=e,delete this._pendingTokenRequests[s],e.token)))))),this._pendingTokenRequests[s])}generateTokenForServer(e,t){return L(e,{params:{token:this.token,serverUrl:t,expiration:this.tokenDuration}}).then((e=>({token:e.token,expires:new Date(e.expires-3e5)}))).catch((e=>{throw new q(e.message,F.GENERATE_TOKEN_FOR_SERVER_FAILED,e.response,e.url,e.options)}))}getFreshToken(e){return this.token&&!this.tokenExpires||this.token&&this.tokenExpires&&this.tokenExpires.getTime()>Date.now()?Promise.resolve(this.token):(this._pendingTokenRequests[this.portal]||(this._pendingTokenRequests[this.portal]=this.refreshCredentials(e).then((()=>(this._pendingTokenRequests[this.portal]=null,this.token)))),this._pendingTokenRequests[this.portal])}refreshWithUsernameAndPassword(e){const t={username:this.username,password:this.password,expiration:this.tokenDuration,client:"referer",referer:this.referer?this.referer:"undefined"!=typeof window&&void 0!==window.document&&window.location&&window.location.origin?window.location.origin:B};return(this.server?L(`${this.getServerRootUrl(this.server)}/rest/info`).then((s=>L(s.authInfo.tokenServicesUrl,Object.assign({params:t},e)))):L(`${this.portal}/generateToken`,Object.assign({params:t},e))).then((e=>(this.updateToken(e.token,new Date(e.expires)),this))).catch((e=>{throw new q(e.message,F.TOKEN_REFRESH_FAILED,e.response,e.url,e.options)}))}refreshWithRefreshToken(e){if(this.refreshToken&&this.refreshTokenExpires&&this.refreshTokenExpires.getTime()-864e5<Date.now())return this.exchangeRefreshToken(e);const t=Object.assign({params:{client_id:this.clientId,refresh_token:this.refreshToken,grant_type:"refresh_token"}},e);return W(`${this.portal}/oauth2/token`,t).then((e=>this.updateToken(e.token,e.expires))).catch((e=>{throw new q(e.message,F.TOKEN_REFRESH_FAILED,e.response,e.url,e.options)}))}updateToken(e,t){return this._token=e,this._tokenExpires=t,this}exchangeRefreshToken(e){const t=Object.assign({params:{client_id:this.clientId,refresh_token:this.refreshToken,redirect_uri:this.redirectUri,grant_type:"exchange_refresh_token"}},e);return W(`${this.portal}/oauth2/token`,t).then((e=>(this._token=e.token,this._tokenExpires=e.expires,this._refreshToken=e.refreshToken,this._refreshTokenExpires=e.refreshTokenExpires,this))).catch((e=>{throw new q(e.message,F.REFRESH_TOKEN_EXCHANGE_FAILED,e.response,e.url,e.options)}))}fetchAuthorizedDomains(){return this.server||!this.portal?Promise.resolve(this):this.getPortal().then((e=>(e.authorizedCrossOriginDomains&&e.authorizedCrossOriginDomains.length&&(this.trustedDomains=e.authorizedCrossOriginDomains.filter((e=>!e.startsWith("http://"))).map((e=>e.startsWith("https://")?e:`https://${e}`))),this)))}}function te(e){return console.log("DEPRECATED:, 'UserSession' is deprecated. Use 'ArcGISIdentityManager' instead."),new ee(e)}var se;te.beginOAuth2=function(...e){return console.warn("DEPRECATED:, 'UserSession.beginOAuth2' is deprecated. Use 'ArcGISIdentityManager.beginOAuth2' instead."),ee.beginOAuth2(...e)},te.completeOAuth2=function(...e){return console.warn("DEPRECATED:, 'UserSession.completeOAuth2()' is deprecated. Use 'ArcGISIdentityManager.completeOAuth2()' instead."),e.length<=1&&console.warn("WARNING:, 'UserSession.completeOAuth2()' is now async and returns a promise the resolves to an instance of `ArcGISIdentityManager`."),ee.completeOAuth2(...e)},te.fromParent=function(...e){return console.warn("DEPRECATED:, 'UserSession.fromParent' is deprecated. Use 'ArcGISIdentityManager.fromParent' instead."),ee.fromParent(...e)},te.authorize=function(...e){return console.warn("DEPRECATED:, 'UserSession.authorize' is deprecated. Use 'ArcGISIdentityManager.authorize' instead."),ee.authorize(...e)},te.exchangeAuthorizationCode=function(...e){return console.warn("DEPRECATED:, 'UserSession.exchangeAuthorizationCode' is deprecated. Use 'ArcGISIdentityManager.exchangeAuthorizationCode' instead."),ee.exchangeAuthorizationCode(...e)},te.fromCredential=function(...e){return console.log("DEPRECATED:, 'UserSession.fromCredential' is deprecated. Use 'ArcGISIdentityManager.fromCredential' instead."),console.warn("WARNING:, 'UserSession.fromCredential' now requires a `ServerInfo` object from the JS API as a second parameter."),ee.fromCredential(...e)},te.deserialize=function(...e){return console.log("DEPRECATED:, 'UserSession.deserialize' is deprecated. Use 'ArcGISIdentityManager.deserialize' instead."),ee.deserialize(...e)},function(e){e.Success="Succeeded",e.Failed="Failed",e.Waiting="Waiting",e.Cancelled="Cancelled",e.Cancelling="Cancelling",e.New="New",e.Executing="Executing",e.Submitted="Submitted",e.Failure="Failure",e.TimedOut="TimedOut",e.Error="Error",e.Status="Etatus",e.Unknown="Unknown"}(se||(se={}));class ie{constructor(e=""){this.termStack=[],this.rangeStack=[],this.openGroups=0,this.q=e}match(...e){return this.termStack=this.termStack.concat(e),this}in(e){const t=`\`in(${e?`"${e}"`:""})\``;return this.hasRange||this.hasTerms?(e&&"*"!==e&&(this.q+=`${e}:`),this.commit()):(M(`${t} was called with no call to \`match(...)\` or \`from(...)\`/\`to(...)\`. Your query was not modified.`),this)}startGroup(){return this.commit(),this.openGroups>0&&(this.q+=" "),this.openGroups++,this.q+="(",this}endGroup(){return this.openGroups<=0?(M("`endGroup(...)` was called without calling `startGroup(...)` first. Your query was not modified."),this):(this.commit(),this.openGroups--,this.q+=")",this)}and(){return this.addModifier("and")}or(){return this.addModifier("or")}not(){return this.addModifier("not")}from(e){return this.hasTerms?(M('`from(...)` is not allowed after `match(...)` try using `.from(...).to(...).in(...)`. Optionally, you may see this because dates are incorrectly formatted. Dates should be a primative Date value, aka a number in milliseconds or Date object, ie new Date("2020-01-01").  Your query was not modified.'),this):(this.rangeStack[0]=e,this)}to(e){return this.hasTerms?(M('`to(...)` is not allowed after `match(...)` try using `.from(...).to(...).in(...)`. Optionally, you may see this because dates are incorrectly formatted. Dates should be a primative Date value, aka a number in milliseconds or Date object, ie new Date("2020-01-01"). Your query was not modified.'),this):(this.rangeStack[1]=e,this)}boost(e){return this.commit(),this.q+=`^${e}`,this}toParam(){return this.commit(),this.cleanup(),this.q}clone(){return this.commit(),this.cleanup(),new ie(this.q+"")}addModifier(e){return this.currentModifer?(M(`You have called \`${this.currentModifer}()\` after \`${e}()\`. Your current query was not modified.`),this):(this.commit(),""===this.q&&"not"!==e?(M(`You have called \`${e}()\` without calling another method to modify your query first. Try calling \`match()\` first.`),this):(this.currentModifer=e,this.q+=""===this.q?"":" ",this.q+=`${e.toUpperCase()} `,this))}hasWhiteSpace(e){return/\s/g.test(e)}formatTerm(e){return e instanceof Date?e.getTime():"string"==typeof e&&this.hasWhiteSpace(e)?`"${e}"`:e}commit(){return this.currentModifer=void 0,this.hasRange&&(this.q+=`[${this.formatTerm(this.rangeStack[0])} TO ${this.formatTerm(this.rangeStack[1])}]`,this.rangeStack=[void 0,void 0]),this.hasTerms&&(this.q+=this.termStack.map((e=>this.formatTerm(e))).join(" "),this.termStack=[]),this}get hasTerms(){return this.termStack.length>0}get hasRange(){return this.rangeStack.length&&this.rangeStack[0]&&this.rangeStack[1]}cleanup(){if(this.openGroups>0)for(M(`Automatically closing ${this.openGroups} group(s). You can use \`endGroup(...)\` to remove this warning.`);this.openGroups>0;)this.q+=")",this.openGroups--;const e=this.q;this.q=e.replace(/( AND ?| NOT ?| OR ?)*$/,""),e!==this.q&&M("`startGroup(...)` was called without calling `endGroup(...)` first. Your query was not modified."),this.q=this.q.replace(/(\(\))*/,"")}}var re=l(6884),ae=l(2838),ne=l.n(ae),oe=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const le=t=>{const s=window.SVG,{className:i}=t,r=oe(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:ne()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var ce=l(170),pe=l.n(ce),he=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const de=t=>{const s=window.SVG,{className:i}=t,r=he(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:pe()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var ue=l(1888);const me=Object.assign({},h,p.defaultMessages),ge=t=>{var s,i;const r=e.hooks.useTranslation(me),a=(0,ue.useTheme)(),n=[{value:null,label:r("all")},{value:"Blank",label:r("blankTemplate")},{value:"WAB classic",label:r("wabClassicTemplate")},{value:"Map centric",label:r("mapCentricTemplate")},{value:"Dashboard",label:r("dashboardTemplate")},{value:"Web page",label:r("webPageTemplate")},{value:"Website",label:r("websiteTemplate")}],o=[{value:null,label:r("all")},{value:"New and noteworthy",label:r("categoriesNoteworthy")},{value:"3D",label:r("categories3D")},{value:"People",label:r("categoriesPeople")},{value:"Environment",label:r("categoriesEnvironment")},{value:"Tourism",label:r("categoriesTourism")},{value:"Infrastructure",label:r("categoriesInfrastructure")},{value:"Data",label:r("categoriesData")},{value:"Document",label:r("categoriesDocument")},{value:"Business Analyst",label:r("categoriesBusinessAnalyst")}],[l,c]=e.React.useState(n),{onTagsChange:h,selectedTags:d,isAGOLFilter:u}=t;e.React.useEffect((()=>{c(u?o:n)}),[u]);const m=e.css`
    & {
      padding-bottom: ${e.polished.rem(25)};
      display: block !important;
      margin-top: ${e.polished.rem(-10)};
      button.template-tag {
        & {
          padding-left: ${e.polished.rem(16)};
          padding-right: ${e.polished.rem(16)};
          margin: ${e.polished.rem(10)} ${e.polished.rem(10)} 0 0;
        }
        &:active, &:hover, &:not(:disabled):not(.disabled).active {
          background-color: ${null===(s=a.sys.color)||void 0===s?void 0:s.primary.main};
          border-color: ${null===(i=a.sys.color)||void 0===i?void 0:i.primary.main};
        }
      }
    }
  `,g=e=>{const t=!d||0===(null==d?void 0:d.length);return e?null==d?void 0:d.includes(e):t};return(0,e.jsx)(p.ButtonGroup,{className:"top-padding default-template-button-con",gap:"10px",css:m},l.map((t=>(0,e.jsx)(p.Button,{className:"template-tag",type:"secondary",key:t.value,title:t.label,active:g(t.value),onClick:()=>{var e;e=t.value,h(e?[e]:[])}},t.label))))},{useState:Ae,useEffect:fe}=e.React;var we;!function(e){e.Blank="blank",e.Fullscreen="fullscreen",e.FullscreenGrid="fullscreenGrid",e.Scrolling="scrolling",e.Multipage="multipage",e.default="default"}(we||(we={}));const ve=Object.assign({},h,p.defaultMessages),be=["Blank","Fullscreen","Fullscreen grid","Scrolling","Multipage"],xe=t=>{const s=e.hooks.useTranslation(ve),i=(0,ue.useTheme)(),{template:r,intl:a,capabilities:n,accessType:o,onCreateClick:l,crateAppByTemplate:c}=t,[h,d]=Ae((0,e.Immutable)({}));fe((()=>{m(r)}),[r]);const u=e.css`
    .jimu-collapse .jimu-collapse-wrapper-inner, .collapsing {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      align-content: flex-start;
      margin-bottom: ${e.polished.rem(10)};
    }
    .collapse-header {
      padding-left: ${e.polished.rem(15)};
      margin-bottom: ${e.polished.rem(10)};
      display: inline-block;
      align-items: center;
      .collapse-label {
        width: auto;
        display: inline-block;
        vertical-align: middle;
      }
      .jimu-collapsable-action {
        display: inline-block;
        padding-left: var(--sys-spacing-1);
      }
      &, & button {
        color: var(--ref-palette-neutral-900) !important;
      }
    }
  `,m=t=>{if(!t)return!1;const s={};let i;be.forEach((e=>{t.asMutable({deep:!0}).forEach((t=>{if(t.tags.includes(e)){switch(e){case"Blank":i=we.Blank;break;case"Fullscreen":i=we.Fullscreen;break;case"Fullscreen grid":i=we.FullscreenGrid;break;case"Scrolling":i=we.Scrolling;break;case"Multipage":i=we.Multipage;break;default:i=we.default}const r=(null==s?void 0:s[i])||[];r.push(t),s[i]=r}}))})),d((0,e.Immutable)(s))},g=e=>{switch(e){case we.Blank:return s("blankTemplate");case we.Fullscreen:return s("fullscreenFixed");case we.FullscreenGrid:return s("fullscreenGrid");case we.Multipage:return s("multipage");case we.Scrolling:return s("scrolling")}},A=(t,s)=>t.map(((t,r)=>(0,e.jsx)(S,{key:`${s}-${r}`,theme:i,info:t,intl:a,accessType:o,disabled:!1,onCreateClick:l,capabilities:n,crateAppByTemplate:c})));return(0,e.jsx)("div",{className:"default-template-list-con w-100",css:u},(()=>{var t;const s=[];for(const i in h){const r=(0,e.jsx)(p.CollapsablePanel,{key:i,label:g(i),type:"default","aria-label":g(i),defaultIsOpen:!0},A(null===(t=h[i])||void 0===t?void 0:t.asMutable({deep:!0}),i));s.push(r)}return s})())};class ye extends e.React.PureComponent{constructor(a){super(a),this.onTemplateFilterChange=e=>{const{accessType:t}=this.state;t===i.ArcGisOnline?this.setState({categoriesTags:e},(()=>{this.refreshTemplate()})):this.setState({selectedTags:e},(()=>{this.getDefaultTemplate()}))},this.getDefaultTemplate=()=>{const{selectedTags:e,searchText:t}=this.state,s=(0,re.getAppTemplates)(e).map((e=>{const t=this.checkIsNewTemplate(e.templateCreateVersion);return{isExperiencesTemplate:!1,name:e.name,title:e.label,image:{src:e.thumbnail,gifSrc:null==e?void 0:e.gifThumbnail},tags:(null==e?void 0:e.tags)||[],description:e.description,isMapAware:e.isMapAware,snippet:e.description,flipThumbnail:e.flipThumbnail,isNewTemplate:t,isMultiplePage:e.isMultiplePage}}));this.setState({defaultTemplate:s,templates:s},(()=>{t&&this.filterDefaultTemplate()}))},this.checkIsNewTemplate=t=>!!t&&(window.jimuConfig.isInPortal?e.semver.satisfies(t,`${s} - ${e.version}`):e.semver.eq(e.version,t)),this.nls=t=>this.props.intl?this.props.intl.formatMessage({id:t,defaultMessage:Object.assign(Object.assign(Object.assign(Object.assign({},h),p.defaultMessages),e.defaultMessages),n.defaultMessages)[t]}):t,this.createAppByDefaultTemplate=t=>{if(this.checkAndShowReadOnlyRemind())return;this.setState({loading:!0});const s=this.nls("untitledExperience"),i=this.getQueryString("folderId"),r=(0,e.getAppStore)().getState().queryObject;o.appServices.createAppByDefaultTemplate(s,t,i,null==r?void 0:r.webmap,null==r?void 0:r.webscene).then((t=>{this.setState({loading:!1}),this.props.dispatch(n.builderActions.refreshAppListAction(!0)),this.hasWebmapOrWebsceneUrlParam?window.location.href=n.utils.getBuilderUrl(t.id):e.jimuHistory.browserHistory.push(n.utils.getBuilderUrl(t.id))}),(e=>{this.setState({loading:!1,isShowAlertPopup:!0,alertPopupMessage:this.nls("createApplicationError")})})).catch((e=>{this.setState({loading:!1,isShowAlertPopup:!0,alertPopupMessage:this.nls("createApplicationError")})}))},this.checkAndShowReadOnlyRemind=()=>{const t=(0,e.getAppStore)().getState().portalSelf;return(null==t?void 0:t.isReadOnly)&&this.setState({isShowAlertPopup:!0,alertPopupMessage:this.nls("remindTextForReadonlyMode")}),null==t?void 0:t.isReadOnly},this.searchLivingAtlasGroups=()=>{const t=(0,e.getAppStore)().getState().portalSelf,s=null==t?void 0:t.livingAtlasGroupQuery;if(!s)return!1;const i={num:1,start:0,sortField:"title",sortOrder:"asc",q:s};o.appServices.searchGroups(i).then((e=>{const t=null==e?void 0:e.results.map((e=>null==e?void 0:e.id)),s=t.length>0?t.join(" OR "):null;this.setState({esriLivingAtlasGroupId:s})}))},this.checkIsShowLivingAtlas=()=>{const t=(0,e.getAppStore)().getState().portalSelf;this.setState({isShowLivingAtlas:!!(null==t?void 0:t.livingAtlasGroupQuery)})},this.onCreateClick=e=>{this.selectTemplate(e),this.createAppByDefaultTemplate(e)},this.selectTemplate=e=>{this.props.dispatch(n.builderActions.selectTemplate(e))},this._matchearchText=e=>{const{searchTextForRequest:t}=this.state;return!t||!e||e.toLowerCase().indexOf(t.toLowerCase())>-1},this.crateAppByTemplate=e=>{if(this.checkAndShowReadOnlyRemind())return;this.setState({loading:!0});const t=this.getQueryString("folderId");o.appServices.createAppByItemTemplateInfo(e,t).then((e=>{e&&(window.location.href=n.utils.getBuilderUrl(e)),this.setState({loading:!1})}),(e=>{const t=e&&(null==e?void 0:e.indexOf("Resource does not exist"))>-1?this.nls("noResource"):this.nls("createApplicationError");this.setState({loading:!1,isShowAlertPopup:!0,alertPopupMessage:t})})).catch((e=>{this.setState({loading:!1,isShowAlertPopup:!0,alertPopupMessage:this.nls("createApplicationError")})}))},this.checkIsOwner=t=>{const s=(0,e.getAppStore)().getState().user;return!(!s||!t||s.username!==t)},this.filterTemplateChange=e=>{const{defaultTemplate:t}=this.state;e!==this.state.accessType&&(e===i.Default?this.setState({templates:t,accessType:e,isMyLocalTemplateLoadAll:!1},(()=>{this.filterDefaultTemplate()})):this.setState({templates:[],accessType:e,isMyLocalTemplateLoadAll:!1},(()=>{this.refreshTemplate()})))},this.refreshTemplate=()=>{this.isEsriGroupsTemplateLoadAll=!1,this.setState({templates:[],esriGroupTemplates:[],otherTemplate:[]},(()=>{this.refreshAction()}))},this.searchEsriGroupTemplate=(e=!1)=>{e||(this.isEsriGroupsTemplateLoadAll=!1);const t=this.getRequestOption(r.EsriGroup,e);this.searchTemplate(t,e,r.EsriGroup)},this.refreshAction=(e=!1)=>{const{accessType:t,esriLivingAtlasGroupId:s,isMyLocalTemplateLoadAll:a}=this.state;if(t===i.ArcGisOnline&&!e&&!this.isEsriGroupsTemplateLoadAll)return this.searchEsriGroupTemplate(e),!1;const n=window.jimuConfig.isDevEdition&&a;let o=r.MyTemplate;switch(t){case i.My:o=n?r.MyPortalTemplate:r.MyTemplate;break;case i.ArcGisOnline:o=r.ArcGISOnline;break;case i.MyGroup:o=r.MyGroup;break;case i.MyOrganization:o=r.MyOrganization;break;case i.Favorites:o=r.Favorites;break;case i.LivingAtlas:o=r.LivingAtlas}if(t===i.LivingAtlas&&!s)return!1;const l=this.getRequestOption(o,e);this.searchTemplate(l,e,o)},this.getSearchType=e=>{const t=e===r.LivingAtlas||e===r.MyPortalTemplate,s=e===r.EsriGroup||e===r.ArcGISOnline;let i;return i=t?o.SearchType.Portal:s?o.SearchType.AGOL:o.SearchType.Other,i},this.getAppPortalUrl=e=>{},this.setTemplateData=(e,t,s)=>{s===r.MyPortalTemplate?this.setMyPortalTemplateData(e,t):this.setTemplateListData(e,t,s)},this.searchMyPortalTemplate=(e,t=!1)=>{this.isSearchMyPortalTemplate(e,t)&&this.setState({isMyLocalTemplateLoadAll:t,myPortaltemplates:[]},(()=>{this.refreshAction()}))},this.isSearchMyPortalTemplate=(e,t)=>{const{accessType:s,myTemplatesInDevEdtion:a}=this.state;let n=!0;return s===i.My&&e!==r.MyPortalTemplate||(n=!1),a.length>=this.pageNumber&&(n=!1),t||(n=!1),n},this.initTemplateInfo=(t,s)=>{const{portalUrl:i}=this.props,a=s===r.LivingAtlas||s===r.MyPortalTemplate,n=s===r.EsriGroup||s===r.ArcGISOnline,o=window.jimuConfig.isDevEdition&&s===r.MyTemplate,l=e.portalUrlUtils.isAGOLDomain(i),c=n&&!l?"https://maps.arcgis.com":i;return t.map((e=>Object.assign(Object.assign({},e),{isExperiencesTemplate:!0,isEsriGroupTemplate:s===r.EsriGroup,image:{src:this.thumbnail(e.thumbnail,e.id,n,a)},isArcGisOnlineRequest:n,isPortalRequest:a,portalUrl:c,isLocalApp:o})))},this.checkIsArcgisOnline=e=>e===r.EsriGroup||e===r.ArcGISOnline,this.setTemplateListData=(e,t,s)=>{let{otherTemplate:i,esriGroupTemplates:a,templates:n}=this.state;i=t?i:[],a=t?a:[],n=t?n:[],t?(i=i.concat(e),a=a.concat(e)):(i=e,a=e);if(s===r.MyTemplate&&window.jimuConfig.isDevEdition&&this.setState({myTemplatesInDevEdtion:e}),s===r.EsriGroup)this.setState({esriGroupTemplates:a});else this.setState({otherTemplate:i,templates:n.concat(e)})},this.setMyPortalTemplateData=(e,t=!1)=>{let{myPortaltemplates:s}=this.state;const{templates:i}=this.state;s=t?s:[],s=t?s.concat(e):e,this.setState({myPortaltemplates:s,templates:i.concat(e)})},this.checkMyLocalTemplateIsLoadAll=(e,t,s=r.MyPortalTemplate)=>{const{accessType:a}=this.state;return a===i.My&&(s===r.MyPortalTemplate||a===i.My&&e>t)},this.getRequestOption=(t,s=!1)=>{const a=this.state.accessType,{categoriesTags:n}=this.state;if(a===i.Default)return null;const o=e.SessionManager.getInstance().getMainSession(),l={start:1,q:'type: "Web Experience Template"',sortField:t===r.EsriGroup?"created":"modified",sortOrder:"desc",num:30};if((t===r.ArcGISOnline||t===r.EsriGroup)&&n[0]){const e=`/Categories/${n[0]}`;e&&(l.categories=e)}if(o){l.q=this.getRequestOptionParamsQ(t);const e=this.getPageStartAndNum(s,t);l.num=e.num,l.start=e.start}return window.jimuConfig.isDevEdition&&t===r.MyTemplate&&(l.portalUrl=this.props.portalUrl),l},this.getRequestOptionParamsQ=(s=r.ArcGISOnline)=>{var i;const{esriLivingAtlasGroupId:a}=this.state,n=e.SessionManager.getInstance().getMainSession(),o=(0,e.getAppStore)().getState().user,l=(null==o?void 0:o.favGroupId)||"";let c=(new ie).match("Web Experience Template").in("type");const{searchTextForRequest:p}=this.state;if(p&&(c=c.and().startGroup().match(this.state.searchTextForRequest).endGroup()),c=c.startGroup().not().match("status: Draft").in("typekeywords").endGroup(),!n)return c.toParam();const h=null===(i=null==o?void 0:o.groups)||void 0===i?void 0:i.map((e=>e.id)),d=(null==n?void 0:n.username)||"";switch(s){case r.EsriGroup:return c.toParam();case r.MyTemplate:case r.MyPortalTemplate:return c=c.and().match(null==o?void 0:o.orgId).in("orgid").and().match(d).in("owner"),s===r.MyTemplate&&window.jimuConfig.isDevEdition&&p&&(c=c.and().startGroup().match(this.state.searchTextForRequest).endGroup()),c.toParam();case r.MyGroup:return c=c.and().startGroup().match("shared").in("access").or().match("public").in("access").or().match("org").in("access").endGroup(),(null==h?void 0:h.length)>0&&(c.and().startGroup(),h.forEach(((e,t)=>{c=c.match(e).in("group"),t<(null==h?void 0:h.length)-1&&(c=c.or())})),c.endGroup()),c.toParam();case r.MyOrganization:return c.and().match(null==o?void 0:o.orgId).in("orgid").toParam();case r.Favorites:return c.and().match(l).in("group").toParam();case r.ArcGISOnline:return c.not().startGroup().match(t).in("group").endGroup().toParam();case r.LivingAtlas:return a?c.and().match(a).in("group").toParam():c.toParam()}},this.getPageStartAndNum=(e,t)=>{const{otherTemplate:s,esriGroupTemplates:i,myPortaltemplates:a}=this.state,n={num:this.getPageNumber(e,t),start:1};if(!e)return n;switch(t){case r.EsriGroup:n.start=i.length+1;break;case r.MyPortalTemplate:n.start=a.length+1;break;default:n.start=s.length+1}return n},this.getPageNumber=(e,t)=>{const{myTemplatesInDevEdtion:s}=this.state,i=this.contentNode.clientWidth,a=this.contentNode.clientHeight;let n=Math.ceil(a/260)*Math.ceil(i/238)||30;return t!==r.MyPortalTemplate||e||(n=n-s.length||0),this.pageNumber=n,n},this.thumbnail=(t,s,r=!1,a=!1)=>{const{accessType:n}=this.state,o=n===i.My,c=e.portalUrlUtils.isAGOLDomain(this.props.portalUrl),p=window.jimuConfig.isDevEdition&&o&&!a,h=r?e.urlUtils.getArcgisOnlineUrl():this.props.portalUrl,d=e.SessionManager.getInstance().getSessionByUrl(h),u=r&&!c?"":`?token=${null==d?void 0:d.token}`;let m;if(t){const e=`${window.location.origin}${window.jimuConfig.mountPath}apps/${s}/${t}`;m=p?e:h+"/sharing/rest/content/items/"+s+"/info/"+t+u}else m=l(1740);return m},this.getMyTemplateThumbnail=(t,s)=>{let i;const r=e.SessionManager.getInstance().getSessionByUrl(this.props.portalUrl),a=r&&r.token?"?token="+r.token:"";return i=window.jimuConfig.isDevEdition?`${window.location.origin}${window.jimuConfig.mountPath}apps/id/${t}`:this.props.portalUrl+"/sharing/rest/content/items/"+s+"/info/"+t+a,i},this.getStyle=()=>{var t;const{theme:s}=this.props,i=s?s.ref.palette.neutral[700]:"";return e.css`
      & {
        flex-direction: column;
      }
      height: 100%;
      .header-bar {
        width: 100%;
        height: ${e.polished.rem(60)};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 ${e.polished.rem(30)};
        font-size: 20px;
        border-bottom: 1px solid ${i};
        color:${s.ref.palette.neutral[1e3]};
        font-weight:500;
        background:${s.ref.palette.neutral[500]};
        svg {
          margin-right: 0;
        }
        &>div {
          color: ${s.ref.palette.neutral[1e3]};
        }
        &>div:hover {
          color: ${s.ref.palette.black};
        }
        .jimu-icon {
          cursor: pointer;
        }
      }
      .loading-con {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: ${e.polished.rgba(s.ref.palette.white,.2)};
      }
      .homescreen {
        width:${e.polished.rem(810)};
        margin: 0 auto;
      }
      .top-padding{
        padding-right: ${e.polished.rem(32)};
        padding-left: ${e.polished.rem(10)};
      }
      .header-nav-container {
        width: 100%;
        padding-bottom: ${e.polished.rem(20)};
        padding-top: ${e.polished.rem(24)};
        align-items: flex-end;
        .filterbar-input {
          width:${e.polished.rem(160)};
          margin-right:${e.polished.rem(20)};
        }
      }
      .search-con {
        &{
          padding-top: ${e.polished.rem(30)};
        }
        &>span {
          font-size: ${e.polished.rem(20)};
          line-height: ${e.polished.rem(20)};
          color: ${null===(t=null==s?void 0:s.ref.palette)||void 0===t?void 0:t.neutral[1e3]};
        }
        .banner {
          position: relative;
          .jimu-icon {
            color: ${s.ref.palette.neutral[1e3]};
            cursor: pointer;
          }
          .searchbox {
            padding-left:${e.polished.rem(28)};
            font-size:${e.polished.rem(14)};
            height: ${e.polished.rem(32)};
            width:${e.polished.rem(228)};
            cursor: text;
            box-sizing: border-box;
            padding-right: 0;
            input {
              flex: 1;
            }
          }
          .searchbox::-ms-clear{
            display: none;
          }
          .icon-close-con {
            color: ${s.ref.palette.neutral[1e3]};
          }
        }
      }

      .section {
        display: flex;
        flex-wrap: wrap;
        overflow-x: hidden;
        overflow-y: auto;
        align-content: flex-start;
        flex: 1;
        min-width: ${e.polished.rem(822)};
        padding-bottom: ${e.polished.rem(30)};
        padding-top: ${e.polished.rem(5)};
        box-sizing: border-box;
        &:focus {
          outline: none;
        }
        .bottom_space {
          width: 100%;
          height: ${e.polished.rem(80)};
        }
      }
      .template-con {
        flex-wrap:wrap;
        align-content: flex-start;
      }
      .template-title {
        font-size: ${e.polished.rem(14)};
        color:${s.ref.palette.neutral[900]};
        .navbar-nav button.nav-link {
          & {
            color:${s.ref.palette.neutral[900]};
          }
          &:hover, &:focus {
            color:${s.ref.palette.black};
          }
        }
        .tap-link a.active {
          font-weight:500;
        }
        .header-nav-bar-con {
          padding:0;
          .navbar-nav {
            border: none;
          }
          .nav-item {
            flex: auto;
          }
        }
        a {
          width:auto;
        }
        .nav-item a.nav-link {
          width: auto;
          white-space: nowrap;
          color: inherit;
        }
        .nav-item a.nav-link:hover, .nav-item a.nav-link:focus {
          color: ${s.ref.palette.black};
        }
        .tap-margin-r {
          margin-right:${e.polished.rem(12)};
        }
      }
      @media only screen and (min-width: 1280px) {
        .homescreen {
          width:${e.polished.rem(1090)};
        }
        .top-padding{
          padding-right: ${e.polished.rem(32)};
          padding-left: ${e.polished.rem(10)};
        }
        .search-con .banner .searchbox {
          width:${e.polished.rem(400)};
        }
        .template-title  .tap-margin-r {
          margin-right:${e.polished.rem(22)};
        }
      }
      @media only screen and (min-width: 1400px) {
        .top-padding{
          padding-right: ${e.polished.rem(37)};
          padding-left: ${e.polished.rem(10)};
        }
        .homescreen {
            width:${e.polished.rem(1360)};
        }
        .template-title  .tap-margin-r {
          margin-right:${e.polished.rem(32)};
        }
      }
      @media only screen and (min-width: 1680px) {
        .homescreen {
            width:${e.polished.rem(1630)};
        }
      }

    `},this.close=()=>{if("back"===this.getQueryString("redirect"))e.jimuHistory.browserHistory.back();else{const e=n.utils.getHomePageUrl(window.isExpressBuilder);window.location.href=e}},this.isTemplateDisabled=e=>!1,this.onSearch=e=>{const{accessType:t}=this.state,s=t===i.Default,r=0===e.length||e.length>2?e:this.state.searchTextForRequest;this.setState({searchText:e,searchTextForRequest:r,isMyLocalTemplateLoadAll:!1},(()=>{if(e.length>0&&e.length<3)return!1;clearTimeout(this.onSearchTextInputed),this.onSearchTextInputed=setTimeout((()=>{this.isEsriGroupsTemplateLoadAll=!1,s?this.filterDefaultTemplate():this.refreshAction()}),500)}))},this.handleKeydown=e=>{const t=e.target.value,{accessType:s}=this.state,r=s===i.Default;"Enter"===e.key&&t&&this.setState({searchTextForRequest:t},(()=>{clearTimeout(this.onSearchTextInputed),r?this.filterDefaultTemplate():this.refreshAction()}))},this.clearSearchText=()=>{const{accessType:e,searchTextForRequest:t}=this.state,s=e===i.Default;this.setState({searchText:"",searchTextForRequest:""},(()=>{t&&(clearTimeout(this.onSearchTextInputed),s?this.filterDefaultTemplate():this.refreshAction())}))},this.filterDefaultTemplate=()=>{const{defaultTemplate:e}=this.state,t=e.filter((e=>this._matchearchText(e.title)));this.setState({templates:t})},this.checkUserPrivilege=()=>{const{CheckTarget:t}=e.privilegeUtils;e.privilegeUtils.checkExbAccess(t.AppList).then((e=>{(null==e?void 0:e.capabilities)&&this.setState({capabilities:e.capabilities})}))},this.toggleAlertPopup=()=>{this.setState({isShowAlertPopup:!this.state.isShowAlertPopup,alertPopupMessage:""})},this.filterTemplateByWebmapOrWebsceneUrlParam=e=>this.hasWebmapOrWebsceneUrlParam?e.filter((e=>e.isMapAware)):e,this.checkIsUseDefaultTemplateList=()=>{const{accessType:e,selectedTags:t}=this.state;return e===i.Default&&0===(null==t?void 0:t.length)},this.state={loading:!1,isShowAlertPopup:!1,alertPopupMessage:"",searchText:"",searchTextForRequest:"",accessType:i.Default,defaultTemplate:[],templates:[],esriGroupTemplates:[],otherTemplate:[],livingAtlasTemplate:[],myPortaltemplates:[],myTemplatesInDevEdtion:[],capabilities:{canCreateExperience:!1,canDeleteExperience:!1,canShareExperience:!1,canUpdateExperience:!1,canViewExperience:!1},esriLivingAtlasGroupId:null,isMyLocalTemplateLoadAll:!1,isShowLivingAtlas:!1,selectedTags:[],categoriesTags:[]};const c=(0,e.getAppStore)().getState().queryObject;this.hasWebmapOrWebsceneUrlParam=!(!(null==c?void 0:c.webmap)&&!(null==c?void 0:c.webscene))}componentDidMount(){this.getDefaultTemplate(),this.checkUserPrivilege(),this.contentNode&&this.contentNode.addEventListener("scroll",this.onScrollHandle.bind(this))}componentDidUpdate(){var t;const{isShowLivingAtlas:s}=this.state;s!==!!(null===(t=(0,e.getAppStore)().getState().portalSelf)||void 0===t?void 0:t.livingAtlasGroupQuery)&&(this.searchLivingAtlasGroups(),this.checkIsShowLivingAtlas())}onScrollHandle(e){const{accessType:t}=this.state,s=e.target.clientHeight,r=e.target.scrollHeight,a=s+e.target.scrollTop+1>r;!this.state.loading&&a&&(t!==i.ArcGisOnline||this.isEsriGroupsTemplateLoadAll?this.refreshAction(!0):this.searchEsriGroupTemplate(!0))}getQueryString(t){return e.queryString.parse(window.location.search)[t]||""}searchTemplate(e,s=!1,i=r.ArcGISOnline){if(!e)return;let a=null;this.setState({loading:!0});const n=this.getSearchType(i);a=i===r.EsriGroup?o.appServices.getGroupContent(t,e,!0):o.appServices.searchApp(e,n),a.then((e=>{const t=e.results;if(!a)return void this.setState({loading:!1});const n=this.initTemplateInfo(t,i);if(this.setTemplateData(n,s,i),this.setState({loading:!1}),i===r.EsriGroup){((null==e?void 0:e.nextStart)||0)<1&&(this.isEsriGroupsTemplateLoadAll=!0,this.refreshAction())}if(window.jimuConfig.isDevEdition){const t=this.checkMyLocalTemplateIsLoadAll(e.nextStart,e.total,i);this.searchMyPortalTemplate(i,t)}}),(()=>{i===r.EsriGroup&&(this.isEsriGroupsTemplateLoadAll=!0,this.refreshAction()),this.setState({loading:!1})}))}render(){const{templates:t,searchText:s,capabilities:r,isShowAlertPopup:a,alertPopupMessage:n,esriGroupTemplates:o,accessType:l,isShowLivingAtlas:c,selectedTags:h,categoriesTags:d}=this.state,{theme:u,intl:m}=this.props,g=l===i.ArcGisOnline,A=this.filterTemplateByWebmapOrWebsceneUrlParam(g?o.concat(t):t),f=this.checkIsUseDefaultTemplateList();return(0,e.jsx)("div",{css:this.getStyle(),className:"widget-choose-template bg-default d-flex","data-testid":"widget-choose-template"},!this.hasWebmapOrWebsceneUrlParam&&(0,e.jsx)("div",{className:"header-bar"},this.nls("template"),(0,e.jsx)(p.Button,{type:"tertiary",icon:!0,"data-testid":"close-button",onClick:this.close,title:this.nls("back")},(0,e.jsx)(le,{"aria-hidden":"true",size:20}))),(0,e.jsx)("div",{className:"homescreen"},(0,e.jsx)("div",{className:"d-flex search-con top-padding align-items-center"},!this.hasWebmapOrWebsceneUrlParam&&(0,e.jsx)("span",{className:"flex-grow-1"},this.nls("choseTemplate")),(0,e.jsx)("div",{className:"d-flex"},(0,e.jsx)("div",{className:"banner d-flex position-relative"},(0,e.jsx)(p.TextInput,{"aria-label":this.nls("searchPlaceholder"),prefix:(0,e.jsx)(de,{"aria-hidden":"true",className:"search-icon position-relative",size:16}),className:"searchbox "+(this.hasWebmapOrWebsceneUrlParam?"p-0":""),placeholder:this.nls("searchPlaceholder"),value:s,allowClear:!0,onKeyDown:e=>{this.handleKeydown(e)},onChange:e=>{this.onSearch(e.target.value)}})))),(0,e.jsx)("div",{className:"header-nav-container d-flex top-padding "+(this.hasWebmapOrWebsceneUrlParam||window.isExpressBuilder?"pt-2 pb-3":"")},!this.hasWebmapOrWebsceneUrlParam&&!window.isExpressBuilder&&(0,e.jsx)("div",{className:"template-title flex-grow-1"},(0,e.jsx)(p.Navbar,{className:"header-nav-bar-con",border:!1,light:!0},(0,e.jsx)(p.Nav,{underline:!0,navbar:!0,justified:!0,fill:!0,"data-testid":"template-menu"},(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("chooseTemplateDefault"),onClick:()=>{this.filterTemplateChange(i.Default)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.Default},this.nls("chooseTemplateDefault"))),(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("my"),onClick:()=>{this.filterTemplateChange(i.My)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.My},this.nls("my"))),!window.jimuConfig.isDevEdition&&(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("myFavorites"),onClick:()=>{this.filterTemplateChange(i.Favorites)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.Favorites},this.nls("myFavorites"))),!window.jimuConfig.isDevEdition&&(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("myGroup"),onClick:()=>{this.filterTemplateChange(i.MyGroup)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.MyGroup},this.nls("myGroup"))),!window.jimuConfig.isDevEdition&&(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("myOrganization"),onClick:()=>{this.filterTemplateChange(i.MyOrganization)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.MyOrganization},this.nls("myOrganization"))),(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:"ArcGIS Online",onClick:()=>{this.filterTemplateChange(i.ArcGisOnline)}},(0,e.jsx)(p.NavLink,{tag:"button",active:g},"ArcGIS Online")),c&&(0,e.jsx)(p.NavItem,{className:"tap-link tap-margin-r",title:this.nls("livingAtlas"),onClick:()=>{this.filterTemplateChange(i.LivingAtlas)}},(0,e.jsx)(p.NavLink,{tag:"button",active:l===i.LivingAtlas},this.nls("livingAtlas"))))))),(l===i.Default||g)&&(0,e.jsx)(ge,{isAGOLFilter:g,selectedTags:g?d:h,onTagsChange:this.onTemplateFilterChange})),(0,e.jsx)("div",{className:"section position-relative flex-grow-1",tabIndex:-1,ref:e=>{this.contentNode=e}},(0,e.jsx)("div",{className:"d-flex template-con homescreen",ref:e=>{this.appListContainer=e}},A.length>0&&!f&&A.map(((t,s)=>(0,e.jsx)(S,{key:s,theme:u,info:t,intl:m,accessType:this.state.accessType,disabled:this.isTemplateDisabled(t),onCreateClick:this.onCreateClick,capabilities:r,crateAppByTemplate:this.crateAppByTemplate}))),f&&(0,e.jsx)(xe,{selectedTags:h,template:(0,e.Immutable)(A),theme:u,intl:m,accessType:this.state.accessType,onCreateClick:this.onCreateClick,capabilities:r,crateAppByTemplate:this.crateAppByTemplate}),0===A.length&&!this.state.loading&&(0,e.jsx)(j,{theme:u,intl:m}))),this.state.loading&&(0,e.jsx)("div",{className:"loading-con"},(0,e.jsx)("div",{style:{position:"absolute",left:"50%",top:"50%"},className:"jimu-primary-loading"})),(0,e.jsx)(p.AlertPopup,{isOpen:a,title:this.nls("warningPopUpTitle"),hideCancel:!0,toggle:this.toggleAlertPopup},(0,e.jsx)("div",{style:{fontSize:"1rem"}},n)))}}ye.scrollTop=0;const Te=ye;var ke=l(505),Ee=l.n(ke),Oe=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const Se=t=>{const s=window.SVG,{className:i}=t,r=Oe(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:Ee()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var je=l(8243),Re=l.n(je),De=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const Ie=t=>{const s=window.SVG,{className:i}=t,r=De(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:Re()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var Ce=l(9165),Ne=l.n(Ce),Pe=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const Me=t=>{const s=window.SVG,{className:i}=t,r=Pe(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:Ne()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var Be=l(7213),Ge=l.n(Be),Ue=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const Le=t=>{const s=window.SVG,{className:i}=t,r=Ue(t,["className"]),a=(0,e.classNames)("jimu-icon jimu-icon-component",i);return s?e.React.createElement(s,Object.assign({className:a,src:Ge()},r)):e.React.createElement("svg",Object.assign({className:a},r))};var Fe=function(e,t,s,i){return new(s||(s=Promise))((function(r,a){function n(e){try{l(i.next(e))}catch(e){a(e)}}function o(e){try{l(i.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(n,o)}l((i=i.apply(e,t||[])).next())}))};const ze=e.css`
  flex-direction: column;
  .header-bar {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    font-size: 20px;
    border-bottom: 1px solid var(--sys-color-secondary-main);
    color: var(--ref-palette-neutral-1000);
    font-weight:500;
    background: var(--ref-palette-neutral-500);
    svg {
      margin-right: 0;
    }
    &>div {
      color: var(--ref-palette-neutral-1000);
    }
    &>div:hover {
      color: var(--ref-palette-black);
    }
    .jimu-icon {
      cursor: pointer;
    }
  }
  .homescreen {
    flex: 1;
    min-height: 0;
    .left {
      width: 401px;
      box-sizing: border-box;
      padding: 30px 0 30px 21px;
      flex-direction: column;
      flex-shrink: 0;
      border-right: 1px solid var(--sys-color-divider-primary);
      .list-title {
        margin-left: 9px;
        margin-bottom: 20px;
        line-height: 27px;
        font-size: 20px;
        font-weight: 500;
        color: var(--ref-palette-custom2-600);
      }
      .list-container {
        flex: 1;
        min-height: 0;
        padding-top: 4px;
        overflow: auto;
        .list {
          flex-wrap: wrap;
          align-items: center;
        }
        .card {
          margin: 0 9px 18px;
          .template {
            margin: 0;
            width: 160px;
            height: 146px;
          }
          .image-container {
            width: 100%;
            height: 108px;
            &:hover .description {
              display: none;
            }
          }
          .template-info-con {
            &:focus .description {
              display: none;
            }
            .title {
              padding: 8px 8px 0;
              font-size: 0.875rem;
            }
          }
          &.card-active {
            .card-checkmark {
              display: none;
            }
            .custom-card-checkmark {
              position: absolute;
              right: 0;
              z-index: 1;
              padding: 3px 3px 5px 5px;
              line-height: 1;
              border-radius: 0 0 0 2px;
              color: #000;
              text-decoration: none;
              font-style: normal;
              background-color: var(--ref-palette-primary-700);
            }
          }
        }
        .info {
          display: none;
        }
      }
      .create-btn {
        margin: 30px 27px 0 9px;
        height: 48px;
      }
    }
    .right {
      flex: 1;
      flex-direction: column;
      overflow: auto;
      .iframe-container {
        flex: 1;
        justify-content: center;
        align-items: center;
        min-width: fit-content;
        overflow: auto;
        text-align: center;
        &.preview-size-mode-LARGE {
          padding: clamp(20px, calc(50% - 510px), 60px);
          padding-bottom: 0;
          .outer-iframe {
            min-width: 1020px;
            width: 100%;
            height: calc(100% - 20px);
          }
        }
        &.preview-size-mode-MEDIUM {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          flex-flow: wrap;
          align-items: center;
          justify-content: center;
          .outer-iframe {
            width: 606px;
            height: 923px;
            min-height: 923px;
          }
        }
        &.preview-size-mode-SMALL {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          flex-flow: wrap;
          align-items: center;
          justify-content: center;
          .outer-iframe {
            width: 395px;
            height: 687px;
            min-height: 687px;
          }
        }
      }
      .outer-iframe {
        padding: 10px;
        border: none;
        background: var(--sys-color-surface-paper);
        box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.20);
      }
      .switch-device {
        margin: 30px;
        min-width: max-content;
        text-align: center;
        .btn {
          height: 40px;
          width: 40px;
          border-radius: 20px;
        }
      }
    }
  }
`,qe=t=>{const{theme:i,intl:r,dispatch:a}=t,l=e.hooks.useTranslation(Object.assign(Object.assign({},h),n.defaultMessages),p.defaultMessages,e.defaultMessages),c=t=>e.queryString.parse(window.location.search)[t]||"",[d,u]=e.React.useState({canCreateExperience:!1,canDeleteExperience:!1,canShareExperience:!1,canUpdateExperience:!1,canViewExperience:!1});e.React.useEffect((()=>{(()=>{const{CheckTarget:t}=e.privilegeUtils;e.privilegeUtils.checkExbAccess(t.AppList).then((e=>{(null==e?void 0:e.capabilities)&&u(e.capabilities)}))})()}),[]);const[m,g]=e.React.useState([]),A=e.React.useRef(new Map),[f,w]=e.React.useState([]),[v,b]=e.React.useState(!1);e.React.useEffect((()=>{const t=(0,re.getAppTemplates)(["WAB classic"]);g(t.map((t=>{const i=!!(r=t.templateCreateVersion)&&(window.jimuConfig.isInPortal?e.semver.satisfies(r,`${s} - ${e.version}`):e.semver.eq(e.version,r));var r;return{isExperiencesTemplate:!1,name:t.name,title:t.label,image:{src:t.thumbnail,gifSrc:null==t?void 0:t.gifThumbnail},tags:(null==t?void 0:t.tags)||[],description:t.description,isMapAware:t.isMapAware,snippet:t.description,flipThumbnail:t.flipThumbnail,isNewTemplate:i,isMultiplePage:t.isMultiplePage}})));let i=!1;Promise.allSettled(t.map((e=>fetch(e.configUrl).then((e=>e.json())).then((t=>{A.current.set(e.name,t),"foldable"===e.name&&(i=!0,b(!0))})).catch((t=>{console.error("get template config error",t),w((t=>[...t,e.name]))}))))).then((()=>{i||b(!0)}))}),[]);const[x,y]=e.React.useState(),T=e=>new Promise((t=>{setTimeout(t,e)})),[k,E]=e.React.useState(e.BrowserSizeMode.Large),O=[{value:e.BrowserSizeMode.Large,icon:(0,e.jsx)(Se,null),title:l("largeDevices")},{value:e.BrowserSizeMode.Medium,icon:(0,e.jsx)(Ie,null),title:l("mediumDevices")},{value:e.BrowserSizeMode.Small,icon:(0,e.jsx)(Me,null),title:l("smallDevices")}];e.React.useEffect((()=>{x&&Fe(void 0,void 0,void 0,(function*(){var t,s,i,r,a;const o=((l=e.lodash.cloneDeep(A.current.get(x.name))).attributes||(l.attributes={}),l.widgets||(l.widgets={}),l.widgetsManifest||(l.widgetsManifest={}),l.views||(l.views={}),l.sections||(l.sections={}),l.dialogs||(l.dialogs={}),l.pages||(l.pages={}),l.layouts||(l.layouts={}),l.dataSources||(l.dataSources={}),l.messageConfigs||(l.messageConfigs={}),l);var l;const c=C.current.contentDocument.getElementById("express-template-preview");if(o&&c){const l=(0,e.getAppStore)().getState().queryObject;if(((null==l?void 0:l.webmap)||(null==l?void 0:l.webscene))&&e.appConfigUtils.addWebmapOrWebsceneToAppConfig(o,null==l?void 0:l.webmap,null==l?void 0:l.webscene,!0),e.utils.replaceI18nPlaceholdersInObject(o,e.i18n.getIntl(),n.defaultMessages),!(null===(t=c.contentWindow)||void 0===t?void 0:t._configManager)){for(;!(null===(s=c.contentWindow)||void 0===s?void 0:s._configManager);)yield T(100);for(;!(null===(r=null===(i=c.contentWindow._appStore)||void 0===i?void 0:i.getState)||void 0===r?void 0:r.call(i)).appConfig;)yield T(100)}null===(a=c.contentWindow._configManager)||void 0===a||a.setAppConfig(o)}}))}),[x]);const[j,R]=e.React.useState(!1),[D,I]=e.React.useState(""),C=e.React.useRef(),[N,P]=e.React.useState(!1),M=e.React.useMemo((()=>(0,e.jsx)("iframe",{src:"",className:"outer-iframe",ref:e=>{if(e){C.current=e;const t=e.contentDocument.body;t.style.margin="0";const s=document.createElement("iframe");s.style.width="100%",s.style.height="100%",s.style.border="none",s.id="express-template-preview",s.src="/template/index.html",s.addEventListener("load",(()=>{P(!0)})),e.contentWindow.addEventListener("load",(()=>{const t=e.contentDocument.body;t.style.margin="0",t.replaceChildren(s)})),t.replaceChildren(s)}}})),[]);e.React.useEffect((()=>{if(v&&N&&m.length){const e=m.find((e=>"foldable"===e.name))||m[0];y(e)}}),[v,N,m]);const B=!(!c("webmap")&&!c("webscene"));return(0,e.jsx)("div",{css:ze,className:"widget-choose-template bg-default d-flex h-100","data-testid":"widget-choose-template"},!B&&(0,e.jsx)("div",{className:"header-bar"},l("template"),(0,e.jsx)(p.Button,{type:"tertiary",icon:!0,"data-testid":"close-button",onClick:()=>{if("back"===c("redirect"))e.jimuHistory.changePage("default");else{const e=n.utils.getHomePageUrl(window.isExpressBuilder);window.location.href=e}},title:l("back")},(0,e.jsx)(le,{"aria-hidden":"true",size:20}))),(0,e.jsx)("div",{className:"homescreen d-flex"},(0,e.jsx)("div",{className:"left d-flex"},!B&&(0,e.jsx)("div",{className:"list-title"},l("choseTemplate")),(0,e.jsx)("div",{className:"list-container"},(0,e.jsx)("div",{className:"d-flex list"},m.map(((t,s)=>{const a=f.includes(t.name),n=(null==x?void 0:x.name)===t.name;return(0,e.jsx)(p.Card,{key:s,active:n,onClick:()=>{a||y(t)},style:{opacity:a?.6:1}},n&&(0,e.jsx)("span",{className:"custom-card-checkmark",role:"presentation"},(0,e.jsx)(Le,{size:16})),(0,e.jsx)(S,{theme:i,info:t,intl:r,disabled:a,capabilities:d}))})))),(0,e.jsx)(p.Button,{className:"create-btn",size:"lg",type:"primary",disabled:!x,onClick:()=>{const t=x.name;a(n.builderActions.selectTemplate(t));if((()=>{const t=(0,e.getAppStore)().getState().portalSelf;return(null==t?void 0:t.isReadOnly)&&I(l("remindTextForReadonlyMode")),null==t?void 0:t.isReadOnly})())return;R(!0);const s=l("untitledExperience"),i=c("folderId"),r=(0,e.getAppStore)().getState().queryObject;o.appServices.createAppByDefaultTemplate(s,t,i,null==r?void 0:r.webmap,null==r?void 0:r.webscene).then((t=>{R(!1),a(n.builderActions.refreshAppListAction(!0)),(null==r?void 0:r.webmap)||(null==r?void 0:r.webscene)?window.location.href=n.utils.getBuilderUrl(t.id,!0):e.jimuHistory.browserHistory.push(n.utils.getBuilderUrl(t.id,!0))})).catch((e=>{R(!1),I(l("createApplicationError"))}))}},l("createNewApp"))),(0,e.jsx)("div",{className:"right d-flex"},(0,e.jsx)("div",{className:`iframe-container preview-size-mode-${k}`},M),(0,e.jsx)("div",{className:"switch-device"},O.map((t=>(0,e.jsx)(p.Button,{className:"mx-2",icon:!0,key:t.value,title:t.title,type:t.value===k?"primary":"default",onClick:()=>{E(t.value)}},t.icon)))))),j&&(0,e.jsx)(p.Loading,null),(0,e.jsx)(p.AlertPopup,{isOpen:!!D,title:l("warningPopUpTitle"),hideCancel:!0,toggle:()=>{D&&I("")}},(0,e.jsx)("div",{style:{fontSize:"1rem"}},D)))},_e=e.css`
  .header-bar {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    font-size: 20px;
    border-bottom: 1px solid var(--sys-color-secondary-main);
    color: var(--ref-palette-neutral-1000);
    font-weight:500;
    background: var(--ref-palette-neutral-500);
  }
  .header-bar.header-bar-simple {
    height: 88px;
    border-bottom: 1px solid var(--sys-color-divider-primary);
    background: transparent;
    .switch-label {
      font-size: 14px;
    }
  }
  &.has-common-header {
    .choose-template-content {
      height: calc(100% - 88px);
    }
  }
  .choose-template-content {
    height: 100%;
  }
`,Qe=t=>{const s=e.ReactRedux.useSelector((e=>{var t,s;return(null===(t=e.queryObject)||void 0===t?void 0:t.webmap)||(null===(s=e.queryObject)||void 0===s?void 0:s.webscene)})),i=e.ReactRedux.useSelector((e=>{var t;return"express"===(null===(t=e.queryObject)||void 0===t?void 0:t.mode)})),r=e.hooks.useTranslation(h),[a,o]=e.React.useState(!1),l="exb-site-express";e.React.useEffect((()=>{if(s)if(i)c(!0);else{e.utils.readLocalStorage(l)&&c(!0)}else c(window.isExpressBuilder)}),[]);const c=t=>{o(t),e.jimuHistory.changeQueryObject({mode:t?"express":null}),window.isExpressBuilder=t;const s=(0,e.getAppStore)().getState().appConfig,i=t?ue.utils.getCustomThemeOfExpressMode():null,r=s.set("customTheme",i);(0,e.getAppStore)().dispatch(e.appActions.appConfigChanged(r)),t?e.utils.setLocalStorage(l,`${t}`):e.utils.removeFromLocalStorage(l)};return(0,e.jsx)("div",{className:(0,e.classNames)("w-100 h-100",{"has-common-header":s}),css:_e},s&&(0,e.jsx)("div",{className:"header-bar header-bar-simple header"},r("choseTemplate"),(0,e.jsx)(n.ExpressModeSwitch,{checked:a,onChange:()=>{c(!a)}})),(0,e.jsx)("div",{className:"choose-template-content"},!a&&(0,e.jsx)(Te,Object.assign({},t)),a&&(0,e.jsx)(qe,Object.assign({},t))))};function He(e){l.p=e}})(),c})())}}}));