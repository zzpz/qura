import axios from "axios";


//we are assuming that we receive a valid session object here
export const createClientWithAuthToken = (session) => {
    const baseURL = "/JWT"; // we will use axios for all API calls

    //given session data, push the authToken into config
    const bearer_token = session.idToken.jwtToken;
    var bearer = `Bearer ${bearer_token}`;
    console.log(bearer);
    const config = {
        baseURL, 
        headers: {"Authorization": bearer}
    }

    const client = axios.create(
     {...config}
    )

    return client
}

    // url?: string;
    // method?: Method | string;
    // baseURL?: string;
    // transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
    // transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
    // headers?: RawAxiosRequestHeaders;
    // params?: any;
    // paramsSerializer?: ParamsSerializerOptions;
    // data?: D;
    // timeout?: Milliseconds;
    // timeoutErrorMessage?: string;
    // withCredentials?: boolean;
    // adapter?: AxiosAdapter;
    // auth?: AxiosBasicCredentials;
    // responseType?: ResponseType;
    // responseEncoding?: responseEncoding | string;
    // xsrfCookieName?: string;
    // xsrfHeaderName?: string;
    // onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    // onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
    // maxContentLength?: number;
    // validateStatus?: ((status: number) => boolean) | null;
    // maxBodyLength?: number;
    // maxRedirects?: number;
    // maxRate?: number | [MaxUploadRate, MaxDownloadRate];
    // beforeRedirect?: (options: Record<string, any>, responseDetails: {headers: Record<string, string>}) => void;
    // socketPath?: string | null;
    // httpAgent?: any;
    // httpsAgent?: any;
    // proxy?: AxiosProxyConfig | false;
    // cancelToken?: CancelToken;
    // decompress?: boolean;
    // transitional?: TransitionalOptions;
    // signal?: GenericAbortSignal;
    // insecureHTTPParser?: boolean;
    // env?: {
    //   FormData?: new (...args: any[]) => object;
    // };
    // formSerializer?: FormSerializerOptions; )

