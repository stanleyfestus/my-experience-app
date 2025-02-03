System.register(["jimu-core","jimu-for-builder","jimu-ui"],(function(e,t){var s={},i={},o={};return{setters:[function(e){s.AppMode=e.AppMode,s.BrowserSizeMode=e.BrowserSizeMode,s.GuideLevels=e.GuideLevels,s.GuideManager=e.GuideManager,s.GuideTypes=e.GuideTypes,s.React=e.React,s.appActions=e.appActions,s.classNames=e.classNames,s.css=e.css,s.defaultMessages=e.defaultMessages,s.getAppStore=e.getAppStore,s.jimuHistory=e.jimuHistory,s.jsx=e.jsx,s.polished=e.polished},function(e){i.helpUtils=e.helpUtils},function(e){o.Dropdown=e.Dropdown,o.DropdownButton=e.DropdownButton,o.DropdownItem=e.DropdownItem,o.DropdownMenu=e.DropdownMenu,o.Icon=e.Icon,o.Nav=e.Nav,o.NavItem=e.NavItem,o.NavLink=e.NavLink,o.Popper=e.Popper,o.defaultMessages=e.defaultMessages}],execute:function(){e((()=>{var e={9244:e=>{"use strict";e.exports=s},4108:e=>{"use strict";e.exports=i},4321:e=>{"use strict";e.exports=o}},t={};function r(s){var i=t[s];if(void 0!==i)return i.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var a={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(a),r.d(a,{__set_webpack_public_path__:()=>m,default:()=>h});var e=r(9244),t=r(4321),s=r(4108);const i="Show help guide",o="What's new",n="Live view",l="Lock layout",p="Unable to add widgets in {liveViewElement} mode. Turn off {liveViewElement} to enable it.",d="Unable to insert a widget from here when layout editing is disabled. Turn off the {lockLayoutElement} option to enable it.",u={page:"./widgets/setting-navigator/dist/runtime/assets/page.svg",data:"./widgets/setting-navigator/dist/runtime/assets/data.svg",utility:"./widgets/setting-navigator/dist/runtime/assets/utility.svg",theme:"./widgets/setting-navigator/dist/runtime/assets/theme.svg",insert:"./widgets/setting-navigator/dist/runtime/assets/insert.svg",appSetting:"./widgets/setting-navigator/dist/runtime/assets/setting.svg"},c="left-sidebar";class g extends e.React.PureComponent{constructor(i){super(i),this.viewLabel={page:this.props.intl.formatMessage({id:"page",defaultMessage:e.defaultMessages.page}),data:this.props.intl.formatMessage({id:"data",defaultMessage:t.defaultMessages.data}),theme:this.props.intl.formatMessage({id:"theme",defaultMessage:e.defaultMessages.theme}),utility:this.props.intl.formatMessage({id:"utility",defaultMessage:t.defaultMessages.utility}),insert:this.props.intl.formatMessage({id:"insert",defaultMessage:t.defaultMessages.insert}),appSetting:this.props.intl.formatMessage({id:"general",defaultMessage:t.defaultMessages.general})},this.onInsertMouseEnter=e=>{"insert"===e&&this.getWhetherViewDisabled("insert")&&this.setState({isInsertDisabledPopperShown:!0})},this.onInsertMouseLeave=e=>{"insert"===e&&this.setState({isInsertDisabledPopperShown:!1})},this.getHelpUrl=()=>{var e;null===(e=null===s.helpUtils||void 0===s.helpUtils?void 0:s.helpUtils.getHomeHelpLink())||void 0===e||e.then((e=>{e&&this.setState({helpHref:e})}))},this.getWhatsNewUrl=()=>{var e;null===(e=null===s.helpUtils||void 0===s.helpUtils?void 0:s.helpUtils.getWhatsNewLink())||void 0===e||e.then((e=>{e&&this.setState({whatsNewHref:e})}))},this.getStyle=t=>{const s=window.isExpressBuilder;return e.css`
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: ${t.sys.color.secondary.main};

      .jimu-nav-link-wrapper{
        > div{
          display: flex;
          justify-content: center;
        }
      }
      .nav.nav-underline {
        border: 0 !important;
        .nav-item{
          display: flex !important;
        }
        .nav-item:focus{
          border: 0;
          outline: none;
          box-shadow: 0 0 0;
        }
        .nav-item > .jimu-link{
          height: auto !important;
          padding-left: 0;
          padding-right: 0;
          position: relative;
          border-width: 0 !important;
          &::before {
            content: " ";
            display: block;
            position: absolute;
            width: 4px;
            height: 100%;
            top: 0;
            left: -4px;
            background-color: ${t.sys.color.primary.light};
            transition: left ease-in .2s .2s;
            z-index: 1;
          }
          > .jimu-icon {
            margin: 0;
          }
          &:active,
          &.active {
            border-left-width: 0 !important;
            &::before {
              left: 0;
            }
          }
        }
      }

      .top-sections {
        height: ${s?"110px":"330px"};
        .link-icon-color{
          svg{
            margin-right: 0 !important;
            margin-left: 0 !important;
          }
        }

        .link-icon-color:not(.disable-setting){
          &:hover{
            svg{
              color: ${t.ref.palette.neutral[1200]} !important;
            }
          }
        }
      }

      .nav-item:hover{
        background-color: ${t.sys.color.secondary.main};
      }

      .active-setting:not(.disable-setting){
        background-color: ${t.ref.palette.neutral[700]};
      }

      .disable-setting{
        &.nav-item:focus, &.nav-item button:focus, &.nav-item:active, &.nav-item button:active, &.nav-item:hover, &.nav-item button:hover{
          outline: none !important;
          cursor: default !important;
          border: 0 !important;
          box-shadow: 0 0 0 !important;
        }
        &.nav-item button:active::before{
          width: 0 !important;
        }
      }

      .link-focus{
        &:focus, button:focus{
          border: 0;
          box-shadow: 0 0 0;
        }
      }

      .bottom-sections{
        position: absolute;
        bottom: 0;
        .func-buttons{
          margin: 0.25rem;
          >span{
            display: inline-block;
            position: relative;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          .cover-dropdown-button {
            min-height: 3rem;
          }
          .dropdown-button.cover-dropdown-button:hover{
            background-color: ${t.sys.color.secondary.main};
            svg{
              color: ${t.ref.palette.neutral[1200]} !important
            }
          }
        }
      }
    `},this.getDropdownMenuStyle=()=>e.css`
      .link-con {
        & {
          padding: 0 !important;
        }
        &>a, &>a:hover {
          color: var(--ref-palette-black);
          padding: ${e.polished.rem(4)} ${e.polished.rem(8)} !important;
          text-decoration: none;
        }
        &>a:focus {
          background: var(--sys-color-primary-main);
          outline: none;
        }
      }
    `,this.getBuilderUrl=()=>{const t=(0,e.getAppStore)().getState().queryObject;let s=`${window.jimuConfig.mountPath}builder/?id=${t.id}`;return t.locale&&(s+=`&locale=${t.locale}`),window.isExpressBuilder||(s+="&mode=express"),s},this.onSwitchModeClick=()=>{const e=this.getBuilderUrl();window.location.href=e},this.state={isInsertDisabledPopperShown:!1,helpHref:"#",whatsNewHref:"#"}}componentDidMount(){this.getHelpUrl(),this.getWhatsNewUrl(),this.getWhetherDisableInsert(this.props)&&"insert"===this.props.currentViewId&&(window.isExpressBuilder?e.jimuHistory.changeView("opts-section","theme"):e.jimuHistory.changeView("opts-section","page"))}componentDidUpdate(t){this.getWhetherDisableInsert(this.props)&&!this.getWhetherDisableInsert(t)&&"insert"===this.props.currentViewId&&(window.isExpressBuilder?e.jimuHistory.changeView("opts-section","theme"):e.jimuHistory.changeView("opts-section","page")),this.props.portalUrl===(null==t?void 0:t.portalUrl)&&this.props.portalSelf===(null==t?void 0:t.portalSelf)||(this.getHelpUrl(),this.getWhatsNewUrl())}getWhetherDisableInsert(t){return t.lockLayoutLabel||t.appMode===e.AppMode.Run}changeView(t){this.getWhetherViewDisabled(t)||(this.props.currentViewId===t?(0,e.getAppStore)().dispatch(e.appActions.widgetStatePropChange(c,"collapse",!this.props.sidebarVisible)):(e.jimuHistory.changeView("opts-section",t),this.props.sidebarVisible||(0,e.getAppStore)().dispatch(e.appActions.widgetStatePropChange(c,"collapse",!0))))}getWhetherViewDisabled(e){return this.getWhetherDisableInsert(this.props)&&"insert"===e}getWhetherViewActive(e){return e===this.props.currentViewId&&this.props.sidebarVisible}render(){const s="active-setting",r="disable-setting",{sectionJson:a,theme:c,browserSizeMode:g}=this.props,h=this.props.intl.formatMessage({id:"liveView",defaultMessage:n}),m=this.props.intl.formatMessage({id:"lockLayouts",defaultMessage:l});let v=this.props.intl.formatMessage({id:"diableInsertDueToLiveViewTip",defaultMessage:p},{liveViewElement:(0,e.jsx)("strong",{key:"diableInsertDueToLiveViewTip"},h)});v=v.map(((t,s)=>(t&&"strong"===t.type&&(t=(0,e.jsx)("strong",{key:`diableInsertDueToLiveViewTip-${s}`},h)),t)));const w=this.props.intl.formatMessage({id:"diableInsertDueToLockLayoutTip",defaultMessage:d},{lockLayoutElement:(0,e.jsx)("strong",{key:"diableInsertDueToLockLayoutTip"},m)}),f=this.props.intl.formatMessage({id:"help",defaultMessage:t.defaultMessages.help});return(0,e.jsx)("div",{css:this.getStyle(c),className:"widget-builder-setting-navigator h-100"},(0,e.jsx)(t.Popper,{open:this.state.isInsertDisabledPopperShown,showArrow:!0,reference:this.insertDom,placement:"right",offset:[0,20],css:e.css`
            width: ${e.polished.rem(300)};
            padding: ${e.polished.rem(12)};
            background-color: ${c.ref.palette.neutral[500]};
            color: ${c.ref.palette.neutral[1100]};
            font-size: ${e.polished.rem(13)};
            strong{
              font-size: ${e.polished.rem(16)};
              color: ${c.ref.palette.black};
            }
            .jimu-popper--arrow::after {
              border-right-color: ${c.ref.palette.neutral[500]} !important;
            }
          `},(0,e.jsx)("div",{className:"insert-disable-tooltip"},this.props.appMode===e.AppMode.Run?(0,e.jsx)("div",null,(0,e.jsx)("div",null,v)):(0,e.jsx)("div",null,(0,e.jsx)("div",null,w)))),(0,e.jsx)(t.Nav,{fill:!0,underline:!0,vertical:!0,right:!0,className:"top-sections",iconOnly:!0},a.views.map((i=>{const o=this.getWhetherViewDisabled(i),a=this.getWhetherViewActive(i);return(0,e.jsx)(t.NavItem,{key:i,className:(0,e.classNames)("link-icon-color",{[s]:a,[r]:o}),disabled:o,onMouseEnter:()=>{this.onInsertMouseEnter(i)},onMouseLeave:()=>{this.onInsertMouseLeave(i)}},(0,e.jsx)(t.NavLink,{iconPosition:"above",tag:"button",active:a,onClick:e=>{this.changeView(i)},themeStyle:{icon:!0},title:this.viewLabel[i],"aria-label":this.viewLabel[i],"aria-pressed":a?"true":"false"},(0,e.jsx)("div",{className:"w-100 h-100",ref:e=>{"insert"===i&&(this.insertDom=e)}},(0,e.jsx)(t.Icon,{className:(0,e.classNames)({[s]:a}),icon:u[i],size:"20",color:o?this.props.theme.sys.color.action.disabled.text:a?this.props.theme.ref.palette.neutral[1200]:this.props.theme.ref.palette.neutral[1e3]}))))}))),(0,e.jsx)("div",{className:"bottom-sections w-100"},(0,e.jsx)("div",{className:"func-buttons"},(0,e.jsx)(t.Dropdown,{direction:"right",className:"link-focus link-icon-color w-100 d-flex justify-content-center",supportInsideNodesAccessible:!0},(0,e.jsx)(t.DropdownButton,{icon:!0,arrow:!1,title:f,"aria-label":f,className:"cover-dropdown-button"},(0,e.jsx)(t.Icon,{autoFlip:"ar"===window.locale.split("-")[0],icon:"./widgets/setting-navigator/dist/runtime/assets/help.svg",color:this.props.theme.ref.palette.neutral[1e3]})),(0,e.jsx)(t.DropdownMenu,{css:this.getDropdownMenuStyle()},(0,e.jsx)(t.DropdownItem,{className:"link-con",tag:"div",title:f},(0,e.jsx)("a",{className:"w-100 h-100 d-block",href:this.state.helpHref,target:"_blank","aria-label":f,rel:"noopener noreferrer"},(0,e.jsx)(t.Icon,{autoFlip:!0,icon:"./widgets/setting-navigator/dist/runtime/assets/help-document.svg",className:"mr-2"}),f)),g===e.BrowserSizeMode.Large&&(0,e.jsx)(t.DropdownItem,{title:this.props.intl.formatMessage({id:"showGuide",defaultMessage:i}),onClick:()=>{window.isExpressBuilder?e.GuideManager.getInstance().startGuide({id:"general-express-mode",type:e.GuideTypes.Program,level:e.GuideLevels.Builder}):e.GuideManager.getInstance().startGuide({id:"opening-tour",type:e.GuideTypes.Program,level:e.GuideLevels.Builder})}},(0,e.jsx)(t.Icon,{icon:"./widgets/setting-navigator/dist/runtime/assets/launch.svg",className:"mr-2"}),this.props.intl.formatMessage({id:"showGuide",defaultMessage:i})),(0,e.jsx)(t.DropdownItem,{title:this.props.intl.formatMessage({id:"whatsNew",defaultMessage:o}),tag:"div",className:"link-con"},(0,e.jsx)("a",{className:"w-100 h-100 d-block",href:this.state.whatsNewHref,target:"_blank","aria-label":this.props.intl.formatMessage({id:"whatsNew",defaultMessage:o}),rel:"noopener noreferrer"},(0,e.jsx)(t.Icon,{icon:"./widgets/setting-navigator/dist/runtime/assets/whats-new.svg",className:"mr-2"}),this.props.intl.formatMessage({id:"whatsNew",defaultMessage:o}))))))))}}g.mapExtraStateProps=(e,t)=>{var s,i,o,r,a,n,l,p,d,u,g;const h=Object.keys(e.appRuntimeInfo.sectionNavInfos||{}).map((t=>e.appRuntimeInfo.sectionNavInfos[t].currentViewId));return{sectionJson:null===(s=e.appConfig)||void 0===s?void 0:s.sections[t.config.sectionId],currentViewId:h[0]?h[0]:"insert",sidebarVisible:null===(r=null===(o=null===(i=e.widgetsState)||void 0===i?void 0:i[c])||void 0===o?void 0:o.collapse)||void 0===r||r,lockLayoutLabel:null===(l=null===(n=null===(a=e.appStateInBuilder)||void 0===a?void 0:a.appConfig)||void 0===n?void 0:n.forBuilderAttributes)||void 0===l?void 0:l.lockLayout,appMode:null===(p=e.appStateInBuilder)||void 0===p?void 0:p.appRuntimeInfo.appMode,portalUrl:null===(d=e.appStateInBuilder)||void 0===d?void 0:d.portalUrl,portalSelf:null===(u=e.appStateInBuilder)||void 0===u?void 0:u.portalSelf,browserSizeMode:null===(g=e.appStateInBuilder)||void 0===g?void 0:g.browserSizeMode}};const h=g;function m(e){r.p=e}})(),a})())}}}));