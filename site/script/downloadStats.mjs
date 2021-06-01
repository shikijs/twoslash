import { writeFileSync } from "fs"
import fetch from "node-fetch"

fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", {
  "headers": {
    "accept": "application/json;api-version=6.1-preview.1;excludeUrls=true",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "x-tfs-session": "c08fce8b-1859-45d4-8229-b8ab2311abfd",
    "x-vss-reauthenticationaction": "Suppress",
    "cookie": "_ga=GA1.2.1677509254.1583614867; VstsSession=%7B%22PersistentSessionId%22%3A%22ced82f07-1b54-477a-8aaa-ae00ccc31c13%22%2C%22PendingAuthenticationSessionId%22%3A%227077548b-3942-4271-9d0c-faffcbb9a35c%22%2C%22CurrentAuthenticationSessionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22SignInState%22%3A%7B%22spsprodwus21.vssps.visualstudio.com%22%3A%7B%22LastSignInTick%22%3A637273161921053878%2C%22SignInCount%22%3A1%7D%7D%7D; mbox=session#0f1499cb87304a53b0fe09d1d00807c5#1618597811|PC#0f1499cb87304a53b0fe09d1d00807c5.37_0#1652782649; MSCC=cid=ld8n1jhyqu1tak0myf7jax69-c1=2-c2=2-c3=2; Gallery-Service-UserIdentifier=3792e993-ea4f-426f-847c-23e38dc0948a; MSFPC=GUID=f9a7afa78ff24dff8a42e2ab7f3e33a1&HASH=f9a7&LV=202006&V=4&LU=1591719384226; _ga=GA1.3.1677509254.1583614867; _gid=GA1.3.1735460335.1622451112; _gat_UA-62780441-6=1; Market_SelectedTab=vscode",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15'"
  },
  "referrer": "https://marketplace.visualstudio.com/search?target=VSCode&category=Themes&sortBy=Installs",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"assetTypes\":[\"Microsoft.VisualStudio.Services.Icons.Default\",\"Microsoft.VisualStudio.Services.Icons.Branding\",\"Microsoft.VisualStudio.Services.Icons.Small\"],\"filters\":[{\"criteria\":[{\"filterType\":8,\"value\":\"Microsoft.VisualStudio.Code\"},{\"filterType\":10,\"value\":\"target:\\\"Microsoft.VisualStudio.Code\\\" \"},{\"filterType\":12,\"value\":\"37888\"},{\"filterType\":5,\"value\":\"Themes\"}],\"direction\":2,\"pageSize\":54,\"pageNumber\":1,\"sortBy\":4,\"sortOrder\":0,\"pagingToken\":null}],\"flags\":870}",
  "method": "POST",
  "mode": "cors"
}).then( theme => theme.json()).then( theme => {
    const themeCount = theme.results[0].resultMetadata[0].metadataItems[0].count
    console.log(themeCount)

    writeFileSync("script/stats.json", JSON.stringify({ themeCount }))
})