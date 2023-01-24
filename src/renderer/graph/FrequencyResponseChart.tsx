import { IFilter } from 'common/constants';
import { useEffect, useMemo, useRef } from 'react';
import { useAquaContext } from 'renderer/utils/AquaContext';
import { setMainPreAmp } from 'renderer/utils/equalizerApi';
import { clamp } from 'renderer/utils/utils';
import Chart, { ChartDimensions } from './Chart';
import {
  IChartCurveData,
  IChartLineDataPointsById,
  IChartPointData,
} from './ChartController';
import { getFilterLineData, getPreAmpLine, getCombinedLineData } from './utils';
import { ColorEnum, getColor, GrayScaleEnum } from '../styles/color';

const isFilterEqual = (f1: IFilter, f2: IFilter) => {
  if (!f1 || !f2) {
    return false;
  }

  return (
    f1.frequency === f2.frequency &&
    f1.gain === f2.gain &&
    f1.quality === f2.quality &&
    f1.type === f2.type
  );
};

interface IGraphData {
  chartData: IChartCurveData[];
  autoPreAmpValue: number;
}

const FrequencyResponseChart = () => {
  const {
    filters,
    isAutoPreAmpOn,
    isGraphViewOn,
    isLoading,
    preAmp,
    setPreAmp,
  } = useAquaContext();
  const prevFilters = useRef<IFilter[]>([]);
  const prevFilterLines = useRef<IChartLineDataPointsById>({});

  const { chartData, autoPreAmpValue }: IGraphData = useMemo(() => {
    const controlPointByCurveId: { [id: string]: IChartPointData } = {};

    // Identify the index of each filter by id from previous render
    const prevIndices: { [id: string]: number } = {};
    prevFilters.current.forEach((f, i) => {
      prevIndices[f.id] = i;
    });

    const updatedFilterLines: IChartLineDataPointsById = {};

    // Update filter lines that have changed
    filters.forEach((filter) => {
      // Store control point info
      controlPointByCurveId[filter.id] = {
        x: filter.frequency,
        y: filter.gain,
      };

      // New filters have no previous data
      const prevIndex = prevIndices[filter.id];
      if (!prevIndex) {
        updatedFilterLines[filter.id] = getFilterLineData(filter);
        return;
      }

      // Recompute filter line if it has been adjusted
      if (!isFilterEqual(filter, prevFilters.current[prevIndex])) {
        updatedFilterLines[filter.id] = getFilterLineData(filter);
      } else {
        // Otherwise, reuse previous data
        updatedFilterLines[filter.id] = prevFilterLines.current[filter.id];
      }
    });

    // Update past state
    prevFilterLines.current = updatedFilterLines;
    prevFilters.current = filters;

    // Compute combined line data
    const totalCurveData = getCombinedLineData(preAmp, updatedFilterLines);

    // Compute preAmp line data
    const preAmpLine = getPreAmpLine(preAmp);

    const highestPoint = totalCurveData.reduce(
      (previousValue, currentValue) => {
        if (previousValue) {
          return previousValue.y < currentValue.y
            ? currentValue
            : previousValue;
        }
        return currentValue;
      }
    );

    return {
      chartData: [
        {
          id: 'PreAmp',
          name: 'PreAmp',
          line: {
            color: ColorEnum.ANALOGOUS2,
            strokeWidth: 2,
            points: preAmpLine,
          },
        } as IChartCurveData,
        {
          id: 'Total Response',
          name: 'Total Response',
          line: {
            color: GrayScaleEnum.WHITE,
            strokeWidth: 3,
            points: totalCurveData,
          },
        } as IChartCurveData,
        ...Object.keys(updatedFilterLines).map((id, index) => {
          return {
            id,
            name: `Filter ${id}`,
            line: {
              color: getColor(index),
              strokeWidth: 2,
              points: updatedFilterLines[id],
            },
            controlPoint: controlPointByCurveId[id],
          } as IChartCurveData;
        }),
      ],
      // Rounding to two decimals
      autoPreAmpValue:
        Math.round(clamp(-1 * (highestPoint.y - preAmp), -30, 30) * 100) / 100,
    };
  }, [filters, preAmp]);

  useEffect(() => {
    // Don't automatically adjust preamp if state hasn't been fetched yet
    if (!isLoading && isAutoPreAmpOn) {
      setMainPreAmp(autoPreAmpValue);
      setPreAmp(autoPreAmpValue);
    }
  }, [autoPreAmpValue, isAutoPreAmpOn, isLoading, setPreAmp]);

  const dimensions: ChartDimensions = {
    width: 1396,
    height: 380,
    margins: {
      top: 30,
      right: 30,
      bottom: 10,
      left: 30,
    },
  };

  return (
    <>
      {isGraphViewOn && (
        <div className="graph-wrapper">
          {isLoading ? (
            <div className="center full row">
              <h1>Loading...</h1>
            </div>
          ) : (
            <Chart data={chartData} dimensions={dimensions} />
          )}
        </div>
      )}
    </>
  );
};

export default FrequencyResponseChart;
