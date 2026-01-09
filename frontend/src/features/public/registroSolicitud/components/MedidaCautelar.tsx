import React from 'react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';

interface MedidaCautelarProps {
    medida_cautelar: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MedidaCautelar: React.FC<MedidaCautelarProps> = ({
    medida_cautelar,
    onChange
}) => {
    return (
        <FormSection title="Medida cautelar previa" number={5}>
            <div className="mb-4">
                <p className="text-gray-700 text-sm">
                    Indicar si cuenta con medida cautelar previa y dar la información pertinente
                </p>
            </div>
            <FormField
                label="Descripción (máximo 1000 caracteres)"
                name="medida_cautelar"
                value={medida_cautelar}
                onChange={onChange}
                placeholder="Describa la medida cautelar previa si cuenta con ella..."
                maxLength={1000}
                isTextarea={true}
                required={false}
            />
            <small className="text-gray-500">{medida_cautelar.length}/1000 caracteres</small>
        </FormSection>
    );
};