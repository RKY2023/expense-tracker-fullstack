# Blog-Posts-App
# expense-tracker-fullstack
express js

AWS to build to 
SQL
My sql workbench

NO SQL
sequelize, cors, bcrypt,  lib

SEQuelize
build save 
create(), destroy(), user.createExpense() => insert, user.addExpense() => update,
QA
why event on form onsubmit inside the fucntion
resilience
dedication
expenses

axios.setHeader


user decrpyt with secret key
jsonwebtoken

transaction
totalExpense in user > millions

npm i razorpay
npm i sib-api-v3-sdk
npm install uuid
npm i aws-sdk
npm i helmet  // header security
npm i compression 
npm i morgan
SSL / TLS encrypition

openssl
openssl req -nodes -new -x509 -keyout server.key -out server.cert
npm i https
Heroku - hoisting & git

curl --silent --location https://rpm.nodesource.com/setup_20.x | bash -
sudo yum -y install nodejs
sudo yum -y install git


npm i -g pm2

## Nginx install in AWS linux 2023 [https://awswithatiq.com/how-to-install-nginx-in-amazon-linux-2023/]
sudo dnf update -y
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl status nginx
sudo yum clean metadata

in nginx config
80/443 =>  reverse proxy localhost:3000
cd /etc/nginx/conf.d/
vi expensetracker.conf

##
server {
    listen      80 default_server;
    listen      [::]:80 default_server;
    server_name localhost;
    root        /usr/share/nginx/html;

    location / {
        proxy_pass http://127.0.0.1:3000; # your app's port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
pm2 start 

### Start web app in AWS
cd /home/ec2-user/expense-tracker-fullstack/
sudo systemctl start nginx
pm2 start app.js


##
## Issues
ACL
main.js, bootstrap.js
HEaders


