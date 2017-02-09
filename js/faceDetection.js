$('#btn').click(function () {
    var file = document.getElementById('filename').files[0];
    detectFaces(file);
});

$("#filename").change(function () {
    showImage();
});




function detectFaces(file) {
    var apiKey = "83e645eab15742da8bb76f5bb1896dc3";


    // Call the API
    $.ajax({
        url: "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Accept", "application/json");
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
            $("#response").text("Calling api...");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (response) {
            // Process the API response.
            processResult(response);
        })
        .fail(function (error) {
            // Oops, an error :(
            $("#response").text(error.getAllResponseHeaders());
        });
}

function processResult(response) {
    var arrayLength = response.length;


    if (arrayLength > 0) {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');

        context.beginPath();
        
        // Draw face rectangles into canvas.
        for (var i = 0; i < arrayLength; i++) {
            var faceRectangle = response[i].faceRectangle;
            context.rect(faceRectangle.left, faceRectangle.top, faceRectangle.width, faceRectangle.height);  
        }



        context.lineWidth = 3;
        context.strokeStyle = 'green';
        context.stroke();
    }

    // Show the raw response.
    var a = JSON.stringify(response);
    var b = JSON.parse(a);

    var age = parseInt(b[0].faceAttributes.age);
    var gender = b[0].faceAttributes.gender;
    $("#response").text(gender+" "+ age);
    
    console.log(b);


}

function showImage() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    var input = document.getElementById("filename");
    var img = new Image;

    img.onload = function () {
        context.drawImage(img, 0, 0);
    }

    img.src = URL.createObjectURL(input.files[0]);
}