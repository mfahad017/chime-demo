import Container from "@cloudscape-design/components/container";
import "@cloudscape-design/global-styles/index.css";
import {
  AudioInputControl,
  AudioOutputControl,
  ContentShareControl,
  ControlBar,
  ControlBarButton,
  DeviceLabels,
  Phone,
  VideoInputControl,
  VideoTileGrid,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import axiosLib from "axios";
import { render } from "react-dom";
import "./App.css";
import { AudioInputCustom } from "./components/AudioInputCustom";
import { AudioOutputCustom } from "./components/AudioOutputCustom";
import { VideoInputCustom } from "./components/VideoInputCustom";
import ShareScreenCustom from "./components/ShareScreenCustom";

const axios = axiosLib.create({
  // baseURL: 'https://bj32w09s-5000.inc1.devtunnels.ms/',
  baseURL: "http://localhost:5000/",
});

function App() {
  const meetingManager = useMeetingManager();

  const handleStartMeeting = async () => {
    try {
      const { data } = await axios.get("?meetingId=meeting-with-fahad");

      const meetingId = data.Meeting.MeetingId;
      const attendeeId = data.Attendee.AttendeeId;
      const externalMeetingId = data.Meeting.ExternalMeetingId;

      render(
        <p>Meeting ID: {meetingId}</p>,
        document.getElementById("meetingId")
      );

      render(
        <p>Attendee ID: {attendeeId}</p>,
        document.getElementById("attendeeId")
      );
      render(
        <p>External Meeting ID: {externalMeetingId}</p>,
        document.getElementById("externalMeetingId")
      );

      const meetingSessionConfiguration = new MeetingSessionConfiguration(
        data.Meeting,
        data.Attendee
      );
      console.log("meetingSessionConfiguration", meetingSessionConfiguration);
      const options = {
        deviceLabels: DeviceLabels.AudioAndVideo,
      };

      // Use the join API to create a meeting session
      const g = await meetingManager.join(meetingSessionConfiguration);
      console.log(
        "Created meeting session:",
        data.Meeting,
        "for:  ",
        data.Attendee
      );

      console.log("meetingManage join", g);

      // At this point you can let users setup their devices, or start the session immediately
      await meetingManager.start();

      meetingManager.invokeDeviceProvider(DeviceLabels.AudioAndVideo);
      console.log("Meeting started");
    } catch (err) {
      console.log(err);
    }
  };

  const leaveMeeting = async () => {
    const lm = await meetingManager.leave();

    console.log("leaveMeeting", lm);
  };

  return (
    <div>
      <div className=" mt-32 rounded-lg flex flex-col gap-4">
        {/* Start Meeting */}
        <div className="rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
          <button
            className="bg-emerald-500 p-2 rounded text-white"
            onClick={handleStartMeeting}
          >
            Join Meeting
          </button>
        </div>

        <VideoInputCustom />
        <AudioInputCustom />
        <AudioOutputCustom />
        {/* End Call */}
        <div className="rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
          <button
            className="bg-emerald-500 p-2 rounded text-white"
            onClick={leaveMeeting}
          >
            End Call
          </button>
        </div>

        {/* Share Screen */}

        <ShareScreenCustom />

        {/* Meeting Info */}
        <div className="rounded-lg flex flex-col gap-4 bg-emerald-100 p-10">
          <div
            className="bg-emerald-800 p-2 rounded text-white"
            id="externalMeetingId"
          ></div>
          <div
            className="bg-emerald-800 p-2 rounded text-white"
            id="attendeeId"
          ></div>
          <div
            className="bg-emerald-800 p-2 rounded text-white"
            id="meetingId"
          ></div>
        </div>
      </div>
      {/* <Container
        fitHeight
        header={
          <Header
            variant="h2"
            description="This is the second workshop App.js build"
          >
            Amazon Chime SDK React app
          </Header>
        }
      >
        <div>
          <Button id="join" onClick={handleStartMeeting}>
            Join Meeting
          </Button>
          <SpaceBetween size="s">
            <div id="externalMeetingId"></div>
            <div id="attendeeId"></div>
            <div id="meetingId"></div>
          </SpaceBetween>
        </div>
      </Container> */}
      <Container>
        <div
          id="videoWindow"
          style={{
            marginTop: "0rem",
            height: "45rem",
            width: "60rem",
            display: "flex",
            top: "50%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <ControlBar layout="undocked-vertical" showLabels>
              <AudioInputControl />
              <AudioOutputControl />
              <div className=" relative">
                <VideoInputControl className="w-96 h-28" />
              </div>
              <ControlBarButton
                icon={<Phone />}
                onClick={leaveMeeting}
                label="End"
              />
            </ControlBar>
          </div>
          <div id="video">
            <div
              className=" "
              style={{
                marginTop: "0rem",
                height: "40rem",
                width: "53rem",
                display: "flex",
                top: "50%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "solid 1px black",
              }}
            >
              <ContentShareControl />
              <VideoTileGrid
                layout="featured"
                noRemoteVideoView="   ::: No remote video yet (send this URL to a friend, or open it in an another browser window to add a remote participant) :::"
                css="border: solid 5px red"
              />
              {/* <TilesCustom /> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
