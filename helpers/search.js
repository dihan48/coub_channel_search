let controller = typeof window !== "undefined" ? new AbortController() : null;
let searchProcessSignal = "stop";

export function canselSearch() {
  searchProcessSignal = "stop";
  controller.abort();
  controller = new AbortController();
}

export async function startSearch(channel, search, setLoadingStatus) {
  try {
    searchProcessSignal = "running";
    setLoadingStatus({ isLoading: true, percent: 0, coubs: [], results: [] });
    const res = await fetch(
      `https://cosmic-tidy-pelican.glitch.me/api/proxy?url=${encodeURIComponent(
        `https://coub.com/api/v2/timeline/channel/${channel}?order_by=newest&type=simples&page=1&per_page=25`
      )}`,
      {
        signal: controller.signal,
      }
    );
    const json = await res.json();
    const count = json.total_pages;

    if (Array.isArray(json?.coubs)) {
      const coubs = [...json?.coubs];

      const results = [
        ...json?.coubs
          ?.filter((item) => searchInProps(item, search))
          .map((item) => ({
            title: item.title,
            permalink: item.permalink,
            url: `https://coub.com/view/${item.permalink}`,
            timeline_picture: item?.timeline_picture,
            coub: item,
          })),
      ];

      setLoadingStatus({
        isLoading: 1 !== count,
        percent: ((1 / count) * 100).toFixed(0),
        coubs,
        results,
      });
    }

    if (searchProcessSignal === "running") {
      for (let i = 2; i <= count; i++) {
        if (searchProcessSignal === "running") {
          const res = await fetch(
            `https://cosmic-tidy-pelican.glitch.me/api/proxy?url=${encodeURIComponent(
              `https://coub.com/api/v2/timeline/channel/${channel}?order_by=newest&type=simples&scope=all&per_page=25&page=${i}`
            )}`,
            {
              signal: controller.signal,
            }
          );
          const json = await res.json();

          if (Array.isArray(json?.coubs)) {
            const coubs = [...json?.coubs];

            const results = [
              ...json?.coubs
                ?.filter((item) => searchInProps(item, search))
                .map((item) => ({
                  title: item.title,
                  permalink: item.permalink,
                  url: `https://coub.com/view/${item.permalink}`,
                  timeline_picture: item?.timeline_picture,
                  coub: item,
                })),
            ];

            setLoadingStatus({
              isLoading: i !== count,
              percent: ((i / count) * 100).toFixed(0),
              coubs,
              results,
            });
          }
        } else {
          setLoadingStatus({
            isLoading: false,
            percent: 0,
            coubs: [],
            results: [],
          });
          return;
        }
      }
    } else {
      setLoadingStatus({
        isLoading: false,
        percent: 0,
        coubs: [],
        results: [],
      });
      return;
    }
  } catch (error) {
    setLoadingStatus({ isLoading: false, percent: 0, coubs: [], results: [] });
    console.error(error);
  }
}

function searchInProps(coub, value) {
  value = value.toLocaleLowerCase();
  if (value == "") return false;

  if (coub?.title?.toLocaleLowerCase().includes(value)) return true;

  if (coub?.translated_title?.toLocaleLowerCase().includes(value)) return true;

  if (
    coub?.categories?.filter((category) =>
      category?.title?.toLocaleLowerCase().includes(value)
    ).length > 0
  )
    return true;

  if (
    coub?.communities?.filter((community) =>
      community?.title?.toLocaleLowerCase().includes(value)
    ).length > 0
  )
    return true;

  if (
    coub?.tags?.filter(
      (tag) =>
        tag?.title?.toLocaleLowerCase().includes(value) ||
        tag?.value?.toLocaleLowerCase().includes(value)
    ).length > 0
  )
    return true;

  return false;
}
