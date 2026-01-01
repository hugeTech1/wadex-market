import type { ApiResponse, FormField } from "../types/form";
import httpClient from "./httpClient.service";

export const fetchFormFields = async (
    application_id: string,
    dataset_id: string,
): Promise<ApiResponse<FormField[]>> => {
    const payload = {
        params: { dataset_id },
        context: { application_id },
        control: {
            preprocess: { process: "preStandard", params: {} },
            postprocess: {
                process: "postFlatten",
                params: {
                    mainKeys: {
                        field_name: "field_name",
                        field_label: "field_label",
                        field_type: "field_type",
                        field_subtype: "field_subtype",
                        field_description: "field_description",
                        field_hidden: "field_hidden",
                        field_default: "field_default",
                        field_required: "field_required"
                    },
                    subKeys: { lookup_code: "lookup_code", lookup_name: "lookup_name" },
                    subItemFieldName: "field_options"
                }
            }
        }
    };

    return httpClient.post<ApiResponse<FormField[]>>('/fieldbuilder', payload);
};

export const saveFormFields = async (
    formValues: Record<string, any>,
    dataset_id: string,
    application_id: string
): Promise<ApiResponse<any[]>> => {
    const payload = {
        params: { dataset_id, ...formValues },
        context: { application_id },
        control: {
            preprocess: { process: "preStandard", params: {} },
            postprocess: {
                process: "postStandard",
                params: {
                    mainKeys: {
                        field_name: "field_name",
                        field_label: "field_label",
                        field_type: "field_type",
                        field_description: "field_description",
                        field_hidden: "field_hidden",
                        field_default: "field_default"
                    },
                    subKeys: { lookup_code: "lookup_code", lookup_name: "lookup_name" },
                    subItemFieldName: "field_options"
                }
            }
        }
    };

    return httpClient.post<ApiResponse<FormField[]>>('/fieldsaver', payload);
};