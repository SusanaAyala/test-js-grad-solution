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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */

module.exports = async function organiseMaintainers() {
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
  /* name, maintainers, publisher */
  const packages = content.map((c) => c.package);
  const usernames = packages.reduce((acc, p) => {
    const maintainerUsernames = p.maintainers.map((maintainer) => maintainer.username);
    return acc.concat(maintainerUsernames);
  }, []);
  const maintainers = packages.reduce((acc, p) => {
    const packageName = p.name;
    const maintainers = p.maintainers.map((maintainer) => maintainer.username);
    const uniqueUsernames = [...new Set(usernames)].sort();

    uniqueUsernames.forEach((username) => {
      if (maintainers.includes(username)) {
        const existingUserIndex = acc.findIndex((a) => a.username === username);
        if (existingUserIndex !== -1) {
          acc[existingUserIndex].packageNames.push(packageName);
          acc[existingUserIndex].packageNames.sort();
        } else {
          const userPackage = {
            username: username,
            packageNames: [packageName]
          }
          acc.push(userPackage);
        }
      }
    });

    acc.sort((a, b) => {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
    });
    return acc;
  }, []);

  return maintainers
};
