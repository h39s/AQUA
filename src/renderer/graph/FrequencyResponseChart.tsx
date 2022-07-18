import gains from './sample_gains.json';
import Chart from './Chart';

const FrequencyResponseChart = () => {
  const portfolioData = {
    name: 'Response',
    color: '#ffffff',
    items: gains,
  };
  const chartData = [portfolioData];

  const dimensions = {
    width: 988,
    height: 400,
    margins: {
      top: 30,
      right: 30,
      bottom: 10,
      left: 30,
    },
  };
  return <Chart data={chartData} dimensions={dimensions} />;
};

export default FrequencyResponseChart;
