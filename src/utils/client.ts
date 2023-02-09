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
