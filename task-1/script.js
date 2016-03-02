var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

//Global dispatcher
var globalDispatch = d3.dispatch('changetime','changestation');

//Crossfilter
var trips;

//Module 1: small time series
var cw = d3.select('.context').node().clientWidth,
    ch = d3.select('.context').node().clientHeight;
var timeChart1 = d3.TimeChart()
    .width(cw).height(ch).margin([30,0,0,0])
    .interval(d3.time.week)
    .value(function(d){return d.startTime});
var plotContext = d3.select('.context').datum([]).call(timeChart1);


//Module 2: large time series
var timeChart2 = d3.TimeChart()
    .width(w).height(h).margin([20,0,20,40])
    .interval(d3.time.week)
    .value(function(d){return d.startTime});
var plotFocus = d3.select('.plot').datum([]).call(timeChart2);



d3_queue.queue()
    .defer(d3.csv,'../data/hubway_trips_reduced.csv',parse)
    .defer(d3.csv,'../data/hubway_stations.csv',parseStations)
    .await(dataLoaded);

function dataLoaded(err,rows,stations){
    timeChart1.range( d3.extent(rows, function(d){return d.startTime}));
    plotContext.datum(rows)
        .call(timeChart1);

    timeChart2.range( d3.extent(rows, function(d){return d.startTime}));
    plotFocus.datum(rows)
        .call(timeChart2);
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

function parseStations(s){
    d3.select('.start')
        .append('option')
        .html(s.station)
        .attr('value', s.id);
    d3.select('.end')
        .append('option')
        .html(s.station)
        .attr('value', s.id);
}

