import { useState, useEffect } from "react";
import { getPriceData } from "./fetch";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import NavBar from "./NavBar";

const Predict = ({state}) => {
  const [model, setModel] = useState();
  const [prediction, setPrediction] = useState();
  const [training, setTraining] = useState(false);
  const [batchCount, setBatchCount] = useState(0);
  const [epochCount, setEpochCount] = useState(0);
  const [ticker, setTicker] = useState("");
  const [showPred, setShowPred] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showForm, setShowForm] = useState(true)

  useEffect(() => {
    tf.setBackend("cpu");
    const model = tf.sequential();
    model.add(
      tf.layers.lstm({ units: 100, returnSequences: true, inputShape: [60, 1] })
    );
    model.add(tf.layers.lstm({ units: 100, returnSequences: false }));
    model.add(tf.layers.dense({ units: 25 }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({
      optimizer: "adam",
      loss: "meanSquaredError",
    });
    setModel(model);
  }, []);

  const stockSelectionHandler = (e) => {
    e.preventDefault();
    getDataHandler();
    
  };

  function toFixed(num, fixed) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
  }

  function reverse_transform(prediction, dataMax, dataMin) {
    const normalized = prediction * (dataMax - dataMin) + dataMin;
    return normalized;
  }
 
  const getDataHandler = () => {
    const temp = [];
    const x_train = [];
    const y_train = [];

    getPriceData(ticker).then((value) => {
      
      if (value === "404" || value === "400") {
        //value === "404" || value === "400"
        setShowError(true);
      } else if (value.length < 560) {
        // value.length < 560
        setShowError(true);
      } else {
        setShowError(false);
        setShowForm(false)
        setTraining(true)
        const dataMax = Math.max(...value);
        const dataMin = Math.min(...value);

        for (const key in value) {
          temp[key] = (value[key] - dataMin) / (dataMax - dataMin);
        }
        for (let i = 60; i < temp.length; i++) {
          x_train.push(temp.slice(i - 60, i));
          y_train.push(temp[i]);
        }
        const predictionData = temp.slice(-60);

        const x_train_tensor = tf.tensor(x_train, [500, 60, 1]);
        const y_train_tensor = tf.tensor(y_train, [500]);
        const predictionData_tensor = tf.tensor(predictionData, [1, 60, 1]);
        modelFitHandler(
          x_train_tensor,
          y_train_tensor,
          predictionData_tensor,
          dataMax,
          dataMin
        );
      }
    });
  };

  const modelFitHandler = (xTrain, yTrain, predData, dataMax, dataMin) => {
    model
      .fit(xTrain, yTrain, {
        epochs: 3,
        batchSize: 1,
        callbacks: { onEpochBegin, onEpochEnd, onBatchEnd },
      })
      .then((info) => {
        setEpochCount(0);
        model.save("localstorage://my-model-1");
        modelPredHandler(predData, dataMax, dataMin);
        setTraining(false)
      });
  };
  function onEpochBegin() {
    setEpochCount((prevState) => prevState + 1);
    setBatchCount(0);
    
  }
  function onEpochEnd() {
    
  }
  function onBatchEnd(batch, logs) {
    setBatchCount((prevState) => prevState + 1);
  }
  const modelPredHandler = (predData, dataMax, dataMin) => {
    
    tf.loadLayersModel("localstorage://my-model-1").then((model) => {
      let prediction = model.predict(predData);
      prediction = prediction.dataSync()[0];
      prediction = reverse_transform(prediction, dataMax, dataMin);
      prediction = toFixed(prediction, 2);
      setPrediction(prediction);
      setShowPred(true);
    });
  };
  return (
    <div className="hero min-h-[83%] bg-base-100">
      <div className="card min-w-[66%] min-h-[83%] bg-base-200 shadow-xl flex flex-col items-center justify-center">
        <div className="flex flex-col">
        {showForm && <form onSubmit={stockSelectionHandler} className="flex flex-col items-center gap-16">
          <label className="m-5">
            Please enter the ticket symbol of the stock you want to predict
          </label>
          <div className="form-control w-full max-w-xs">
            <label className="label p-0">
              <span className="label-text">Ticker Symbol e.g. TSLA</span>
            </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs text-lg mb-12"
              value={ticker}
              onChange={(e) => {
                setTicker(e.target.value);
              }}
            />
            <button className="btn mt-2.5" type="submit">Predict</button>
            </div>
          </div>
          
        </form>}

        {showError ? (
            <>
          <h3 className="text-xl m-0 p-0 text-center">
            Ticker Invalid or the stock does not have enough historical data
          </h3>
        </>
        ) : (
          <></>
        )}
        </div>
        {training && <div className="text-2xl">
        <h6 className="mb-6">Please wait, the model is getting trained...</h6>
        <p>Epoch: {epochCount}/3</p>
        <p>Batch: {batchCount}/500</p>
      </div>}
        {showPred ? (
        <div className="flex flex-col gap-12 items-center">
          <p className="text-2xl mt-20">
            Predicted {ticker} price next trading day: <b>${prediction}</b>
          </p>
          <button className="btn btn-primary w-28" onClick={state} >Go Back</button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Predict;
