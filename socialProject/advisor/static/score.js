$(function(){
    $("#Oralslider").slider({
    range: "min",    
    min: 0,
    max: 50,
    slide: function(e, ui) {
    //   var val=$("#slider").slider("value");   //使用 value 方法取值
      $("#Oralvalue div").html("口頭成績: "+ui.value+"pt");
      }
    });
    $("#Demoslider").slider({
        range: "min",    
        min: 0,
        max: 50,
        slide: function(e, ui) {
        //   var val=$("#slider").slider("value");   //使用 value 方法取值
        $("#Demovalue div").html("實作成績: "+ui.value+"pt");
        }
    });
    $(".sub").on('click',function(){
        alert($("#Oralslider").slider("option", "value"))
        alert($("#Demoslider").slider("option", "value"))
    });
    function hexFromRGB(r, g, b) {
        var hex = [
          r.toString( 16 ),
          g.toString( 16 ),
          b.toString( 16 )
        ];
        $.each( hex, function( nr, val ) {
          if ( val.length === 1 ) {
            hex[ nr ] = "0" + val;
          }
        });
        return hex.join( "" ).toUpperCase();
      }
      function refreshSwatch() {
        var opacity = $( "#opacity" ).slider( "value" ),
          red = $( "#red" ).slider( "value" ),
          green = $( "#green" ).slider( "value" ),
          blue = $( "#blue" ).slider( "value" ),
          hex = hexFromRGB( red, green, blue );
          $(".opacity_degree .value").html(Math.ceil(opacity/255*40));
          $(".red_degree .value").html(Math.ceil(red/255*20));
          $(".green_degree .value").html(Math.ceil(green/255*20));
          $(".blue_degree .value").html(Math.ceil(blue/255*20));
        $( "#swatch" ).css( "background-color", "#" + hex );
        // $("#swatch").css("color","#"+ hexFromRGB( 255-red, 255-green, 255-blue ))
        $( "#swatch" ).css( "opacity", opacity/255);
      }
      
      $( "#red, #green, #blue,#opacity" ).slider({
        orientation: "horizontal",
        range: "min",
        max: 255,
        value: 127,
        slide: refreshSwatch,
        change: refreshSwatch
    });
    $('#prompt').on('click',function(){
      $('.promptDiv').show()
    });
    $(document).mouseup(function(e) 
    {
    var container = $(".promptDiv");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
    });
    $('#swatch').on('click',function(){
      // $(".opacity_degree .value").html(Math.ceil(opacity/255*40));
      // $(".red_degree .value").html(+Math.ceil(red/255*20));
      // $(".green_degree .value").html(+Math.ceil(green/255*20));
      // $(".blue_degree .value").html(+Math.ceil(blue/255*20));
     alert($(".opacity_degree .value").html()+" "+$(".red_degree .value").html()+" "+$(".green_degree .value").html()+" "+$(".blue_degree .value").html())
    }); 
});