import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import type { FormField } from "./types/form";
import { saveFormFields } from "./services/form.service";

interface ContactFormProps {
  formId: string;
  fields: FormField[];
}

const ContactForm: React.FC<ContactFormProps> = ({ formId, fields }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= INIT DEFAULT VALUES ================= */
  useEffect(() => {
    if (!fields?.length) return;

    const defaults: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.field_default) {
        defaults[field.field_name] = field.field_default;
      }
    });

    setFormValues((prev) => ({ ...defaults, ...prev }));
  }, [fields]);

  /* ================= HANDLERS ================= */
  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async () => {
    const validationErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.field_required === "1" && !formValues[field.field_name]) {
        validationErrors[field.field_name] = "Required";
      }
    });

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const decoded = decodeFormId(formId);
    if (!decoded) return;

    const [datasetId, applicationId] = decoded;

    await saveFormFields(formValues, datasetId, applicationId);
  };

  /* ================= FIELD RENDERER ================= */
  const renderField = (field: FormField) => {
    if (field.field_hidden === "1" || field.field_type === "UUID") {
      return null;
    }

    const value = formValues[field.field_name] || "";
    const error = errors[field.field_name];

    switch (field.field_type) {
      case "EMAIL":
      case "SHORT_TXT":
        return (
          <InputText
            value={value}
            onChange={(e) => handleChange(field.field_name, e.target.value)}
            placeholder={field.field_label}
            className={`w-full ${error ? "p-invalid" : ""}`}
          />
        );

      case "SELECT":
      case "SYS_LKP":
      case "GLOB_LKP":
      case "TABLE_LKP":
        return (
          <Dropdown
            value={value}
            options={field.field_options}
            optionLabel="lookup_name"
            optionValue="lookup_code"
            placeholder={field.field_label}
            className={`w-full ${error ? "p-invalid" : ""}`}
            onChange={(e) => handleChange(field.field_name, e.value)}
          />
        );

      default:
        return null;
    }
  };

  /* ================= LAYOUT (UNCHANGED) ================= */
  return (
    <div className="grid container">
      {/* LEFT PANEL */}
      <div className="col-12 md:col-4 text-white p-4 md:p-5 border-round-left-xl relative overflow-hidden form-left">
        <h2
          className="text-5xl font-semibold m-0 mb-2"
          style={{ color: "#f9a74e" }}
        >
          Contact for Business Solutions
        </h2>
        <p className="text-2xl text-gray-300">
          Fill out your details to be contacted.
        </p>

        <span
          className="absolute border-circle"
          style={{
            width: 160,
            height: 160,
            background: "#d4934b",
            bottom: -60,
            right: -40,
            opacity: 0.9,
          }}
        />
        <span
          className="absolute border-circle"
          style={{
            width: 40,
            height: 40,
            background: "#d4934b",
            bottom: 80,
            right: 40,
            opacity: 0.7,
          }}
        />
      </div>

      {/* RIGHT FORM */}
      <div className="col-12 md:col-8 p-4 md:p-5 border-round-right-xl form-right">
        <div className="grid">
          {fields
            .filter(
              (field) =>
                field.field_hidden !== "1" && field.field_type !== "UUID"
            )
            .map((field) => (
              <div
                key={field.field_name}
                className={`col-12 ${
                  field.field_label === "Country" ? "" : "md:col-6"
                }`}
              >
                <label className="block text-lg font-medium mb-2">
                  {field.field_label}
                  {field.field_required === "1" && (
                    <span className="text-red-500 ml-1 ">*</span>
                  )}
                </label>

                {renderField(field)}

                {errors[field.field_name] && (
                  <small className="p-error">{errors[field.field_name]}</small>
                )}
              </div>
            ))}

          <div className="col-12 mt-4">
            <Button
              label="SEND"
              className=" border-none px-5 btn btn-submit "
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */
const decodeFormId = (formId: string): [string, string] | null => {
  try {
    const decoded = atob(formId);
    const parts = decoded.split("@");
    return parts.length === 2 ? [parts[0], parts[1]] : null;
  } catch {
    return null;
  }
};

export default ContactForm;
