import React from 'react'
import './score.css'
import { Link } from 'react-router-dom'

function Score({score, total}) {
    console.log(score, total)
  return (
    <div className='score-outer-container'>
        <div className="score-container">
            <h2>Score</h2>
            <p>You scored {score} out of {total}</p>
            <Link to={'/test/all'} className='btn'>Home</Link>
        </div>
    </div>
  )
}

export default Score