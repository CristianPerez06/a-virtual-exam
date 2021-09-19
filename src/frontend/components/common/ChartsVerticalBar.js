import React from 'react'
import { Bar } from 'react-chartjs-2'
import NoResults from './NoResults'

const ChartsVerticalBar = (props) => {
  // Props and params
  const { id, title, chartData } = props

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const showBar = ((chartData || {}).labels || []).length > 0
  const style = showBar ? { height: '280px' } : {}

  return (
    <div id={id} className='m-2 pt-3 text-left'>
      <span>{title}</span>
      <div id={`${id}-chart`} className='mt-2' style={style}>
        {!showBar && <NoResults />}
        {showBar && <Bar data={chartData} options={options} />}
      </div>
    </div>
  )
}

export default ChartsVerticalBar
