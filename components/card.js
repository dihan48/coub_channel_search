/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import styles from "../styles/card.module.css";

export function Card({ item, cols, conf }) {
  const cardRef = useRef();
  const [cardStale, setCardStyle] = useState({});

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

  return (
    <div className={styles.card} ref={cardRef} style={cardStale}>
      <a
        href={item.url}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.img_container}>
          <img
            src={item.timeline_picture}
            alt=""
            className={styles.img}
            width={300}
            height={300}
          />
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
