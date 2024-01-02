export const assessVideoQuality = (data: unknown | null) => {
  console.log("🚀 ~ file: video.utils.ts:2 ~ assessVideoQuality ~ data:", data);
  if (!data) return "Poor";
  const { videoStreamMetrics } = data;
  if (!Object.keys(videoStreamMetrics)[0]) return "Poor";
  const videoMetrics =
    videoStreamMetrics[Object.keys(videoStreamMetrics)[0]][
      Object.keys(videoStreamMetrics[Object.keys(videoStreamMetrics)[0]])[0]
    ];

  // Define thresholds
  const bitrateThreshold = {
    poor: 20000,
    average: 50000,
    good: 100000,
    veryGood: 300000,
  };
  const frameRateThreshold = { poor: 5, average: 15, good: 24, veryGood: 30 };
  const resolutionThreshold = {
    poor: 480,
    average: 720,
    good: 1080,
    veryGood: 1440,
  };
  const packetLossThreshold = { poor: 5, average: 2, good: 1, veryGood: 0 };
  const jitterThreshold = { poor: 30, average: 20, good: 15, veryGood: 10 };
  const delayThreshold = { poor: 150, average: 100, good: 50, veryGood: 25 };

  // Calculate scores
  let score = 0;
  score +=
    videoMetrics.videoDownstreamBitrate > bitrateThreshold.veryGood
      ? 5
      : videoMetrics.videoDownstreamBitrate > bitrateThreshold.good
      ? 4
      : videoMetrics.videoDownstreamBitrate > bitrateThreshold.average
      ? 3
      : videoMetrics.videoDownstreamBitrate > bitrateThreshold.poor
      ? 2
      : 1;

  score +=
    videoMetrics.videoDownstreamFramesDecodedPerSecond >=
    frameRateThreshold.veryGood
      ? 5
      : videoMetrics.videoDownstreamFramesDecodedPerSecond >=
        frameRateThreshold.good
      ? 4
      : videoMetrics.videoDownstreamFramesDecodedPerSecond >=
        frameRateThreshold.average
      ? 3
      : videoMetrics.videoDownstreamFramesDecodedPerSecond >=
        frameRateThreshold.poor
      ? 2
      : 1;

  const resolution = Math.min(
    videoMetrics.videoDownstreamFrameHeight,
    videoMetrics.videoDownstreamFrameWidth
  );
  score +=
    resolution >= resolutionThreshold.veryGood
      ? 5
      : resolution >= resolutionThreshold.good
      ? 4
      : resolution >= resolutionThreshold.average
      ? 3
      : resolution >= resolutionThreshold.poor
      ? 2
      : 1;

  score +=
    videoMetrics.videoDownstreamPacketLossPercent <=
    packetLossThreshold.veryGood
      ? 5
      : videoMetrics.videoDownstreamPacketLossPercent <=
        packetLossThreshold.good
      ? 4
      : videoMetrics.videoDownstreamPacketLossPercent <=
        packetLossThreshold.average
      ? 3
      : videoMetrics.videoDownstreamPacketLossPercent <=
        packetLossThreshold.poor
      ? 2
      : 1;

  score +=
    videoMetrics.videoDownstreamJitterMs <= jitterThreshold.veryGood
      ? 5
      : videoMetrics.videoDownstreamJitterMs <= jitterThreshold.good
      ? 4
      : videoMetrics.videoDownstreamJitterMs <= jitterThreshold.average
      ? 3
      : videoMetrics.videoDownstreamJitterMs <= jitterThreshold.poor
      ? 2
      : 1;

  score +=
    videoMetrics.videoDownstreamDelayMs <= delayThreshold.veryGood
      ? 5
      : videoMetrics.videoDownstreamDelayMs <= delayThreshold.good
      ? 4
      : videoMetrics.videoDownstreamDelayMs <= delayThreshold.average
      ? 3
      : videoMetrics.videoDownstreamDelayMs <= delayThreshold.poor
      ? 2
      : 1;

  // Determine quality
  const averageScore = score / 6;
  if (averageScore >= 4.5) return "Excellent";
  if (averageScore >= 3.5) return "Very Good";
  if (averageScore >= 2.5) return "Good";
  if (averageScore >= 1.5) return "Average";
  return "Poor";
};
