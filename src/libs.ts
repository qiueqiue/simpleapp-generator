export const capitalizeFirstLetter = (str: string) => {
    const res = str == '' ? '' : str.slice(0, 1).toUpperCase() + str.slice(1);
    // const res = str;
    return res;
  };
  