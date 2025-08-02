declare module 'chartjs-adapter-date-fns' {
  import { ChartType, Plugin } from 'chart.js'
  
  const adapter: Plugin<ChartType>
  export default adapter
}