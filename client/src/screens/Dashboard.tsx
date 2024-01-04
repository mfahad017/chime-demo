import {
  VideoTileGrid,
  useAudioVideo,
} from 'amazon-chime-sdk-component-library-react';

import { useEffect } from 'react';
import useMeeting from '../hooks/useMeeting';

const Dashboard = () => {
  const { joinMeeting, isJoining, isStarted } = useMeeting();
  const audioVideo = useAudioVideo();

  useEffect(() => {
    audioVideo?.realtimeSubscribeToReceiveDataMessage('test', (data) => {
      console.log('----data message----', new TextDecoder().decode(data.data));
    });
  }, [audioVideo]);

  if (isJoining) {
    return <div>Joining...</div>;
  }

  if (isStarted) {
    return (
      <div className="bg-red-500 w-full h-full">
        <VideoTileGrid
          layout={'standard'}
          noRemoteVideoView={<div>No one joined</div>}
        />
        <div>{/* <FeaturedRemoteVideos /> */}</div>
      </div>
    );
  }

  return <button onClick={joinMeeting}>Join</button>;
};

export default Dashboard;
