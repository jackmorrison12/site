'use client';

import { ReactNode, useState } from 'react';
import { MotionConfig } from 'motion/react';
import styles from './home.module.scss';
import { CartoonAvatar } from './CartoonAvatar/CartoonAvatar';
import { HotspotId } from './CartoonAvatar/CartoonAvatar.types';
import { Corkboard } from './Corkboard/Corkboard';

type Props = {
  topTrackSlot: ReactNode;
  musicStatsSlot: ReactNode;
  contributionsSlot: ReactNode;
  contributionsCardSlot: ReactNode;
  feedSlot: ReactNode;
};

export const HomeLayout = ({
  topTrackSlot,
  musicStatsSlot,
  contributionsSlot,
  contributionsCardSlot,
  feedSlot,
}: Props) => {
  // A story stays up until you pick another object or click the same one again.
  const [active, setActive] = useState<HotspotId | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.page}>
        <Corkboard
          active={active}
          onSelect={setActive}
          topTrackSlot={topTrackSlot}
          musicStatsSlot={musicStatsSlot}
          contributionsCardSlot={contributionsCardSlot}
        >
          <CartoonAvatar active={active} onActiveChange={setActive} contributionsSlot={contributionsSlot} />
        </Corkboard>
        {feedSlot}
      </div>
    </MotionConfig>
  );
};
