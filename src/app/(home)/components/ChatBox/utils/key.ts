import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const getLatestKey = (obj: Record<string, any>): string => {
  return Object.keys(obj).reduce((latest, current) => {
    return dayjs(current).isAfter(dayjs(latest)) ? current : latest;
  });
};

export const getNowKey = () => {
  return dayjs().format(DATE_FORMAT);
};
