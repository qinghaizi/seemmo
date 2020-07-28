// 定义一些常量
let X_PI: number = (3.14159265358979324 * 3000.0) / 180.0;
let PI: number = 3.1415926535897932384626;
let a: number = 6378245.0;
let ee: number = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bdLon {Number} 百度经度
 * @param bdLat {Number} 百度纬度
 * @returns
 */
export function bd09togcj02(bdLon: number, bdLat: number): [number, number] {
  const X_PI: number = (3.14159265358979324 * 3000.0) / 180.0;
  const x: number = bdLon - 0.0065;
  const y: number = bdLat - 0.006;
  const z: number = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta: number = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  const ggLng: number = z * Math.cos(theta);
  const ggLat: number = z * Math.sin(theta);
  return [ggLng, ggLat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns
 */
export function gcj02tobd09(lng: number, lat: number): [number, number] {
  const z: number =
    Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta: number = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  const bdLng: number = z * Math.cos(theta) + 0.0065;
  const bdLat: number = z * Math.sin(theta) + 0.006;
  return [bdLng, bdLat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns
 */
export function wgs84togcj02(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat: number = transformlat(lng - 105.0, lat - 35.0);
    let dlng: number = transformlng(lng - 105.0, lat - 35.0);
    const radlat: number = (lat / 180.0) * PI;
    let magic: number = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic: number = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat: number = lat + dlat;
    const mglng: number = lng + dlng;
    return [mglng, mglat];
  }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns
 */
export function gcj02towgs84(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat: number = transformlat(lng - 105.0, lat - 35.0);
    let dlng: number = transformlng(lng - 105.0, lat - 35.0);
    let radlat: number = (lat / 180.0) * PI;
    let magic: number = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic: number = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    let mglat: number = lat + dlat;
    let mglng: number = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}

export function transformlat(lng: number, lat: number): number {
  let ret: number =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

export function transformlng(lng: number, lat: number): number {
  let ret: number =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns
 */
export function outOfChina(lng: number, lat: number): boolean {
  return (
    lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
  );
}
