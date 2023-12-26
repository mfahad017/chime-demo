import { Menu } from '@headlessui/react';
import {
  VideoQuality,
  useAudioVideo,
  useLocalVideo,
  useSelectVideoQuality,
  useVideoInputs,
} from 'amazon-chime-sdk-component-library-react';
import { VideoInputDevice } from 'amazon-chime-sdk-js';

export const VideoInputCustom = () => {
  const vi = useVideoInputs();
  const vq = useSelectVideoQuality();
  const lv = useLocalVideo();
  const av = useAudioVideo();

  const vqArray: VideoQuality[] = ['360p', '540p', '720p'];

  function handleVq(selectedVq: VideoQuality) {
    vq(selectedVq);
  }

  function handleVideoToggle() {
    lv.toggleVideo();
  }

  function handleSelectVideoInputDevice(p: VideoInputDevice) {
    if (!av) return;

    av.startVideoInput(p);
  }

  console.log(av?.getVideoInputQualitySettings());

  return (
    <div className=" rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
      <h1>Video</h1>
      <div className="flex flex-row gap-4">
        <button
          className={`bg-emerald-500 p-2 rounded text-white ${
            !lv.isVideoEnabled && 'line-through'
          } `}
          onClick={handleVideoToggle}
        >
          Toggle
        </button>
        <Menu as={'div'} className="relative ">
          <Menu.Button className="bg-emerald-500 p-2 rounded text-white">
            Device
          </Menu.Button>
          <Menu.Items className="absolute z-10 top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded overflow-clip">
            {vi.devices.map((device) => {
              return (
                <Menu.Item
                  key={device.deviceId}
                  onClick={() => handleSelectVideoInputDevice(device)}
                  as={'button'}
                  className={`py-2 px-4 hover:bg-blue-500 hover:text-white transition-all ${
                    vi.selectedDevice === device.deviceId &&
                    'bg-emerald-100 text-slate-400'
                  }}`}
                >
                  {device.label}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
        {/* Video Quality */}
        <Menu as={'div'} className="relative ">
          <Menu.Button className="bg-emerald-500 p-2 rounded text-white">
            Quality
          </Menu.Button>
          <Menu.Items className="absolute z-10 top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded overflow-clip">
            {vqArray.map((vqItem) => {
              return (
                <Menu.Item
                  as={'div'}
                  className={`py-2  px-4 hover:bg-blue-500 hover:text-white transition-all ${
                    av?.getVideoInputQualitySettings()?.videoHeight ===
                      (() => {
                        const g = Number(vqItem.replace('p', ''));
                        console.log(g);
                        return g;
                      })() && 'bg-emerald-100 text-slate-400'
                  }`}
                >
                  {({ active }) => (
                    <button
                      onClick={() => handleVq(vqItem)}
                      className={`${active && ' '}`}
                    >
                      {vqItem}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};
