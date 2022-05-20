//import { Chart } from "chart.js";

let labels = [];
for(let i = 0; i <= 100; i++)
{
    labels[i] = i;
}

let susCount = [];
let infCount = [];
let remCount = [];

// const totalDuration = 10000;
// const delayBetweenPoints = totalDuration / data.length;
// const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
// const animation = {
//   x: {
//     type: 'number',
//     easing: 'linear',
//     duration: delayBetweenPoints,
//     from: NaN, // the point is initially skipped
//     delay(ctx) {
//       if (ctx.type !== 'data' || ctx.xStarted) {
//         return 0;
//       }
//       ctx.xStarted = true;
//       return ctx.index * delayBetweenPoints;
//     }
//   },
//   y: {
//     type: 'number',
//     easing: 'linear',
//     duration: delayBetweenPoints,
//     from: previousY,
//     delay(ctx) {
//       if (ctx.type !== 'data' || ctx.yStarted) {
//         return 0;
//       }
//       ctx.yStarted = true;
//       return ctx.index * delayBetweenPoints;
//     }
//   }
// };

function RunChart(chartDat)
{
    //console.log(chartDat);
    susCount = chartDat.S;
    infCount = chartDat.I;
    remCount = chartDat.R;

    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const plugin = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => 
        {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = 'lightGrey';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
        }
    };
    let config = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: 
            [
                {
                    order: 2,
                    label: 'Susceptible',
                    data: susCount,
                    //borderColor: "rgb(0, 0, 255)",
                    backgroundColor: "rgb(51,145,215)",
                    hoverBorderWidth: 1,
                    hoverBackgroundColor: "rgb(0, 0, 0)",
                    hoverBorderColor: "rgb(0, 0, 255)",
                    pointRadius: 2,
                    fill: true,
                    tension: 0.3,
                    //borderWidth: 0.7,
                },
                {
                    order: 1,
                    label: 'Infected',
                    data: infCount,
                    //borderColor: "rgb(255, 0, 0)",
                    backgroundColor: "rgb(242,102,91)",
                    hoverBorderWidth: 1,
                    hoverBackgroundColor: "rgb(0, 0, 0)",
                    hoverBorderColor: "rgb(255, 0, 0)",
                    pointRadius: 2,
                    fill: true,
                    tension: 0.3,
                    //borderWidth: 0.7,
                },
                {
                    order: 0,
                    label: 'Removed',
                    data: remCount,
                    //borderColor: "rgb(50, 50, 50)",
                    backgroundColor: "rgb(153,153,153)",
                    hoverBorderWidth: 1,
                    hoverBackgroundColor: "rgb(0, 0, 0)",
                    hoverBorderColor: "rgb(50, 50, 50)",
                    pointRadius: 2,
                    fill: true,
                    tension: 0.3,
                    //borderWidth: 0.7,
                }
            ]
        },
        options: 
        {
            //animation,
            responsive: true,
            maintainAspectRatio: true,
            scales: 
            {
                x:
                {
                    title: 
                    {
                        display: true,
                        text: 'Timesteps'
                    },
                    ticks:
                    {
                        stepSize: 20
                    }
                },
                y: 
                {
                    beginAtZero: true,
                    title: 
                    {
                        display: true,
                        text: 'Population'
                    },
                    ticks:
                    {
                        stepSize: 2
                    }
                }
            }
        },
        plugins:[plugin],
    });
}

