import React from 'react'

const StatsBar = ({ domainCount, urlCount }) => {
  return (
    <div className="stats-bar">
      <div className="stats-info">
        <span>{domainCount} domains</span>
        <span className="stats-separator">|</span>
        <span>{urlCount} URLs</span>
      </div>
      {/* <div className="stats-status">
        <span className={`status-dot ${isListening ? '' : 'inactive'}`} />
        <span>{isListening ? 'Listening' : 'Paused'}</span>
      </div> */}
    </div>
  )
}

export default StatsBar
