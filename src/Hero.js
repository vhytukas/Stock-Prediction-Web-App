import React from 'react'

const Hero = ({state}) => {
  return (
    <div className="hero min-h-[83%] bg-base-100">
      <div className="hero-content text-center">
      <div className="max-w-md">
      <h1 className="text-5xl font-bold">Welcome</h1>
      <p className="py-8">Forecast future stock price with the help of Machine Learning</p>
      <button className="btn btn-primary " onClick={state}>Enter</button>
    </div>
  </div>
</div>
  )
}

export default Hero