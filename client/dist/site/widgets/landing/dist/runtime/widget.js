System.register(["jimu-core","jimu-for-builder"],(function(e,t){var s={},a={};return{setters:[function(e){s.React=e.React,s.SessionManager=e.SessionManager,s.classNames=e.classNames,s.css=e.css,s.getAppStore=e.getAppStore,s.hooks=e.hooks,s.jsx=e.jsx},function(e){a.helpUtils=e.helpUtils}],execute:function(){e((()=>{var e={244:e=>{"use strict";e.exports=s},108:e=>{"use strict";e.exports=a}},t={};function n(s){var a=t[s];if(void 0!==a)return a.exports;var i=t[s]={exports:{}};return e[s](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="";var i={};return n.p=window.jimuConfig.baseUrl,(()=>{"use strict";n.r(i),n.d(i,{__set_webpack_public_path__:()=>o,default:()=>r});var e=n(244);const t={landingOverView:"Overview",landingHelp:"Help",landingProductDiscribe:"Create web apps and pages visually with drag-and-drop. Choose the tools you need to interact with your 2D and 3D data. Build interactive, mobile adaptive experiences for your audiences.",landingLearnMore:"Learn more about ArcGIS Experience Builder",landingSignIn:"Sign in",landingTrustCenter:"Trust Center",landingLegal:"Legal",landingContact:"Contact Esri"};var s=n(108);const a=e.React.memo((a=>{const n=e.hooks.useTranslation(t),i=e.React.useRef(null),r=e.React.useRef(null),[o,l]=e.React.useState(null),{onShowMenuChanged:c}=a;let d;e.React.useEffect((()=>(s.helpUtils.getHomeHelpLink().then((e=>{l(e)})),()=>{c(!1)})),[c]),function(e){e.firstNode="is508first",e.lastNode="is508last"}(d||(d={}));const p=e.React.useCallback((e=>{const t="first"===e?d.firstNode:d.lastNode,s=r.current.querySelector("[data-"+t+"]");null==s||s.focus()}),[d]),x=e=>{const t=e.target,s=t.dataset[d.firstNode],a=t.dataset[d.lastNode];"Tab"===e.key&&(a&&!e.shiftKey?(e.stopPropagation(),e.nativeEvent.preventDefault(),e.nativeEvent.stopImmediatePropagation(),p("first")):s&&e.shiftKey&&(e.stopPropagation(),e.nativeEvent.preventDefault(),e.nativeEvent.stopImmediatePropagation(),p("last")))},g=e.React.useCallback((()=>{var e;a.isShowMenu?(r.current.style.display="block",r.current.setAttribute("aria-expanded","true"),(null===(e=a.maskerRef)||void 0===e?void 0:e.current)&&(a.maskerRef.current.style.opacity="1",a.maskerRef.current.style.zIndex="1"),p("first")):(r.current.style.display="none",r.current.setAttribute("aria-expanded","false"),a.maskerRef&&(a.maskerRef.current.style.opacity="0",a.maskerRef.current.style.zIndex="-1"),i.current.focus())}),[a.isShowMenu,a.maskerRef,p]);e.hooks.useUpdateEffect((()=>{g()}),[a.isShowMenu,g]);return(0,e.jsx)("ul",{className:"exb-header-menus",css:(u=a.isRTL,e.css`
      &.exb-header-menus {
        display: flex;
        height: 100%;
        width: 390px;
        align-items: center;

        margin-top: 0;
        margin-bottom: 0;
        padding-right: 0;
        padding-left: 0;

        list-style-type: none;
      }

      .exb-header-menus-item {
        display: flex;
        flex-grow: 1;
        height: 100%;
        padding: 4px; /* for 508 focus border */

        position: relative;
      }

      .exb-header-menus-link {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        line-height: 20px;
        padding-right: 24px;
        padding-left: 24px;

        color: #595959 !important;
        font-size: 16px;
        text-align: left;
        text-decoration: none;

        cursor: pointer;
        white-space: nowrap;
      }

      .exb-header-menus-link:hover {
        box-shadow: inset 0 -3px 0 0 rgba(0,121,193,.5);
        color: #000;
        fill: currentColor
      }

      .exb-submenu-arrow {
        margin-left: 5px;
        width: 20px;
        height: 20px;
      }

      .exb-header-menus-submenu {
        width: 420px;
        left: 0;
        padding: 15px 35px 35px 35px;
        box-shadow: inset 0 0 0 1px #e0e0e0;
        top: 100%;
        position: absolute;
        transition: opacity .25s ease-in-out;
        background-color: #f8f8f8;
        display: none;

        list-style-type: none;
        margin-top: 0;
        margin-bottom: 0;
        font-size: 0.9375rem;
        line-height: 1.5;
      }

      .exb-header-menus-subitem {
        margin: 0;
      }

      .exb-header-menus-sublink{
        padding-right: 30px;
        background-image: linear-gradient(90deg,${u?"#e0e0e0 50%,#0079c1 0":"#0079c1 50%,#e0e0e0 0"});
        background-position: 100% 100%;
        background-repeat: no-repeat;
        background-size: 200% 1px;
        color: #595959;
        cursor: pointer;
        display: block;
        font-size: 15px;
        line-height: 20px;
        position: relative;
        transition: background-position .25s;
        padding-top: 15px;
        padding-bottom: 15px;
        text-decoration: none;
      }

      .exb-header-menus-sublink:hover{
        background-position-x: left;
        color: #000;
        text-decoration: none;
      }

      .exb-header-menus-sublink:after{
        right: 20px;
        opacity: 0;
        position: absolute;
        width: 16px;
        height: 16px;
        transition: opacity .25s,transform .25s;
        content: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' fill='%230079c1'%3E%3Cpath d='M3 6.982h9.452L9.948 4.48l.707-.707L14.384 7.5l-3.729 3.729-.707-.707 2.54-2.54H3z'/%3E%3C/svg%3E");
        top: calc(50% - 16px / 2)
      }

      .exb-header-menus-sublink:hover:after{
        opacity: 1;
        transform: translateX(10px) ${u?"scaleX(-1)":null};
      }

      .icon-horizontal-revert {
        -moz-transform:scaleX(-1);
        -webkit-transform:scaleX(-1);
        -o-transform:scaleX(-1);
        transform:scaleX(-1);
    }
  `)},(0,e.jsx)("li",{className:"exb-header-menus-item"},(0,e.jsx)("button",{className:"exb-header-menus-link d-flex",id:"exb-header-menus-link-desktop",onClick:e=>{e.preventDefault(),e.stopPropagation(),g(),a.onShowMenuChanged(!a.isShowMenu)},type:"button","aria-owns":"exb-submenu","aria-controls":"exb-submenu",ref:i},"ArcGIS Experience Builder",(0,e.jsx)("img",{className:"exb-submenu-arrow",src:a.getImageUrl("assets/down.png")})),(0,e.jsx)("ul",{className:"exb-header-menus-submenu",id:"exb-submenu",ref:r,onClick:e=>{e.stopPropagation()},role:"listbox","aria-expanded":"false"},(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"https://www.esri.com/software/arcgis/arcgisonline","data-is508first":!0,onKeyDown:x},"ArcGIS Online")),(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"https://www.esri.com/arcgis/products/arcgis-pro/"},"ArcGIS Pro")),(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"https://www.esri.com/arcgis/products/arcgis-enterprise/"},"ArcGIS Enterprise")),(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"https://developers.arcgis.com/en/"},"ArcGIS for Developers")),(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"http://links.esri.com/arcgis-solutions/"},"ArcGIS Solutions")),(0,e.jsx)("li",{className:"exb-header-menus-subitem"},(0,e.jsx)("a",{className:"exb-header-menus-sublink",href:"http://marketplace.arcgis.com/","data-is508last":!0,onKeyDown:x},"ArcGIS Marketplace")))),(0,e.jsx)("li",{className:"exb-header-menus-item"},(0,e.jsx)("a",{className:"exb-header-menus-link",href:"https://www.esri.com/en-us/arcgis/products/arcgis-experience-builder/overview",target:"_blank"},n("landingOverView"))),(0,e.jsx)("li",{className:"exb-header-menus-item"},(0,e.jsx)("a",{className:"exb-header-menus-link",href:o,rel:"noopener noreferrer",target:"_blank"},n("landingHelp"))));var u}));class r extends e.React.PureComponent{constructor(t){super(t),this.getImageUrl=e=>this.props.context.folderUrl+"./dist/runtime/"+e,this.toSignIn=()=>{const t=window.location.search?`/${window.location.search}`:"/";e.SessionManager.getInstance().signIn({fromUrl:t,popup:!1})},this.showExbContent=()=>{this.setState({isPageLoaded:!0})},this.initPage=()=>{const e=new Image;e.src=this.getImageUrl("assets/landing-page.jpeg"),e.onload=()=>{this.showExbContent()},e.onerror=()=>{this.showExbContent()}},this.onShowMenuChanged=e=>{this.setState({isShowHeadMenu:e})},this.onWapperEscKey=e=>{"Esc"!==e.key&&"Escape"!==e.key||this.onShowMenuChanged(!1)},this.maskerRef=e.React.createRef(),this.state={isPageLoaded:!1,isShowHeadMenu:!1}}componentDidMount(){this.initPage()}render(){const s=(0,e.getAppStore)().getState().appContext.isRTL,n=this.props.intl.formatMessage({id:"landingSignIn",defaultMessage:t.landingSignIn});return(0,e.jsx)("div",{className:"w-100 h-100",css:(i=this.props.context.folderUrl,e.css`
    hr {
      box-sizing: content-box;
      height: 0;
      overflow: visible;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 400;
      -webkit-font-smoothing: antialiased;
    }
    button {
      background-color: transparent;
      border: none;
    }

    #landing-page {
      width: 100%;
      height: 100%;
      position: relative;

      align-items: center;
      overflow: auto;
    }

    /* 1.header */
    .exb-header-wrapper {
      position: relative;
      height: 56px;
      background: #fff;
      box-shadow: 0 1px 0 0 #e0e0e0;
      z-index: 101;

      animation: fadein 1s ease;
    }

    .exb-header {
      width: 1440px;
      max-width: 96vw;
      margin: 0 auto;
      height: 100%;
    }

    .exb-header * {
      box-sizing: border-box;
    }

    .exb-header-menus-masker {
      background-color: rgba(0,0,0,.5);
      opacity: 0;
      transition: opacity .25s ease-in-out;
      border-style: none;
      content: "";
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;
      position: fixed;
      width: 100%;
      height: 100%;
      -webkit-tap-highlight-color: transparent;
      transition: opacity .25s ease-in-out,visibility 0ms .25s;
      z-index: -1;
      top: 56px;
    }

    .icon-horizontal-revert {
      -moz-transform:scaleX(-1);
      -webkit-transform:scaleX(-1);
      -o-transform:scaleX(-1);
      transform:scaleX(-1);
    }

    /* 2.main content */
    .exb-main-bg {
      position: absolute;
      width: 100%;
      height: calc(100% - 56px);
      min-height: 800px; /* ,#14889 */

      background-image: url(${i+"./dist/runtime/assets/landing-page.jpeg"});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .exb-main-content {
      padding-top: 14vh;
      width: 100%;
    }

    .text-center {
      text-align: center;
    }

    .intro-transition {
      animation: fadeinAndUp .8s ease;
    }

    .intro-transition2 {
      animation: fadeinAndUp 1s ease;
    }

    .exb-logo {
      height: 90px;
      width: 90px;
    }

    .banner-title {
      color: #F4F7FF;
      font-size: 65px;
      letter-spacing: 1.35px;
      text-align: center;
      margin-top: 16px;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .banner-title h1 {
      margin: 8px;
      font-size: 65px;
    }

    .exb-line-break {
      margin: 0 auto;
      margin-bottom: 28px;
      margin-top: 15px;
      width: 60px;
      border-top: 3px solid rgba(255, 255, 255, .7);
    }

    .exb-heading-description {
      color: #F4F7FF;
      font-size: 18px;
      line-height: 1.5rem;
      padding: 0 29%;
      margin-bottom: 35px;
    }

    .exb-learn-more-link {
      color: #F4F7FF;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      font-size: 15px;
    }

    .exb-learn-more-link:hover {
      text-decoration: underline
    }

    .exb-sign-btn {
      height: 60px;
      padding: 20px 72px;
      font-size: 17px;
      border-radius: 0;
      background: #007F94;
      color: #F4F7FF;
      transition: all .3s linear;
      text-decoration: none;
      line-height: normal;
      cursor: pointer;
    }

    .exb-sign-btn:hover {
      background: #00AABB;
    }

    /* 3.footer */
    .exb-footer {
      position: absolute;
      width: 100%;
      height: 56px;
      background: #ffffff;
      text-align: center;
      color: #045E6C;
      bottom: 0;
      animation: fadein 1s ease;
      line-height: 1.5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .exb-footer-span {
      color: #045E6C;
      font-size: 13px;
    }

    .exb-footer-text {
      color: #045E6C;
      font-size: 13px;
      text-decoration: none;
    }

    .exb-footer-text:hover {
      text-decoration: underline;
    }

    /* 4.animation */
    @keyframes fadeinAndUp {
      0% {
        transform: translate(0, 40px);
        opacity: 0;
      }
      100% {
        transform: translate(0, 0);
        opacity: 1;
      }
    }

    @keyframes fadein {
      0% {
        opacity: 0;
      }
      20% {
        opacity: .30;
      }
      100% {
        opacity: 1;
      }
    }
  `),onClick:()=>{this.onShowMenuChanged(!1)},onKeyDown:this.onWapperEscKey},(0,e.jsx)("div",{id:"landing-page"},(0,e.jsx)("div",{className:"exb-header-wrapper"},(0,e.jsx)("div",{className:"exb-header"},(0,e.jsx)(a,{isShowMenu:this.state.isShowHeadMenu,onShowMenuChanged:this.onShowMenuChanged,maskerRef:this.maskerRef,isRTL:s,getImageUrl:this.getImageUrl}))),(0,e.jsx)("div",{className:"exb-main-bg"},(0,e.jsx)("div",{className:"exb-header-menus-masker",id:"exb-header-menus-masker",ref:this.maskerRef}),(0,e.jsx)("div",{className:"exb-main-content text-center"},(0,e.jsx)("div",{className:"intro-transition",style:{display:this.state.isPageLoaded?"block":"none"}},(0,e.jsx)("img",{className:"exb-logo",src:this.getImageUrl("assets/exb-logo.png"),alt:"ArcGIS Experience Builder"})),(0,e.jsx)("div",{className:"intro-transition2",style:{display:this.state.isPageLoaded?"block":"none"}},(0,e.jsx)("div",{className:"banner-title"},s&&(0,e.jsx)(e.React.Fragment,null,(0,e.jsx)("h1",null,"Builder"),(0,e.jsx)("h1",null,"Experience"),(0,e.jsx)("h1",{style:{position:"relative"}},"ArcGIS")),!s&&(0,e.jsx)(e.React.Fragment,null,(0,e.jsx)("h1",null,"ArcGIS"),(0,e.jsx)("h1",null,"Experience"),(0,e.jsx)("h1",{style:{position:"relative"}},"Builder"))),(0,e.jsx)("div",{className:"exb-line-break"}),(0,e.jsx)("p",{className:"exb-heading-description text-break"},this.props.intl.formatMessage({id:"landingProductDiscribe",defaultMessage:t.landingProductDiscribe})),(0,e.jsx)("a",{className:"exb-learn-more-link",href:"https://www.esri.com/en-us/arcgis/products/arcgis-experience-builder/overview"},this.props.intl.formatMessage({id:"landingLearnMore",defaultMessage:t.landingLearnMore}),(0,e.jsx)("img",{className:(0,e.classNames)("ml-2 mb-1 ",{"icon-horizontal-revert":s}),src:this.getImageUrl("assets/arrow.svg")})),(0,e.jsx)("div",{className:"d-flex justify-content-center",style:{marginTop:"50px"}},(0,e.jsx)("button",{type:"button",className:"exb-sign-btn d-flex align-items-center",onClick:this.toSignIn,"aria-label":n},n)))),(0,e.jsx)("div",{style:{position:"absolute",width:"100%",height:"56px",backgroundColor:"#ffffff",bottom:"0"}},(0,e.jsx)("div",{className:"exb-footer"},(0,e.jsx)("span",null,(0,e.jsx)("a",{href:"https://trust.arcgis.com",className:"exb-footer-text",target:"_blank"},this.props.intl.formatMessage({id:"landingTrustCenter",defaultMessage:t.landingTrustCenter})),(0,e.jsx)("span",{className:"exb-footer-span"},"\xa0\xa0|\xa0\xa0"),(0,e.jsx)("a",{href:"https://www.esri.com/en-us/legal/overview",className:"exb-footer-text",target:"_blank"},this.props.intl.formatMessage({id:"landingLegal",defaultMessage:t.landingLegal})),(0,e.jsx)("span",{className:"exb-footer-text"},"\xa0\xa0|\xa0\xa0"),(0,e.jsx)("a",{href:"http://www.esri.com/about-esri/contact",className:"exb-footer-text",target:"_blank"},this.props.intl.formatMessage({id:"landingContact",defaultMessage:t.landingContact}))))))));var i}}function o(e){n.p=e}})(),i})())}}}));