

document.addEventListener('DOMContentLoaded', function () {
  
  var calendarEl = document.getElementById('calendar');
  var isallday,format1,format2,currentE;
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    customButtons: {
      myCustomButton: {
        text: '?!',
        click: function () {
          alert('點擊或選取即可完成操作!');
        }
      }
    },
    select: function(info) {
      isallday = info.allDay
      if(isallday){
        format1 = "YYYY/MM/DD"
        format2 = "YYYY-MM-DD"
        var end =  moment(info.end).subtract(1,'d').format(format1)
      }
      else{ 
        format1 = "YYYY/MM/DD HH:mm"
        format2 = "YYYY-MM-DD HH:mm"
        var end =  moment(info.end).format(format1)
      }
      // console.log(format)
      var start =  moment(info.start).format(format1)
      console.log(start,end)
      if(start == end){
        $('#date').val(start)   
      }else{
        $('#date').val(start+" - "+end)
      }
      $(".upper").html('Create new event')
      $(".subDiv .sub").show()
      $("#options").show()
    },
    eventClick: function(info) {
      currentE = info.event
      isallday = currentE.allDay
      if(isallday){
        format1 = "YYYY/MM/DD"
        format2 = "YYYY-MM-DD"
        var end =  moment(info.end).subtract(1,'d').format(format1)
      }
      else{ 
        format1 = "YYYY/MM/DD HH:mm"
        format2 = "YYYY-MM-DD HH:mm"
        var end =  moment(currentE.end).format(format1)
      }
      // console.log(format)
      var start =  moment(currentE.start).format(format1)
      console.log(start,end)
      if(start == end){
        $('#date').val(start)   
      }else{
        $('#date').val(start+" - "+end)
      }
      $(".upper").html('Delete event')
      $("#titol").val("Meeting")
      $(".delete").val("預約")
      // $(".subDiv .update").show()
      if (info.event.backgroundColor == "red"){
        $(".subDiv .delete").show()
      }
      $("#options").show()
      // change the border color just for fun
      info.el.style.borderColor = 'red';
    },
    headerToolbar: {
      left: 'prev,next today myCustomButton',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    selectable: true,
    editable: true,
    events: [{
    }]
  });
  $('#options .sub').on('click',function(){
    const date =  $("#date").val().split(' - ')
    s = moment(new Date(date[0]))
    console.log(date.length)
    if (isallday){
      if (date.length==1){
        e = moment(new Date(date[0])).add(1, 'days')
      }else{
        e = moment(new Date(date[1])).add(1, 'days')
      }
    }else{
      e = moment(new Date(date[1]))
    }
    
    // ===========================
    console.log(s.format(format2),e.format(format2))
    // ===========================
    calendar.addEvent({
      title: $("#titol").val(),
      start: s.format(format2),
      end:  e.format(format2),
      allDay: isallday,
      color:  $("#color").val()
    })
    $("#titol").val('')
    $(".subDiv .sub").hide();
    $("#options").hide();
  });
  // $('#options .update').on('click',function(){
  //   console.log(currentE.title)
  //   currentE.remove()
  //   $("#titol").val('')
  //   $(".subDiv .delete").hide();
  //   $(".subDiv .update").hide();
  //   $("#options").hide();
  // });
  $('#options .delete').on('click',function(){
    $.ajax({
      url: './calendar', 
      async: true,
      type: "POST",
      data: {
        'operation': 'meeting', 
        'start': moment(currentE.start).format(format2),
        'end': moment(currentE.end).format(format2),
        'group': 1,
      },
      datatype: 'json',
      error: function (xhr, message, errorTrown){
          console.log(message + errorTrown);
      },
      success: function (response){
          console.log(response);
          calendar.addEvent(response);
      }
    });
    currentE.remove()
    $("#titol").val('')
    $(".subDiv .delete").hide();
    // $(".subDiv .update").hide();
    $("#options").hide();
  });
  $(document).mouseup(function(e) 
  {
    var container = $("#options");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
      $(".subDiv .sub").hide();
      $(".subDiv .delete").hide()
      // $(".subDiv .update").hide()
      container.hide();
    }
  });
  calendar.render();
  $.ajax({
    url: './calendar', 
    async: true,
    type: "POST",
    data: {'operation': 'fetchTime'},
    datatype: 'json',
    error: function (xhr, message, errorTrown){
        console.log(message + errorTrown);
    },
    success: function (response){
        results = JSON.parse(response);
        for (i in results){
          calendar.addEvent(results[i])
        }
    }
  });
});
