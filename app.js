
EWD.sockets.log = true;
EWD.application = {
  name: 'ewdUpLoad',
  timeout: 36000,
  labels: {
        'ewd-title': 'ewdUpLoad'
  },
  setStatus: function(status){
      if(status){
          $('#upLoadStatusOff').hide();
          $('#upLoadStatusOn').show();
      }else{
          $('#upLoadStatusOff').show();
          $('#upLoadStatusOn').hide();
      }
  },

  onStartup: function() {

    $('#upLoadReset').click(function(e) {
      e.preventDefault();
      $('#upLoadSend').hide();
    });

    $('#upLoadFile').change(function(e) {
      e.preventDefault();
      var files = this.files;
      // console.log('--- files = \n', files);
      if (files.length>0) {
        $('#upLoadSend').show();
      } else {
        $('#upLoadSend').hide();
      }
    });

    // Start upLoad Server -> Send files -> Close upLoad Server
    $('#upLoadForm').submit(function(e){
      e.preventDefault();
      EWD.sockets.sendMessage({
        type : 'fileUpLodeListen',  params: {},
        done: function(messageObj) {
          if(messageObj.message.upserver){
            var port = messageObj.message.uploadPort;
            var upLoadUrl  = messageObj.message.uploadUrl;
            console.log('----- Start Listen upLoad Server port No:' + port);
            EWD.application.setStatus(true);
            var fd = new FormData($('#upLoadForm').get(0));
            // Send files by $.ajax
            $.ajax({
                url: 'http://' + location.hostname + ':' + port + '/' + upLoadUrl,
                type: 'POST',
                data: fd,
                processData: false,
                contentType: false,
                dataType: 'json'
              })
              .done(function( data ) {
                console.log('----- success files upLoad!');
                EWD.application.setStatus(false);
                EWD.sockets.sendMessage({ type : 'fileUpLodeUnref', params: {} });
                toastr.success('upload Success');
              })
              .fail(function( jqXHR, textStatus, errorThrown ) {
                EWD.application.setStatus(false);
                EWD.sockets.sendMessage({ type : 'fileUpLodeUnref', params: {} });
                toastr.error('upload Error' + textStatus);
              });
              // End of $.ajax
          }  // End of if upserver
          $('#upLoadReset').click();
        }  // End of Done by fileUpLodeListen
      });  // End of EWD.sockets.sendMessage fileUpLodeListen
    });  // End of submit
  },  // End of onStartup

  onMessage: {
    upLoadList: function(messageObj) {
      var html ;
      if (messageObj.message.upload) {
        $('#upLoadListTable tbody').empty();
        jQuery.each(messageObj.message.upload, function(val, obj) {
          html  = '<tr><td>' + obj.name + '</td><td>' + obj.path + '</td>';
          html += '<td>' + obj.size + '</td><td>' + obj.type + '</td>';
          html += '<td>' + obj.lastModifiedDate + '</td></tr>';
          $('#upLoadListTable tbody').append(html); 
        });
      }
    },
    fileUpLodeUnref: function(messageObj){
      if(!messageObj.message.upserver){
        console.log('----- Close upLoad Server');
      }
    }

  }
};

EWD.onSocketsReady = function() {
    for (id in EWD.application.labels) {
        try {
            document.getElementById(id).innerHTML = EWD.application.labels[id];
        }
        catch(err) {}
    };
    if (EWD.application.onStartup) EWD.application.onStartup();
};
EWD.onSocketMessage = function(messageObj) {
    if (EWD.application.messageHandlers) EWD.application.messageHandlers(messageObj);
};

