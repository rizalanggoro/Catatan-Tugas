const hitungSisa = (dateStr) => {
  const date = new Date(dateStr);
  if (date instanceof Date && !isNaN(date)) {
    const currentDate = new Date();
    const diff = currentDate.getTime() - date.getTime();
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    // const hours = Math.floor(
    //   (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    // );
    // const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days == 0 ? "" : diff > 0 ? "-" : ""}${days} hari`;
  }
  return "-";
};

const getTenggat = (dateStr) => {
  const date = new Date(dateStr);
  if (date instanceof Date && !isNaN(date)) {
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "-";
};

const apiKey = "c0vukhanqvo_621brNFEyUSYA5U6vL7qPgBDLns5ZUm2";
const baseUrl = "https://database.deta.sh/v1/c0vukhanqvo/tugas";
const headers = {
  "content-type": "application/json",
  "x-api-key": apiKey,
};

document.addEventListener("alpine:init", () => {
  Alpine.store("tugas", {
    listTugas: [],
    isUploading: false,
    isFetching: false,

    async delete(key) {
      const response = await fetch(baseUrl + "/items/" + key, {
        method: "DELETE",
        headers,
      });
      if (response.ok) {
        this.fetchTugas();
      }
    },

    async upload(title, date) {
      this.isUploading = true;
      const response = await fetch(baseUrl + "/items", {
        method: "POST",
        headers,
        body: JSON.stringify({
          item: {
            title,
            date,
          },
        }),
      });
      const { status, statusText } = response;
      console.log({ status, statusText });
      this.isUploading = false;

      if (response.ok) {
        this.fetchTugas();
      }
    },

    async fetchTugas() {
      this.isFetching = true;
      const response = await fetch(baseUrl + "/query", {
        method: "POST",
        headers,
      });

      if (response.ok) {
        const { items } = await response.json();
        this.listTugas = items;
        this.listTugas.sort((a, b) => {
          if (a.date != undefined && b.date != undefined) {
            return a.date.localeCompare(b.date);
          }
          return 0;
        });
      }
      this.isFetching = false;
    },
  });

  Alpine.store("tugas").fetchTugas();
});
