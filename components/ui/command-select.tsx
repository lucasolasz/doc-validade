"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import * as React from "react";

type Item = { id: string; descricao: string };

interface CommandSelectProps {
  items: Item[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CommandSelect({
  items,
  value,
  onValueChange,
  placeholder = "Selecione...",
  className = "",
}: CommandSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = items.find((i) => i.id === value);

  return (
    <>
      <Button
        variant="outline"
        className={`w-full justify-start text-left h-8 px-3 ${className}`}
        onClick={() => setOpen(true)}
      >
        <ChevronDown className="mr-2 h-4 w-4" />
        {selected ? selected.descricao : placeholder}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Pesquisar..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {items.map((it) => (
                <CommandItem
                  key={it.id}
                  onSelect={() => {
                    onValueChange(it.id);
                    setOpen(false);
                  }}
                >
                  <span>{it.descricao}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
