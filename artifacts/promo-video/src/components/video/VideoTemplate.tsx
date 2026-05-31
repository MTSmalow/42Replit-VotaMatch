import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';

export const SCENE_DURATIONS = {
  home: 2000,
  quiz: 2500,
  cola: 2500,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  home: Scene1,
  quiz: Scene2,
  cola: Scene3,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(
    /_r[12]$/,
    '',
  ) as keyof typeof SCENE_DURATIONS;
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div
      className="w-full h-screen overflow-hidden relative mx-auto"
      style={{
        backgroundColor: 'var(--color-bg)',
        maxWidth: '390px' /* Mobile format constraint for viewing on desktop */,
        maxHeight: '844px',
        boxShadow: '0 0 50px rgba(0,0,0,0.1)',
      }}
    >
      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>
    </div>
  );
}
