// @flow

import * as React from 'react';
import type { I18n as I18nType } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  ResponsiveContainer,
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import AirStudioThemeContext from '../UI/Theme/AirStudioThemeContext';
import Paper from '../UI/Paper';
import { ColumnStackLayout } from '../UI/Layout';
import Text from '../UI/Text';
import { durationValues, type ChartData } from './GameAnalyticsEvaluator';

const chartMargins = {
  top: 5,
  bottom: 5,
  right: 25,
  left: 0,
};
// There is a known bug with recharts that causes the chart to not render if the width is 100%
// in a flexbox component. check https://github.com/recharts/recharts/issues/172
const chartWidth = '99%';

const minutesFormatter = (value: number) => {
  return value.toFixed(2);
};

const percentFormatter = (value: number) => {
  return value.toFixed(2);
};

const getChartsStyleFromTheme = (airStudioTheme: airStudioTheme) => ({
  tooltipContent: {
    color: airStudioTheme.chart.textColor,
    padding: 10,
  },
  tickLabel: {
    fontFamily: airStudioTheme.chart.fontFamily,
  },
  chartLineDot: {
    fill: airStudioTheme.chart.dataColor1,
    strokeWidth: 0,
  },
});

const CustomTooltip = ({
  payload,
  label,
  customStyle,
  labelSuffix,
}: {|
  payload: ?Array<any>,
  label: string,
  customStyle: Object,
  labelSuffix: ?string,
|}) =>
  payload ? (
    <Paper style={customStyle} background="light">
      <ColumnStackLayout>
        <Text size="sub-title" noMargin>
          {label} {labelSuffix ? labelSuffix : ''}
        </Text>
        {payload.length > 0 &&
          payload.map(
            (
              {
                name,
                unit,
                value,
              }: {| name: string, unit: ?string, value: number |},
              index
            ) => (
              <Text noMargin key={index}>{`${name}: ${
                Number.isInteger(value) ? value.toString() : value.toFixed(2)
              }${unit ? ` ${unit}` : ''}`}</Text>
            )
          )}
      </ColumnStackLayout>
    </Paper>
  ) : null;

type ChartProps = {|
  i18n: I18nType,
  chartData: ChartData,
  height: number,
  fontSize?: 'small' | 'medium',
|};

