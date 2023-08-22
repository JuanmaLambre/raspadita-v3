/**
 * Script to fetch server's hidden variables and paste them on index.html
 * Run with `npm run fetch-tokens <code>`
 *
 * Cookies are set by calling the following request:
 * https://test.ypfchances.com/default.aspx?hash=<test-user-hash>
 */

import fs from "fs";

const url = "https://test.ypfchances.com/pages/tarjeta.aspx";
const code = process.argv[2];

async function main() {
  if (!code) {
    console.error("Scripts requires a code as first argument");
    process.exit(1);
  }

  // Fetch tokens from server
  const requestForm = new FormData();
  requestForm.append("txt_codigo", code);

  const requestOpts = {
    method: "POST",
    body: requestForm,
    headers: {
      cookie:
        "SSIDToken202308=token=0f3f484017d26e4a73b73006eae1041051ea4b44&hash=b25fb23fd0dd1f90bf475de3e2303b4869570333; ASP.NET_SessionId=w0gswtsx4zxtapajlimzvvrq; _ga_B6B7SL1EYX=GS1.1.1692714315.1.0.1692714315.0.0.0; _ga=GA1.1.1974663838.1692714315",
    },
  };

  const response = await fetch(url, requestOpts);
  const pageHtml = await response.text();

  // Get HTML elements with hidden variables
  const varsRegex = /<form name="form1".*id="stop_counter" value="" \/>/gs;
  const varsHtml = pageHtml.match(varsRegex)[0];

  // Paste variables on index.html
  const destFilepath = "./src/index.html";
  const oldHtml = fs.readFileSync(destFilepath).toString();
  const replacingRegex = /<!-- HIDDEN_VARS -->.*<!-- ENDOF HIDDEN_VARS -->/gs;
  const oldHtmlMatch = oldHtml.match(replacingRegex);
  const replacingText = oldHtmlMatch[0];
  const newContent = "<!-- HIDDEN_VARS -->\n" + varsHtml + "\n<!-- ENDOF HIDDEN_VARS -->\n";
  const newHtml = oldHtml.replace(replacingText, newContent);

  fs.writeFileSync(destFilepath, newHtml);
}

main();
