import { assets } from "../../assets/assets";
import "./Main.css";

export default function Main() {
  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        <div className="greet">
          <p>
            <span>Hello, Dev</span>
          </p>
          <p>How can I help you today?</p>
        </div>

        <div className="cards">
          <div className="card">
            <p>What is the best city in Nepal?</p>
            <img src={assets.compass_icon} alt="" />
          </div>
          <div className="card">
            <p>What is Bitcoin?</p>
            <img src={assets.bulb_icon} alt="" />
          </div>
          <div className="card">
            <p>How is a rainbow formed?</p>
            <img src={assets.message_icon} alt="" />
          </div>
          <div className="card">
            <p>What is C#?</p>
            <img src={assets.code_icon} alt="" />
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input type="text" placeholder="Enter a propmt..." />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Gemini may be wrong at times. Please check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
