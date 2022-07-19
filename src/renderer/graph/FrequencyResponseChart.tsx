import { IFilter } from 'common/constants';
import { useEffect, useMemo, useState } from 'react';
import { useAquaContext } from 'renderer/utils/AquaContext';
import Chart from './Chart';
import { ChartDataPoint } from './ChartController';
import { getDataPoints, getFilterPoints, getTotalPoints } from './utils';

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

  const [localFilters, setLocalFilters] = useState<IFilter[]>([]);
  const [filterLines, setFiltersLines] = useState<ChartDataPoint[][]>([]);

  // const data = useMemo(() => {
  //   return getDataPoints(preAmp, filters);
  // }, [filters, preAmp]);

  useEffect(() => {
    const updatedFilterLines = filters.map((f, index) =>
      index < localFilters.length && isFilterEqual(f, localFilters[index])
        ? filterLines[index]
        : getFilterPoints(f)
    );
    setFiltersLines(updatedFilterLines);
    setLocalFilters(filters);
  }, [filterLines, filters, localFilters, preAmp]);

  const data = useMemo(() => {
    return getTotalPoints(preAmp, filterLines);
  }, [filterLines, preAmp]);

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
