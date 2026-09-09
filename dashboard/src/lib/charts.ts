import type { ApexOptions } from "apexcharts";

/**
 * Categorical hues for the three collections.
 * Validated on a white surface: lightness band, chroma floor, CVD separation
 * (worst adjacent deutan ΔE 19.0), normal-vision floor (ΔE 26.0) and 3:1
 * contrast all pass. Assign in fixed order — never cycle, never re-rank.
 */
export const CATEGORICAL = ["#B5820F", "#1D6FD0", "#A83262"];

/** Single-series brand hue for magnitude-over-time. */
export const SERIES_GOLD = "#B5820F";

const INK = "#12100C";
const MUTED = "#7C7466";
const GRID = "#E6DED0";

export const CHART_FONT = "Jost, ui-sans-serif, system-ui, sans-serif";

/** Shared chrome: recessive grid and axes, no data labels, tooltips on. */
export function baseOptions(): ApexOptions {
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: CHART_FONT,
      animations: { speed: 400 },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: GRID,
      strokeDashArray: 3,
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      labels: { style: { colors: MUTED, fontSize: "11px" } },
      axisBorder: { color: GRID },
      axisTicks: { color: GRID },
      crosshairs: { stroke: { color: GRID, dashArray: 3 } },
    },
    yaxis: {
      labels: { style: { colors: MUTED, fontSize: "11px" } },
    },
    tooltip: {
      theme: "light",
      style: { fontFamily: CHART_FONT },
    },
    legend: {
      labels: { colors: INK },
      fontSize: "12px",
      markers: { size: 6 },
      itemMargin: { horizontal: 10 },
    },
    states: {
      hover: { filter: { type: "lighten" } },
      active: { filter: { type: "none" } },
    },
  };
}
