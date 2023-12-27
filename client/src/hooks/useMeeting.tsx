import {
  DeviceLabels,
  useAudioVideo,
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
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
  };
};

export default useMeeting;
