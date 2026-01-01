import type { IHTTPResponse } from "../types/http-response";
import type { IMenuItem } from "../types/menu";
import { fetchConfig } from "./config.service";
import httpClient from "./httpClient.service";

export const getMenu = async () => {
  const CONFIG = await fetchConfig();
  const payload = {
    "params": {},
    "context": {
      "query_id": "b257b7bb-145b-4ac5-9bd9-d061a832551f",
      "application_id": CONFIG.APPLICATION_ID
    },
    "control": {
      "preprocess": {
        "process": "preStandard",
        "params": {}
      },
      "postprocess": {
        "process": "postFlatten",
        "params": {
          "mainKeys": {
            "label": "main_menu_label",
            "page": "main_menu_canonical",
            "uuid": "main_menu_uuid",
            "type": "main_menu_label_type"
          },
          "subKeys": {
            "label": "sub_menu_label",
            "page": "sub_menu_canonical",
            "uuid": "sub_menu_uuid"
          },
          "subItemFieldName": "sub_menu_items"
        }
      }
    }
  };
  return httpClient.post<IHTTPResponse<IMenuItem[]>>('/datasource', payload);
}