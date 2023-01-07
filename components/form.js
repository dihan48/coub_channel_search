import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSearch, canselSearch } from "../helpers/search";
import {
  addCoubs,
  addFilteredCoubs,
  clearCoubs,
  clearFilteredCoubs,
  selectIsLoading,
  setIsLoading,
  setLoadingPercent,
} from "../redux/feedSlice";

import styles from "../styles/form.module.css";
import { Status } from "./status";

export function Form() {
  const [channel, setChannel] = useState("dovletkerei");
  const [search, setSearch] = useState("blade runner");

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (isLoading) {
            canselSearch();
          } else {
            dispatch(clearCoubs());
            dispatch(clearFilteredCoubs());
            startSearch(
              channel,
              search,
              ({ isLoading, percent, coubs, results }) => {
                dispatch(addCoubs(coubs));
                dispatch(addFilteredCoubs(results));
                dispatch(setIsLoading(isLoading));
                dispatch(setLoadingPercent(percent));
              }
            );
          }
        }}
      >
        <input
          type="text"
          className={styles.field}
          placeholder="Channel"
          value={channel}
          onChange={(event) => setChannel(event.target.value)}
        />
        <input
          type="text"
          className={styles.field}
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          type="submit"
          className={isLoading ? styles.close : styles.submit}
        />
      </form>
      <Status />
    </div>
  );
}
