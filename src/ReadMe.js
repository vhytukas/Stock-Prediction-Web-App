import React from "react";

const ReadMe = () => {
  return (
    <div className="hero min-h-[83%] bg-base-100">
      <div className="card min-w-[66%] min-h-[83%] bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl mb-10">Project Information</h2>
          <div className="flex flex-col gap-20">
            <p>
              This is a programming project and any stock price forecasting
              should not be taken seriously
            </p>
            <p >Web application built using with TensorFlow.js and React.js</p>
            <p>Machine model used - Long Short Term Memory Recurrent Neural Network</p>
            <p>Part of Brunel University London BSc Computer Science Final Year Project</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadMe;
