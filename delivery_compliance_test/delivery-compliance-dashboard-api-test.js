import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',

      // How long the test lasts
      duration: '5m',

      // How many iterations per timeUnit
      rate: 3,

      // Start `rate` iterations per second
      timeUnit: '1s',

      // Pre-allocate VUs
      preAllocatedVUs: 50,
    },
  },
};

let brandIdList = [7036, 3689, 2649, 17381, 7730, 14153, 15264, 13376, 2421, 11882, 15905, 15631, 4122, 6513, 19808, 13639, 8347, 4044, 5401, 7157, 25288, 10807, 2753, 8450, 16851, 3031, 6418, 12680, 3930, 4759, 3828, 11981, 3830, 4021, 6809, 3306, 10371, 21988, 15910, 13146, 653, 16250, 12179, 19378, 14240, 9857, 5340, 2400, 10418, 16882, 15684, 20687, 2698, 22122, 16632, 7196, 23214, 17599, 6689, 10386, 1854, 16742, 21606, 19585, 19644, 12513, 2755, 17117, 21058, 5188, 15923, 2967, 8304, 8904, 2066, 10728, 2791, 2000, 9543, 12685, 4018, 5179, 6405, 6221, 19744, 1159, 9011, 2427, 2757, 13804, 16926, 11058, 11445, 19222, 16072, 12479, 1095, 2477, 4990, 1740, 4151, 12195, 7414, 4611, 21549, 22124, 10421, 7451, 9304, 4640, 2107, 20342, 11483, 20980, 10172, 19859, 16334, 2052, 6967, 15547, 24506, 4415, 9173, 17120, 21624, 21060, 4178, 14056, 1742, 9294, 8504, 11916, 15662, 21820, 6183, 3039, 2768, 20441, 10782, 22617, 15023, 2527, 21131, 15837, 14718, 20735, 9545, 6884, 6736, 17067, 21990, 11036, 10522, 5634, 13421, 18512, 696, 18998, 4747, 21790, 17435, 3763, 21428, 19793, 11472, 16352, 8825, 2019, 21553, 3795, 16876, 479, 15018, 20662, 16227, 17190, 13565, 10747, 2701, 5257, 17177, 18786, 15943, 11736, 16633, 22081, 8166, 3266, 20974, 8448, 8390, 17967, 14160, 10770, 15926, 21615, 11475, 2123, 4445, 9965, 1195, 1413, 5356, 14555, 491, 9997, 20208, 3797, 15709, 2968, 10929, 17454, 17760, 20022, 10219, 2104, 16024, 9621, 3070, 1192, 7939, 21434, 9928, 3735, 4074, 5974, 15962, 14783, 19483, 18961, 6014, 16839, 17532, 6100, 22623, 20647, 9930, 2101, 3326, 2350, 7345, 10827, 10043, 3745, 15705, 13848, 6030, 12306, 11321, 14851, 2590, 16023, 18159, 17206, 20716, 1816, 10839, 7978, 17872, 3268, 20615, 2018, 5391, 16082, 6517, 10115, 17348, 22583, 12800, 2415, 16918, 18196, 8415, 6303, 9977, 18758, 6883, 5190, 20975, 16901, 19745, 12360, 7889, 3852, 2038, 16908, 5911, 2119, 13796, 10107, 20591, 2422, 20246, 7846, 4612, 17027, 12248, 17091, 4236, 9893, 20753, 23577, 16100, 3474, 13337, 16354, 21283, 13905, 12210, 3388, 19799, 1565, 6804, 4833, 1642, 7588, 13125, 20041, 8411, 6515, 16716, 10126, 12056, 15173, 21239, 19284, 17218, 9607, 3897, 21041, 2733, 22221, 9057, 17620, 8067, 25783, 8103, 7851, 8429, 1953, 3223, 14932, 7272, 13208, 2353, 16887, 529, 20077, 12124, 13901, 10474, 22061, 2121, 11390, 12539, 4656, 6834, 23318, 16333, 16274, 10987, 16265, 15609, 5919, 4162, 14597, 17319, 12538, 7147, 19462, 2186, 10235, 2047, 21821, 21857, 20495, 3886, 1620, 3053]
let baseUrl = 'http://localhost:8080/inhouse-admin/v4/delivery-compliance/dashboard?brandId='

function getBrandId(brandIdList) {
  return brandIdList[Math.floor(Math.random() * brandIdList.length)]
}

export default function () {
  // 헤더 추가 (Authorization 헤더를 추가)
  let headers = {
    'Authorization': 'Bearer eyJ2ZXIiOiJWMSIsImFsZyI6IkVTMjU2In0.eyJqdGkiOiJjMDY2ZWI5OS0yYjI5LTQ0M2QtYjQyNy1jOTI3MzhmYjJlNTkiLCJpc3MiOiIyOWNtLWF1dGhlbnRpY2F0aW9uIiwic3ViIjoiMjljbS1BQ0NFU1MtVE9LRU4iLCJhdWQiOiJpbnRlcm5hbCIsIm5iZiI6MTcwNTI4NjU3NywiaWF0IjoxNzA1Mjg2NTc3LCJleHAiOjE3MDUzMDA5NzcsInVzZXJJbmZvIjp7InVzZXJBbHRLZXkiOiIzZjA3ZThlMi1lYzJhLTRkNTEtOGVkOS1iODcyMzVlM2Q0MTAiLCJsb2dpbklkIjoieW9vbnlzNDI3IiwiYWRtaW5JZCI6MjgxNCwicGFydG5lcklkIjpudWxsLCJlbWFpbFZlcmlmaWVkIjpmYWxzZSwicm9sZXMiOlsiaW50ZXJuYWwtc3RhZmYiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl0sImV4cGlyZWRBdCI6bnVsbH19.DuColddN0MZY7DU3X63dYT1hqqIIPy4abocYgP0HyO-L5XuHZ-FTxJsuSroQiwC02Grxr4wi62JeUQDaJjMf5g',
  };

  // 요청 시 헤더를 함께 보냄
  http.get(baseUrl + getBrandId(brandIdList), { headers: headers });
}