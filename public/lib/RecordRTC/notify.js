window.NotifyPageInit = function () {
    let method = {
        get:function() {
            let newObj = new Object();
            for(let i = 0, getArr = location.search.substring(1,location.search.length).split('&').map(function(item) {
                return {[item.split('=')[0]]:item.split('=')[1]};
            }); i < getArr.length; i++) newObj = Object.assign(newObj, getArr[i]);
            return newObj;
        }
    };
    var isMobile = false; //initiate as false
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

    function uploadMyVideo(file, filename, callback) {
        var fd = new FormData();
        fd.append('request_id', method.get().request_id);
        fd.append('confirm_code', method.get().confirm_code);

        if (file) {
            fd.append('file_0', file, filename);
        } else
            return false;

        $.ajax({
            url: "https://indacoin.com/AddVerificationVideo.ashx",
            type: "POST",
            data: fd,
            contentType: false, processData: false,
            success: function (data) {
                if (callback)
                    callback();
                return true;
            },
            error: function (xhr, textStatus, errorThrown) {
                switch (xhr.status) {
                    case 429:
                        note(window.t.floodError, "notyRed");
                        break;
                    default:
                        break;
                }
            }
        });
        return false;
    }
    //if (getParamFromUrl('testmode'))
    if ($("#card-code-video").length) {
        $("#card-code-video").show();
        if ($("#requestInfo").length) {
            $('#smsVerify').hide();
            $("#requestInfo").show();
        }
        if (isMobile) {
            $("#videoForMobile").show();
            $("#videoForDesktop").hide();
        } else {
            $("#videoForMobile").hide();
            $("#videoForDesktop").show();
        }

        function toggleButton(button, state) {
            button.disabled = !state;
            if (state) {
                button.removeClass("disabled");
                button.prop("disabled", false);
            } else {
                button.addClass("disabled");
                button.prop("disabled", "disabled");
            }
        }

        function InitState() {

            toggleButton($("#start-recording"), true);
            toggleButton($("#stop-recording"), false);
            toggleButton($("#send-recording"), false);
            $("#start-recording").addClass("flash").addClass("flash-slow");
            $("#stop-recording").removeClass("flash");
            $("#send-recording").removeClass("flash");
        }

        InitState();

        function captureUserMedia00(callback) {
            captureUserMedia({
                audio: true,
                video: true
            }, function (stream) {
                window.currentStream = stream;
                try {
                    videoElement.srcObject = stream;
                } catch (error) {
                videoElement.src = window.URL.createObjectURL(stream);
                }
                //videoElement.src = URL.createObjectURL(stream);
                videoElement.muted = true;
                videoElement.controls = true;
                videoElement.play();
                if (!window.hasWebcam) {
                    if ($('#videoForMobile>p').length) {
                        $('#videoForMobile>p').remove();
                        $('#videoForMobile div label.uploadbutton .button').html('Choose');
                        $('#videoForMobile div label.uploadbutton .input').html('Not choosen');
                        if (isMobile) {
                            $("#videoForDesktop").show();
                        } else {
                            $("#videoForMobile").show();
                        }
                        alert('We cannot find WebCam. Try to upload video');
                    }
                }
                callback(stream);
            }, function (error) {
                if (!window.hasWebcam) {
                    if ($('#videoForMobile>p').length) {
                        $('#videoForMobile>p').remove();
                        $('#videoForMobile div label.uploadbutton .button').html('Choose');
                        $('#videoForMobile div label.uploadbutton .input').html('Not choosen');
                        if (isMobile) {
                            $("#videoForDesktop").show();
                        } else {
                            $("#videoForMobile").show();
                        }
                        alert('We cannot find WebCam. Try to upload video');
                    }
                }

                InitState();
                if (isMobile) {
                    $("#videoForDesktop").show();
                } else {
                    $("#videoForMobile").show();
                }
                alert("Please check permissions for video recording in browser");
            });
        }
        function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
            var isBlackBerry = !!(/BB10|BlackBerry/i.test(navigator.userAgent || ''));
            if (isBlackBerry && !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
                return;
            }
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        }

        var videoElement = document.getElementById('video');

        $("body").delegate("#send-recording", "click", function () {
            if ($(this).hasClass('disabled')) return false;
            var file = window.audioVideoRecorder.getBlob();
            //window.loadingEffect("#send-recording", true);

            uploadMyVideo(file, new Date().getTime() + '.webm', function () {
                $('.videoUploadedCongrats').show();
                alert($('.videoUploadedCongrats').html())
                if (window.audioVideoRecorder && window.audioVideoRecorder.getBlob()) {
                    window.audioVideoRecorder.clearRecordedData();
                }
                //window.loadingEffect("#send-recording", false);
                toggleButton($("#start-recording"), false);
                toggleButton($("#stop-recording"), false);
                toggleButton($("#send-recording"), false);
                $("#start-recording").removeClass("flash");
                $("#stop-recording").removeClass("flash");
                $("#send-recording").removeClass("flash");
            });
        });

        $("body").delegate("#start-recording", "click", function () {
            if ($(this).hasClass('disabled')) return false;
            $('#video').show();
            toggleButton($("#start-recording"), false);
            toggleButton($("#stop-recording"), false);
            toggleButton($("#send-recording"), false);
            $("#start-recording").removeClass("flash").removeClass("flash-slow");

            setTimeout(function () {
                toggleButton($("#stop-recording"), true);
                $("#stop-recording").addClass("flash").addClass("flash-slow");
            }, 10000);

            toggleButton($("#send-recording"), false);
            if (window.audioVideoRecorder && window.audioVideoRecorder.getBlob()) {
                window.audioVideoRecorder.clearRecordedData();
            }
            captureUserMedia00(function (stream) {
                window.audioVideoRecorder = window.RecordRTC(stream, {
                    type: 'video'
                });
                window.audioVideoRecorder.startRecording();
            });
        });

        $("body").delegate("#stop-recording", "click", function () {
            if ($(this).hasClass('disabled')) return false;
            window.startedRecording = false;
            toggleButton($("#start-recording"), true);
            toggleButton($("#stop-recording"), false);
            toggleButton($("#send-recording"), true);
            $("#stop-recording").removeClass("flash").removeClass("flash-slow");
            $("#send-recording").addClass("flash").addClass("flash-fast");

            window.audioVideoRecorder.stopRecording(function (url) {
                videoElement.src = url;
                videoElement.muted = false;
                videoElement.play();
                window.currentStream.stop();
                window.currentStream = null;
                videoElement.onended = function () {
                    videoElement.pause();

                    // dirty workaround for: "firefox seems unable to playback"
                    videoElement.src = URL.createObjectURL(audioVideoRecorder.getBlob());
                };
            });
        });
    }

    $("body").delegate("#uploadVideoButton", "click", function () {

        if ($("#verification_video_upload")[0].files[0]) {
            $("#uploadVideoButton").addClass("flash").addClass("flash-slow");
            toggleButton($("#uploadVideoButton"), false);
        }
        uploadMyVideo($('#verification_video_upload')[0].files[0], $('#verification_video_upload')[0].files[0].name, function () {
            $('.videoUploadedCongrats').show();
            $("#uploadVideoButton").removeClass("flash").removeClass("flash-slow");
            toggleButton($("#uploadVideoButton"), true);
            return false;
        });
    });






}
window.NotifyPageInit();