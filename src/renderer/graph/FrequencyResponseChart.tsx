import { useMemo } from 'react';
import { useAquaContext } from 'renderer/utils/AquaContext';
import Chart from './Chart';
import { getDataPoints } from './utils';

const FrequencyResponseChart = () => {
  const { filters, preAmp } = useAquaContext();

  const data = useMemo(() => {
    return getDataPoints(preAmp, filters);
  }, [filters, preAmp]);

  const portfolioData = {
    name: 'Response',
    color: '#ffffff',
    items: data,
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
