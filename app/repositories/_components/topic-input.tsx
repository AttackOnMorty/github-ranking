'use client';

import { useCallback, useRef, useState } from 'react';

import { getTopicsAsync } from '@/api';

import type { Topic } from '@/api/types';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

interface TopicInputProps {
  value: string[];
  setValue: (value: string[]) => void;
  resetPage: () => void;
}

export default function TopicInput({
  value,
  setValue,
  resetPage,
}: TopicInputProps) {
  const [options, setOptions] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValueRef = useRef<string>('');

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (newValue.trim() === '') {
        setOptions([]);
        setOpen(false);
        setHasSearched(false);
        return;
      }

      currentValueRef.current = newValue;

      timeoutRef.current = setTimeout(async () => {
        setLoading(true);
        setOpen(true);
        const topics = await getTopicsAsync(newValue);
        setLoading(false);

        if (currentValueRef.current === newValue) {
          setOptions(topics);
          setHasSearched(true);
        }
      }, 500);
    },
    []
  );

  return (
    <Combobox
      multiple
      value={value}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && options.length === 0 && !loading) return;
        setOpen(nextOpen);
      }}
      onValueChange={(val) => {
        setValue(val as string[]);
        resetPage();
      }}
      filter={null}
    >
      <ComboboxChips ref={setAnchorEl} className="w-50 min-h-8 flex-nowrap overflow-x-auto">
        {value.map((topic) => (
          <ComboboxChip key={topic}>
            {topic}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput
          placeholder={value.length === 0 ? 'Any' : ''}
          onChange={handleInputChange}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchorEl}>
        <ComboboxList>
          {loading && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              Searching...
            </div>
          )}
          {!loading && hasSearched && options.length === 0 && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No topics found
            </div>
          )}
          {options.map(({ name, displayName, description }) => (
            <ComboboxItem key={name} value={name}>
              <div>
                <div className="font-medium">{displayName ?? name}</div>
                {description && (
                  <div className="text-xs text-muted-foreground whitespace-normal">
                    {description}
                  </div>
                )}
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
