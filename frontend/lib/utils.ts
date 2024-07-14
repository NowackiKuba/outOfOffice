import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import { Dispatch, SetStateAction } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const handleSort = (
  item: string,
  activeSort: string,
  setActiveSort: Dispatch<SetStateAction<string>>,
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams
) => {
  if (activeSort === item) {
    setActiveSort('');
    const newUrl = removeKeysFromQuery({
      keysToRemove: ['sort'],
      params: searchParams.toString(),
    });

    router.push(newUrl, { scroll: false });
  } else {
    setActiveSort(item);
    const newUrl = formUrlQuery({
      key: 'sort',
      value: item,
      params: searchParams.toString(),
    });

    router.push(newUrl, { scroll: false });
  }
};
