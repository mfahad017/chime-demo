import {
  Camera,
  ControlBar,
  ControlBarButton,
  HandRaise,
  Laptop,
  Microphone,
  Phone,
  Presenter,
  Sound,
  useBackgroundBlur,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useSelectVideoQuality,
  useToggleLocalMute,
  useVideoInputs,
} from 'amazon-chime-sdk-component-library-react';
import React, { useEffect, useState } from 'react';
import useMeeting from '../hooks/useMeeting';
import { isVideoTransformDevice } from 'amazon-chime-sdk-js';

export const Controls = () => {
  const { joinMeeting, isJoining, isStarted, leaveMeeting } = useMeeting();

  const [isVideoTransformCheckBoxOn, setisVideoTransformCheckBoxOn] =
    useState(false);

  const [muted, setMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const { toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();
  const selectVideoQuality = useSelectVideoQuality();
  const mute = useToggleLocalMute();
  const meetingManager = useMeetingManager();
  const { isLocalUserSharing } = useContentShareState();
  const { selectedDevice } = useVideoInputs();

  const { isBackgroundBlurSupported, createBackgroundBlurDevice } =
    useBackgroundBlur();

  const handRaiseProps = {
    icon: <HandRaise />,
    onClick: () => console.log('Hand Raised'),
    label: 'Raise Hand',
  };

  const hangUpButtonProps = {
    icon: <Phone />,
    onClick: () => {
      leaveMeeting();
      setIsStarted(false);
    },
    label: 'End',
  };

  const volumeButtonProps = {
    icon: <Sound />,
    onClick: () => console.log('Volume button clicked'),
    popOver: [
      {
        onClick: () => console.log('volume popover option 1'),
        children: <span>Some option text</span>,
      },
      {
        onClick: () => console.log('volume popover option 2'),
        children: <span>More option text</span>,
      },
    ],
    label: 'Volume',
  };

  const laptopButtonProps = {
    icon: isLocalUserSharing ? <Presenter /> : <Laptop />,
    onClick: () => toggleContentShare(),
    label: 'Screen',
  };

  const onClick = () => {
    setisVideoTransformCheckBoxOn((current) => !current);
  };

  const microphoneButtonProps = {
    icon: muted ? <Microphone muted /> : <Microphone />,
    onClick: () => {
      setMuted(!muted);
      mute.toggleMute();
    },
    label: 'Mute',
    // popOver: [
    //   {
    //     onClick: () => muteAllParticipants(),
    //     children: <span>Mute All</span>,
    //   },
    //   {
    //     onClick: () => muteParticipants(),
    //     children: <span>Mute Single</span>,
    //   },
    // ],
  };

  const cameraButtonProps = {
    icon: cameraActive ? <Camera /> : <Camera disabled />,
    popOver: [
      {
        onClick: () => selectVideoQuality('360p'),
        children: <span>360p</span>,
      },
      {
        onClick: () => selectVideoQuality('540p'),
        children: <span>540p</span>,
      },
      {
        onClick: () => selectVideoQuality('720p'),
        children: <span>720p</span>,
      },
    ],
    onClick: () => {
      toggleVideo();
      setCameraActive(!cameraActive);
    },
    label: 'Camera',
  };

  // useEffect(() => {
  //   async function toggleBackgroundBlur() {
  //     try {
  //       let current = selectedDevice;
  //       if (isVideoTransformCheckBoxOn) {
  //         current = await createBackgroundBlurDevice(selectedDevice);
  //       } else {
  //         if (isVideoTransformDevice(selectedDevice)) {
  //           current = await selectedDevice.intrinsicDevice();
  //         }
  //       }
  //       await meetingManager.startVideoInputDevice(current);
  //     } catch (error) {
  //       console.error('Failed to toggle Background Blur');
  //     }
  //   }

  //   toggleBackgroundBlur();
  // }, [isVideoTransformCheckBoxOn]);

  return (
    <div
      className="w-full"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '10px',
        marginRight: '10px',
      }}
    >
      <ControlBar showLabels layout="bottom" className="h-[10vh]">
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
                ? 'Disable Blur'
                : 'Blur Background'}
            </button>
          )}
        </div>
      </ControlBar>
    </div>
  );
};
