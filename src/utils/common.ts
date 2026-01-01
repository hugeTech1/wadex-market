export const decodeFormId = (formId: string): [string, string] | null => {
    try {
        const decoded = atob(formId);
        const parts = decoded.split('@');
        return parts.length === 2 ? [parts[0], parts[1]] : null;
    } catch {
        return null;
    }
};