



// TODO;
// implement scrollable datatable;
// incorporate enlisted SURF;
// DONE integrate bootstrap grids;
// Time in Service;
// bin dates into bigger resolution for performance;
// Top(45) location and RDTM grouping broken;

// Create the dc.js chart objects & link to div;

var tosChart = dc.barChart("#dc-TOS-chart")
var majChart = dc.barChart("#dc-MAJ-chart")
var tisChart = dc.barChart("#dc-TIS-chart")
var gradeChart = dc.rowChart("#dc-grade-chart")
var funccatChart = dc.rowChart("#dc-FC-chart")
var recordStatusChart = dc.rowChart("#dc-RS-chart")
var afscChart = dc.rowChart("#dc-AFSC-chart")
var dutyStatusChart = dc.rowChart("#dc-DS-chart")
var rdtmChart = dc.barChart("#dc-RDTM-chart")
var locationChart = dc.barChart("#dc-location-chart")
//var dataTable = dc.dataTable("#dc-data-table")

var width = 1140
var x;
// load data from a csv file



var data=DT.New;
  //console.log(data);
  // format our data
  // Process count of rdtm and location
  toprdtm = []
  var loc_obj = {}
  var rdtm_obj = {}
  var maj_obj = {}

  _.forEach(data, (d)=>{
    if (loc_obj.hasOwnProperty(d['LOCATION'])){
      loc_obj[d['LOCATION']] += 1
    }
    else{
      loc_obj[d['LOCATION']] = 1
    }
    if (rdtm_obj.hasOwnProperty(d['RDTM'])){
      rdtm_obj[d['RDTM']] += 1
    }
    else{
      rdtm_obj[d['RDTM']] = 1
    }
    if (maj_obj.hasOwnProperty(d['MAJ'])){
      maj_obj[d['MAJ']] += 1
    }
    else{
      maj_obj[d['MAJ']] = 1
    }
  })

  var dateParse = d3.time.format("%Y%m%d").parse
  data.forEach(function(d){
    d.DAS = dateParse(d.DAS)
    d.TAFMSD = dateParse(d.TAFMSD)

    // Estimated time on station
    d.TOS =  +d3.format('.1f')((new Date() - d.DAS) / (1000*60*60*24*30*12))

    // Estimated time in service
    d.TIS =  +d3.format('.1f')((new Date() - d.TAFMSD) / (1000*60*60*24*30*12))

    // push rdtm occuring less than 10 times into other
    d.RDTM2= rdtm_obj[d['RDTM']] < 10 ? 'OTHER' : d['RDTM']

    // push location occuring less than 15 times into other
    d.LOCATION2 = loc_obj[d['LOCATION']] < 15 ? 'OTHER' : d['LOCATION']

    d.MAJ = maj_obj[d['MAJ']] < 100 ? 'OTHER' : d['MAJ']
  })

  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(data)
  var all = facts.groupAll();
  
  // count all the facts
  dc.dataCount(".dc-data-count")
    .dimension(facts)
    .group(all) 

  // Date Arrived Station 
  var tosValue = facts.dimension(function (d){
    return d.TOS
  })

  var tosValueGroup = tosValue.group().reduceCount(function(d) {return d.TOS}) 

  //var DAS = data.map(function(x) { return new Date(x['DAS']) })
  //minDAS = new Date(Math.min.apply(null,DAS))
  //maxDAS = new Date(Math.max.apply(null,DAS))

  // TOS Bar Graph Counted
  tosChart.width(width/2)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(tosValue)
    .group(tosValueGroup)
    .transitionDuration(500)
    .centerBar(true)  
    .gap(72)  // 65 = norm
    .x(d3.scale.linear().domain([0, 15]))
    .elasticY(true)
    .xAxis().ticks(20)  

  // Total Active Federal Military Service
  var tisValue = facts.dimension(function(d){
    return d.TIS
  })

  var tisValueGroup = tisValue.group().reduceCount(function(d) { return d.TIS})


  // TIS Bar Graph Counted
  tisChart.width(width/2)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(tisValue)
    .group(tisValueGroup)
    .transitionDuration(500)
    .centerBar(true)  
    .gap(29)  // 65 = norm
    .x(d3.scale.linear().domain([0, 35]))
    .elasticY(true)
    .xAxis().ticks(20)  

  // Grade
  var grade = facts.dimension(function (d){
    return d.GRD
  })
  var gradeGroup = grade.group()

  // Manual ordering of grade
  gradeOrder = {'AB':0, 'AMN': 1, 'A1C': 2, 'SRA': 3, 'SSG': 4, 'TSG': 5, 'MSG': 6, 'SMS': 7, 'CMS': 8}
  gradeOrder = {'2LT':0, '1LT': 1, 'CPT': 2, 'MAJ': 3, 'LTC': 4, 'COL': 5, 'BG': 6, 'MG': 7, 'LTG': 8, 'GEN':9}

  gradeChart.width(width/3).height(350)

    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(grade)
    .group(gradeGroup)
    .colors(d3.scale.category10())
    .label(function (d){
       return d.key
    })
    .title(function(d){return d.value})
    .elasticX(true)
	.ordering(function(d){ 
      return gradeOrder[d.key]
    })
    .xAxis().ticks(4)

