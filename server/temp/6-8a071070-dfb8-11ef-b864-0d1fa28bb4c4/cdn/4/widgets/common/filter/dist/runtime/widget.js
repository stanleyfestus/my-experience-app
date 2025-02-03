System.register(["jimu-core","jimu-ui","jimu-ui/basic/sql-expression-runtime"],(function(e,t){var s={},i={},r={};return{setters:[function(e){s.BaseVersionManager=e.BaseVersionManager,s.DataSourceComponent=e.DataSourceComponent,s.DataSourceFilterChangeMessage=e.DataSourceFilterChangeMessage,s.DataSourceManager=e.DataSourceManager,s.DataSourceStatus=e.DataSourceStatus,s.Immutable=e.Immutable,s.MessageManager=e.MessageManager,s.React=e.React,s.SqlExpressionMode=e.SqlExpressionMode,s.appConfigUtils=e.appConfigUtils,s.classNames=e.classNames,s.css=e.css,s.dataSourceUtils=e.dataSourceUtils,s.defaultMessages=e.defaultMessages,s.getAppStore=e.getAppStore,s.jsx=e.jsx,s.lodash=e.lodash,s.moduleLoader=e.moduleLoader,s.polished=e.polished},function(e){i.Alert=e.Alert,i.Badge=e.Badge,i.Button=e.Button,i.Card=e.Card,i.Icon=e.Icon,i.Option=e.Option,i.Popper=e.Popper,i.Select=e.Select,i.Switch=e.Switch,i.WidgetPlaceholder=e.WidgetPlaceholder,i.applyMaxSizeModifier=e.applyMaxSizeModifier,i.defaultMessages=e.defaultMessages,i.getCustomFlipModifier=e.getCustomFlipModifier,i.maxSizeModifier=e.maxSizeModifier},function(e){r.SqlExpressionRuntime=e.SqlExpressionRuntime,r.getShownClauseNumberByExpression=e.getShownClauseNumberByExpression,r.getTotalClauseNumberByExpression=e.getTotalClauseNumberByExpression,r.updateSQLExpressionByVersion=e.updateSQLExpressionByVersion}],execute:function(){e((()=>{var e={52214:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" fill-rule="evenodd" d="M18.5.995c0-.55-.43-.995-.96-.995H2.46a.94.94 0 0 0-.605.223 1.02 1.02 0 0 0-.14 1.4L6.5 7.72c.122.156.196.347.212.548l.835 10.815q.011.139.058.27a.95.95 0 0 0 1.237.582l2.112-.82a.99.99 0 0 0 .615-.797l1.325-10.062c.025-.193.105-.374.228-.52l5.141-6.087c.154-.181.238-.414.238-.655M2.5 1h14.999l-5.141 6.09-.117.153a2 2 0 0 0-.34.883l-1.325 10.062-2.035.792-.833-10.788-.02-.169a2 2 0 0 0-.402-.92L2.502 1.006z" clip-rule="evenodd"></path></svg>'},35737:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="m14 4-6 8-6-8z"></path></svg>'},29435:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M14.938 8A7 7 0 0 1 1.01 9H0a8.001 8.001 0 0 0 15.938-1A8 8 0 0 0 1.02 3.98L1 .702a.5.5 0 1 0-1 .006L.031 5.9l5.128-.826a.5.5 0 0 0-.16-.987L1.819 4.6A7 7 0 0 1 14.938 8"></path></svg>'},79244:e=>{"use strict";e.exports=s},14321:e=>{"use strict";e.exports=i},76117:e=>{"use strict";e.exports=r}},t={};function a(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,a),r.exports}a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var s in t)a.o(t,s)&&!a.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.p="";var o={};return a.p=window.jimuConfig.baseUrl,(()=>{"use strict";a.r(o),a.d(o,{__set_webpack_public_path__:()=>E,default:()=>D});var e,t,s,i=a(79244);!function(e){e.Block="BLOCK",e.Inline="INLINE",e.Popper="POPPER"}(e||(e={})),function(e){e.Toggle="TOGGLE",e.Button="BUTTON"}(t||(t={})),function(e){e.Single="SINGLE",e.Group="GROUP",e.Custom="CUSTOM"}(s||(s={}));var r=a(14321),l=a(76117);const n=350;function p(e,t=!1){return t?i.css`
      ${e&&"\n        width: 350px;\n        height: 54px;\n      "}
    `:e?i.css`
        width: ${n}px;
        min-height: 54px;
        max-height: 300px;
        overflow-y: auto;
        padding: 0.5rem;
        .filter-item-custom .sql-expression-builder .sql-expression-container .sql-expression-list {
          max-height: unset;
        }
      `:i.css`
        width: 100% !important;
        height: 100% !important;
        max-height: 100vh;
      `}function u(t,s){var r;const a=(0,i.getAppStore)().getState().appContext.isRTL,o="200px",l="300px",n="350px",p=(null==s?void 0:s.arrangeType)===e.Inline&&(null===(r=null==s?void 0:s.filterItems)||void 0===r?void 0:r.length)>=2;return i.css`
    .filter-items-container, &.filter-items-container {
      overflow: auto;

      .filter-item {
        /* skip case: horizontal pill items */
        padding-bottom: ${p?0:"0.5rem"};

        &.filter-item-popper{
          margin: 0.5rem;
          min-width: ${l};
          max-width: ${n};
        }

        /** custom filter - start */
        &.filter-item-custom {
          &:has(.small-mode) {
            .filter-layer-select {
              width: 100%;
              min-width: 240px;
              .layer-select {
                margin-top: 4px;
              }
            }
          }
          &:has(.medium-mode), &:has(.large-mode) {
            .filter-layer-select {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-left: 6px;
              padding-right: 6px;
              .layer-label {
                width: 178px;
              }
              .layer-select {
                width: calc(100% - 186px);
              }
            }
          }
          .sql-expression-builder {
            .sql-expression-container {
              min-height: 110px;
              min-width: 240px;
              display: block !important;
              .sql-expression-list { /** not show scrolling bar for expr list inside widget */
                max-height: unset;
                height: unset;
                overflow-y: visible;
                .sql-expression-set {
                  display: block !important;
                }
              }
            }
          }
        }
        /** custom filter - end */

        .filter-item-inline {
          padding-bottom: 0.5rem;
          padding-top: 0.5rem;

          .filter-item-arrow{
            transform: rotate(${a?90:270}deg);
          }
          .filter-item-icon{
            margin-right: 0.5rem;

            &.no-arrow{
              margin-left: 0.5rem;
            }
          }
          .filter-item-name{
            font-size: ${i.polished.rem(13)};
            color: ${t.ref.palette.black};
            word-break: break-word;
            &.no-icons{
              margin-left: 0.5rem;
            }
            &.toggle-name{
              white-space: nowrap;
              margin-right: 0.5rem;
            }
          }

          /* sql-expression-styles - start */
          .sql-expression-inline{
            align-items: center;

            &.sql-expression-wrap{
              display: block !important;

              .sql-expression-builder{
                overflow-x: hidden;
                .sql-expression-container{
                  flex-wrap: wrap;
                  align-content: flex-start;
                  .sql-expression-set{
                    flex-wrap: wrap;
                  }
                }
              }

            }

            .sql-expression-builder{
              overflow-x: auto;
              .sql-expression-container{
                display: flex;
                .sql-expression-single{
                  margin-right: 0.5rem;
                  &:last-of-type{
                    margin-right: 0;
                  }
                  /* .clause-inline{
                    min-width: ${o};
                  }
                  .clause-block{
                    .sql-expression-input{
                      min-width: ${o};
                    }
                  }
                  .sql-expression-display-label{
                    min-width: ${o};
                  } */
                }
                .sql-expression-set{
                  display: flex;
                }
              }
            }

          }
          /* sql-expression-styles - end */

        }
      }

      .filter-item:last-child{
        padding-bottom: 0 !important;
      }

      &.filter-items-inline{
        max-width: 100vw;
        display: flex;
        .sql-expression-builder .sql-expression-container .sql-expression-single .sql-expression-input .pill-btn-container{
          .jimu-button-group {
            flex-wrap: nowrap;
            .pill-btn{
              overflow: visible;
            }
          }
        }

        &.filter-items-wrap{
          flex-wrap: wrap;
          align-content: flex-start;

          .sql-expression-builder .sql-expression-container .sql-expression-single .sql-expression-input .pill-btn-container{
            .jimu-button-group {
              flex-wrap: wrap;
            }
          }
        }
        .filter-item{
          /* padding: 0; */
          &.filter-item-popper{
            min-width: 300px;
            padding-bottom: 0.5rem;
            .filter-item-inline {
              padding-bottom: 0.5rem;
              padding-top: 0.5rem;
            }
          }
          .filter-item-inline{
            padding: 0;
            /* height: 100%; */
            overflow-y: auto;
            background-color: unset !important;
            border: none !important;

            .filter-expanded-container{
              width: ${l};
              padding-top: 0.5rem;
            }

            /* .filter-item-clause-pill{
              margin: 10px 5px;
              white-space: nowrap;
            } */

            /* .filter-popper-container{ */
              .filter-item-pill{
                margin: 10px 4px;
                white-space: nowrap;

                .sql-expression-single{
                  margin: 0;
                }

                &.filter-item-toggle-pill{
                  /* &:hover{
                    background-color: ${t.ref.palette.neutral[200]};
                  } */
                  display: flex;
                  flex-direction: row;
                  height: 32px;
                  align-items: center;
                  padding: 0 0.5rem;
                }
              /* } */
              /* .pill-display-label{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              } */
            }

            /*input editor width*/
            .sql-expression-builder{
              .sql-expression-container{
                .sql-expression-single{
                  .clause-inline{
                    .sql-expression-label{
                      margin-right: 0.5rem;
                      width: auto;
                      overflow: visible;
                    }
                    .sql-expression-input{
                      width: auto;
                    }

                  }
                  /* .clause-block{ */
                    .sql-expression-input{
                      min-width: ${o};
                      .double-number-picker{
                        min-width: ${l};
                      }
                      .double-datetime-picker{
                        min-width: ${n};
                      }
                    }
                  /* } */
                  .sql-expression-display-label{
                    white-space: nowrap;
                    padding-right: 0.5rem;
                    font-size: 13px;
                  }
                }
              }
            }

          }
        }
      }

      &.filter-items-popup{
        min-width: ${l};
        max-width: ${n};
      }

      .apply-cancel-group{
        white-space: nowrap;
        overflow: visible;
      }


    }

    .filter-reset-container{
      display: flex;
      &.bottom-reset {
        margin-top: 0.5rem;
        justify-content: flex-end;
      }
      &.right-reset {
        height: fit-content;
        margin-top: 10px;
        margin-left: 0.5rem;
        margin-right: 0.25rem;
      }
    }
  `}var c=a(35737),d=a.n(c),h=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const g=e=>{const t=window.SVG,{className:s}=e,r=h(e,["className"]),a=(0,i.classNames)("jimu-icon jimu-icon-component",s);return t?i.React.createElement(t,Object.assign({className:a,src:d()},r)):i.React.createElement("svg",Object.assign({className:a},r))},m=[(0,r.getCustomFlipModifier)({fallbackPlacements:["top","left","right"],useClosestVerticalPlacement:!0}),r.maxSizeModifier,r.applyMaxSizeModifier],f=Object.assign({},i.defaultMessages,r.defaultMessages);class x extends i.React.PureComponent{constructor(a){super(a),this.loadSqlExpressionBuilder=()=>{this.props.config.type!==s.Custom||this.state.SqlExpressionBuilder||i.moduleLoader.loadModule("jimu-ui/advanced/sql-expression-builder").then((e=>{this.setState({SqlExpressionBuilder:null==e?void 0:e.SqlExpressionBuilder})}))},this.getSqlExprObjFromItem=()=>{const{selectedDs:e,config:t}=this.props;let r=t.sqlExprObj;return t.type===s.Group&&(r=i.dataSourceUtils.getDisplayedSQLExpressionFromGroupSQLExpression(t.sqlExprObjForGroup,e,this.formatMessage)),r},this.formatMessage=(e,t)=>this.props.intl.formatMessage({id:e,defaultMessage:f[e]},t),this.getOutPutWidgetLabel=()=>{var e;return null===(e=(0,i.getAppStore)().getState().appConfig.widgets[i.appConfigUtils.getWidgetIdByOutputDataSource(this.props.useDataSource)])||void 0===e?void 0:e.label},this.getAppliedState=()=>{let e=this.props.config.autoApplyWhenWidgetOpen||!1;return this.props.omitInternalStyle&&1===this.endUserClausesNum&&1===this.clausesNumConfigured&&(e=!0),e},this.onCollapsedChange=()=>{this.setState({collapsed:!this.state.collapsed})},this.onApplyChange=e=>{this.setState({sqlChanged:!1}),this.props.onChange(this.props.id,this.props.selectedDs,this.state.sqlExprObj,e)},this.onToggleChange=e=>{this.setState({applied:e}),this.onApplyChange(e)},this.onPillClick=(e,t)=>{if(e)this.setState({popperVersion:this.state.isOpen?this.state.popperVersion:this.state.popperVersion+1}),this.onTogglePopper();else{const e=t.className.indexOf("active")<0;this.onToggleChange(!!e)}},this.onSqlExpressionChange=(e,s)=>{var i;const{omitInternalStyle:r,id:a,selectedDs:o,triggerType:l,onChange:n}=this.props;let p=o,u=(null===(i=this.getSqlExprObjFromItem())||void 0===i?void 0:i.sql)!==(null==e?void 0:e.sql);s&&(p=s,u=!0),this.setState({sqlExprObj:e,sqlChanged:!(l!==t.Button||r||!u)}),(s||l===t.Toggle||r)&&n(a,p,e,this.state.applied)},this.onTogglePopper=()=>{this.state.isOpen&&i.lodash.defer((()=>{this.pillButton.focus()})),this.setState({isOpen:!this.state.isOpen})},this.getFilterItem=(a,o=!1)=>{const{config:l,triggerType:n,arrangeType:p,filterNum:u,omitInternalStyle:c,wrap:d}=this.props,{icon:h,name:m,type:f}=l;return(0,i.jsx)("div",{className:"h-100"},(0,i.jsx)("div",{className:(0,i.classNames)("d-flex justify-content-between w-100 pr-2 align-items-center",o?"flex-row-reverse":"")},!o&&a&&(0,i.jsx)(r.Button,{"aria-label":this.formatMessage(this.state.collapsed?"expand":"collapse"),size:"sm",icon:!0,type:"tertiary",className:"jimu-outline-inside",onClick:this.onCollapsedChange},(0,i.jsx)(g,{className:this.state.collapsed?"filter-item-arrow":"",size:"s"})),!o&&h&&(0,i.jsx)("div",{className:(0,i.classNames)("filter-item-icon",a?"":"no-arrow")},(0,i.jsx)(r.Icon,{icon:h.svg,size:h.properties.size,"aria-hidden":"true"})),!o&&(0,i.jsx)("div",{className:(0,i.classNames)("filter-item-name flex-grow-1",a||h?"":"no-icons")},m),n===t.Toggle&&(0,i.jsx)("div",{className:"ml-1 d-flex align-items-center"},this.getToggle())),(this.state.sqlExprObj||f===s.Custom)&&(0,i.jsx)("div",{className:(0,i.classNames)("w-100 pl-6 pr-6",{"d-none":this.state.collapsed,"sql-expression-inline":p===e.Inline&&1===u&&c,"sql-expression-wrap":p===e.Inline&&1===u&&d})},this.getSqlExpression()),n===t.Button&&(0,i.jsx)("div",{className:"d-flex justify-content-end pl-5 pr-5 pt-2 pb-2"},this.getApplyButtons()))},this.isDataSourceError=()=>null===this.props.selectedDs,this.isOutputFromWidget=()=>{var e;return null===(e=this.props.selectedDs)||void 0===e?void 0:e.getDataSourceJson().isOutputFromWidget},this.isOutputDataSourceValid=()=>this.isOutputFromWidget()&&!this.props.isNotReadyFromWidget,this.isOutputDataSourceInvalid=()=>this.isOutputFromWidget()&&this.props.isNotReadyFromWidget,this.isDataSourceValid=()=>this.props.selectedDs&&(this.isOutputFromWidget()&&!this.props.isNotReadyFromWidget||!this.isOutputDataSourceInvalid()),this.isDataSourceLoadingOrInvalid=()=>!this.isDataSourceValid(),this.getErrorIcon=()=>{if(this.isDataSourceError())return(0,i.jsx)(r.Alert,{variant:"text",form:"tooltip",size:"small",type:"error",text:this.formatMessage("dataSourceCreateError"),className:"mr-2"});if(this.isOutputDataSourceInvalid()){const e=this.formatMessage("outputDataIsNotGenerated",{outputDsLabel:this.props.selectedDs.getLabel(),sourceWidgetName:this.state.outputWidgetLabel});return(0,i.jsx)(r.Alert,{variant:"text",form:"tooltip",size:"small",type:"warning",text:e,className:"mr-2"})}return null},this.getToggle=()=>(0,i.jsx)(i.React.Fragment,null,this.getErrorIcon(),(0,i.jsx)(r.Switch,{checked:this.state.applied,disabled:this.isDataSourceLoadingOrInvalid(),"aria-label":this.props.config.name,onChange:e=>{this.onToggleChange(e.target.checked)}})),this.getApplyButtons=()=>(0,i.jsx)("div",{className:"w-100 d-flex justify-content-end apply-cancel-group"},this.getErrorIcon(),(0,i.jsx)(r.Button,{type:"primary",className:"filter-apply-button wrap",disabled:this.isDataSourceLoadingOrInvalid()||!(!this.state.applied||this.state.sqlChanged),onClick:()=>{this.onApplyChange(!0)}},this.formatMessage("apply")),(0,i.jsx)(r.Button,{type:"default",className:"filter-cancel-button ml-2",disabled:this.isDataSourceLoadingOrInvalid()||!this.state.applied,onClick:()=>{this.onApplyChange(!1)}},this.formatMessage("cancel"))),this.getTriggerNodeForClauses=(e=this.props.triggerType)=>{let s=null;switch(e){case t.Toggle:s=this.getToggle();break;case t.Button:s=this.getApplyButtons()}return s},this.getSqlExpression=()=>this.isDataSourceValid()?this.props.config.type===s.Custom?this.getCustomSqlExpressionBuilder():(0,i.jsx)(l.SqlExpressionRuntime,{widgetId:this.props.widgetId,dataSource:this.props.selectedDs,expression:this.state.sqlExprObj,onChange:this.onSqlExpressionChange}):null,this.getCustomSqlExpressionBuilder=()=>{const{widgetId:e,config:s,triggerType:a,dataSources:o,selectedDs:l}=this.props;return(0,i.jsx)("div",null,(0,i.jsx)("div",{className:"filter-layer-select mt-3 mb-3"},(0,i.jsx)("div",{className:"layer-label"},this.formatMessage("selectLayer")),(0,i.jsx)(r.Select,{className:"layer-select",title:(null==l?void 0:l.getLabel())||"",value:l.id,onChange:e=>{this.state.applied&&s.sqlExprObj&&this.onSqlExpressionChange(null,l),setTimeout((()=>{this.setState({applied:a!==t.Button&&this.state.applied},(()=>{this.onSqlExpressionChange(null,o[e.target.value])}))}),0)}},s.useDataSources.map((e=>{var t;const s=null===(t=o[e.dataSourceId])||void 0===t?void 0:t.getLabel();return(0,i.jsx)(r.Option,{key:e.dataSourceId,value:e.dataSourceId,active:l.id===e.dataSourceId},s)})))),l&&this.state.SqlExpressionBuilder&&(0,i.jsx)(this.state.SqlExpressionBuilder,{mode:i.SqlExpressionMode.Simple,widgetId:e,dataSource:l,forceUpdateExpression:!0,expression:this.state.sqlExprObj,onChange:this.onSqlExpressionChange}))},this.getTriggerNodeForWrapClauses=e=>e===this.props.triggerType&&this.isSingleFilterAndMultipleClauses()&&this.props.wrap&&(0,i.jsx)("div",{className:"d-flex flex-row-reverse"},this.getTriggerNodeForClauses(e)),this.getTriggerNodeForNoWrapClause=()=>this.isSingleFilterAndMultipleClauses()&&!this.props.wrap&&(0,i.jsx)("div",{className:"ml-4"},this.getTriggerNodeForClauses());const{collapseFilterExprs:o}=this.props.config,n=this.getSqlExprObjFromItem();this.endUserClausesNum=(0,l.getShownClauseNumberByExpression)(n),this.clausesNumConfigured=(0,l.getTotalClauseNumberByExpression)(n),this.state={isOpen:!1,applied:this.getAppliedState(),collapsed:o,sqlExprObj:n,sqlChanged:!1,outputWidgetLabel:this.getOutPutWidgetLabel(),popperVersion:1,SqlExpressionBuilder:null}}componentDidMount(){this.loadSqlExpressionBuilder()}componentDidUpdate(e,t){const{config:s,logicalOperator:i,omitInternalStyle:r,useDataSource:a,selectedDs:o}=this.props,n=this.getSqlExprObjFromItem();this.endUserClausesNum=(0,l.getShownClauseNumberByExpression)(n),this.clausesNumConfigured=(0,l.getTotalClauseNumberByExpression)(n),e.config!==s||e.selectedDs!==o?(this.setState({applied:this.getAppliedState(),collapsed:e.config.collapseFilterExprs!==s.collapseFilterExprs?s.collapseFilterExprs:this.state.collapsed,sqlExprObj:o?n:null,outputWidgetLabel:a.dataSourceId===e.useDataSource.dataSourceId?this.state.outputWidgetLabel:this.getOutPutWidgetLabel()}),this.loadSqlExpressionBuilder()):e.logicalOperator===i&&e.omitInternalStyle===r||this.setState({applied:this.getAppliedState()})}isSingleFilterAndMultipleClauses(){return 1===this.props.filterNum&&this.clausesNumConfigured>1&&this.endUserClausesNum>=1}isSingleFilterAndSingleShownClause(){return 1===this.props.filterNum&&1===this.clausesNumConfigured&&1===this.endUserClausesNum}isMultipleFiltersAndSingleShownClause(){return this.props.filterNum>1&&1===this.clausesNumConfigured&&1===this.endUserClausesNum}render(){const{config:a,arrangeType:o,triggerType:l,omitInternalStyle:p,wrap:c,theme:d}=this.props,{name:h,icon:g,type:f}=a,x=f===s.Custom,S=x||this.endUserClausesNum>=1;return(0,i.jsx)("div",{className:(0,i.classNames)("filter-item",{"filter-item-custom":x}),role:"group","aria-label":h},(0,i.jsx)(r.Card,{className:"filter-item-inline"},o===e.Block?(0,i.jsx)("div",{className:"w-100"},p&&(this.isSingleFilterAndSingleShownClause()||this.isMultipleFiltersAndSingleShownClause())?(0,i.jsx)("div",{className:"w-100 pl-6 pr-6"},this.getSqlExpression()):(0,i.jsx)("div",{className:"filter-expanded-container"},this.getFilterItem(S))):(0,i.jsx)(i.React.Fragment,null,this.isSingleFilterAndSingleShownClause()?(0,i.jsx)("div",{className:"sql-expression-inline d-flex"},this.getSqlExpression(),!p&&(0,i.jsx)("div",{className:"ml-4"},this.getTriggerNodeForClauses())):(0,i.jsx)(i.React.Fragment,null,this.isSingleFilterAndMultipleClauses()||this.isMultipleFiltersAndSingleShownClause()&&p?(0,i.jsx)("div",{className:(0,i.classNames)("sql-expression-inline d-flex",{"sql-expression-wrap":c,"filter-item-pill":this.isMultipleFiltersAndSingleShownClause()})},this.getTriggerNodeForWrapClauses(t.Toggle),this.getSqlExpression(),this.getTriggerNodeForWrapClauses(t.Button),this.getTriggerNodeForNoWrapClause()):(0,i.jsx)("div",{className:"filter-popper-container"},l!==t.Toggle||0!==this.endUserClausesNum||x?(0,i.jsx)("div",{className:"filter-item-pill h-100 nowrap"},(0,i.jsx)(r.Button,{className:(0,i.classNames)("",{"frame-active":this.state.applied}),title:h,ref:e=>{this.pillButton=e},type:"default","aria-pressed":this.state.applied,onClick:e=>{this.onPillClick(S,this.pillButton)}},g&&(0,i.jsx)(r.Icon,{icon:g.svg,size:g.properties.size}),h)):(0,i.jsx)(r.Card,{className:"filter-item-pill filter-item-toggle-pill"},g&&(0,i.jsx)(r.Icon,{icon:g.svg,size:g.properties.size,className:"mr-1"}),(0,i.jsx)("div",{className:"filter-item-name toggle-name"},h),this.getToggle()),S&&(0,i.jsx)(r.Popper,{open:this.state.isOpen,toggle:this.onTogglePopper,modifiers:m,showArrow:!0,reference:this.pillButton,version:this.state.popperVersion,autoFocus:this.state.popperVersion>1,forceLatestFocusElements:l===t.Button},(0,i.jsx)("div",{className:"filter-items-container",css:u(d),style:{width:n}},(0,i.jsx)("div",{className:(0,i.classNames)("filter-item filter-item-popper",{"filter-item-custom":x})},(0,i.jsx)(r.Card,{className:"filter-item-inline"},this.getFilterItem(S,o!==e.Popper))))))))))}}var S=function(e,t,s,i){return new(s||(s=Promise))((function(r,a){function o(e){try{n(i.next(e))}catch(e){a(e)}}function l(e){try{n(i.throw(e))}catch(e){a(e)}}function n(e){var t;e.done?r(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,l)}n((i=i.apply(e,t||[])).next())}))};class y extends i.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.1.0",description:"",upgrader:s=>S(this,void 0,void 0,(function*(){return yield function(e){return S(this,void 0,void 0,(function*(){const t=[],s=i.DataSourceManager.getInstance();return e&&e.forEach((e=>{e.sqlExprObj&&t.push(s.createDataSourceByUseDataSource(Object.assign({},e.dataSource,{mainDataSourceId:e.dataSource.dataSourceId})))})),Promise.all(t)}))}(s.filterItems).then((i=>{let r=s;r=r.set("arrangeType",e.Block),r=r.set("triggerType",t.Toggle),r=r.set("wrap",!1),r=r.set("omitInternalStyle",!1);const a=i.map(((e,t)=>{const s=r.filterItems[t];return Object.assign({},s,{sqlExprObj:s.sqlExprObj?(0,l.updateSQLExpressionByVersion)(s.sqlExprObj,"1.1.0",e):null,icon:s.icon.setIn(["properties","color"],null),useDataSource:Object.assign({},s.dataSource,{mainDataSourceId:s.dataSource.dataSourceId})})}));return r=r.set("filterItems",a),r}))}))},{version:"1.14.0",description:"",upgrader:e=>{const t=e.filterItems.map((e=>e=e.set("isGroup",!1).set("useDataSources",[e.useDataSource]).without("useDataSource")));return e.set("filterItems",t)}},{version:"1.16.0",description:"",upgrader:e=>{const t=e.filterItems.map((e=>e.set("type",e.isGroup?"GROUP":"SINGLE").without("isGroup")));return e.set("filterItems",t)}}]}}const v=new y,w="Filter";class b extends i.React.PureComponent{constructor(){super(...arguments),this.onDataSourceCreated=e=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,e)},this.onDataSourceInfoChange=e=>{this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,null==e?void 0:e.status)},this.onCreateDataSourceFailed=()=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null)}}componentWillUnmount(){this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null),this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,i.DataSourceStatus.NotReady)}render(){const{useDataSource:e}=this.props;return(0,i.jsx)(i.DataSourceComponent,{useDataSource:e,onDataSourceCreated:this.onDataSourceCreated,onCreateDataSourceFailed:this.onCreateDataSourceFailed,onDataSourceInfoChange:this.onDataSourceInfoChange})}}var I=a(29435),j=a.n(I),C=function(e,t){var s={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(s[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)t.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(s[i[r]]=e[i[r]])}return s};const N=e=>{const t=window.SVG,{className:s}=e,r=C(e,["className"]),a=(0,i.classNames)("jimu-icon jimu-icon-component",s);return t?i.React.createElement(t,Object.assign({className:a,src:j()},r)):i.React.createElement("svg",Object.assign({className:a},r))},q=a(52214);class O extends i.React.PureComponent{constructor(a){super(a),this.onFilterItemChange=(e,t,i,r)=>{if(this.__unmount)return;const a=this.state.filterItems;let o=a[e].set("autoApplyWhenWidgetOpen",r);if(o.type===s.Single)o=o.set("sqlExprObj",i);else if(o.type===s.Custom){const e=o.useDataSources.map((e=>Object.assign({},e,{checked:e.dataSourceId===t.id})));o=o.set("sqlExprObj",i).set("useDataSources",e)}else o.sqlExprObjForGroup&&(o=o.setIn(["sqlExprObjForGroup","0","clause","valueOptions","value"],i.parts[0].valueOptions.value));const l=a.set(e,o);this.setState({filterItems:l});if(!(!r&&!a[e].autoApplyWhenWidgetOpen)){const e={};if(e[t.id]=t,o.type===s.Group&&o.sqlExprObjForGroup){o.useDataSources.map((e=>e.dataSourceId)).forEach((t=>{e[t]=this.state.dataSources[t]}))}this.setSqlToAllDs(e,l)}},this.setSqlToAllDs=(e=this.state.dataSources,t=this.props.config.filterItems)=>{const s=[];Object.keys(e).forEach((i=>{var r,a;const o=e[i];if(o){const e=(null===(a=null===(r=o.getInfo().widgetQueries)||void 0===r?void 0:r[this.props.id])||void 0===a?void 0:a.where)||"",i=this.getQuerySqlFromDs(o,t);this.setSqlToDs(o,i),e!==i.sql&&s.push(o.id)}})),s.length>0&&this.publishFilterMessage(s)},this.setSqlToDs=(e,t)=>{var s,i;if((!this._autoApplyInit||""!==t.sql)&&e){const r={where:t.sql,sqlExpression:t.sqlExpression};null===(i=(s=e).updateQueryParams)||void 0===i||i.call(s,r,this.props.id)}},this.publishFilterMessage=e=>{i.MessageManager.getInstance().publishMessage(new i.DataSourceFilterChangeMessage(this.props.id,e))},this.getQuerySqlFromDs=(e,t=this.props.config.filterItems)=>{const r=[];t.forEach((t=>{if(t.autoApplyWhenWidgetOpen||this.props.config.omitInternalStyle&&1===(0,l.getShownClauseNumberByExpression)(t.sqlExprObj)){const a=t.type===s.Group?i.dataSourceUtils.getSQLExpressionFromGroupSQLExpression(t.sqlExprObjForGroup,e):t.useDataSources.filter((t=>t.dataSourceId===(null==e?void 0:e.id))).length&&t.sqlExprObj;if(a){const t=i.dataSourceUtils.getArcGISSQL(a,e);t.sql&&r.push(t.sqlExpression)}}}));let a=r[0]||null;return r.length>1&&(a=i.dataSourceUtils.getMergedSQLExpressions(r,e,this.props.config.logicalOperator)),{sql:(null==a?void 0:a.sql)||"",sqlExpression:a}},this.getDataSourceById=e=>{const t=this.props.useDataSources.asMutable({deep:!0}).filter((t=>t.dataSourceId===e));return(0,i.Immutable)(t[0])},this.isDataSourceRemoved=e=>{var t;return 0===(null===(t=this.props.useDataSources)||void 0===t?void 0:t.filter((t=>e===t.dataSourceId)).length)},this.onResetChange=()=>{this.setState({filterItems:this.props.config.filterItems}),this.setSqlToAllDs()},this.showResetAtBottom=(t,s,i,r)=>{let a=!0;return t&&s===e.Inline&&!i&&(r.length>1||1===r.length&&0===(0,l.getShownClauseNumberByExpression)(r[0].sqlExprObj))&&(a=!1),a},this.getItemUseDs=e=>{let t=e.useDataSources[0];return e.type===s.Custom?t=e.useDataSources.filter((e=>e.checked))[0]||t:e.type===s.Group&&e.sqlExprObjForGroup&&(t=e.useDataSources.filter((t=>t.dataSourceId===e.sqlExprObjForGroup[0].dataSourceId))[0]),t},this.getFilterItems=(a,o=e.Block,l=!1,n=!1)=>{const p=this.showResetAtBottom(a.resetAll,o,l,a.filterItems);return(0,i.jsx)("div",{className:(0,i.classNames)("w-100 h-100 d-flex justify-content-between",p?"flex-column":"flex-row"),css:u(this.props.theme,this.props.config)},(0,i.jsx)("div",{className:(0,i.classNames)("w-100 filter-items-container",o&&a.arrangeType===e.Inline?"filter-items-inline":"",l?"filter-items-wrap":"",n?"filter-items-popup":"")},this.state.filterItems.map(((e,t)=>{const r=this.getItemUseDs(e),n=this.isDataSourceRemoved(r.dataSourceId)?null:this.state.dataSources[r.dataSourceId],p=this.state.outputDataSourceIsNotReady[r.dataSourceId];return(0,i.jsx)(x,{key:t,id:t,widgetId:this.props.id,intl:this.props.intl,selectedDs:n,useDataSource:r,dataSources:e.type===s.Custom&&this.state.dataSources,isNotReadyFromWidget:p,logicalOperator:a.logicalOperator,config:e,arrangeType:o,triggerType:a.triggerType,wrap:l,omitInternalStyle:a.omitInternalStyle,filterNum:this.state.filterItems.length,onChange:this.onFilterItemChange,itemBgColor:this.props.theme.ref.palette.neutral[400],theme:this.props.theme})}))),a.resetAll&&(0,i.jsx)("div",{className:(0,i.classNames)("filter-reset-container",p?"bottom-reset":"right-reset")},(0,i.jsx)(r.Button,{icon:!0,type:"default",size:"default",className:"reset-button",style:{borderRadius:a.triggerType===t.Toggle?"16px":null},title:this.props.intl.formatMessage({id:"resetAllFilters",defaultMessage:r.defaultMessages.resetAllFilters}),"aria-label":this.props.intl.formatMessage({id:"resetAllFilters",defaultMessage:r.defaultMessages.resetAllFilters}),onClick:this.onResetChange},(0,i.jsx)(N,null))))},this.onShowPopper=()=>{this.setState({isOpen:!this.state.isOpen,popperVersion:this.state.isOpen?this.state.popperVersion:this.state.popperVersion+1})},this.onTogglePopper=()=>{this.setState({isOpen:!1}),this.widgetIconRef.focus()},this.checkIfAnyFiltersApplied=()=>{var e;const{omitInternalStyle:t}=this.props.config,r=((null===(e=this.state)||void 0===e?void 0:e.filterItems)||this.props.config.filterItems).some((e=>{var r,a,o;const n=e.type===s.Group?i.dataSourceUtils.getSQLExpressionFromGroupSQLExpression(e.sqlExprObjForGroup,this.state.dataSources[null===(r=e.sqlExprObjForGroup)||void 0===r?void 0:r[0].dataSourceId]):e.sqlExprObj;if(e.type!==s.Custom&&t&&1===(0,l.getTotalClauseNumberByExpression)(n)&&1===(0,l.getShownClauseNumberByExpression)(n)){const t=e.type===s.Group?null===(o=this.state.dataSources[null===(a=e.sqlExprObjForGroup)||void 0===a?void 0:a[0].dataSourceId])||void 0===o?void 0:o.id:e.useDataSources[0].dataSourceId;return""!==(this.state.dataSources[t]?i.dataSourceUtils.getArcGISSQL(n,this.state.dataSources[t]).sql:n.sql)}return e.autoApplyWhenWidgetOpen}));return r},this.onIsDataSourceNotReady=(e,t)=>{this.setState((s=>{var r;if(!(null===(r=s.dataSources[e])||void 0===r?void 0:r.getDataSourceJson().isOutputFromWidget))return;const a=Object.assign({},s.outputDataSourceIsNotReady);return a[e]=t===i.DataSourceStatus.NotReady,{outputDataSourceIsNotReady:a}}))},this.onCreateDataSourceCreatedOrFailed=(e,t)=>{this.setState((s=>{const i=Object.assign({},s.dataSources);return i[e]=t,{dataSources:i}}))},this.applyAutoFiltersAtStart=()=>{var e;if(this._autoApplyInit){Object.keys(this.state.dataSources).map((()=>!0)).length===(null===(e=this.props.useDataSources)||void 0===e?void 0:e.length)&&setTimeout((()=>{this.setSqlToAllDs(),this._autoApplyInit=!1}),0)}},this.__unmount=!1,this.index=0,this._autoApplyInit=!0,this.state={popperVersion:1,isOpen:!1,filterItems:this.props.config.filterItems,dataSources:{},outputDataSourceIsNotReady:{}}}componentWillUnmount(){this.__unmount=!0;const e=[];Object.keys(this.state.dataSources).forEach((t=>{var s,i;const r=this.state.dataSources[t];r&&(null===(i=null===(s=r.getInfo().widgetQueries)||void 0===s?void 0:s[this.props.id])||void 0===i?void 0:i.where)&&(null==r||r.updateQueryParams(null,this.props.id),e.push(r.id))})),e.length>0&&this.publishFilterMessage(e)}componentDidUpdate(e,t){this.__unmount||(this._autoApplyInit=!1,e.config!==this.props.config?(this.setState({filterItems:this.props.config.filterItems}),this.setSqlToAllDs()):this.state.dataSources!==t.dataSources&&(this._autoApplyInit=!0,this.applyAutoFiltersAtStart()))}render(){var s;const{config:a,icon:o,label:l}=this.props,u=this.props.controllerWidgetId&&this.props.offPanel;return 0===this.state.filterItems.length?(0,i.jsx)(r.WidgetPlaceholder,{icon:q,widgetId:this.props.id,css:p(u),message:this.props.intl.formatMessage({id:"_widgetLabel",defaultMessage:w})}):(0,i.jsx)("div",{className:"jimu-widget widget-filter overflow-auto"},null===(s=this.props.useDataSources)||void 0===s?void 0:s.map(((e,t)=>(0,i.jsx)(b,{key:t,useDataSource:e,onIsDataSourceNotReady:this.onIsDataSourceNotReady,onCreateDataSourceCreatedOrFailed:this.onCreateDataSourceCreatedOrFailed}))),a.arrangeType!==e.Popper||u?(0,i.jsx)("div",{css:p(u)},this.getFilterItems(a,u?e.Block:a.arrangeType,a.wrap)):(0,i.jsx)("div",{className:"filter-widget-popper"},(0,i.jsx)(r.Badge,{dot:!0,className:"m-1",hideBadge:!this.checkIfAnyFiltersApplied(),color:"primary"},(0,i.jsx)(r.Button,{icon:!0,size:"sm",className:"filter-widget-pill h-100",ref:e=>{this.widgetIconRef=e},title:l,type:"tertiary",onClick:this.onShowPopper,"aria-pressed":this.checkIfAnyFiltersApplied(),"aria-haspopup":"dialog"},(0,i.jsx)(r.Icon,{icon:"string"==typeof o?o:o.svg,size:16,color:"string"==typeof o?"":o.properties.color}))),this.state.popperVersion>1&&(0,i.jsx)(r.Popper,{open:this.state.isOpen,version:this.state.popperVersion,keepMount:!0,toggle:this.onTogglePopper,showArrow:!0,modifiers:m,forceLatestFocusElements:!0,reference:this.widgetIconRef},(0,i.jsx)("div",{className:"p-2",style:{width:n}},this.getFilterItems(a,e.Block,!1,!0),!a.resetAll&&a.triggerType===t.Button&&(0,i.jsx)(r.Button,{className:"sr-only"})))))}}O.versionManager=v;const D=O;function E(e){a.p=e}})(),o})())}}}));