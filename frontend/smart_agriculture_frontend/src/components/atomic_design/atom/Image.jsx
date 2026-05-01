import React from 'react'

const Image = ({image, alt, className = '', ...props}) => {
  return (
    <img src={image} alt={alt} className={className} {...props} />
  )
}

export default Image