//MAj
var majValue = facts.dimension(function (d){
    return d.MAJ
 })

 var majValueGroup = majValue.group();
 
 var filteredMAJGroup = (function (majValueGroup) {return {
  all:function () {
    return majValueGroup.top(15).filter(function(d) {
      return d.key != "Not mentioned";
     });
  }
};})(majValueGroup);

   // MAJ Bar Graph
 majChart.width(width/2)
    .height(150)
     .margins({top: 10, right: 10, bottom: 50, left: 40})
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .dimension(majValue)
    .group(filteredMAJGroup)
    .elasticY(true)
	.ordering(function(d) { return -d.value})

  // AFSC
  var afsc = facts.dimension(function (d){
    return d['WORKBOOK_AFSC']
  })
  var afscGroup = afsc.group()
  
  var filteredAFSCGroup = (function (afscGroup) {return {
  all:function () {
    return afscGroup.top(15).filter(function(d) {
      return d.key != "Not mentioned";
     });
  }
};})(afscGroup);

  afscChart.width(width/3)
    .height(350)
    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(afsc)
    .group(filteredAFSCGroup)
    .colors(d3.scale.category20())
    .label(function (d){
       return d.key
    })
    .title(function(d){return d.value})
    .elasticX(true)
	.ordering(function(d) { return -d.value})
    .xAxis().ticks(4)


  // Functional Category
  var funccat = facts.dimension(function (d){
    return d['F_C_T']
  })
  var funccatGroup = funccat.group()

  funccatChart.width(width/3).height(300)

    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(funccat)
    .group(funccatGroup)
    .colors(d3.scale.category10())
    .label(function (d){
       return d.key
    })
    .title(function(d){return d.value})
    .elasticX(true)
    .ordering(function(d) { return -d.value})
    .xAxis().ticks(4)

  // Record Status
  var recordStatus = facts.dimension(function (d){
    return d['R_S_T']
  })
  var recordStatusGroup = recordStatus.group()

  recordStatusChart.width(width/3).height(300)

    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(recordStatus)
    .group(recordStatusGroup)
    .colors(d3.scale.category10())
    .label(function (d){
       return d.key
    })
    .title(function(d){return d.value})
    .elasticX(true)
    .ordering(function(d) { return -d.value})
    .xAxis().ticks(4)



  // Duty Status
  var dutyStatus = facts.dimension(function (d){
    return d['D_S_T']
  })
  var dutyStatusGroup = dutyStatus.group()

  dutyStatusChart.width(width/3)
    .height(300)
    .margins({top: 5, left: 10, right: 10, bottom: 20})
    .dimension(dutyStatus)
    .group(dutyStatusGroup)
    .colors(d3.scale.category20())
    .label(function (d){
       return d.key
    })
    .title(function(d){return d.value})
    .elasticX(true)
    .ordering(function(d) { return -d.value})
    .xAxis().ticks(4)

  var rdtmValue = facts.dimension(function(d){
    return d.RDTM2
  })

  var rdtmValueGroup = rdtmValue.group() 
  
   var filteredRDTMGroup = (function (rdtmValueGroup) {return {
  all:function () {
    return rdtmValueGroup.top(20).filter(function(d) {
      return d.key != "Not mentioned";
     });
  }
};})(rdtmValueGroup);

  rdtmChart.width(width)
    .height(300)
    .margins({top: 10, right: 10, bottom: 50, left: 40})
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .dimension(rdtmValue)
    .group(rdtmValueGroup)
    .elasticY(true)
	.ordering(function(d) { return -d.value})

  // Location
  var locationValue = facts.dimension(function (d){
    return d['LOCATION2']
  })
  var locationValueGroup = locationValue.group() 


function topN(source_group, n) {
	return {
		all: function () {
			return source_group.top(n);
		}
	};
}
  
  var fakeLoc = topN(locationValueGroup, 50);
  
  locationChart.width(width)
    .height(300)
    .margins({top: 10, right: 10, bottom: 100, left: 40})
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(false)
    .dimension(locationValueGroup)
    .group(fakeLoc)
    .elasticY(true)
	.elasticX(true)
	.ordering(function(d) { return -d.value})


  // Render the Charts
  dc.renderAll();
