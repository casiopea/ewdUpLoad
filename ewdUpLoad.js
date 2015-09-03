

var fs = require('fs');
var crypto = require('crypto');

var password = {
  encrypt: function(password) {
    if (!password || password === '') return {error: 'Missing or invalid password'};
    var salt = crypto.randomBytes(64);
    var iterations = 10000;
    var keyLength = 64;
    var encrypted = crypto.pbkdf2Sync(password, salt, iterations, keyLength);
    return {
      type: 'password',
      hash: encrypted.toString('base64'),
      salt: salt.toString('base64')
    };
  },
  matches: function(fromUser, credentials) {
    var iterations = 10000;
    var keyLength = 64;
    var salt = new Buffer(credentials.salt, 'base64');
    var encrypted = crypto.pbkdf2Sync(fromUser, salt, iterations, keyLength);
    encrypted = encrypted.toString('base64');
    if (credentials.hash === encrypted) return true;
    return false;
  }
};

// files upLoad
var http = require('http'),
    util = require('util'),
    formidable = require('formidable'),
    upserver;

var baseDir = '/tmp/ewdupload';   // upload base directory
var uploadPort;                   // port number
var uploadUrl;                    // upload URL

var upLoadStart = function(ewd) {

  var sessid  = ewd.session.sessid;
  var hashObj = password.encrypt('ewdupload' + sessid.toString()) ;
  uploadUrl   = escape(hashObj.hash);
  uploadPort  = Math.floor((Math.random()*1000)+10000);

  var upList = new ewd.mumps.GlobalNode('%zewdUpLoad', ['session', sessid]);

  var uploadDir = baseDir + '/' + ewd.session.sessid ;
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  upserver = http.createServer();
  upserver.listen(uploadPort);

  upserver.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('******* : ' + uploadPort + ' : port in use Now , port = port + 1 trying...');
      upserver.close();
      uploadPort = uploadPort + 1;
      upserver.listen(uploadPort);
    }
  });

  upserver.on('listening',function(){
    console.log('******* Start listening upLoad server http://localhost:' + uploadPort + '/' + uploadUrl );
    ewd.sendWebSocketMsg({ 
      type: 'fileUpLodeListen', 
      message: {
         upserver: true,
         uploadPort: uploadPort,
         uploadUrl: uploadUrl
      }
    });
  });

  upserver.on('request', function(req, res) {

      var reqIP = req.connection.remoteAddress;
      var ewdIP = ewd.ipAddress;

      if ( (req.url == '/' + uploadUrl) && (req.method.toLowerCase() == 'post') && (reqIP == ewdIP) ) {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = uploadDir;
        form.parse(req, function(err, fields, files) {
          console.log('******* UpLoad Success Files=\n', files, '\nError=', err, '\nfields=', fields );
          res.writeHead(200, { 'content-type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
          res.end( JSON.stringify( {fields: fields, files: files} ));

          if (typeof files.upload.length == 'number') {
            for(var i=0; i < files.upload.length; i++){
              var upload = {
                size: files.upload[i].size,   path: files.upload[i].path,
                name: files.upload[i].name,   type: files.upload[i].type,
                lastModifiedDate: files.upload[i].lastModifiedDate.toLocaleString()
              };
              upList.$(files.upload[i].path)._setDocument(upload);
            }
          } else {
              // console.log('********* only one file =',files);
              var upload = {
                size: files.upload.size,   path: files.upload.path,
                name: files.upload.name,   type: files.upload.type,
                lastModifiedDate: files.upload.lastModifiedDate.toLocaleString()
              };
              upList.$(files.upload.path)._setDocument(upload);
          }
          ewd.sendWebSocketMsg({ type: 'upLoadList',  message: { upload : upList._getDocument() } });

        });
      } else {
        console.log('*******  UpServer error URL: /' + uploadUrl );
        console.log('*******  UpServer error reqest Method: ' + req.method);
        console.log('*******  UpServer error reqest IP: ' + reqIP);
        console.log('*******  UpServer error ewd IP: ' + ewdIP);
        res.writeHead(404, { 'content-type': 'text/plain' , 'Access-Control-Allow-Origin': '*' });
        res.end('404');
      }
  });
};
var upLoadUnref = function(ewd) {
    upserver.close();
    upserver.unref();
    console.log('**************** Unref upLoad Server on http://localhost:' + uploadPort + '/');
    ewd.sendWebSocketMsg({ type: 'fileUpLodeUnref', message: { upserver: false } });
};

module.exports = {
  onMessage: {
    fileUpLodeListen: function(params, ewd) { upLoadStart(ewd); },
    fileUpLodeUnref: function(params, ewd)  { upLoadUnref(ewd); }
  }
};
