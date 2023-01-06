import { useSelector } from "react-redux";
import { selectFilteredCoubs, selectIsLoading } from "../redux/feedSlice";
import { Card } from "./card";

import styles from "../styles/feed.module.css";
import { useEffect, useRef } from "react";

export function Feed() {
  const items = useSelector(selectFilteredCoubs);
  const isLoading = useSelector(selectIsLoading);
  const col1 = useRef(0);
  const col2 = useRef(0);
  const col3 = useRef(0);
  const feedRef = useRef();

  useEffect(() => {
    col1.current = 0;
    col2.current = 0;
    col3.current = 0;
  }, [isLoading]);

  return (
    <div className={styles.feed} ref={feedRef}>
      {items.map((item) => (
        <Card
          key={item.permalink}
          item={item}
          col1={col1}
          col2={col2}
          col3={col3}
          feedRef={feedRef}
        />
      ))}
    </div>
  );
}
