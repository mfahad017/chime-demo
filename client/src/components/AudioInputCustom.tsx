import { Menu } from '@headlessui/react';
import {
  // VideoQuality,
  useAudioInputs,
  useAudioVideo,
  useToggleLocalMute,
} from 'amazon-chime-sdk-component-library-react';
import { AudioInputDevice } from 'amazon-chime-sdk-js';

export const AudioInputCustom = () => {
  const ai = useAudioInputs();

  const mute = useToggleLocalMute();

  const av = useAudioVideo();

  function handleSelectAudioInputDevice(p: AudioInputDevice) {
    if (!av) return;

    av.startAudioInput(p);
  }

  function handleAudioMuteToggle() {
    mute.toggleMute();
  }

  return (
    <div className="rounded-lg flex flex-col gap-4 items-center bg-emerald-100 p-10">
      <h1>Audio Input</h1>
      <div className="flex flex-row gap-4">
        <button
          className={`bg-emerald-500 p-2 rounded text-white ${
            mute.muted && 'line-through'
          }`}
          onClick={handleAudioMuteToggle}
        >
          Toggle
        </button>
        <Menu as={'div'} className="relative ">
          <Menu.Button className="bg-emerald-500 p-2 rounded text-white">
            Device
          </Menu.Button>
          <Menu.Items className="absolute w-96 z-10 top-full mt-2 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded overflow-clip">
            {ai.devices.map((device) => {
              return (
                <Menu.Item
                  onClick={() => handleSelectAudioInputDevice(device)}
                  as={'button'}
                  className="py-2 w-full px-4 hover:bg-blue-500 hover:text-white transition-all"
                >
                  {device.label}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};
