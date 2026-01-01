import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';

import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';

import { InputTextarea } from 'primereact/inputtextarea';
import type { FormField } from './types/form';
import { saveFormFields } from './services/form.service';
import VideoUploader from './components/VideoUploader';
import AddressField from './components/AddressAutocomplete';

interface FormLayoutProps {
  fields: FormField[];
  formId: string;
}

const FormBuilderFields: React.FC<FormLayoutProps> = ({ fields, formId }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [thankyouMessage, setThankyouMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>({});
  const [formSubmitted, setFromSubmitted] = useState<boolean>(false);

  const toastRef = useRef<Toast>(null);

  const decoded = decodeFormId(formId || '');

  if (!decoded) {
    toastRef.current?.show({
      severity: 'error',
      summary: 'Invalid form',
      detail: 'Form ID is missing or incorrect',
      life: 3000
    });
    return;
  }

  const [datasetId, applicationId] = decoded;

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (errorMessage[name]) {
      setErrorMessage((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { [key: string]: string } = {};
    fields.forEach((field) => {
      if (field.field_required === '1' && (!formValues[field.field_name] || (Array.isArray(formValues[field.field_name]) && formValues[field.field_name].length === 0))) {
        errors[field.field_name] = 'This field is required';
      }
    });

    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    const params = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])
    );

    const trackerFieldValue = formValues['delete_form_tracker'];
    if (trackerFieldValue) {
      localStorage.setItem('tracking_id', trackerFieldValue);
    }

    try {
      const response = await saveFormFields(params, datasetId, applicationId);

      if (response.status === "OK") {
        toastRef.current?.show({
          severity: 'success',
          summary: 'Form Submitted',
          detail: response.message || 'Form saved successfully!',
          life: 3000
        });
        setFormValues({});
        setThankyouMessage(response?.data[0]?.email_body || "");
        setFromSubmitted(prev => !prev);
      } else {
        toastRef.current?.show({
          severity: 'warn',
          summary: 'Failed',
          detail: response.message || 'Submission failed.',
          life: 3000
        });
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Something went wrong.',
        life: 3000
      });
    }
  };


  const renderField = (field: FormField) => {
    const value = formValues[field.field_name] || '';
    const error = errorMessage[field.field_name];
    const disabledField = field.field_name.includes('tracker');

    const errorElement = error ? (
      <small className="p-error block mt-1">{error}</small>
    ) : null;

    if (['VIDEO'].includes(field.field_type)) {
      return (
        <>
          <VideoUploader
            formSubmitted={formSubmitted}
            mediaPrefix={applicationId + "/videos/"}
            onUploadComplete={(fileUrl) => handleChange(field.field_name, fileUrl)}
          />
          {errorElement}
        </>
      );
    }
    if (['EMAIL', 'SHORT_TXT'].includes(field.field_type)) {
      return (
        <>
          <InputText
            id={field.field_name}
            type={field.field_type === 'EMAIL' ? 'email' : 'text'}
            value={value}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
            placeholder={field.field_label}
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['MEDIUM_TXT', 'LONG_TXT'].includes(field.field_type)) {
      return (
        <>
          <InputTextarea
            id={field.field_name}
            value={value}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
            placeholder={field.field_label}
            rows={field.field_type === 'MEDIUM_TXT' ? 5 : 10}
            autoResize
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['URL'].includes(field.field_type)) {
      return (
        <>
          <InputText
            id={field.field_name}
            type="url"
            value={value}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
            placeholder={field.field_label}
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['DATE'].includes(field.field_type)) {
      return (
        <>
          <Calendar
            id={field.field_name}
            value={value || null}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.value)}
            placeholder="MM/DD/YYYY"
            showIcon
            dateFormat="mm/dd/yy"
            panelClassName='panel-sm'
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['DATETIME'].includes(field.field_type)) {
      return (
        <>
          <Calendar
            id={field.field_name}
            value={value || null}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.value)}
            placeholder={field.field_label}
            dateFormat="mm/dd/yy"
            showTime
            showIcon
            panelClassName='panel-sm'
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['MULTIPLE_SELECT'].includes(field.field_type)) {
      return (
        <>
          <div className="flex flex-column gap-2 mt-2">
            {field.field_options.map((opt) => (
              <div
                key={opt.lookup_code}
                className="flex align-items-center gap-2"
              >
                <Checkbox
                  inputId={`${field.field_name}_${opt.lookup_code}`}
                  name={field.field_name}
                  value={opt.lookup_code}
                  disabled={disabledField}
                  onChange={(e) => {
                    const selectedValues = formValues[field.field_name] || [];
                    const newValues = e.checked
                      ? [...selectedValues, e.value]
                      : selectedValues.filter((val: string) => val !== e.value);
                    handleChange(field.field_name, newValues);
                  }}
                  checked={(formValues[field.field_name] || []).includes(opt.lookup_code)}
                />
                <label htmlFor={`${field.field_name}_${opt.lookup_code}`}>{opt.lookup_name}</label>
              </div>
            ))}
          </div>
          {errorElement}
        </>
      );
    }
    if (['INT'].includes(field.field_type)) {
      return (
        <>
          <InputText
            id={field.field_name}
            type="number"
            value={value}
            min={0}
            disabled={disabledField}
            onChange={(e) => handleChange(field.field_name, e.target.value ? parseInt(e.target.value) : '')}
            placeholder={field.field_label}
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
    if (['ADDRESS'].includes(field.field_type)) {
      return (
        <>
          <AddressField
            value={value}
            onChange={(val) => handleChange(field.field_name, val)}
            placeholder={field.field_label}
          />
          {errorElement}
        </>
      );
    }
    if (['BOOL'].includes(field.field_type)) {
      return (
        <>
          <div className="flex flex-column gap-3">
            {[
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ].map((opt) => (
              <div
                key={String(opt.value)}
                className="flex align-items-center gap-2"
              >
                <RadioButton
                  inputId={`${field.field_name}_${opt.label}`}
                  name={field.field_name}
                  value={opt.value}
                  disabled={disabledField}
                  onChange={(e) =>
                    handleChange(field.field_name, e.value)
                  }
                  checked={value === opt.value}
                />
                <label htmlFor={`${field.field_name}_${opt.label}`}>
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          {errorElement}
        </>
      );
    }
    if (['SELECT', 'SYS_LKP', 'GLOB_LKP', 'TABLE_LKP'].includes(field.field_type)) {
      if (['LIKERT_SCALE'].includes(field.field_subtype)) {
        return (
          <>
            <div className="flex flex-column gap-3 mt-2">
              <div className={`flex flex-row flex-wrap gap-4`}>
                {[
                  { lookup_code: '1', lookup_name: "1 - Strongly Disagree" },
                  { lookup_code: '2', lookup_name: "2 - Disagree" },
                  { lookup_code: '3', lookup_name: "3 - Neither or Disagree" },
                  { lookup_code: '4', lookup_name: "4 - Agree" },
                  { lookup_code: '5', lookup_name: "5 - Strongly Agree" },
                ].map((opt) => (
                  <div
                    key={opt.lookup_code}
                    className={`flex flex-column flex-1 align-items-center text-center`}
                  >
                    <RadioButton
                      inputId={`${field.field_name}_${opt.lookup_code}`}
                      name={field.field_name}
                      value={opt.lookup_code}
                      disabled={disabledField}
                      onChange={(e) =>
                        handleChange(field.field_name, e.value)
                      }
                      checked={value === opt.lookup_code}
                    />
                    <label
                      htmlFor={`${field.field_name}_${opt.lookup_code}`}
                      className="mt-2 text-sm"
                    >
                      {opt.lookup_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {errorElement}
          </>
        );
      }
      return (
        <>
          <Dropdown
            value={value}
            onChange={(e) => handleChange(field.field_name, e.target.value ? parseInt(e.target.value) : '')}
            options={field.field_options}
            optionLabel="lookup_name"
            disabled={disabledField}
            placeholder={field.field_label}
            className={error ? 'p-invalid' : ''}
          />
          {errorElement}
        </>
      );
    }
  };

  useEffect(() => {
    let tracking = true                 // remove this when tracking true false come from endpoint
    if (tracking === true) {            // write headers?.tracking instead of tracking here
      if (!fields.length) return;
      let trackingId = localStorage.getItem('tracking_id');
      if (!trackingId) {
        trackingId = crypto.randomUUID();
      } else if (trackingId) {
        trackingId = trackingId || '';
      }
      const trackerField = fields.find(f => f.field_name.includes('tracker'));

      if (trackerField && trackingId) {
        setFormValues(prev => ({
          ...prev,
          [trackerField.field_name]: trackingId,
        }));
      }
    }
    fields.forEach((field) => {
      // Set default value
      if (field.field_default && (!formValues[field.field_name] && formValues[field.field_name] !== false))
        handleChange(field.field_name, field.field_default)
    })
  }, [fields]);

  return (

    <>
      {thankyouMessage ? (
        <div className='flex flex-column align-items-center max-w-screen p-4'>
          <div className='w-full md:w-6 thankyou-message' dangerouslySetInnerHTML={{ __html: thankyouMessage }} />
        </div>
      ) : (<div className='flex flex-column align-items-center max-w-screen py-4'>
        <Toast ref={toastRef} />
        <div className='w-full xl:w-[1200px]'>
          <form onSubmit={handleSubmit} className="flex flex-column gap-2">
            {fields
              .filter(field => field.field_type !== 'UUID' && field.field_hidden !== '1')
              .map((field, index) => (
                <Card key={field.field_name} className='shadow-1'>
                  <div className="flex flex-column gap-1">
                    <div>
                      <label htmlFor={field.field_name} className='font-bold' >
                        {index + 1}. {field.field_label} {field.field_required === '1' && <span style={{ color: 'red' }}>*</span>}
                      </label>
                      {field.field_description && (
                        <small id={`${field.field_name}-help`} className="text-color-secondary block my-2">
                          <span dangerouslySetInnerHTML={{ __html: field.field_description }} />
                        </small>
                      )}
                    </div>
                    {renderField(field)}

                  </div>
                </Card>
              ))}
            <div className="w-full">
              <Button type="submit" label="Submit" />
            </div>
          </form>
        </div>
      </div>)}
    </>
  );
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
export default FormBuilderFields;
