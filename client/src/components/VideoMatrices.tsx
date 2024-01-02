import { useMediaStreamMetrics } from "amazon-chime-sdk-component-library-react";
import { ReactElement, memo } from "react";
import { assessVideoQuality } from "../utils/video.utils";

const VideoMatrices = () => {
  const metrics = useMediaStreamMetrics();
  const rtcStatsReportValues: ReactElement[] = [];

  metrics.rtcStatsReport?.forEach((report) =>
    rtcStatsReportValues.push(
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(report, null, 2)}
      </pre>
    )
  );

  const videoQuality = assessVideoQuality(metrics ?? null);

  return (
    <div
      style={{
        background: "#f5f5f5",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        height: "40vh",
        width: "30vw",
        position: "fixed",
        top: "10vh",
        right: "30vw",
        overflowY: "auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        zIndex: 1000,
      }}
    >
      <h1
        style={{
          borderBottom: "2px solid #0078d4",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        Video Quality: {videoQuality}
      </h1>
      <div style={{ lineHeight: "1.6", textAlign: "left" }}>
        <p>
          audioPacketsSentFractionLossPercent:{" "}
          {metrics.audioPacketsSentFractionLossPercent}
        </p>
        <p>
          audioPacketsReceivedFractionLossPercent:{" "}
          {metrics.audioPacketsReceivedFractionLossPercent}
        </p>
        <p>audioSpeakerDelayMs: {metrics.audioSpeakerDelayMs}</p>
        <p>
          audioUpstreamRoundTripTimeMs: {metrics.audioUpstreamRoundTripTimeMs}
        </p>
        <p>audioUpstreamJitterMs: {metrics.audioUpstreamJitterMs}</p>
        <p>audioDownstreamJitterMs: {metrics.audioDownstreamJitterMs}</p>
        <p>currentRoundTripTimeMs: {metrics.currentRoundTripTimeMs}</p>
        <p>availableOutgoingBandwidth: {metrics.availableOutgoingBandwidth}</p>
        <p>availableIncomingBandwidth: {metrics.availableIncomingBandwidth}</p>
        <p>videoStreamMetrics:</p>
        <code
          style={{
            display: "block",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <pre>{JSON.stringify(metrics.videoStreamMetrics, null, 2)}</pre>
        </code>
        <p>rtcStatsReport</p>
        <code
          style={{
            display: "block",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {...rtcStatsReportValues}
        </code>
      </div>
    </div>
  );
};

const MemoizedVideoMatrices = memo(VideoMatrices);
export default MemoizedVideoMatrices;
