d3.TimeChart = function(){

    var w = 800,
        h = 600,
        m = {t:0,r:0,b:0,l:0},
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        scaleX = d3.time.scale(),
        scaleY = d3.scale.linear(),
        timeRange = [new Date(), new Date()],
        interval = d3.time.day,
        layout = d3.layout.histogram(),
        valueAccessor = function(d){ return d;};

    var exports = function(_selection){
        //recalculate width, height, scales, layout
        chartW = w - m.l - m.r;
        chartH = h - m.t - m.b;
        scaleX = d3.time.scale().domain(timeRange).range([0,chartW]);
        scaleY = d3.scale.linear().range([chartH,0]);

        var bins = interval.range(timeRange[0],timeRange[1]);
        bins.push(timeRange[1]);
        layout
            .range(timeRange)
            .bins(bins)
            .value(valueAccessor);

        _selection.each(draw);
    }

    function draw(array){
        var data = layout(array),
            maxY = d3.max(data, function(d){return d.y})*1.1;
        scaleY.domain([0, maxY]);

        var svg = d3.select(this).selectAll('svg').data([array]);

        //when DOM is drawn for the firs time
        var svgEnter = svg.enter().append('svg').attr('width',w).attr('height',h);
        svgEnter.append('g').attr('transform','translate('+ m.l+','+ m.t+')').attr('class','chart');
        svgEnter.append('g').attr('transform','translate('+ m.l+','+ m.t+')').attr('class','brush');

        //bars
        var bars = svg.select('.chart')
            .selectAll('.bar')
            .data( layout(array), function(d,i){return i});

        bars.enter().append('rect').attr('class','bar');
        bars.exit().remove();

        bars.transition()
            .attr('x',function(d){return scaleX(d.x)})
            .attr('y',function(d){return scaleY(d.y)})
            .attr('height',function(d){return chartH - scaleY(d.y)})
            .attr('width',function(d){
                var time2 = d.x.getTime() + d.dx;
                return scaleX(time2) - scaleX(d.x);
            });
    }

    exports.width = function(_x){
        if(!arguments.length) return w;
        w = _x;
        return this;
    }
    exports.height = function(_x){
        if(!arguments.length) return h;
        h = _x;
        return this;
    }
    exports.range = function(_r){
        //type of _r --> [a, b] where a and b are Date objects
        if(!arguments.length) return timeRange;
        timeRange = _r;
        return this;
    }
    exports.interval = function(_i){
        //type of _i --> d3.time object
        if(!arguments.length) return interval;
        interval = _i;
        return this;
    }
    exports.value = function(_v){
        //type of _v --> value accessor function
        if(!arguments.length) return valueAccessor;
        valueAccessor = _v;
        return this;
    }
    exports.margin = function(_m){
        if(!arguments.length) return [m.t, m.r, m.b, m.l];
        m.t = _m[0];m.r = _m[1];m.b = _m[2];m.l = _m[3];
        return this;
    }

    return exports;
}