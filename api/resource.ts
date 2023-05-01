import { AxiosRequestConfig } from 'axios';

export type APIResource = {
  get: (...args: Array<any>) => any;
  query: (...args: Array<any>) => any;
  save: (...args: Array<any>) => any;
  update: (...args: Array<any>) => any;
  delete: (...args: Array<any>) => any;
  list: (...args: Array<any>) => any;
  post: (...args: Array<any>) => any;
  put: (...args: Array<any>) => any;
  create: (...args: Array<any>) => any;
  filter: (...args: Array<any>) => any;
};

export type AuthAPIResource = APIResource & {
  token: (...args: Array<any>) => any;
};

function parseSuccess(response: any) {
  return response.data;
}

function parseError(error: any) {
  if (error.response) {
    if (error.response.data) {
      return Promise.reject(error.response.data);
    }
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  }

  return Promise.reject(error.response || error.message);
}

type Item =
  | undefined
  | { id: number | string }
  | { _id: number | string }
  | number
  | string;

function getItemId(input: NonNullable<Item>): number | string {
  if (typeof input === 'object') {
    if ('id' in input) {
      return input.id;
    } else {
      return input._id;
    }
  }
  return input;
}

type ExtraActions = {
  [key: string]: (baseResourceURL: string, request: any) => any;
};

// we type the return as any so we can extend the typing dynamically afterwards.
function resource(
  baseResourceURL: string,
  http: any,
  extraActions: ExtraActions = {},
  trailSlash: boolean = false,
): any {
  const getPath = (path = '') =>
    // eslint-disable-next-line implicit-arrow-linebreak
    `${baseResourceURL}${path}${trailSlash ? '' : '/'}`;

  const request = (config: AxiosRequestConfig, options = {}) =>
    http({ ...config, ...options })
      .then(parseSuccess)
      .catch(parseError);

  const resourceExtraActions = () => {
    const newActions: { [key: string]: any } = {};
    Object.keys(extraActions).forEach((key) => {
      newActions[key] = extraActions[key](baseResourceURL, request);
    });

    return newActions;
  };

  // eslint-disable-next-line arrow-body-style
  const query = (params = {}, options = {}) => {
    return request(
      {
        url: getPath(),
        method: 'GET',
        params,
      },
      options,
    );
  };

  const get = (input: Item, params = {}, options = {}) => {
    if (input === undefined) {
      return query(params, options);
    }
    const id = getItemId(input);
    return request(
      {
        url: getPath(`/${id}`),
        method: 'GET',
        params,
      },
      options,
    );
  };

  // eslint-disable-next-line arrow-body-style
  const save = (data: any, options = {}) => {
    return request(
      {
        url: getPath(),
        method: 'POST',
        data,
      },
      options,
    );
  };

  const update = (input: Item, data: any, options = {}) => {
    const id = getItemId(input!);
    const path = `${baseResourceURL}/${id}/`;
    return request(
      {
        url: path,
        method: 'PUT',
        data,
      },
      options,
    );
  };

  // eslint-disable-next-line no-underscore-dangle
  const _delete = (input: Item, options = {}) => {
    const id = getItemId(input!);
    const path = `${baseResourceURL}/${id}/`;
    return request(
      {
        url: path,
        method: 'DELETE',
      },
      options,
    );
  };

  return {
    get,
    query,
    save,
    update,
    delete: _delete,
    // alias
    list: query,
    post: save,
    put: update,
    create: save,
    filter: query,
    // extra
    ...resourceExtraActions(),
  };
}

export default resource;
