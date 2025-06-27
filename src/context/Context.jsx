import { createContext, useState } from "react";
import runChat from "../config/gemini";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useEffect } from "react";

marked.setOptions({
  breaks: true,
  highlight: function (code, lang) {
    return hljs.highlightAuto(code).value;
  },
});

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chatHistory, setChatHistory] = useState({});

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 25 * index);
  };

  const newChat = () => {
    setLoading(false);

    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let usedPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt(usedPrompt);

    // Use cached response if available
    if (chatHistory[usedPrompt]) {
      setResultData(chatHistory[usedPrompt]);
      setLoading(false);
      if (!prompt) {
        setPrevPrompts((prev) => [...prev, input]);
        setInput("");
      }
      return;
    }

    // Otherwise, fetch from API
    let response = await runChat(usedPrompt);

    // Format response
    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    // Convert Gemini's markdown to HTML
    let htmlResponse = marked.parse(response);

    // Display word-by-word
    const wordArray = htmlResponse.split(" ");
    for (let i = 0; i < wordArray.length; i++) {
      delayPara(i, wordArray[i] + " ");
    }

    // Cache response
    setChatHistory((prev) => ({
      ...prev,
      [usedPrompt]: htmlResponse,
    }));

    // Add to history list only if new
    if (!prompt) {
      setPrevPrompts((prev) => [...prev, input]);
      setInput("");
    }

    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
  }, [prevPrompts]);

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    chatHistory,
  };

  // On mount, restore history
  useEffect(() => {
    const savedPrompts = localStorage.getItem("prevPrompts");
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedPrompts) setPrevPrompts(JSON.parse(savedPrompts));
    if (savedHistory) setChatHistory(JSON.parse(savedHistory));
  }, []);

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
