# ewdUpLoad
file uploads from Web client to Server for ewd.js, sample Test version.

### Setup Instructions


(1) This ewdUpLoad requires the formidable in node.js. Please install from npm.

       cd ~/ewdjs
       npm install formidable@latest


(2) Change directory to ewd application directory in your ewdjs setup e.g. ~/ewdjs/www/ewd/


(3) Do git clone https://github.com/casiopea/ewdUpLoad.git


(4) Move the ewdUpLoad.js to your node_modules directory. e.g. /home/youruser/ewdjs/node_modules/


## Running ewdUpLoad

Start the new, improved ewdUpLoad using the usual URL:

       http://xx.xx.xx.xx:8080/ewd/ewdUpLoad/index.html

## upLoad directry and upload file infomation


upload directory is /tmp/ewdupload/"sessionID"/


upload file infomation are ^%zewdUpLoad global.


e.g.

     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_37efe93ef7898b2177","lastModifiedDate")="Thu Sep 03 2015 14:26:12 GMT+0900 (JST)"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_37efe93ef7898b2177","name")="gtmandewdjsSetup.exe"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_37efe93ef7898b2177","path")="/tmp/ewdupload/9999/upload_37efe93ef7898b2177"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_37efe93ef7898b2177","size")=711152
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_37efe93ef7898b2177","type")="application/x-msdownload"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_d05090a6b35a1663eb","lastModifiedDate")="Thu Sep 03 2015 14:25:40 GMT+0900 (JST)"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_d05090a6b35a1663eb","name")="gtmewdjsinstall.exe"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_d05090a6b35a1663eb","path")="/tmp/ewdupload/9999/upload_d05090a6b35a1663eb"
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_d05090a6b35a1663eb","size")=2130028
     ^%zewdUpLoad("session",9999,"/tmp/ewdupload/9999/upload_d05090a6b35a1663eb","type")="application/x-msdownload"








