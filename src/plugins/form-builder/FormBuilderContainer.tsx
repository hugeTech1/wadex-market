import { useEffect, useState } from 'react';
import { useStoreContext } from '../../context/StoreContext';
import FormBuilderFields from './FormBuilderFields';
import type { FormField } from './types/form';
import { fetchFormFields } from './services/form.service';

const FormBuilderContainer = ({ formId }: any) => {
    const { loading, updateLoader } = useStoreContext();
    const [fields, setFields] = useState<FormField[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        updateLoader(true);

        if (!formId) {
            setError('Not found!');
            updateLoader(false);
            return;
        }

        const decoded = decodeFormId(formId);
        if (!decoded) {
            setError('Invalid form');
            updateLoader(false);
            return;
        }

        const [dataset_id, applicationId] = decoded;

        Promise.all([
            fetchFormFields(applicationId, dataset_id),
        ])
            .then(([fieldsRes]: any) => {
                setFields(Object.values(
                    fieldsRes.data?.reduce((acc: any, obj: any) => {
                        acc[obj.field_name] = obj;
                        return acc;
                    }, {})
                ));
            })
            .catch(() => {
                setError('Failed to load form fields or headers');
            })
            .finally(() => {
                updateLoader(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-4xl text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen text-red-500">
                <i className="pi pi-exclamation-triangle mr-2" />
                {error}
            </div>
        );
    }

    return (
        <>
            <FormBuilderFields fields={fields} formId={formId} />
        </>
    )
};
const decodeFormId = (formId: string): [string, string] | null => {
    try {
        const decoded = atob(formId);
        const parts = decoded.split('@');
        return parts.length === 2 ? [parts[0], parts[1]] : null;
    } catch {
        return null;
    }
};
export default FormBuilderContainer;