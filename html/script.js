var w = 750;
var h = 400;

var dataset;

var ranges;

var attributes = ['kills', 'deaths', 'assists', 'wardsPlaced']

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var yScale = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function gamesPlayed(data, day){
    var count = 0;
    for (i = 0; i<data.length; i++){
      if (data[i]['timeOfDay'] == day){
        count++;
      }
    }
    return count;
}

d3.csv("pobelter.csv", type, function(error, data) {

  if (error){
    console.log('Error uploading data');
  } else {
    console.log('Data uploaded successfully!');
  }

  data.forEach(function(d){d['kills'] = +d['kills'],
               d['assists'] = +d['assists'],
               d['deaths'] = +d['deaths']
               d['time'] = +d['time'],
               d['wardsPlaced'] = +d['wardsPlaced'],
               d['day'] = dayOfWeek(d['time']),
               d['date'] = dateStr(d['time']),
               d['timeOfDay'] = timeOfDay(d['time']),
               d['winner'] = d['winner']=="True"?1:0;});

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
        return "<strong>Games played:</strong> <span style='color:orange'>" + gamesPlayed(data, d[0]) + "</span>";});

  dataset = data;

  // var brush = d3.svg.brush()
 //     .x(xScale)
 //     .extent([.3, .9])
 //       .on("brushstart", brushstart)
 //     .on("brush", brushmove)
 //     .on("brushend", brushend);
    dayWins = winRate(dataset, 'timeOfDay');
    console.log(dayWins);

    svg.call(tip);
    
    xScale.domain(range(0,23));
    yScale.domain([0, 1]);

    chart.append("text")      // text label for the x axis
        .attr("x",  width/2)
        .attr("y",  height+margin.bottom+10)
        .style("text-anchor", "middle")
        .text("Hour of Day (0 = Midnight)");

    chart.append("text")      // text label for the y axis
        .attr("transform", "rotate(-90)")
        .attr("x",  -height/2-95)
        .attr("y",  -30)
        .text("Winrate (# wins / # games)");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll("rect")
        .data(dayWins, function(d) { return(d); })
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", function(d) { return isNaN(d[1])?yScale(0):yScale(d[1]);})
        .attr("height", function(d) {return isNaN(d[1])||d[1]==0?height-yScale(0.01):height-yScale(d[1]);})
        .attr("width", xScale.rangeBand())
        .style("fill", function(d) {return isNaN(d[1])?"red":"steelblue";})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var maxKills = d3.max(dataset.map(function(d) {return d['kills'];}));
    var maxDeaths = d3.max(dataset.map(function(d) {return d['deaths'];}));
    var maxAssists = d3.max(dataset.map(function(d) {return d['kills'];}));
    var maxWards = d3.max(dataset.map(function(d) {return d['wardsPlaced'];}));
    ranges = [[0, maxKills], [0, maxDeaths], [0, maxAssists], [0, maxWards]];

  $(function() {
    $( "#kills" ).slider({
      range: true,
      min:  0,
      max: maxKills,
      values: [ 0, maxKills ],
      slide: function( event, ui ) {
        $( "#killamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        filterData("kills", ui.values);
      }
    });
    $( "#killamount" ).val( $( "#kills" ).slider( "values", 0 ) +
      " - " + $( "#kills" ).slider( "values", 1 ) );
  });

  $(function() {
    $( "#deaths" ).slider({
      range: true,
      min:  0,
      max: maxDeaths,
      values: [ 0, maxDeaths ],
      slide: function( event, ui ) {
        $( "#deathamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        filterData("deaths", ui.values);
      }
    });
    $( "#deathamount" ).val( $( "#deaths" ).slider( "values", 0 ) +
      " - " + $( "#deaths" ).slider( "values", 1 ) );
  });

  $(function() {
    $( "#assists" ).slider({
      range: true,
      min:  0,
      max: maxAssists,
      values: [ 0, maxAssists ],
      slide: function( event, ui ) {
        $( "#assistamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        filterData("assists", ui.values);
      }
    });
    $( "#assistamount" ).val( $( "#assists" ).slider( "values", 0 ) +
      " - " + $( "#assists" ).slider( "values", 1 ) );
  });

  $(function() {
    $( "#wardsPlaced" ).slider({
      range: true,
      min:  0,
      max: maxWards,
      values: [ 0, maxWards ],
      slide: function( event, ui ) {
        $( "#wardamount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        filterData("wardsPlaced", ui.values);
      }
    });
    $( "#wardamount" ).val( $( "#wardsPlaced" ).slider( "values", 0 ) +
      " - " + $( "#wardsPlaced" ).slider( "values", 1 ) );
  });

});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

// Backend functions
function winLoss(data, a){
  var reduced = data.map(function(datum){
    return [datum[a], datum['winner']];
  })
  var wins = reduced.filter(function(x){return x[1] == 1}).map(function(x){return x[0]});
  var losses = reduced.filter(function(x){return x[1] == 0}).map(function(x){return x[0]});
  wins.sort(sortNumber);
  losses.sort(sortNumber);
  return [wins, losses];
}

function winRate(data, a){
  var wins = winLoss(data, a)[0];
  var losses = winLoss(data, a)[1];
  var xVals = range(d3.min(dataset.map(function(d){return d[a]})), d3.max(dataset.map(function(d){return d[a]})));
  var rates = [];
  for (i = 0; i<xVals.length; i++){
    val = xVals[i]
    w = 0;
    l = 0;
    for (x = 0; x<wins.length; x++){
      if (wins[x] == val){
        w++;
      }
    }
    for (y = 0; y<losses.length; y++){
      if (losses[y] == val){
        l++;
      }
    }
    if (w == 0 && l == 0){
      rates.push([val, NaN]);
    } else if (w==0){
      rates.push([val, 0])
    } else if (l == 0){
      rates.push([val, 1]);
    } else {
      rates.push([val,w/(w+l)]);
    }
  }
  return rates;
}
//Credit for most of these helper functions goes to stackoverflow contributors.
var range = function(start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }

    return range;

}

// Returns a unique set of values
function unique(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

function sortNumber(a, b){
  return a-b;
}

function dayOfWeek(ms){
  a = new Date(ms);
  return a.getDay();
}

function dateStr(ms){
  a = new Date(ms);
  return a.toLocaleDateString();
}

function timeOfDay(ms){
  a = new Date(ms);
  return a.getHours();
}

function filterData(attr, values){
  for (i = 0; i < attributes.length; i++){
    if (attr == attributes[i]){
      ranges[i] = values;
    }
  }
  var toVisualize = dataset.filter(function(d) { return isInRange(d)});
  update(toVisualize);
}

function isInRange(datum){
  for (i = 0; i < attributes.length; i++){
    if (datum[attributes[i]] < ranges[i][0] || datum[attributes[i]] > ranges[i][1]){
      return false;
    }
  }
  return true;
}

function update(dataset) {
  dayWins = winRate(dataset, 'timeOfDay');
  yScale.domain([0, 1]);

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
        return "<strong>Games played:</strong> <span style='color:orange'>" + gamesPlayed(dataset, d[0]) + "</span>";});

  svg.call(tip);

  var bar = chart.selectAll("rect")
    .data(dayWins, function(d) { return(d); });

  bar.exit().remove();

  bar.enter().append("rect")
    .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("y", function(d) { return isNaN(d[1])?yScale(0):yScale(d[1]);})
        .attr("height", function(d) {return isNaN(d[1])||d[1]==0?height - yScale(0.01):height-yScale(d[1]);})
        .attr("width", xScale.rangeBand())
        .style("fill", function(d) {return isNaN(d[1])?"red":"steelblue";})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

}