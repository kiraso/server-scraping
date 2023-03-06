const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/", async (req, res) => {
  try {
    const data = await axios.get(
      "https://www.similarweb.com/apps/top/google/app-index/th/all/top-free/"
    );
    if (data.status !== 200) {
      return data.status(data.status).send({
        message: "invalid",
      });
    }
    const html = await data.data;
    const $ = cheerio.load(html);
    const result =
      Array.from(
        $(
          'div[class="topAppsSection js-leaderBoard js-appsSection"] > div[class="topAppsGrid"]>div[itemprop="itemListElement"] > table[class="topAppsGrid-table"] > tbody[class="topAppsGrid-body"] > tr[class="topAppsGrid-row"]'
        )
      ).map((element) => {
        return {
          title: $(element)
            .find(
              'tr[class="topAppsGrid-row"] > td[class="topAppsGrid-cell app showInMobile"] > div[class="topAppsGrid-popupWrap js-popupWrap"] > a[class="topAppsGrid-title js-hover js-noTrackingForClick"]'
            )
            .attr("data-analytics-label")
            .replace("Table/", ""),
          imageSrc: $(element).find("img").attr("src"),
          positonUsage: $(element)
            .find(
              'td[class="topAppsGrid-cell appIndex active hiddenInMobile"] > span[class="topAppsGrid-value"]'
            )
            .text(),
          catagory: $(element)
            .find('td[class="topAppsGrid-cell category hiddenInMobile"] > a')
            .text(),
        };
      }) || [];
    return res.status(data.status).send(result);
  } catch (err) {
    console.log(err);
  }
});
app.listen(PORT, () => {
  console.log(`this is server ${PORT}`);
});
