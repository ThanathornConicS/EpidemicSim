//import { Chart } from "chart.js";

const lebels = ['1', '2', '3', '4', '5', '6'];
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
        labels: lebels,
        datasets: 
        [
            {
                order: 2,
                label: 'Susceptible',
                data: [20, 19, 15, 10, 4, 0],
                //borderColor: "rgb(0, 0, 255)",
                backgroundColor: "rgb(51,145,215)",
                hoverBorderWidth: 1,
                hoverBackgroundColor: "rgb(0, 0, 0)",
                hoverBorderColor: "rgb(0, 0, 255)",
                pointRadius: 3,
                fill: true,
                //borderWidth: 0.7,
            },
            {
                order: 1,
                label: 'Infected',
                data: [0, 1, 3, 8, 10, 11],
                //borderColor: "rgb(255, 0, 0)",
                backgroundColor: "rgb(242,102,91)",
                hoverBorderWidth: 1,
                hoverBackgroundColor: "rgb(0, 0, 0)",
                hoverBorderColor: "rgb(255, 0, 0)",
                pointRadius: 3,
                fill: true,
                //borderWidth: 0.7,
            },
            {
                order: 0,
                label: 'Removed',
                data: [0, 0, 2, 2, 6, 9],
                //borderColor: "rgb(50, 50, 50)",
                backgroundColor: "rgb(153,153,153)",
                hoverBorderWidth: 1,
                hoverBackgroundColor: "rgb(0, 0, 0)",
                hoverBorderColor: "rgb(50, 50, 50)",
                pointRadius: 3,
                fill: true,
                //borderWidth: 0.7,
            }
        ]
    },
    options: 
    {
        responsive: true,
        maintainAspectRatio: true,
        layout: 
        {
            padding:
            {
                left: 50
            }
        },
        scales: 
        {
            y: 
            {
                beginAtZero: true
            }
        }
    },
    plugins:[plugin],
});