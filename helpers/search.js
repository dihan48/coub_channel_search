let controller = new AbortController();
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
      `https://api.codetabs.com/v1/proxy?quest=https://coub.com/api/v2/timeline/channel/${channel}?order_by=newest&type=simples&page=1&per_page=25`,
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
            `https://api.codetabs.com/v1/proxy?quest=https://coub.com/api/v2/timeline/channel/${channel}?order_by=newest&type=simples&scope=all&per_page=25&page=${i}`,
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

function createLink(item) {
  console.log(item);
  const div = document.createElement("div");
  div.className = "card";
  const a = document.createElement("a");
  a.href = item.url;
  a.className = "link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";

  const img_container = document.createElement("div");
  img_container.className = "img_container";

  const img = document.createElement("img");
  img.className = "img";
  img.src = item.timeline_picture;

  const title = document.createElement("div");
  title.className = "title";
  title.innerText = item.title;

  const categories = document.createElement("div");
  categories.className = "categories";
  categories.innerText = item.coub?.categories.map((x) => x.title).join(" ");

  const tags = document.createElement("div");
  tags.className = "tags";

  item.coub?.categories?.forEach((x) => {
    const category = document.createElement("div");
    category.className = "category";
    category.innerText = x.title;
    tags.append(category);
  });

  item.coub?.tags?.forEach((x) => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerText = "#" + x.title;
    tags.append(tag);
  });
  elResult.append(div);
  div.append(a);
  a.append(img_container);
  img_container.append(img);
  a.append(title);
  a.append(categories);
  a.append(tags);
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
