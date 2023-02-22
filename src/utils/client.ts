import { uuidv4 } from "@firebase/util";

export const getCookie = (name: string): string | undefined => {
  if (typeof window === "undefined") return undefined;

  const value: string = "; " + document.cookie;
  const parts: string[] = value.split("; " + name + "=");
  if (parts.length == 2) {
    const result: string | undefined = parts.pop()?.split(";").shift();
    return result;
  }
  return undefined;
};

export const dateTimeFormat = (isoDateStr: string) => {
  const time = new Date(isoDateStr).toLocaleTimeString();
  const date = new Date(isoDateStr).toLocaleDateString();
  return `${date} ${time}`;
};

export const generateUuid = () => {
  const uuid = uuidv4();
  return uuid;
};
