import {
  CheckAudioConnectivityFeedback,
  CheckNetworkTCPConnectivityFeedback,
  CheckVideoConnectivityFeedback,
} from "amazon-chime-sdk-js";
import { useEffect, useState } from "react";
import useMeeting from "../hooks/useMeeting";

const ConnectivityCheck = ({
  onCheckComplete,
}: {
  onCheckComplete: () => void;
}) => {
  const [loadings, setLoadings] = useState({
    audio: true,
    video: true,
    tcp: true,
  });

  const [testResults, setTestResults] = useState({
    audio: "pending",
    video: "pending",
    tcp: "pending",
  });

  const { testAudioConnectivity, testVideoConnectivity, testTCPConnectivity } =
    useMeeting();

  const performConnectivityTests = async () => {
    console.log("----performConnectivityTests----");
    let testResults = "";

    const audioFeedback = await testAudioConnectivity();
    let audioResult = "";
    switch (audioFeedback) {
      case CheckAudioConnectivityFeedback.Succeeded:
        audioResult = "Succeeded";
        break;

      case CheckAudioConnectivityFeedback.AudioInputPermissionDenied:
        audioResult = "Permission denied";
        break;

      case CheckAudioConnectivityFeedback.AudioNotReceived:
        audioResult = "Audio not received";
        break;

      case CheckAudioConnectivityFeedback.AudioInputRequestFailed:
        audioResult = "Audio input request failed";
        break;

      case CheckAudioConnectivityFeedback.ConnectionFailed:
        audioResult = "Connection failed";
        break;
    }

    setTestResults((prev) => {
      return { ...prev, audio: audioResult };
    });
    setLoadings({ audio: false, video: true, tcp: true });

    const videoFeedback = await testVideoConnectivity();
    let videoResult = "";
    switch (videoFeedback) {
      case CheckVideoConnectivityFeedback.ConnectionFailed:
        videoResult = "Connection Failed";
        break;

      case CheckVideoConnectivityFeedback.VideoInputPermissionDenied:
        videoResult = "Permission denied";
        break;

      case CheckVideoConnectivityFeedback.VideoNotSent:
        videoResult = "Video not sent";
        break;

      case CheckVideoConnectivityFeedback.VideoInputRequestFailed:
        videoResult = "Video input request failed";
        break;

      case CheckVideoConnectivityFeedback.Succeeded:
        videoResult = "Succeeded";
        break;
    }
    setTestResults((prev) => {
      return { ...prev, video: videoResult };
    });
    setLoadings({ audio: false, video: false, tcp: true });

    const tcpFeedback = await testTCPConnectivity();
    let tcpResult = "";
    switch (tcpFeedback) {
      case CheckNetworkTCPConnectivityFeedback.ConnectionFailed:
        tcpResult = "Connection Failed";
        break;

      case CheckNetworkTCPConnectivityFeedback.Succeeded:
        tcpResult = "Succeeded";
        break;

      case CheckNetworkTCPConnectivityFeedback.ICENegotiationFailed:
        tcpResult = "ICE negotiation failed";
        break;

      case CheckNetworkTCPConnectivityFeedback.MeetingSessionURLsNotInitialized:
        tcpResult = "Meeting session URLs not initialized";
        break;
    }

    setTestResults((prev) => {
      return { ...prev, tcp: tcpResult };
    });

    setLoadings({ audio: false, video: false, tcp: false });

    setTimeout(() => {
      onCheckComplete();
    }, 2000);
  };

  useEffect(() => {
    performConnectivityTests();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "3rem" }}
      >
        Connectivity Check
      </h1>

      {Object.entries(loadings).map(([key, isLoading]) => (
        <p
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}:
          {isLoading ? (
            <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
              checking ...
            </span>
          ) : (
            <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
              {testResults[key]}
            </span>
          )}
        </p>
      ))}
    </div>
  );
};

export default ConnectivityCheck;
