import { useEffect, useRef, useState } from "react";
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
import { Status } from "./status";
import AsyncSelect from "react-select/async";

import styles from "../styles/form.module.css";

export function Form() {
  const [channel, setChannel] = useState();
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const debounce = useDebounce();

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (channel) {
            if (isLoading) {
              canselSearch();
            } else {
              dispatch(clearCoubs());
              dispatch(clearFilteredCoubs());
              startSearch(
                channel.value,
                search,
                ({ isLoading, percent, coubs, results }) => {
                  dispatch(addCoubs(coubs));
                  dispatch(addFilteredCoubs(results));
                  dispatch(setIsLoading(isLoading));
                  dispatch(setLoadingPercent(percent));
                }
              );
            }
          }
        }}
      >
        <AsyncSelect
          instanceId={"Channel"}
          cacheOptions
          defaultOptions
          placeholder={"Channel"}
          defaultValue={channel}
          // value={channel}
          onChange={setChannel}
          classNames={{
            container: () => styles.select_container,
            control: () => styles.select_control,
            valueContainer: () => styles.select_valueContainer,
            singleValue: () => styles.select_singleValue,
            indicatorsContainer: () => styles.select_indicatorsContainer,
            input: () => styles.select_input,
            menu: () => styles.select_menu,
            option: ({ isDisabled, isSelected, isFocused }) => {
              return `${styles.select_option} ${
                isDisabled
                  ? ""
                  : isSelected
                  ? styles.select_optionSelected
                  : isFocused
                  ? styles.select_optionFocused
                  : ""
              }`;
            },
          }}
          components={{ IndicatorsContainer, NoOptionsMessage }}
          loadOptions={(inputValue, callback) => {
            if (inputValue) {
              debounce(async () => {
                let result = new Map();
                try {
                  const res = await fetch(
                    `https://cosmic-tidy-pelican.glitch.me/api/proxy?url=https://coub.com/api/v2/channels/${inputValue}`
                  );
                  const json = await res.json();
                  const { title, permalink } = json;
                  if (title && permalink) {
                    result.set(permalink, `${title} (${permalink})`);
                  }
                } catch (error) {
                  callback(null);
                }
                try {
                  const res = await fetch(
                    `https://cosmic-tidy-pelican.glitch.me/api/proxy?url=https://coub.com/api/v2/search/channels?q=${inputValue}&order_by=followers_count&page=1&per_page=25`
                  );
                  const json = await res.json();

                  json.channels?.forEach(({ title, permalink }) => {
                    result.set(permalink, `${title} (${permalink})`);
                  });

                  const r = [];
                  for (let entry of result) {
                    r.push({ value: entry[0], label: entry[1] });
                  }

                  callback(r);
                } catch (error) {
                  const r = [];
                  for (let entry of result) {
                    r.push({ value: entry[0], label: entry[1] });
                  }
                  callback(r);
                }
              }, 500);
            } else {
              callback(null);
            }
          }}
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

function useDebounce() {
  const timer = useRef();

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return (func, delay) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      func?.();
    }, delay);
  };
}

function IndicatorsContainer() {
  return <></>;
}

function NoOptionsMessage() {
  return <div className={styles.select_noOptionsMessage}>not found</div>;
}
