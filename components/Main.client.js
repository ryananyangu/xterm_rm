import React, { useRef, useState } from "react";

export default function Main() {
  const processedVid = useRef();
  const rawVideo = useRef();
  const startBtn = useRef();
  const closeBtn = useRef();
  const snapBtn = useRef();
  const text_canvas = useRef();
  const [output, setOutput] = useState(null);

  let recordedChunks = [];
  let options = { mimeType: "video/webm; codecs=vp9" };
  let c_out, mediaRecorder, localStream, video_in;

  const startCamHandler = async () => {
    console.log("Starting webcam and mic ..... ");
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    //populate video element
    rawVideo.current.srcObject = localStream;
    video_in = rawVideo.current;
    rawVideo.current.addEventListener("loadeddata", (ev) => {
      console.log("loaded data.");
    });

    mediaRecorder = new MediaRecorder(localStream, options);
    mediaRecorder.ondataavailable = (event) => {
      console.log("data-available");
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
    mediaRecorder.start();
  };

  const stopCamHandler = async () => {
    console.log("Hanging up the call ...");
    localStream.getTracks().forEach((track) => track.stop());

    localStream.getTracks().forEach(function (track) {
      track.stop();
    });
  };

  const captureSnapshot = async () => {
    c_out = processedVid.current;

    c_out
      .getContext("2d")
      .drawImage(video_in, 0, 0, video_in.videoWidth, video_in.videoHeight);

    let img_url = c_out.toDataURL("image/png");

    uploadVideo(img_url);

    await stopCamHandler();
  };

  const uploadVideo = async (base64) => {
    console.log("uploading to backend...");
    try {
      fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64 }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        console.log("successfull session", response.status);
        console.log(
          response.text().then((result) => {
            setOutput(result);
          })
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <h1>Extract Webcam Texts</h1>
          <div className="container">
            <div className="row">
              <div className="column">
                <video
                  className="display"
                  width={800}
                  height={450}
                  ref={rawVideo}
                  autoPlay
                  playsInline
                ></video>
              </div>
              <div className="column">
                <canvas
                  className="display"
                  width={800}
                  height={450}
                  ref={processedVid}
                ></canvas>
              </div>
              {output && (
              <div className="column">
                  <div ref={text_canvas}>
                    {output}
                  </div>
              </div>
                )}
            </div>
          </div>

          <div className="buttons">
            <button className="button" onClick={startCamHandler} ref={startBtn}>
              Start Webcam
            </button>
            <button className="button" onClick={stopCamHandler} ref={closeBtn}>
              Close camera
            </button>

            <button className="button" onClick={captureSnapshot} ref={snapBtn}>
              Capture snapshot and save
            </button>
          </div>
    </>
  );
}
