import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { Chart, DoughnutController, ArcElement, CategoryScale, Tooltip, Legend } from 'chart.js';
import { COLORS } from '../Styles/ColorTheme';

const MetricPieChart = ({dataToDisplay}) => {
  const theme = useTheme();


  useEffect(() => {
    const ctx = document.getElementById('metricPieChart').getContext('2d');
    Chart.register(DoughnutController, ArcElement, CategoryScale, Tooltip, Legend);

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(dataToDisplay),
        datasets: [
          {
            label: 'News Source Counts',
            data: Object.values(dataToDisplay),
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
            display: true,
            position: 'top', 
        },
        },
      },
    });
   
    // Cleanup function
    return () => {
      chart.destroy();
    };
  }, [theme, dataToDisplay]);

  return (
    <Box>
      <Box sx={{ width: '400px', height: '400px' }}>
        <canvas id="metricPieChart" width="400" height="600"></canvas>
      </Box>
    </Box>
  );
};

export default MetricPieChart;
