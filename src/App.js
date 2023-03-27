import './App.css';
import * as tf from '@tensorflow/tfjs';
import NavBar from './NavBar';
import Predict from './Predict';
import Footer from './Footer';
import Hero from './Hero';
import ReadMe from './ReadMe';
import { useState } from 'react';





function App() {
  const [UI, setUI] = useState(0)

const homeHandler = () => {
    setUI(0)
  }
const predictHandler = () => {
  setUI(1)
}
const readMeHandler = () => {
  setUI(2)
}
  return (
   <div className='app-div'>
     <NavBar readMe={readMeHandler} home={homeHandler}/>
     { UI === 0 && <Hero state={predictHandler}/> }
     { UI === 1 && <Predict state={homeHandler}/> }
     { UI === 2 && <ReadMe/> }
    <Footer/>
   </div>
  )
}

export default App;
