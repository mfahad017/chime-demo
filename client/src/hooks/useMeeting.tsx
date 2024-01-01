import {
  DeviceLabels,
  useAudioVideo,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import {
  MeetingSessionConfiguration,
  CheckAudioConnectivityFeedback,
  CheckContentShareConnectivityFeedback,
  CheckVideoConnectivityFeedback,
  DefaultMeetingReadinessChecker,
  ConsoleLogger,
  LogLevel,
} from "amazon-chime-sdk-js";
import { useEffect, useState } from "react";

import axiosLib from "axios";

const axios = axiosLib.create({
  baseURL: "http://localhost:4000/",
});

const useMeeting = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [meetingId, setMeetingId] = useState("");

  const meetingManager = useMeetingManager();
  const audioVideo = useAudioVideo();
  const { roster } = useRosterState();

  const joinMeeting = async () => {
    try {
      setIsJoining(true);
      const response = await axios.get("?meetingId=therapy-session");

      const data = response.data;

      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        data.Meeting,
        data.Attendee
      );

      setCurrentUser(data.Attendee?.AttendeeId);
      setMeetingId(data.Meeting?.MeetingId);

      await meetingManager.join(meetingSessionConfiguration);

      await meetingManager.start();

      setIsStarted(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsJoining(false);
    }
  };

  class DataMessage {
    /** 

      can have multiple subscription on FE for main meeting room and breakout rooms

      meetingId or breakoutRoomId
    
     */
    topic: string;

    type:
      | "CHAT"
      | "SYSTEM_MESSAGE"
      | "MIC_MUTED"
      | "VIDEO_MUTED"
      | "HAND_RAISED"
      | "MIC_ALLOWED"
      | "VIDEO_ALLOWED"
      | "REQUEST_MIC_OPEN"
      | "REQUEST_VIDEO_OPEN";

    isBreakoutRoom: boolean;

    content: unknown;
  }

  const muteParticipants = async () => {
    audioVideo?.realtimeSendDataMessage("test", "participant is muted");

    const participants = Object.keys(roster).filter(
      (participant) => participant !== currentUser
    );

    if (!participants.length) return;

    await axios.post("/mute", {
      meetingId,
      attendeeId: participants[0],
    });
  };

  const muteAllParticipants = async () => {
    await axios.post("/mute-all", {
      meetingId,
      attendeeIds: [currentUser],
    });
  };

  const askForDevicePermission = async () => {
    try {
      meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
    } catch (e) {
      console.log(e);
    }
  };

  const leaveMeeting = async () => {
    const lm = await meetingManager.leave();

    console.log("leaveMeeting", lm);
  };

  const performConnectivityTest = async () => {
    console.log("---- connectivity test started ----");
    const logger = new ConsoleLogger("MyLogger", LogLevel.INFO);

    if (!meetingManager?.meetingSession) return;

    const meetingReadinessChecker = new DefaultMeetingReadinessChecker(
      logger,
      meetingManager?.meetingSession
    );

    const audioDevices =
      await meetingManager?.meetingSession.audioVideo.listAudioInputDevices();
    const videoDevices =
      await meetingManager?.meetingSession.audioVideo.listVideoInputDevices();
    // Tests audio connection
    const audioDeviceInfo = audioDevices[0];
    const audioFeedback = await meetingReadinessChecker.checkAudioConnectivity(
      audioDeviceInfo.deviceId
    );
    console.log(
      `Feedback result: ${CheckAudioConnectivityFeedback[audioFeedback]}`
    );

    // Test video connection
    const videoInputInfo = videoDevices[0];
    const videoFeedback = await meetingReadinessChecker.checkVideoConnectivity(
      videoInputInfo.deviceId
    );
    console.log(
      `Feedback result: ${CheckVideoConnectivityFeedback[videoFeedback]}`
    );

    // Tests content share connectivity
    const contentShareFeedback =
      await meetingReadinessChecker.checkContentShareConnectivity();
    console.log(
      `Feedback result: ${CheckContentShareConnectivityFeedback[contentShareFeedback]}`
    );

    return {
      audio: audioFeedback,
      video: videoFeedback,
      contentShare: contentShareFeedback,
    };
  };

  useEffect(() => {
    askForDevicePermission();
  }, []);

  return {
    joinMeeting,
    isJoining,
    isStarted,
    askForDevicePermission,
    leaveMeeting,
    setIsStarted,
    muteParticipants,
    muteAllParticipants,
    performConnectivityTest,
  };
};

export default useMeeting;
