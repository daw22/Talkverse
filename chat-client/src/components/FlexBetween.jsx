import React from 'react'

function FlexBetween({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%'
    }}>
      { children }
    </div>
  )
}

export default FlexBetween;