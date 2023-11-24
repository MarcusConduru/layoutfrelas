import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Gráfico (dias)',
    },
  },
};

// function getRandomInt(min: number, max: number) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
// }

const handleGraph = (dashData: any) => {

  const labels = dashData?.work_stage?.stages?.map((item: any) => item?.observation_date.split('-')?.[2])
  const data =  {
      labels,
      datasets: [
          {
          label: 'RUP Diária',
          data: dashData?.work_stage?.stages?.map((item: any) => item?.rup_diaria ?? 0),
          borderColor: 'rgb(53, 132, 200)',
          backgroundColor: 'rgba(53, 132, 200, 0.5)',
          },
          {
          label: 'RUP CUM',
          data: dashData?.work_stage?.stages?.map((item: any) => item?.rup_cumulativa ?? 0),
          borderColor: 'rgb(221, 72, 8)',
          backgroundColor: 'rgba(221, 72, 8, 0.5)',
      },
      {
          label: 'RUP POT',
          data: dashData?.work_stage?.stages?.map((item: any) => item?.rup_potencial ?? 0),
          borderColor: 'rgb(124, 122, 121)',
          backgroundColor: 'rgba(124, 122, 121, 0.5)',
      },
    ],
  };
  console.log(data)
  return data;
}

interface LineChartProps {
  data: any;
}

const LineChart: React.FC<LineChartProps> = ({data}) => {
  return <Line options={options} data={handleGraph(data)} />;
}

export default LineChart;