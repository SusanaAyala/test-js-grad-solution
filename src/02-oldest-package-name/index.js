const axios = require('axios').default;

/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

module.exports = async function oldestPackageName() {
  const response = await axios({
    method: 'POST',
    data: {
      "url": "https://api.npms.io/v2/search/suggestions?q=react",
      "method": "GET",
      "return_payload": true
    },
    "url": 'http://ambush-api.inyourarea.co.uk/ambush/intercept',
  });

  const data = response.data;
  const content = data.content;
  const packages = content.map((c) => c.package);
  let name = "";
  let oldestDate;

  packages.forEach((p) => {
    const packageName = p.name;
    const date = new Date(p.date);
    const dateTime = date.getTime();
    if (oldestDate === undefined) {
      oldestDate = dateTime;
      name = packageName;
    } else if (dateTime < oldestDate) {
      oldestDate = dateTime;
      name = packageName;
    }
  });

  return name
};
