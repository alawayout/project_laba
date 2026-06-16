"use client";

import { ImagePlus, X } from "lucide-react";
import type { ChangeEvent } from "react";
import type { OrderFormPhoto } from "@/lib/types";

interface PhotoUploaderProps {
  photos: OrderFormPhoto[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
}

/** Сетка фото работы: миниатюры с удалением + плитка загрузки. */
export function PhotoUploader({ photos, onAdd, onRemove }: PhotoUploaderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onAdd(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="flex flex-wrap gap-3.5">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative h-[110px] w-[110px] overflow-hidden rounded-image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt="Фото работы"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(photo.id)}
            aria-label="Удалить фото"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-pill bg-accent text-black [&_svg]:size-4"
          >
            <X />
          </button>
        </div>
      ))}

      <label className="flex h-[110px] w-[110px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-image border border-dashed border-[#4a4a4a] px-2 text-center text-caption text-fg-muted transition hover:border-fg-muted hover:text-fg [&_svg]:size-6">
        <ImagePlus />
        Загрузите ещё фото
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
