import { useContext, useRef, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import "./Main.css";
import { Context } from "../../context/Context";

export default function Main() {
  const resultRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  // Auto-scroll only if user hasn't scrolled manually
  useEffect(() => {
    if (isAutoScroll && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [resultData, isAutoScroll]);

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini-Clone (Gemini 2.0 Flash Model)</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Animesh</span>
              </p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div
                className="card"
                onClick={() => onSent("What is the best city in Nepal?")}
              >
                <p>What is the best city in Nepal?</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card" onClick={() => onSent("What is Bitcoin?")}>
                <p>What is Bitcoin?</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() => onSent("How is a rainbow formed?")}
              >
                <p>How is a rainbow formed?</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card" onClick={() => onSent("What is C#?")}>
                <p>What is C#?</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>

            <div
              className="result-scrollable"
              ref={scrollContainerRef}
              onScroll={() => {
                const el = scrollContainerRef.current;
                if (!el) return;

                const nearBottom =
                  el.scrollHeight - el.scrollTop - el.clientHeight < 100;
                setIsAutoScroll(nearBottom);
              }}
            >
              <div className="result-data">
                <img src={assets.gemini_icon} alt="" />
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <div
                    className="result-html"
                    dangerouslySetInnerHTML={{ __html: resultData }}
                  />
                )}
              </div>
              <div ref={resultRef} />
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a propmt..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents newline
                  if (input.trim()) {
                    const prompt = input; // Save current input
                    setInput(""); // Clear immediately
                    onSent(prompt); // Send to model
                  }
                }
              }}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? (
                <img
                  onClick={() => {
                    const prompt = input;
                    setInput("");
                    onSent(prompt);
                  }}
                  src={assets.send_icon}
                  alt=""
                />
              ) : null}
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
