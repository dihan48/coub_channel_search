import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectFilteredCoubs, selectIsLoading } from "../redux/feedSlice";
import { Card } from "./card";

import styles from "../styles/feed.module.css";

const conf = {
  countCols: 3,
  colWidth: 300,
  gap: 10,
};

const cols = new Array(conf.countCols).fill(0);

export function Feed() {
  const items = useSelector(selectFilteredCoubs);
  const isLoading = useSelector(selectIsLoading);
  const feedRef = useRef();

  useEffect(() => {
    const maxIndexCol = getMaxIndexCol(cols);
    feedRef.current.style.height = cols[maxIndexCol] + "px";
  }, [items]);

  return (
    <div className={styles.feed} ref={feedRef}>
      {items.map((item) => (
        <Card key={item.permalink} item={item} cols={cols} conf={conf} />
      ))}
    </div>
  );
}

function getMaxIndexCol(cols) {
  return cols.reduce(
    (acc, val, index, arr) => (arr[acc] < val ? index : acc),
    0
  );
}
