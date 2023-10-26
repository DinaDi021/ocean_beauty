import axios, { AxiosError, AxiosResponse } from "axios";

import { baseURL } from "../constants";
import { router } from "../router";
import { authService } from "./authService";

type IRes<DATA> = Promise<AxiosResponse<DATA>>;

const apiService = axios.create({ baseURL });

apiService.interceptors.request.use((req) => {
  const access = authService.getAccessToken();

  if (access) {
    req.headers.Authorization = `Bearer ${access}`;
  }

  return req;
});

let isRefreshing = false;
//
// const waitList: IWaitList[] = [];
apiService.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // await authService.refresh();
          // isRefreshing = false;
          // afterRefresh();
          return await apiService(originalRequest);
        } catch (e) {
          authService.deleteTokens();
          isRefreshing = false;
          await router.navigate("/login?SessionExpired=true");
          return await Promise.reject(error);
        }
      }
    }
  },
);
//   if (originalRequest.url === urls.refresh) {
//     return await Promise.reject(error);
//   }
//
//   return await new Promise((resolve) => {
//     subscribeToWaitList(() => resolve(apiService(originalRequest)));
//   });
// }

//   return await Promise.reject(error);
// },
// );
// type IWaitList = () => void;
// const subscribeToWaitList = (cb: IWaitList): void => {
//   waitList.push(cb);
// };
//
// const afterRefresh = (): void => {
//   while (waitList.length) {
//     const cb = waitList.pop();
//     cb();
//   }
// };

export type { IRes };
export { apiService };
