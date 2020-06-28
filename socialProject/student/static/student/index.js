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
        $.ajax({
            url: './index', 
            async: true,
            type: "POST",
            data: { 'group_No': 1, 'operation':'fetch'},
            datatype: 'json',
            error: function (xhr, message, errorTrown){
                console.log(message + errorTrown);
            },
            success: function (response){
                console.log("got json response");
                $('#group_No_change').text(1);
                $('#pj_name').text(response["projectname"]);
                $('#group_teacher').text(response["advisor"]);
                $('#group_member').html(response["members"]);
                $('#progress_value').text(response["progress_value"] + "%");
                $('.gtitle').text(response["projectname"]);
            }
        });
        var value = document.getElementById('progress_value').innerHTML;
        document.getElementById('progress_bar').style.width = value;
    }
    if (choice=='upload_pj'){
        hideAll();
        document.getElementById('upload_block').style.display = "flex"; //hide 歷屆專題資料
    }
    if (choice=='conne_teacher'){
        hideAll();
        document.location.href = "./chat"
    }
    if(choice=='calendar'){
        hideAll();
        document.location.href = "./calendar"
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
var pj_groupNo = 1;
//從資料庫讀取先前的資料，秀在html上
///.........
//讀取使用者修改的資料
function store(){
    console.log('store');    
    formElement = document.getElementById("profile-form");
    username = formElement[0].value;
    usergrade = formElement[1].value;
    usermail = formElement[2].value;
    var userphone = formElement[3].value;
    var userline = formElement[4].value;
    console.log(formElement[0].value);
    console.log(formElement[1].value);
    console.log(formElement[2].value);
    console.log(formElement[3].value);
    console.log(formElement[4].value);

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
            console.log("got json response");
            console.log(response);
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
            console.log("got json response");
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
    document.getElementById('upload_block').style.display = "none"; //hide 歷屆專題資料
}
function gettime(){
    var t = new Date();
    var month = t.getMonth() + 1;
    var currentTime = t.getFullYear()+'-'+month+'-'+t.getDate()+'  '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
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
            console.log(response);
            $('#pj_name').text(response["projectname"]);
            $('#group_teacher').text(response["advisor"]);
            $('#group_member').html(response["members"]);
            $('#progress_value').text(response["progress_value"] + "%");
            $('.gtitle').text(response["projectname"]);
            $('.text_motive_content').text('開發動機 ：'+response["pj_text_motive"]);
            $('.text_system_content').text('系統需求 ：'+response["pj_text_system"]);
        }
    });
    var value = document.getElementById('progress_value').innerHTML;
    document.getElementById('progress_bar').style.width = value;
}

// 上船專題檔案
function uploadfile(){
    var selectedFile = document.getElementById('loadfile').files[0];        
    if(selectedFile){
        console.log(selectedFile);
        // document.getElementById('loadtime').innerHTML= gettime();
        document.getElementById('showfilename').innerHTML= selectedFile.name;

        // objectURL = URL.createObjectURL(selectedFile);
        
        // document.getElementById('showfilename').setAttribute('href',objectURL)
        var ss = returnFileSize(selectedFile.size);
        alert('上傳成功 !\n ' + ss);  
        
      
        
    }
    else{
        alert('warning : 選擇上傳選檔案');
    }
    // console.log(selectedFile);
    
}

function savetext(){    
    var pj_name = document.getElementById('textvalue_1').value;
    var pj_Progress_rate = document.getElementById('text_rate').value;
    var pj_text_motive = document.getElementById('text2_input').value;
    var pj_text_system = document.getElementById('text3_input').value;
    var private_pj_name = Number(document.getElementById('text1').checked);
    var private_text_motive = Number(document.getElementById('text2').checked);
    var private_text_system = Number(document.getElementById('text3').checked);
    console.log(private_pj_name);
    $.ajax({
        url: './index',
        async: true,
        type: "POST",
    data: {'pj_groupNo' :pj_groupNo,
           'pj_name': pj_name, 
           'pj_Progress_rate': parseInt(pj_Progress_rate, 10),
           'pj_text_motive': pj_text_motive, 
           'pj_text_system': pj_text_system, 
           'private_pj_name': private_pj_name, 
           'private_text_motive': private_text_motive, 
           'private_text_system': private_text_system, 
           'operation':'storepj'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            console.log(response);
        }
    });
}
var mescount = 1;

function sendmessage(){
    var mes = document.getElementById('input_mes_text').value;
    console.log(mes);
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
    newElement_name.setAttribute('onclick','person(this.id)');
    newElement_name.setAttribute('href','#');
    newElement_name.setAttribute('value',username);
    newElement_name.setAttribute('id',username);
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
function returnFileSize(number) {
    if(number < 1024) {
      return number + ' bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + ' KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + ' MB';
    }
  }

function WriteToFile(text) {
   
    var fso = new ActiveXObject("Scripting.FileSystemObject");

    var fileFrom =document.getElementById("fileFrom").value;
    var fileTo =document.getElementById("fileTo").value;
    var file="Data"+fileFrom+"0000-"+fileTo+"0000.txt";
    var folder ="/text";
    var f=folder+file;

    var s = fso.CreateTextFile(f, true);
    s.WriteLine('<?xml version="1.0″ encoding="utf-8″ ?>');
    s.WriteLine(text);
    s.Close();
 }