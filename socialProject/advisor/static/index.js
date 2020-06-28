var today = new Date();
var m = today.getMonth() + 1;
var d = today.getDate();
var limit_m = 6;
var start_d = 28;
var end_d = 30;
var showButton = false;
if (m == limit_m && d >= start_d && d <= end_d){
    showButton = true;
}
else{
    showButton = false;
}

function ifShow(){
    if(showButton){
        $('#judge').show();
    }
    else{
        $('#judge').hide();
    }
}

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
     var total = parseInt($(".opacity_degree .value").html())+parseInt($(".red_degree .value").html())+parseInt($(".green_degree .value").html())+parseInt($(".blue_degree .value").html());
     alert(total);
     showButton = false;
     $(".score").hide();
    }); 
});


function check(status) {
    console.log(status);
    if  (status == 'profile'){
        hideAll();
        document.getElementById('profile').style.display = "block";
    }
    
}
function click_dir(choice){
    console.log(choice);
    reductionDirColor();
    document.getElementById(choice).style.backgroundColor='blueviolet';
    if (choice=='show'){
        hideAll();

        
        document.getElementById('Previous-project').style.display = "flex"; //show 歷屆專題資料
    }
    if (choice=='cur_pj'){
        hideAll();
        document.getElementById('current_pj').style.display = "flex"; //hide 歷屆專題資料
        
    }
    if (choice=='calendar'){
        document.location.href = "./calendar";
    }
    // 導向聊天室頁面
    if (choice=='conne_teacher'){
        hideAll();
        document.location.href = "./chat"; 
    }
    if (choice=='judge'){
        hideAll();
        $(".score").show();
    }
}
// 讀取照片並且更換大頭貼
function readURL(input){    
    if(input.files && input.files[0]){  
        var imageTagID = input.getAttribute("targetID");  
        var reader = new FileReader();  
        reader.onload = function (e) {  
        var img = document.getElementById(imageTagID);  
            img.setAttribute("src", e.target.result)         
        }  
        reader.readAsDataURL(input.files[0]);  
    }
}
var username = $("#u_name").text()
var usergrade = 110
var usermail =''
var userphone =''
var userline =''
var choiceYear = '108'
var choiceGroup = '1'
//從資料庫讀取先前的資料，秀在html上
///.........
//讀取使用者修改的資料
function store(){
//     console.log('store');    
//     formElement = document.getElementById("profile-form");
//     username = formElement[0].value;
//     usermail = formElement[1].value;
//     var userphone = formElement[2].value;
//     var userline = formElement[3].value;
//     console.log(formElement[0].value);
//     console.log(formElement[1].value);
//     console.log(formElement[2].value);
//     console.log(formElement[3].value);
    var div = document.getElementById('profile'); 
    var attr = document.createAttribute('class'); 
    attr.value = 'cssClass1'; 
    div.setAttributeNode(attr);
}   
//存回資料庫
//.......

function choice_Y(status) { //選擇年分    
    choiceYear = status;
    console.log(status + '級');
    //更改html為選到的學年
    document.getElementById('year').innerHTML = status + '學年'; 
    reductionGroupColor();//將全部.group 背景都還原變成黑色
    // document.getElementById('show').style.backgroundColor='blueviolet';
    document.getElementById('Previous-project').style.display='flex';
    // 利用ajax獲取專題資料
    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: {'year': choiceYear + '級', 'group': 1, 'operation': 'pj'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            $('.pj-title').text(response["project_name"]);
            $('#pj-teacher').text("• 指導教授 : " + response["advisor"]);
            $('#pj-members').text("• 組員 : " + response["members"]);
            $('#pj-text').text("• 內容 : " + response["content"]);
        }
    });
    // 利用ajax獲取專題留言板資訊
    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: {'year': choiceYear + '級', 'group': 1, 'operation': 'mes'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            $('#message_board').html("<div class='mes_title'>留言板:</div>")
            var results = JSON.parse(response);
            for (i in results){
                $("#message_board").append(
                    "<div class='mes_bar'><a id='" + results[i]["username"] + "' href='#' onclick=\"person(this.id)\" class='mes_name'>" + results[i]["username"] + "</a><div class='mes_text'>" + results[i]["sentence"] + "</div><div class='mes_date'>" + results[i]["time"] +"</div></div>"
                    );
            }
        }
    });
}

function choice_G(status) {  //選擇組別
    choiceGroup = status;    //將選擇的組別儲存到變數中，用於之後資料庫呼叫
    reductionGroupColor();//將全部.group 背景都還原變成黑色
    
    console.log(choiceYear + "-" + status); 
    //將選到的group變色
    var group = 'group'+status;     
    document.getElementById(group).style.backgroundColor='#282828';
    document.getElementById('Previous-project').style.display='flex';

    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: {'year': choiceYear + '級', 'group': parseInt(choiceGroup, 10), 'operation': 'pj'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            $('.pj-title').text(response["project_name"]);
            $('#pj-teacher').text("• 指導教授 : " + response["advisor"]);
            $('#pj-members').text("• 組員 : " + response["members"]);
            $('#pj-text').text("• 內容 : " + response["content"]);
        }
    });

    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: {'year': choiceYear + '級', 'group': choiceGroup, 'operation': 'mes'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            $('#message_board').html("<div class='mes_title'>留言板:</div>")
            var results = JSON.parse(response);
            for (i in results){
                $("#message_board").append(
                    "<div class='mes_bar'><a id='" + results[i]["username"] + "' href='#' onclick=\"person(this.id)\" class='mes_name'>" + results[i]["username"] + "</a><div class='mes_text'>" + results[i]["sentence"] + "</div><div class='mes_date'>" + results[i]["time"] +"</div></div>"
                    );
            }
        }
    });
}

