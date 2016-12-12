/*! banana-fusion - v1.6.15 - 2016-12-12
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/hits/module",["angular","app","underscore","jquery","kbn","jquery.flot","jquery.flot.pie"],function(a,b,c,d,e){"use strict";var f=a.module("kibana.panels.hits",[]);b.useModule(f),f.controller("hits",["$scope","$q","$timeout","timer","querySrv","dashboard","filterSrv",function(b,d,e,f,g,h,i){function j(){this.type="count",this.field="",this.decimalDigits=2,this.label="",this.value=0}b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Stable",description:"Showing stats like count, min, max, and etc. for the current query including all the applied filters."};var k={queries:{mode:"all",ids:[],query:"*:*",basic_query:"",custom:""},style:{"font-size":"10pt"},arrangement:"horizontal",chart:"total",counter_pos:"above",donut:!1,tilt:!1,labels:!0,spyable:!0,show_queries:!0,metrics:[new j],refresh:{enable:!1,interval:2}};c.defaults(b.panel,k),b.init=function(){b.hits=0,b.panel.refresh.enable&&b.set_timer(b.panel.refresh.interval),b.$on("refresh",function(){b.get_data()}),b.get_data()},b.set_timer=function(a){b.panel.refresh.interval=a,c.isNumber(b.panel.refresh.interval)?(f.cancel(b.refresh_timer),b.realtime()):f.cancel(b.refresh_timer)},b.realtime=function(){b.panel.refresh.enable?(f.cancel(b.refresh_timer),b.refresh_timer=f.register(e(function(){b.realtime(),b.get_data()},1e3*b.panel.refresh.interval))):f.cancel(b.refresh_timer)},b.addMetric=function(){b.panel.metrics.push(new j)},b.removeMetric=function(a){b.panel.metrics.length>1&&(b.panel.metrics=c.without(b.panel.metrics,a))},b.get_data=function(){if(delete b.panel.error,b.panelMeta.loading=!0,0!==h.indices.length){b.sjs.client.server(h.current.solr.server+h.current.solr.core_name);var a=b.sjs.Request().indices(h.indices);b.panel.queries.ids=g.idsByMode(b.panel.queries),c.each(b.panel.queries.ids,function(c){var d=b.sjs.FilteredQuery(g.getEjsObj(c),i.getBoolFilter(i.ids));a=a.facet(b.sjs.QueryFacet(c).query(d)).size(0)}),b.populate_modal(a);var e="";i.getSolrFq()&&(e="&"+i.getSolrFq());var f="&stats=true";c.each(b.panel.metrics,function(a){a.field&&(f+="&stats.field="+a.field)});var j="&wt=json",k="&rows=0",l=[];b.data=[],b.hits=0,b.panel.queries.query="",c.each(b.panel.queries.ids,function(c){var d=g.getQuery(c)+e+f+j+k;b.panel.queries.query+=d+"\n",a=null!==b.panel.queries.custom?a.setQuery(d+b.panel.queries.custom):a.setQuery(d),l.push(a.doSearch())}),d.all(l).then(function(a){c.each(h.current.services.query.ids,function(d,e){return b.panelMeta.loading=!1,c.each(a[e].stats.stats_fields,function(a,d){c.each(b.panel.metrics,function(b){b.field===d&&(b.value=a[b.type].toFixed(b.decimalDigits))})}),c.isUndefined(a[e].error)?void b.$emit("render"):void(b.panel.error=b.parse_error(a[e].error))})})}},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.panel.refresh.enable&&b.set_timer(b.panel.refresh.interval),b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")},b.populate_modal=function(c){b.inspector=a.toJson(JSON.parse(c.toString()),!0)}}]),f.directive("hitsChart",["querySrv",function(b){return{restrict:"A",link:function(f,g){function h(){g.css({height:f.panel.height||f.row.height});try{c.each(f.data,function(a){a.label=a.info.alias,a.color=a.info.color})}catch(a){return}try{"bar"===f.panel.chart&&(f.plot=d.plot(g,f.data,{legend:{show:!1},series:{lines:{show:!1},bars:{show:!0,fill:1,barWidth:.8,horizontal:!1},shadowSize:1},yaxis:{show:!0,min:0,color:"#c8c8c8"},xaxis:{show:!1},grid:{borderWidth:0,borderColor:"#eee",color:"#eee",hoverable:!0},colors:b.colors})),"pie"===f.panel.chart&&(f.plot=d.plot(g,f.data,{legend:{show:!1},series:{pie:{innerRadius:f.panel.donut?.4:0,tilt:f.panel.tilt?.45:1,radius:1,show:!0,combine:{color:"#999",label:"The Rest"},stroke:{width:0},label:{show:f.panel.labels,radius:2/3,formatter:function(a,b){return"<div ng-click=\"build_search(panel.query.field,'"+a+'\') "style="font-size:8pt;text-align:center;padding:2px;color:white;">'+a+"<br/>"+Math.round(b.percent)+"%</div>"},threshold:.1}}},grid:{hoverable:!0,clickable:!0},colors:b.colors}))}catch(a){g.text(a)}}f.$on("render",function(){h()}),a.element(window).bind("resize",function(){h()});var i=d("<div>");g.bind("plothover",function(a,b,c){if(c){var d="bar"===f.panel.chart?c.datapoint[1]:c.datapoint[1][0][1];i.html(e.query_color_dot(c.series.color,20)+" "+d.toFixed(0)).place_tt(b.pageX,b.pageY)}else i.remove()})}}}])});