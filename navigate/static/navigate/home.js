// if ($)
// 	console.log('jQuery is loaded')
// if ($.ajax)
// 	console.log('ajax is loaded')

$("#test").click(() => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const request_data = { 'title': document.getElementById('test').innerHTML }
    const request = new Request(
        "/test", {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request_data),
    }
    );

    fetch(request)
        .then(response => response.json())
        .then(function (data) {
            console.log(data)
            document.getElementById("test").innerHTML = data.success;
            console.log("success")
        });
});