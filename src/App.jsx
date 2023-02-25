import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import "chartjs-plugin-annotation"
import "./App.css"
import data from "./data.json"

function App() {
  const schedules = data

  const [selectedDate, setSelectedDate] = useState("")

  const [selectedPattern, setSelectedPattern] = useState({
    L: {
      "9am to 12pm": 0,
      "12pm to 3pm": 0,
      "3pm to 6pm": 0,
      "6pm to 9pm": 0,
    },
    D: {
      "9am to 12pm": 0,
      "12pm to 3pm": 0,
      "3pm to 6pm": 0,
      "6pm to 9pm": 0,
    },
  })

  // To get the pattern for a itemDate
  const getPattern = (schedules, itemDate) => {
    const filteredSchedules = schedules.filter(
      (schedule) => schedule.item_date === itemDate
    )

    // schedules.map((schedule) => {
    //   console.log(schedule.item_date + " " + itemDate)
    // })

    // initializing it with 0
    const pattern = {
      L: {
        "9am to 12pm": 0,
        "12pm to 3pm": 0,
        "3pm to 6pm": 0,
        "6pm to 9pm": 0,
      },
      D: {
        "9am to 12pm": 0,
        "12pm to 3pm": 0,
        "3pm to 6pm": 0,
        "6pm to 9pm": 0,
      },
    }

    // increment the count when it occurs between the range of time getPattern() function is called
    filteredSchedules.forEach((schedule) => {
      const scheduleTime = new Date(schedule.schedule_time)
      const hour = scheduleTime.getHours()

      if (hour >= 9 && hour < 12) {
        pattern[schedule.slot]["9am to 12pm"] += 1
      } else if (hour >= 12 && hour < 15) {
        pattern[schedule.slot]["12pm to 3pm"] += 1
      } else if (hour >= 15 && hour < 18) {
        pattern[schedule.slot]["3pm to 6pm"] += 1
      } else if (hour >= 18 && hour < 21) {
        pattern[schedule.slot]["6pm to 9pm"] += 1
      }
    })

    return pattern
  }

  // when date get changed by user this function is called and for that date again pattern
  const handleDateChange = (event) => {
    const selectedDate = event.target.value
    const selectedPattern = getPattern(schedules, selectedDate)
    setSelectedDate(selectedDate)
    setSelectedPattern(selectedPattern)
  }
  const [uniqueDates, setuniqueDate] = useState([])

  useEffect(() => {
    const uniqueDates1 = [
      ...new Set(schedules.map((schedule) => schedule.item_date)),
    ]
    // console.log(uniqueDates1);
    setuniqueDate(uniqueDates1)
  }, [])

  const datasets = [
    {
      label: "Lunch",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
      hoverBorderColor: "rgba(255, 99, 132, 1)",
      data: Object.values(selectedPattern.L),
    },
    {
      label: "Dinner",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(54, 162, 235, 0.4)",
      hoverBorderColor: "rgba(54, 162, 235, 1)",
      data: Object.values(selectedPattern.D),
    },
  ]

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  return (
    <div className="graph-container">
      <div>
        <label htmlFor="date-select">Select date:</label>
        <select
          id="date-select"
          value={selectedDate}
          onChange={handleDateChange}
        >
          <option value="">All Dates</option>
          {uniqueDates?.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      <div className="chart">
        <Bar
          data={{ datasets, labels: Object.keys(selectedPattern.L) }}
          options={options}
        />
      </div>
      <div className="item">
        {datasets.map((dataset, index) => (
          <div className="subitem" key={dataset.label}>
            <div
              className="color-dot"
              style={{ backgroundColor: dataset.backgroundColor }}
            ></div>
            <div className="label">{dataset.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App
