import { Component, Input, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instagram-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="instagram-widget">
      <h3 class="text-xl font-serif-display text-brand-gold mb-4">
        Síguenos en Instagram
      </h3>
      
      <!-- Método 1: Widget Simple -->
      <div *ngIf="widgetType === 'simple'" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div *ngFor="let post of instagramPosts" 
             class="aspect-square bg-brand-grey rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
             (click)="openInstagram()">
          <img [src]="post.image" [alt]="post.caption" class="w-full h-full object-cover">
        </div>
      </div>

      <!-- Método 2: Embed Directo -->
      <div *ngIf="widgetType === 'embed'" [innerHTML]="embedCode" class="instagram-embed"></div>

      <!-- Método 3: Botón de Seguir -->
      <div *ngIf="widgetType === 'follow'" class="text-center">
        <button 
          (click)="openInstagram()"
          class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Seguir en Instagram
        </button>
      </div>
    </div>
  `,
  styles: [`
    .instagram-embed {
      max-width: 540px;
      margin: 0 auto;
    }
  `]
})
export class InstagramWidgetComponent implements OnInit, AfterViewInit {
  @Input() username: string = '';
  @Input() widgetType: 'simple' | 'embed' | 'follow' = 'simple';
  @Input() postCount: number = 6;

  instagramPosts: any[] = [];
  embedCode: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.generateInstagramPosts();
    this.generateEmbedCode();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.widgetType === 'embed') {
      this.loadInstagramScript();
    }
  }

  private generateInstagramPosts() {
    // Genera posts simulados realistas
    this.instagramPosts = Array.from({ length: this.postCount }, (_, i) => ({
      id: `post_${i}`,
      image: `https://picsum.photos/300/300?random=${Date.now() + i}`,
      caption: this.getRandomCaption(),
      url: `https://instagram.com/p/example_${i}`
    }));
  }

  private generateEmbedCode() {
    if (this.username) {
      // Widget embed simple de Instagram
      this.embedCode = `
        <div style="background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center;">
          <h4 style="margin: 0 0 15px 0; color: #333;">@${this.username.replace('@', '')}</h4>
          <p style="color: #666; margin-bottom: 15px;">Síguenos para ver nuestros últimos trabajos</p>
          <a href="https://instagram.com/${this.username.replace('@', '')}" 
             target="_blank" 
             style="background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
                    color: white; 
                    padding: 10px 20px; 
                    border-radius: 25px; 
                    text-decoration: none; 
                    display: inline-block;">
            Ver en Instagram
          </a>
        </div>
      `;
    }
  }

  private loadInstagramScript() {
    if (typeof window !== 'undefined' && !window.document.getElementById('instagram-embed-script')) {
      const script = window.document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      window.document.body.appendChild(script);
    }
  }

  private getRandomCaption(): string {
    const captions = [
      '🎨 Nuevo trabajo terminado! #tattoo #art #equinocciostudio',
      '✨ Proceso de sanación perfecto #healing #tattoocare',
      '🖤 Black & grey en proceso #blackandgrey #inprogress',
      '🌟 Sesión completada. Gracias por la confianza! #grateful',
      '⚡ Detalles que marcan la diferencia #precision #tattoowork',
      '🔥 Diseño custom único #custom #unique #tattoodesign'
    ];
    return captions[Math.floor(Math.random() * captions.length)];
  }

  openInstagram() {
    const url = `https://instagram.com/${this.username.replace('@', '')}`;
    window.open(url, '_blank');
  }
}
