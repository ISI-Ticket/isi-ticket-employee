let scanner = new Instascan.Scanner({
    video: document.getElementById('preview'),
    mirror: false
});
scanner.addListener('scan', function (content) {
    validateTicket(content);
});
Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {
        let selectedCam = cameras[0];

        console.log(cameras);

        cameras.forEach(camera => {
            if(camera.name.indexOf('back') != -1) {
                selectedCam = camera;
            }
        })

        scanner.start(selectedCam);
    } else {
        console.error("Não existe câmera no dispositivo!");
    }
});

function validateTicket(content) {
    let saleID = content;
    let data = { saleID };
    console.log(data);
    fetch('https://isi-ticket-api.herokuapp.com/employee/validate', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        console.log(data);
        showPopup(data);
    });


}


function showPopup(response) {
    console.log(response.status);
    if (response.status == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Senha validada previamente!',
        })
    } else {
        Swal.fire({
            title: 'Sucesso!',
            text: response.msg,
            imageUrl: '../img/blueticket.png',
            imageWidth: 200,
            imageHeight: 200
        })
    }
}