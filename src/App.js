import React, { useState } from "react";

import "./styles.css";

import "./jsplayer";

import xml2js from "xml2js";

const xmlParser = xml2js.parseString;

export default function App() {
  const [text, setText] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [commentsFile, setCommentsFile] = useState("");
  const [delay, setDelay] = useState(1000);
  const [ready, setReady] = useState(false);

  const _increaseDelay = () => {
    setDelay(delay + 1000);
  };

  const _decreaseDelay = () => {
    setDelay(delay - 1000);
  };

  const _submitUrl = async (e) => {
    e.preventDefault();
    console.log("--Submit--");

    setFileURL(text);

    //Since js-player is an custom element (Shadow DOM)
    //We have to access using shadow doom methods
    //const divs = document.getElementsByTagName("js-player");
    //divs[0].shadowRoot.getElementById("動画").setAttribute("src", text);
  };

  const _uploadComments = async (e) => {
    e.preventDefault();
    console.log("--upload--");

    let ary = [];

    let cf = document.getElementById("commentsFile").files[0];
    let reader = new FileReader();
    reader.readAsText(cf, "UTF-8");
    reader.onload = function (evt) {
      xmlParser(evt.target.result, (err, esiObj) => {
        if (err) {
          console.log(err);
        }
        let { chat } = esiObj.packet;
        for (let e of chat) {
          ary.push([e._, e.$.vpos]);
        }
        //console.log(JSON.stringify(ary));
        setCommentsFile(JSON.stringify(ary));
      });
    };
  };

  const _createNewPlayer = async (e) => {
    e.preventDefault();
    console.log("--create--");
    setReady(true);
  };

  return (
    <div className="App" id="App">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div>
            <h2>
              Himado HTML5 Player{" "}
              <i className="fa fa-video-camera" aria-hidden="true"></i>
            </h2>
            <div>
              {/**FILE URL */}
              <div className="row">
                <div>
                  <span className="m-1">
                    {fileURL === "" ? (
                      <i className="fa fa-square-o" aria-hidden="true"></i>
                    ) : (
                      <i
                        className="fa fa-check-square-o"
                        aria-hidden="true"
                      ></i>
                    )}
                  </span>
                  <span className="m-1">
                    <i className="fa fa-file-audio-o" aria-hidden="true"></i>
                  </span>

                  <input
                    type="text"
                    style={{ width: "50%" }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={"Video URL"}
                  />
                  <button
                    className="btn btn-secondary m-1"
                    type="submit"
                    onClick={(e) => {
                      _submitUrl(e);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/**COMMENT FILE*/}
              <div className="row">
                <div>
                  <span className="m-1">
                    {commentsFile === "" ? (
                      <i className="fa fa-square-o" aria-hidden="true"></i>
                    ) : (
                      <i
                        className="fa fa-check-square-o"
                        aria-hidden="true"
                      ></i>
                    )}
                  </span>
                  <span className="m-1">
                    <i className="fa fa-commenting-o" aria-hidden="true"></i>
                  </span>
                  <input
                    style={{ width: "76%" }}
                    type="file"
                    id="commentsFile"
                    onChange={(e) => _uploadComments(e)}
                  />
                </div>
              </div>

              {/**COMMENT SPEED */}
              <div className="d-inline-flex m-1">
                <button
                  className="btn btn-primary m-2"
                  onClick={_increaseDelay}
                >
                  <i class="fa fa-plus m-1" aria-hidden="true"></i>
                </button>
                <span className="m-2">
                  <h4> Comment Delay: {delay / 1000}s </h4>
                </span>
                <button className="btn btn-danger m-2" onClick={_decreaseDelay}>
                  <i class="fa fa-minus m-1" aria-hidden="true"></i>{" "}
                </button>
              </div>

              {/** START */}
              {!ready ? (
                <>
                  <div
                    className="m-2 border"
                    style={{ width: 500, height: 450 }}
                  >
                    <h3 className="m-1">Instruction</h3>
                    <div className="m-3" style={{ textAlign: "left" }}>
                      <p>
                        Since flash is abandon at 1/12/2021, himado's my source
                        function is no longer working. This app gives the same
                        functionality that allow you to watch the video with
                        himado comments.
                      </p>
                      <p>
                        Please do the following steps to play the video with
                        comments:
                      </p>
                      <p>
                        Step 1 - <b>Submit</b> an working video url
                      </p>
                      <small>
                        Ex:
                        https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4{" "}
                      </small>
                      <p>
                        <small>
                          <b>Important!</b> Some mp4 links may not be working.
                        </small>
                      </p>

                      <p>
                        Step 2 - <b>Download</b> the comments file from himado
                        video, then <b>Choose</b> the file in this app.
                      </p>

                      <p>
                        Step 3 - After you finish step 1 and step 2, the start
                        button will be unlock. <b>Click</b> it and <b>Enjoy</b>{" "}
                        your video
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={fileURL === "" || commentsFile === ""}
                    className="btn btn-primary m-1"
                    onClick={(e) => _createNewPlayer(e)}
                  >
                    <i className="fa fa-play" aria-hidden="true"></i> Start
                  </button>
                </>
              ) : (
                <p> </p>
              )}
            </div>
            {ready && (
              <js-player file={fileURL} comment={commentsFile} delay={delay}>
                {" "}
              </js-player>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
