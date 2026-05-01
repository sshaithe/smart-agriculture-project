import React from 'react'

const Input = ({type, text, className = '', placeholder, ...props}) => {
  return (
    <input type={type} text={text} className={className} {...props} placeholder={placeholder}/>
  )
}

export default Input