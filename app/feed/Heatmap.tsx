'use client';
import { HeatMapGrid } from 'react-grid-heatmap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Heatmap = ({ data, xLabels, yLabels }: { data: any; xLabels: string[]; yLabels: string[] }) => (
  <HeatMapGrid
    data={data}
    xLabels={xLabels}
    yLabels={yLabels}
    // Could add an on hover here?
    cellRender={(x, y, value) => <div data-frequency={value.toString()}></div>}
    xLabelsStyle={(index) => ({
      color: index % 2 ? 'transparent' : 'inherit',
      fontSize: 'var(--fontSizes_tiny)',
      overflow: 'initial',
    })}
    yLabelsStyle={() => ({
      fontSize: 'var(--fontSizes_tiny)',
      textTransform: 'uppercase',
    })}
    cellStyle={(_x, _y, ratio) => ({
      background: `var(--colours_primary_default)`,
      borderColor: 'var(--colours_secondary_default)',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderRadius: '6px',
      opacity: ratio * 3 + 0.1,
    })}
    cellHeight="30px"
    xLabelsPos="bottom"
    square
  />
);
