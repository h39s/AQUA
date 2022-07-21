import { IFilter } from 'common/constants';
import { useMemo, useRef } from 'react';
import { useAquaContext } from 'renderer/utils/AquaContext';
import Chart, { ChartDimensions } from './Chart';
import { ChartDataPoint } from './ChartController';
import { getFilterPoints, getTotalPoints } from './utils';

const isFilterEqual = (f1: IFilter, f2: IFilter) => {
  return (
    f1.frequency === f2.frequency &&
    f1.gain === f2.gain &&
    f1.quality === f2.quality &&
    f1.type === f2.type
  );
};

const FrequencyResponseChart = () => {
  const { filters, preAmp } = useAquaContext();
  const prevFilters = useRef<IFilter[]>([]);
  const prevFilterLines = useRef<ChartDataPoint[][]>([]);

  const chartData = useMemo(() => {
    // Update filter lines that have changed
    const updatedFilterLines = filters.map((f, index) =>
      index < prevFilters.current.length &&
      isFilterEqual(f, prevFilters.current[index])
        ? prevFilterLines.current[index]
        : getFilterPoints(f)
    );

    // Update past state
    prevFilterLines.current = updatedFilterLines;
    prevFilters.current = filters;

    // Compute and return new chart data
    const data = getTotalPoints(preAmp, updatedFilterLines);
    return [
      {
        name: 'Response',
        color: '#ffffff',
        items: data,
      },
    ];
  }, [filters, preAmp]);

  const dimensions: ChartDimensions = {
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
