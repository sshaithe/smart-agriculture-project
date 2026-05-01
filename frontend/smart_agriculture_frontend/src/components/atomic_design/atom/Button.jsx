import React from 'react'

const Button = ({children, className= '', onClick, ...props}) => {
  return (
    <button onClick={onClick} className={className} {...props} >
        {children}
    </button>
  )
}

export default Button