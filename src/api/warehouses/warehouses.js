import { http } from '../http-service';

const GET_WAREHOUSES_URL = `warehouses/table`;
const GET_WAREHOUSE_URL = (id) => `warehouses/${id}`;
const ACTION_WAREHOUSE_URL = `warehouses`;
const GET_WAREHOUSES_OPTIONS_URL = `warehouses/options`;
const GET_ALL_TAGS_URL = `warehouses/all-tags`;

export function getWarehouses(data) {
  return http().post(GET_WAREHOUSES_URL, data);
}

export function getWarehouse(id) {
  return http().get(GET_WAREHOUSE_URL(id));
}

export function getWarehouseOptions() {
  return http().get(GET_WAREHOUSES_OPTIONS_URL);
}

export function updateWarehouse(data) {
  return http().put(ACTION_WAREHOUSE_URL, data);
}

export function newWarehouse(data) {
  return http().post(ACTION_WAREHOUSE_URL, data);
}

export function getAllTags() {
  return http().get(GET_ALL_TAGS_URL);
}