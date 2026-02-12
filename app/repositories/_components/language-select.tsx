'use client';

import { useState, useMemo } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxEmpty,
} from '@/components/ui/combobox';
import { getPopularLanguageOptions, getOtherLanguageOptions } from '@/utils';

interface LanguageSelectProps {
  languages: string[];
  value?: string;
  onChange: (value: string | null) => void;
}

export default function LanguageSelect({
  languages,
  value,
  onChange,
}: LanguageSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const popularOptions = getPopularLanguageOptions();
  const otherOptions = getOtherLanguageOptions(languages);

  const query = inputValue.toLowerCase().trim();

  const filteredPopular = useMemo(
    () =>
      query
        ? popularOptions.filter((opt) =>
          opt.label.toLowerCase().includes(query)
        )
        : popularOptions,
    [query, popularOptions]
  );

  const filteredOther = useMemo(
    () =>
      query
        ? otherOptions.filter((opt) =>
          opt.label.toLowerCase().includes(query)
        )
        : otherOptions,
    [query, otherOptions]
  );

  return (
    <Combobox
      value={value ?? null}
      onValueChange={(val) => {
        onChange(val as string | null);
      }}
      onInputValueChange={(v) => setInputValue(v)}
      filter={null}
    >
      <ComboboxInput
        placeholder="Any"
        showClear={!!value}
        className="w-48"
      />
      <ComboboxContent>
        {filteredPopular.length === 0 && filteredOther.length === 0 && (
          <ComboboxEmpty>No languages found</ComboboxEmpty>
        )}
        <ComboboxList>
          {filteredPopular.length > 0 && (
            <ComboboxGroup>
              <ComboboxLabel>Popular</ComboboxLabel>
              {filteredPopular.map((opt) => (
                <ComboboxItem key={opt.value} value={opt.value}>
                  {opt.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
          {filteredOther.length > 0 && (
            <>
              {filteredPopular.length > 0 && <ComboboxSeparator />}
              <ComboboxGroup>
                <ComboboxLabel>Everything else</ComboboxLabel>
                {filteredOther.map((opt) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
