 import {MetricData} from "../Data/fakeMetricData"
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { COLORS } from '../Styles/ColorTheme';

const MetricBarGraph = ({sourceCounts}) => {
  useEffect(() => {
    const ctx = document.getElementById('metricBarGraph').getContext('2d');
    Chart.register(CategoryScale, LinearScale, BarController, BarElement);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(sourceCounts),
        datasets: [
          {
            label: 'News Source Counts',
            data: Object.values(sourceCounts),
            // backgroundColor: COLORS.inquisitor,
            backgroundColor: [
              COLORS.shade1,
              COLORS.shade2,
              COLORS.shade3,
              COLORS.shade4,
              COLORS.shade5,
              COLORS.shade6,
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: 'category',
            labels: Object.keys(sourceCounts), 
            title: {
              display: true,
              text: 'News Source',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count',
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      chart.destroy();
    };
  }, [sourceCounts]);

  return (
  <Box sx={{ height: '400px' }}>
  <Box sx={{ width: '400px', height: '400px' }}>
    <canvas id="metricBarGraph" width="400" height="400"></canvas>
  </Box>
</Box>
  );
};
export default MetricBarGraph;