export const SessionsChart = ({
  i18n,
  chartData,
  height,
  fontSize,
}: ChartProps): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const styles = getChartsStyleFromTheme(airStudioTheme);

  return (
    <ResponsiveContainer width={chartWidth} height={height} debounce={1}>
      <AreaChart data={chartData.overTime} margin={chartMargins}>
        <Area
          name={i18n._(t`Viewers`)}
          type="monotone"
          dataKey="viewersCount"
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.125}
          yAxisId={0}
        />
        <Area
          name={i18n._(t`Players`)}
          type="monotone"
          dataKey="playersCount"
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.25}
          yAxisId={0}
        />
        <CartesianGrid
          stroke={airStudioTheme.chart.gridColor}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="date"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
          tick={{ fontSize: fontSize === 'small' ? 12 : 16 }}
        />
        <YAxis
          dataKey="viewersCount"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
          tick={{ fontSize: fontSize === 'small' ? 12 : 16 }}
        />
        <Tooltip
          content={props =>
            CustomTooltip({
              ...props,
              customStyle: styles.tooltipContent,
            })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BounceRateChart = ({
  i18n,
  chartData,
  height,
  fontSize,
}: ChartProps): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const styles = getChartsStyleFromTheme(airStudioTheme);

  return (
    <ResponsiveContainer width={chartWidth} height={height} debounce={1}>
      <LineChart data={chartData.overTime} margin={chartMargins}>
        <RechartsLine
          name={i18n._(t`Bounce rate`)}
          unit={'%'}
          formatter={minutesFormatter}
          type="monotone"
          dataKey="bounceRatePercent"
          stroke={airStudioTheme.chart.dataColor1}
          dot={styles.chartLineDot}
          yAxisId={0}
        />
        <CartesianGrid
          stroke={airStudioTheme.chart.gridColor}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="date"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <YAxis
          unit={'%'}
          dataKey="bounceRatePercent"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <Tooltip
          content={props =>
            CustomTooltip({
              ...props,
              customStyle: styles.tooltipContent,
            })
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const MeanPlayTimeChart = ({
  i18n,
  chartData,
  height,
  fontSize,
}: ChartProps): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const styles = getChartsStyleFromTheme(airStudioTheme);

  return (
    <ResponsiveContainer width={chartWidth} height={height} debounce={1}>
      <LineChart data={chartData.overTime} margin={chartMargins}>
        <RechartsLine
          name={i18n._(t`Mean played time`)}
          unit={' ' + i18n._(t`minutes`)}
          formatter={minutesFormatter}
          type="monotone"
          dataKey="meanPlayedDurationInMinutes"
          stroke={airStudioTheme.chart.dataColor1}
          dot={styles.chartLineDot}
          yAxisId={0}
        />
        <CartesianGrid
          stroke={airStudioTheme.chart.gridColor}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="date"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <YAxis
          unit={` ` + i18n._(t`min`)}
          dataKey="meanPlayedDurationInMinutes"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <Tooltip
          content={props =>
            CustomTooltip({
              ...props,
              customStyle: styles.tooltipContent,
            })
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const PlayersRepartitionPerDurationChart = ({
  i18n,
  chartData,
  height,
  fontSize,
}: ChartProps): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const styles = getChartsStyleFromTheme(airStudioTheme);
  return (
    <ResponsiveContainer width={chartWidth} height={height} debounce={1}>
      <AreaChart data={chartData.overPlayedDuration} margin={chartMargins}>
        <Area
          name={i18n._(t`Players`)}
          type="monotone"
          dataKey="playersCount"
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.25}
          yAxisId={0}
        />
        <XAxis
          unit={` ` + i18n._(t`min`)}
          name={i18n._(t`Played time`)}
          dataKey="duration"
          type="number"
          domain={[0, durationValues[durationValues.length - 1]]}
          ticks={durationValues}
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <YAxis
          dataKey="playersCount"
          stroke="#f5f5f5"
          style={styles.tickLabel}
          domain={[0, 'dataMax']}
        />
        <CartesianGrid
          stroke={airStudioTheme.chart.gridColor}
          strokeDasharray="3 3"
        />
        <Tooltip
          content={props =>
            CustomTooltip({
              ...props,
              customStyle: styles.tooltipContent,
              labelSuffix: i18n._(t`minutes`),
            })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const PlayersDurationPerDayChart = ({
  i18n,
  chartData,
  height,
  fontSize,
}: ChartProps): React.Node => {
  const airStudioTheme = React.useContext(AirStudioThemeContext);
  const styles = getChartsStyleFromTheme(airStudioTheme);

  return (
    <ResponsiveContainer width={chartWidth} height={height} debounce={1}>
      <AreaChart data={chartData.overTime} margin={chartMargins}>
        <Area
          name={i18n._(t`Players`)}
          type="monotone"
          dataKey="over60sPlayersPercent"
          formatter={percentFormatter}
          unit={'%'}
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.15}
          yAxisId={0}
        />
        <Area
          name={i18n._(t`Played > 3 minutes`)}
          type="monotone"
          dataKey="over180sPlayersPercent"
          formatter={percentFormatter}
          unit={'%'}
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.15}
          yAxisId={0}
        />
        <Area
          name={i18n._(t`Played > 5 minutes`)}
          type="monotone"
          dataKey="over300sPlayersPercent"
          formatter={percentFormatter}
          unit={'%'}
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.15}
          yAxisId={0}
        />
        <Area
          name={i18n._(t`Played > 10 minutes`)}
          type="monotone"
          dataKey="over600sPlayersPercent"
          formatter={percentFormatter}
          unit={'%'}
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.15}
          yAxisId={0}
        />
        <Area
          name={i18n._(t`Played > 15 minutes`)}
          type="monotone"
          dataKey="over900sPlayersPercent"
          formatter={percentFormatter}
          unit={'%'}
          stroke={airStudioTheme.chart.dataColor1}
          fill={airStudioTheme.chart.dataColor1}
          fillOpacity={0.15}
          yAxisId={0}
        />
        <CartesianGrid
          stroke={airStudioTheme.chart.gridColor}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="date"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
        />
        <YAxis
          dataKey="over60sPlayersPercent"
          stroke={airStudioTheme.chart.textColor}
          style={styles.tickLabel}
          unit={'%'}
        />
        <Tooltip
          content={props =>
            CustomTooltip({
              ...props,
              customStyle: styles.tooltipContent,
            })
          }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