function reductionGroupColor(){       //將全部.group 背景都還原變成黑色
    const turnback = document.querySelectorAll('.group'); 
    for (const back of turnback) {
        back.style.backgroundColor='black';
    }
}

function reductionDirColor(){        //將全部.group 背景都還原變成黑色
    const turnback = document.querySelectorAll('.table_index'); 
    for (const back of turnback) {
        back.style.backgroundColor='rgb(212, 0, 255)';
    }
}

function hideAll(){
    document.getElementById('profile').style.display = "none";  //hide 個人資料
    document.getElementById('Previous-project').style.display = "none"; //hide 歷屆專題資料
    document.getElementById('current_pj').style.display = "none"; //hide 歷屆專題資料
    $(".score").hide(); //hide 評分頁面
}
function gettime(){
    var t = new Date();
    var month = t.getMonth() + 1;
    var currentTime = t.getFullYear()+'-'+month+'-'+t.getDate()+'  '+t.getHours()+':'+t.getMinutes();
    return currentTime;
    console.log(currentTime);
}

hideAll();

document.getElementById('cur_group_block').onscroll = function() {scroll()}; 

var groupNo = 1;     
function scroll(){    
    var hight = document.getElementById('cur_group_block').scrollTop;         
    groupNo = Math.round(hight/600) +1;
    document.getElementById('group_No_change').innerHTML=groupNo;
    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: { 'group_No': parseInt(groupNo, 10), 'operation':'fetch'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            console.log("got json response");
            $('#pj_name').text(response["projectname"]);
            $('#group_teacher').text(response["advisor"]);
            $('#group_member').html(response["members"]);
            $('#progress_value').text(response["progress_value"] + "%");
            $('.gtitle').text(response["projectname"]);
        }
    });
}

function savetext(){
    var c = document.getElementById('text1').checked;
    console.log(c);
}
var mescount = 1;
function sendmessage(){
    var mes = document.getElementById('input_mes_text').value;
    createNewMessage(mes,mescount);
    mescount += 1;
    $.ajax({
        url: './index', //請求的網址
        async: true,
        type: "POST",
        data: {'username': username, 'sentence':mes, 'year': choiceYear+'級', 'group':choiceGroup, 'operation': 'sendmes'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            
        }
    });
}

function createNewMessage(text, ID){
    var mesID = 'mes_bar' + ID;
    var newElement = document.createElement('div');
    var newElement_name = document.createElement('a');
    var newElement_text = document.createElement('div');
    var newElement_date = document.createElement('div');
    newElement.className = 'mes_bar';
    newElement.setAttribute('id',mesID);
    newElement_name.className = 'mes_name';
    newElement_name.setAttribute('id', username)
    newElement_name.setAttribute('href','#');
    newElement_name.setAttribute('onclick','person(this.id)');
    newElement_text.className = 'mes_text';
    newElement_date.className = 'mes_date';

    var newName = document.createTextNode(username);
    var newText = document.createTextNode(text);
    var newDate = document.createTextNode(gettime());
    newElement_name.appendChild(newName);
    newElement_text.appendChild(newText);
    newElement_date.appendChild(newDate);
    document.getElementById('message_board').appendChild(newElement);
    document.getElementById(mesID).appendChild(newElement_name);
    document.getElementById(mesID).appendChild(newElement_text);
    document.getElementById(mesID).appendChild(newElement_date);
}

// 得知點選的人是誰，來叫出他的個人資料
function person(name){  
    var find_name = name; 
    console.log(find_name);
    $.ajax({
        url: './index', 
        async: true,
        type: "POST",
        data: {'name': find_name, 'operation': 'getuser' },
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            console.log(response);
            $('#id_userphone').val(response["userphone"]);
            $('#id_userline').val(response["userline"]);
            $('#id_contactMail').val(response["contactMail"]);
        }
    });
    // document.getElementById('profile').style.display = "block";  
    document.getElementById('profile').classList.add('show_person_profile');
    document.getElementById('but_hide').style.display = 'none';
    
    setTimeout(function(){
        document.getElementById('Previous-project').setAttribute('onclick','hideprofile()');
        console.log('wait');    
    }, 100);
    

    
}
function hideprofile(){
    document.getElementById('Previous-project').removeAttribute('onclick','hideprofile()');
    console.log('hide_person');

    document.getElementById('profile').classList.remove('show_person_profile');
    document.getElementById('but_hide').style.display = 'block';
    
}

setInterval(ifShow, 1000); //每1秒更新一次


