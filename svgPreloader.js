var SVGPreloader = function ( canvas ){ 
    // fade time
    var appear_duration = 1000;

    
    this.inProgress = false;        

    // show preloader, hide other elements
    this.showPreloader = function(){
      if (!this.inProgress)
      {
        this.inProgress = true;    
        // create container
        this.elem = d3.select(canvas)
                      .append('g')
                        .attr('id', 'spinner-container')
                        .style('opacity', 0);
        var elem = this.elem;
        // insert animated elements
        createPreloader(elem);
        var nodes = d3.selectAll(canvas.children);
        nodes.transition()
            .duration(appear_duration)
            .style("opacity", function(){
                return (this === elem[0][0]) ? 1.0 : 0;
            });
      }        
    };

    // hide preloader, show other elements
    this.hidePreloader = function(){
      var nodes = d3.selectAll(canvas.children);
      var elem = this.elem;                
      nodes.transition()
         .duration(appear_duration)
         .style("opacity", function(){
            return (this === elem[0][0]) ? 0 : 1.0;
       })
         .each('end', function(){
            // delete animation element 
            elem.remove();
         });     
      this.inProgress = false;
    };

    // append container with spinner image
    function createPreloader(g){ 

      var width = 60,
          height = 60; 
      g.attr("width", width )
       .attr("height", height);

      // data for image
      var circles = [10, 11, 12, 13, 14];
      // animation duration
      var timeparam = 1000;
      // create animation elements according to data
      var circle = g.selectAll("circle")
        .data(circles)
        .enter()
          .append("circle")
          .attr("r", 4)
          .attr("cx", 30)
          .style("fill", "black");

      // start looping animation
      transition();

      function transition() {
        circle.data(circles)
            .transition()
              .duration(timeparam)                    
              .delay(function(d) { return d + (d - 10) * 100; })
              .attrTween("transform", translateFn())  // change coordinates process
              .each("end", transition);
      }   

      // move element around with rotation_radius
      function translateFn() {
        return function(d, i, a) {
          return function(t) {
            var t_x, t_y;
            var rotation_radius = 30;
            var t_angle = (2 * Math.PI) * t;
            var t_x = rotation_radius * Math.sin(t_angle) - 30;
            var t_y = -1 * rotation_radius * Math.cos(t_angle); 
            return "translate(" + (g.attr('width')/2 + t_x) + "," + (g.attr('height')/2  + t_y) + ")";
          };
        };
      }
      // return container 
      return g;
    };  

};