import {
  Camera,
  ControlBar,
  ControlBarButton,
  HandRaise,
  Laptop,
  Microphone,
  Phone,
  Presenter,
  Roster,
  RosterCell,
  RosterGroup,
  RosterHeader,
  Sound,
  VideoTileGrid,
  useAudioVideo,
  useBackgroundBlur,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useSelectVideoQuality,
  useToggleLocalMute,
  useVideoInputs,
} from "amazon-chime-sdk-component-library-react";
import { isVideoTransformDevice } from "amazon-chime-sdk-js";

import { useEffect, useState } from "react";
import useMeeting from "../hooks/useMeeting";

const Dashboard = () => {
  const [muted, setMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const {
    joinMeeting,
    isJoining,
    isStarted,
    leaveMeeting,
    setIsStarted,
    muteParticipants,
    muteAllParticipants,
  } = useMeeting();
  const { toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();
  const selectVideoQuality = useSelectVideoQuality();
  const mute = useToggleLocalMute();
  const meetingManager = useMeetingManager();
  const { isLocalUserSharing } = useContentShareState();
  const { selectedDevice } = useVideoInputs();
  const audioVideo = useAudioVideo();

  const { isBackgroundBlurSupported, createBackgroundBlurDevice } =
    useBackgroundBlur();
  const [isVideoTransformCheckBoxOn, setisVideoTransformCheckBoxOn] =
    useState(false);

  useEffect(() => {
    audioVideo?.realtimeSubscribeToReceiveDataMessage("test", (data) => {
      console.log("----data message----", new TextDecoder().decode(data.data));
    });
  }, [audioVideo]);

  useEffect(() => {
    async function toggleBackgroundBlur() {
      try {
        let current = selectedDevice;
        if (isVideoTransformCheckBoxOn) {
          current = await createBackgroundBlurDevice(selectedDevice);
        } else {
          if (isVideoTransformDevice(selectedDevice)) {
            current = await selectedDevice.intrinsicDevice();
          }
        }
        await meetingManager.startVideoInputDevice(current);
      } catch (error) {
        console.error("Failed to toggle Background Blur");
      }
    }

    toggleBackgroundBlur();
  }, [isVideoTransformCheckBoxOn]);

  const onClick = () => {
    setisVideoTransformCheckBoxOn((current) => !current);
  };

  const microphoneButtonProps = {
    icon: muted ? <Microphone muted /> : <Microphone />,
    onClick: () => {
      setMuted(!muted);
      mute.toggleMute();
    },
    label: "Mute",
    popOver: [
      {
        onClick: () => muteAllParticipants(),
        children: <span>Mute All</span>,
      },
      {
        onClick: () => muteParticipants(),
        children: <span>Mute Single</span>,
      },
    ],
  };

  const cameraButtonProps = {
    icon: cameraActive ? <Camera /> : <Camera disabled />,
    popOver: [
      {
        onClick: () => selectVideoQuality("360p"),
        children: <span>360p</span>,
      },
      {
        onClick: () => selectVideoQuality("540p"),
        children: <span>540p</span>,
      },
      {
        onClick: () => selectVideoQuality("720p"),
        children: <span>720p</span>,
      },
    ],
    onClick: () => {
      toggleVideo();
      setCameraActive(!cameraActive);
    },
    label: "Camera",
  };

  const handRaiseProps = {
    icon: <HandRaise />,
    onClick: () => console.log("Hand Raised"),
    label: "Raise Hand",
  };

  const hangUpButtonProps = {
    icon: <Phone />,
    onClick: () => {
      leaveMeeting();
      setIsStarted(false);
    },
    label: "End",
  };

  const volumeButtonProps = {
    icon: <Sound />,
    onClick: () => console.log("Volume button clicked"),
    popOver: [
      {
        onClick: () => console.log("volume popover option 1"),
        children: <span>Some option text</span>,
      },
      {
        onClick: () => console.log("volume popover option 2"),
        children: <span>More option text</span>,
      },
    ],
    label: "Volume",
  };

  const laptopButtonProps = {
    icon: isLocalUserSharing ? <Presenter /> : <Laptop />,
    onClick: () => toggleContentShare(),
    label: "Screen",
  };

  if (isJoining) {
    return <div>Joining...</div>;
  }

  const Menu = () => (
    <>
      <div
        style={{
          padding: ".5rem 1rem",
          cursor: "pointer",
        }}
      >
        Message user
      </div>
      <div
        style={{
          padding: ".5rem 1rem",
          cursor: "pointer",
        }}
      >
        Kick user
      </div>
    </>
  );

  if (isStarted) {
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            height: "80vh",
            width: "100vh",
          }}
        >
          <VideoTileGrid noRemoteVideoView={<div>No one joined</div>} />
          {/* <FeaturedRemoteVideos /> */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: "10px",
              marginRight: "10px",
            }}
          >
            <ControlBar showLabels layout="bottom" css="height:10vh;">
              <ControlBarButton {...microphoneButtonProps} />
              <ControlBarButton {...volumeButtonProps} />
              <ControlBarButton {...cameraButtonProps} />
              <ControlBarButton {...handRaiseProps} />
              <ControlBarButton {...laptopButtonProps} />
              <ControlBarButton {...hangUpButtonProps} />
              <div>
                {isBackgroundBlurSupported && (
                  <button onClick={onClick}>
                    {isVideoTransformDevice(selectedDevice)
                      ? "Disable Blur"
                      : "Blur Background"}
                  </button>
                )}
              </div>
            </ControlBar>
          </div>
        </div>
        <div className="fixed right-0 h-full top-0">
          <Roster
            className=""
            css="position:fixed; top:0; right:0; height:90vh"
          >
            <RosterHeader
              title="Present"
              badge={2}
              onClose={() => {}}
              searchValue=""
              onSearch={() => {}}
            />
            <RosterGroup>
              <RosterCell
                name="Michael Scott"
                subtitle="Regional Manager"
                muted={false}
                videoEnabled={true}
                poorConnection={false}
                sharingContent={false}
                menu={<Menu />}
              />
            </RosterGroup>
            <RosterGroup title="Left" badge={2}>
              <RosterCell name="Dwight" subtitle="Assistant regional manager" />
              <RosterCell name="Mike the Magic" subtitle="Magician" />
              <RosterCell name="Mike the Magic" subtitle="Magician" />
              <RosterCell name="Mike the Magic" subtitle="Magician" />
              <RosterCell name="Mike the Magic" subtitle="Magician" />
              <RosterCell name="Mike the Magic" subtitle="Magician" />
            </RosterGroup>
          </Roster>
        </div>
      </div>
    );
  }

  return <button onClick={joinMeeting}>Join</button>;
};

export default Dashboard;
