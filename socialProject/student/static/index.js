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
    if (choice=='upload_pj'){
        hideAll();
        document.getElementById('upload_block').style.display = "flex"; //hide 歷屆專題資料
    }
    if (choice=='conne_teacher'){
        hideAll();
        
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
var username = '翁晟洋'
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
}

function choice_G(status) {  //選擇組別
    choiceGroup = status;    //將選擇的組別儲存到變數中，用於之後資料庫呼叫
    reductionGroupColor();//將全部.group 背景都還原變成黑色
    
    console.log(choiceYear + "-" + status); 
    //將選到的group變色
    var group = 'group'+status;     
    document.getElementById(group).style.backgroundColor='#282828';
    document.getElementById('Previous-project').style.display='flex';
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
    var currentTime = t.getFullYear()+'-'+t.getMonth()+'-'+t.getDate()+'  '+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
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
    if (groupNo == 2){
        document.getElementById('pj_name').innerHTML='家有女友';
        document.getElementById('group_teacher').innerHTML='劉育瑋獸慾';
        document.getElementById('group_member').innerHTML='F1065511 陽菜<br>D1065511 瑠衣<br>A1065511 流石景<br>A1065511 藤井夏生<br>';
        document.getElementById('progress_bar').style.width='80%';
        document.getElementById('progress_value').innerHTML='80%';
    }
    else if (groupNo == 3){
        
    }
}
// 上船專題檔案
function uploadfile(){
    var selectedFile = document.getElementById('loadfile').files[0];
    
    
    if(selectedFile){
        console.log(selectedFile);
        document.getElementById('loadtime').innerHTML= gettime();
        document.getElementById('showfilename').innerHTML= selectedFile.name;
        alert('上傳成功!!');
    }
    else{
        alert('選檔案啦，媽的智障是不是');
    }
    // console.log(selectedFile);
    
}

function savetext(){
    var c = document.getElementById('text1').checked;
    console.log(c);
}
var mescount = 1;
function sendmessage(){
    var mes = document.getElementById('mes_text').value;
    console.log(mes);
    createNewMessage(mes,mescount);
    mescount += 1;
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

