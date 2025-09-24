
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { colors, commonStyles, spacing } from '../styles/commonStyles';

const screenWidth = Dimensions.get('window').width;

interface ChartProps {
  type: 'pie' | 'bar' | 'line';
  data: any;
  title?: string;
  height?: number;
}

const chartConfig = {
  backgroundColor: colors.backgroundAlt,
  backgroundGradientFrom: colors.backgroundAlt,
  backgroundGradientTo: colors.backgroundAlt,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: colors.primary,
  },
};

export default function Chart({ type, data, title, height = 220 }: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart
            data={data}
            width={screenWidth - spacing.xl}
            height={height}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            absolute
          />
        );
      case 'bar':
        return (
          <BarChart
            data={data}
            width={screenWidth - spacing.xl}
            height={height}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
            fromZero
          />
        );
      case 'line':
        return (
          <LineChart
            data={data}
            width={screenWidth - spacing.xl}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    ...commonStyles.subtitle,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: spacing.sm,
    ...commonStyles.card,
  },
});
