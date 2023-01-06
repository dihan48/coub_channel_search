/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import styles from "../styles/card.module.css";

export function Card({ item, col1, col2, col3, feedRef }) {
  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      col1, col2, col3;
      const rect = cardRef.current.getBoundingClientRect();
      const h = rect.height;

      const cols = [col1, col2, col3];
      const minIndexCol = getMinIndexCol(cols);
      console.log({ cols, minIndexCol });
      const minCol = cols[minIndexCol];
      console.log(
        `translateX(${minIndexCol * 320}px) translateY(${minCol.current}px)`
      );
      cardRef.current.style.transform = `translateX(${
        minIndexCol * 320
      }px) translateY(${minCol.current}px)`;

      minCol.current += h;

      // const maxIndexCol = getMaxIndexCol(cols);
      // const hFeed = cols[maxIndexCol].current;
      // if (feedRef.current) {
      //   // feedRef.current.style.height = `${hFeed}px`;
      // }
    }
  }, [col1, col2, col3, feedRef]);

  return (
    <div className={styles.card} ref={cardRef}>
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
    (acc, val, index, arr) => (arr[acc].current > val.current ? index : acc),
    0
  );
}

function getMaxIndexCol(cols) {
  return cols.reduce(
    (acc, val, index, arr) => (arr[acc].current < val.current ? index : acc),
    0
  );
}
