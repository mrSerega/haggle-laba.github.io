//var host = 'https://ml-1.herokuapp.com:3000';
var host = 'http://localhost:3000';
var drawChart = function (data) {
    var popCanvas = $("#popChart");
    var popCanvas = document.getElementById("popChart");
    var popCanvas = document.getElementById("popChart").getContext("2d");
    var lineChart = null;
    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;

    var speedData = {
        labels: data.map(function (value) {
            return value.x
        }),
        datasets: [{
            label: "Car Speed (mph)",
            data: data,
            lineTension: 0,
            fill: false,
            borderColor: 'orange',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            pointBorderColor: 'orange',
            pointBackgroundColor: 'rgba(255,150,0,0.5)',
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded'
      }]
    };

    var chartOptions = {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        hover: {
            mode: null
        }
    };

    lineChart = new Chart(popCanvas, {
        type: 'line',
        data: speedData,
        options: chartOptions
    });
}
var onStart = function () {
    var reDrawButton = $("#reDraw");
    reDrawButton.on('click', function () {
        $("#popChart").remove();
        $("body").append('<canvas id="popChart" width="600" height="400"></canvas>');
        $.ajax({
            type: 'POST',
            url: host + '/redraw',
            success: function (data) {
                drawChart(data.err);
            }
        })
    })
    $.ajax({
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        cache: "no-cache",
        url: host + '/index',
        success: function (data) {
            drawChart(data.err);
        }
    })
}
$(onStart);