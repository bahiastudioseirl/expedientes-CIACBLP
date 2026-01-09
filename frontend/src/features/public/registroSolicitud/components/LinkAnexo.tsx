import React from 'react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';

interface LinkAnexoProps {
    link_anexo: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const LinkAnexo: React.FC<LinkAnexoProps> = ({ link_anexo, onChange }) => {
    return (
        <FormSection title="Documentos Anexos" number={7}>
            <FormField
                label="Link de documentos (Google Drive, OneDrive, etc.)"
                name="link_anexo"
                value={link_anexo}
                onChange={onChange}
                placeholder="https://drive.google.com/..."
                type="url"
                required={false}
            />
            <small className="text-gray-500 block mt-2">Proporcione un enlace público a los documentos que respaldan su solicitud</small>
        </FormSection>
    );
};
