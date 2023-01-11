import { IFilter } from 'common/constants';
import { useEffect, useMemo, useRef } from 'react';
import { useAquaContext } from 'renderer/utils/AquaContext';
import { setMainPreAmp } from 'renderer/utils/equalizerApi';
import { clamp } from 'renderer/utils/utils';
import Chart, { ChartDimensions } from './Chart';
import {
  ChartCurveData,
  ChartPointsData,
  ChartDataPoint,
  ChartDataPointWithId,
} from './ChartController';
import {
  getFilterAdjustmentPoints,
  getFilterGraphData,
  getPreAmpLine,
  getSpecificPoints,
  getTotalCurveInfo,
} from './utils';
import {
  ColorEnum,
  getColor,
  GrayScaleEnum,
  SecondaryColorEnum,
} from '../styles/color';

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

const FrequencyResponseChart = () => {
  const { filters, preAmp, isAutoPreAmpOn, setPreAmp, isGraphViewOn } =
    useAquaContext();
  const prevFilters = useRef<IFilter[]>([]);
  const prevFilterLines = useRef<ChartDataPoint[][]>([]);
  const prevFreqPoints = useRef<ChartDataPointWithId[][]>([]);

  const {
    chartData,
    pointData,
    autoPreAmpValue,
  }: {
    chartData: ChartCurveData[];
    pointData: ChartPointsData[];
    autoPreAmpValue: number;
  } = useMemo(() => {
    const freqData = filters.map(({ id, frequency }) => {
      return { frequency, id };
    });

    const isFreqDiff =
      prevFilters.current.length === freqData.length &&
      !prevFilters.current.every(
        ({ frequency }, i) => frequency === freqData[i].frequency
      );

    const hasNewFilter = prevFilters.current.length < freqData.length;

    // Identify the index of each filter by id from previous render
    const prevIndices: { [id: string]: number } = {};
    prevFilters.current.forEach((f, i) => {
      prevIndices[f.id] = i;
    });

    // Update filter lines that have changed
    const { data: updatedFilterLines, points: updatedFreqPoints } = filters
      .map((f) => {
        const prevIndex = prevIndices[f.id];
        // New filters have no previous data
        if (!prevIndex) {
          return getFilterGraphData(f, freqData);
        }

        // Filter changes can impact both the curve and the points so update both
        const hasFilterChanges = !isFilterEqual(
          f,
          prevFilters.current[prevIndex]
        );

        if (hasFilterChanges) {
          return getFilterGraphData(f, freqData);
        }

        return {
          data: prevFilterLines.current[prevIndex],
          // Recompute specific points in 2 scenarios
          //  1. to ensure a point for the new filter is added
          //  2. to update point order when a filter's frequency has changed
          points:
            isFreqDiff || hasNewFilter
              ? getSpecificPoints(f, freqData)
              : prevFreqPoints.current[prevIndex],
        };
      })
      .reduce<{ data: ChartDataPoint[][]; points: ChartDataPointWithId[][] }>(
        (acc, curr) => {
          acc.data.push(curr.data);
          acc.points.push(curr.points);
          return acc;
        },
        { data: [], points: [] }
      );

    // Update past state
    prevFreqPoints.current = updatedFreqPoints;
    prevFilterLines.current = updatedFilterLines;
    prevFilters.current = filters;

    // Compute and return new chart data
    const { data: totalCurveData } = getTotalCurveInfo(
      preAmp,
      updatedFilterLines,
      updatedFreqPoints
    );

    const preAmpLine = getPreAmpLine(preAmp);

    const adjustmentPoints = getFilterAdjustmentPoints(filters);

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
        ...updatedFilterLines.map((lineData, index) => {
          return {
            name: `Filter ${index}`,
            color: getColor(index),
            width: 2,
            items: lineData,
          };
        }),
        {
          name: 'PreAmp',
          color: ColorEnum.ANALOGOUS2,
          width: 2,
          items: preAmpLine,
        },
        {
          name: 'Total Response',
          color: GrayScaleEnum.WHITE,
          width: 3,
          items: totalCurveData,
        },
      ],
      pointData: adjustmentPoints.map((p, index) => {
        return {
          name: `Point for filter ${index}`,
          color: SecondaryColorEnum.DEFAULT,
          items: [p],
        };
      }),
      // Rounding to two decimals
      autoPreAmpValue:
        Math.round(clamp(-1 * (highestPoint.y - preAmp), -30, 30) * 100) / 100,
    };
  }, [filters, preAmp]);

  useEffect(() => {
    if (isAutoPreAmpOn) {
      setMainPreAmp(autoPreAmpValue);
      setPreAmp(autoPreAmpValue);
    }
  }, [autoPreAmpValue, isAutoPreAmpOn, setPreAmp]);

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
  return (
    <>
      {isGraphViewOn && (
        <div className="graph-wrapper">
          <Chart data={chartData} dimensions={dimensions} points={pointData} />
        </div>
      )}
    </>
  );
};

export default FrequencyResponseChart;
