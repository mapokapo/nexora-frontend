import { auth } from "@/lib/firebase";
import { hc } from "hono/client";

import type { AppType } from "../../../../nexora-backend/src";

let bearerToken: string | null;

auth.onIdTokenChanged(async newToken => {
  if (newToken === null) {
    bearerToken = null;
    return;
  }

  bearerToken = await newToken.getIdToken();
});

export const client = hc<AppType>("http://localhost:5000/", {
  fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    console.log(input);

    return fetch(input, {
      method: requestInit?.method,
      headers: {
        Authorization: bearerToken === null ? "" : "Bearer " + bearerToken,
        "Content-Type": "application/json",
        ...requestInit?.headers,
      },
      body: requestInit?.body,
    });
  },
});
