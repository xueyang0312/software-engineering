
function Update(){ //更新網頁
    let user_name = document.querySelector('#user_name').textContent;
    $.ajax({
        url: './chat', //請求的網址
        async: true,
        type: "POST",
        data: {'operation': 'update'},
        datatype: 'json',
        error: function (xhr, message, errorTrown){
            console.log(message + errorTrown);
        },
        success: function (response){
            $("#chat_space").html("") //印之前先清空
            var results = JSON.parse(response)
            for(i in results){
                $("#chat_space").append(
                    "<div class='mes_bar'><a class='mes_name'>" + results[i]["username"] + "</a><div class='mes_text'>" + results[i]["sentence"] + "</div><div class='mes_date'>" + results[i]["time"] +"</div></div>"
                    );
            }
            
        }
    });
}


// var submit = document.getElementById('data');
// submit.addEventListener('click', getData);
setInterval(Update, 1000); //每1秒更新一次