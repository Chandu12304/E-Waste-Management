import { useState, useEffect } from "react";
import axios from "axios";
import "./Hero.css";
import sliderData from "./heroData";
import { BASE_URL } from "../config";

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Backend connection test
  useEffect(() => {
    axios.get(`${BASE_URL}/`)
      .then((res) => {
        console.log("backend connected to the frontend");
      })
      .catch((err) => {
        console.error("backend connection failed", err);
      });
  }, []);

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [index]);

  // Animated bar effect
  useEffect(() => {
    const bar = document.querySelector(".animated-bar-1");
    if (bar) {
      bar.style.animation = "none";
      void bar.offsetWidth; // Trigger reflow
    }
  }, [index]);

  return (
    <div className="hero-section">
      <div
        className="slide-img-1"
        style={{ backgroundImage: `url(${sliderData[index].imgURL})` }}
      ></div>
      <div className="slide-text-container">
        <h3 className="img-heading-1">{sliderData[index].heading}</h3>
        <p
          className="img-caption-1"
          dangerouslySetInnerHTML={{ __html: sliderData[index].caption }}
        ></p>
      </div>
      <div className="slide-switch-btns">
        <ul>
          {sliderData.map((data, i) => (
            <li key={data.id} onClick={() => setIndex(i)}>
              {data.heading}
            </li>
          ))}
        </ul>
      </div>
      <div className="animated-bar-1"></div>
    </div>
  );
};

export default Hero;
