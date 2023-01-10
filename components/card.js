/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import styles from "../styles/card.module.css";

export function Card({ item, cols, conf }) {
  const cardRef = useRef();
  const videoRef = useRef();
  const audioRef = useRef();
  const previewRef = useRef();
  const [cardStale, setCardStyle] = useState({});

  const [media, setMedia] = useState(false);

  useEffect(() => {
    const minIndex = getMinIndexCol(cols);
    setCardStyle({
      opacity: 1,
      transform: `translateX(${
        minIndex * (conf.colWidth + conf.gap)
      }px) translateY(${cols[minIndex] + conf.gap}px)`,
    });

    const rect = cardRef.current.getBoundingClientRect();
    cols[minIndex] += rect.height + conf.gap;

    return () => (cols[minIndex] -= rect.height + conf.gap);
  }, [cols, conf]);

  // useEffect(() => {
  //   const options = {
  //     // rootMargin: "0px",
  //     // threshold: 0,
  //   };
  //   const callback = function (entries, observer) {
  //     entries.forEach((entry) => {
  //       const { target, isIntersecting } = entry;

  //       if (isIntersecting) {
  //         console.log(item.coub.title);
  //         setMedia(true);
  //       } else {
  //       }
  //     });
  //   };
  //   const observer = new IntersectionObserver(callback, options);
  //   const element = cardRef.current;

  //   observer.observe(element);
  //   return () => observer.unobserve(element);
  // }, [item.coub.title]);

  const { dimensions } = item.coub;

  return (
    <div className={styles.card} ref={cardRef} style={cardStale}>
      <a
        href={item.url}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={styles.img_container}
          onPointerEnter={(event) => {
            previewRef.current.style.opacity = 0;
            setMedia(true);
          }}
          onPointerLeave={(event) => {
            previewRef.current.style.opacity = 1;
            setMedia(false);
          }}
        >
          <img
            ref={previewRef}
            src={item.coub.first_frame_versions.template.replace(
              "%{version}",
              "med"
            )}
            alt=""
            className={styles.img}
            width={dimensions.med[0]}
            height={dimensions.med[1]}
          />

          {media ? (
            <Media coub={item.coub} audioRef={audioRef} videoRef={videoRef} />
          ) : null}
        </div>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.tags}>
          {item.coub?.categories?.map((x) => (
            <div key={x.title} className={styles.category}>
              {x.title}
            </div>
          ))}
          {item.coub?.tags?.map((x) => (
            <div key={x.title} className={styles.tag}>
              {"#" + x.title}
            </div>
          ))}
        </div>
      </a>
    </div>
  );
}

function getMinIndexCol(cols) {
  return cols.reduce(
    (acc, val, index, arr) => (arr[acc] > val ? index : acc),
    0
  );
}

function Media({ coub }) {
  const videoRef = useRef();
  const audioRef = useRef();

  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [canPlayAudio, setCanPlayAudio] = useState(false);

  if (canPlayVideo && canPlayAudio) {
    videoRef.current.play();
    audioRef.current.play();
  }

  return (
    <>
      <video
        loop={true}
        ref={videoRef}
        src={coub.file_versions.mobile.video}
        width={coub.dimensions.med[0]}
        height={coub.dimensions.med[1]}
        onCanPlay={() => setCanPlayVideo(true)}
        style={{
          maxWidth: "100%",
          width: "100%",
          objectFit: "contain",
          height: "auto",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <audio
        src={coub.file_versions.mobile.audio}
        ref={audioRef}
        loop={true}
        onCanPlay={() => setCanPlayAudio(true)}
      />
    </>
  );
}
