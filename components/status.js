import { useSelector } from "react-redux";
import {
  selectIsLoading,
  selectLoadingPercent,
  selectCoubs,
  selectFilteredCoubs,
} from "../redux/feedSlice";

import styles from "../styles/status.module.css";

export function Status() {
  const isLoading = useSelector(selectIsLoading);
  const percent = useSelector(selectLoadingPercent);
  const coubs = useSelector(selectCoubs);
  const filteredCoubs = useSelector(selectFilteredCoubs);

  if (coubs.length === 0) return null;

  return (
    <div className={styles.container}>
      {isLoading ? <div>Loading... {percent}%</div> : null}
      <div>
        loading coubs: {coubs.length}, find coubs: {filteredCoubs.length}
      </div>
    </div>
  );
}
