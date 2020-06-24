# software-engineering
GPMS(畢業專題管理系統)

1. git clone https://github.com/xueyang0312/software-engineering.git
2. cd software-engineering
3. pip install -r requirements.txt
4. cd socialProject
5. python manage.py runserver
1. html都放各個module的templates裡面
2. js, css, 圖片放在static裡
3. html裡連結圖片和js,css方法如下:
   {% load static %}
   css:
    <link rel="stylesheet" href="{% static % 'yourcssname' %}/>
   js:
    <script src="{% static 'yourjsname' %}" defer></script>
   圖片:
    <link rel="icon" type="image/png" href="{% static 'images/yourimagename' %}" sizes="32x32" />
