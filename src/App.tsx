import classnames from 'classnames';
import { useInView } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const throttle = (fn: () => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn();
      }, delay);
    }
  };
};

const Photo = ({ url }: { url: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);
  return (
    <div
      className={classnames('opacity-0 transition-opacity duration-[400ms]', {
        'opacity-100': isVisible,
      })}
      ref={ref}
    >
      <img alt="Agent Conf 2023 Photo" src={url} />
    </div>
  );
};

export default function App({ photos }: { photos: ReadonlyArray<string> }) {
  const [start, setStart] = useState(0);
  const [visiblePhotos, setVisiblePhotos] = useState(() =>
    photos.slice(0, ITEMS_PER_PAGE),
  );

  useEffect(() => {
    const loadPhotos = () => {
      setStart(start + ITEMS_PER_PAGE);
      setVisiblePhotos([
        ...visiblePhotos,
        ...photos.slice(start + ITEMS_PER_PAGE, start + 2 * ITEMS_PER_PAGE),
      ]);
    };

    const onScroll = throttle(() => {
      const element = document.scrollingElement;
      if (
        start < photos.length &&
        element &&
        element.scrollTop + element.clientHeight > element.scrollHeight - 1000
      ) {
        loadPhotos();
      }
    }, 300);

    document.addEventListener('scroll', onScroll, false);
    return () => document.removeEventListener('scroll', onScroll, false);
  }, [start, visiblePhotos]);

  return (
    <div className="tracking-widest">
      <div className="mx-auto flex h-[66vh] max-w-screen-md flex-col justify-center px-4 text-center">
        <h1 className="my-4 text-3xl">
          people of <a href="https://agent.sh">agentconf 2023</a>
        </h1>
        <h2 className="my-4 text-xl">
          photos by{' '}
          <a className="colorful" href="http://twitter.com/cpojer">
            christoph nakazawa
          </a>
        </h2>
      </div>
      {visiblePhotos.map((url, index) => (
        <Photo key={index} url={url} />
      ))}
      <div className="my-4 text-center">
        <a href="https://athenacrisis.com">athena crisis</a>
      </div>
    </div>
  );
}
