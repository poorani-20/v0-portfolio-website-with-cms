"use client"

import { useState } from "react"
import type { GalleryImage } from "@/lib/types/database"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface GallerySectionProps {
  gallery: GalleryImage[]
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  if (gallery.length === 0) {
    return (
      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gallery</h2>
            <p className="text-muted-foreground">No gallery images added yet. Add some from the admin dashboard.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of memorable moments and experiences
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={image.image_url}
                alt={image.title || "Gallery image"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                {image.title && (
                  <span className="text-white text-sm font-medium">{image.title}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedImage && (
              <div className="relative">
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.title || "Gallery image"}
                    fill
                    className="object-contain"
                  />
                </div>
                {(selectedImage.title || selectedImage.description) && (
                  <div className="p-4 bg-background">
                    {selectedImage.title && (
                      <h3 className="font-semibold">{selectedImage.title}</h3>
                    )}
                    {selectedImage.description && (
                      <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
