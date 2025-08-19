import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TatuadorService, Tatuador, ApiResponse } from '../../core/services/tatuador.service';
import { InstagramService, InstagramPost } from '../../core/services/instagram.service';

interface EnhancedTatuador extends Tatuador {
  rol?: string;
  imagen?: string;
  biografia?: string;
  experiencia?: string;
  certificaciones?: string[];
  instagramPosts?: InstagramPost[];
  portfolio?: { imagen: string; titulo: string; estilo: string; }[];
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss'
})
export class NosotrosComponent implements OnInit {
  selectedArtist: EnhancedTatuador | null = null;
  tatuadores: EnhancedTatuador[] = [];
  loading = false;

  // Enhanced data templates for each artist
  private enhancedData: { [key: string]: Partial<EnhancedTatuador> } = {
    'Alan Guillin': {
      rol: 'Fundador y Artista Principal',
      imagen: 'https://images.unsplash.com/photo-1595085610892-38f35b5ee483?q=80&w=1887&auto=format&fit=crop',
      biografia: 'Con más de 8 años de experiencia en el arte del tatuaje, Alan es reconocido por su técnica excepcional en realismo y retratos. Fundó EQUINOCCIO STUDIO con la visión de crear un espacio donde el arte y la piel se fusionan para contar historias únicas.',
      experiencia: '8 años',
      certificaciones: ['Certificación en Bioseguridad', 'Curso Avanzado de Realismo', 'Workshop Internacional de Retratos']
    },
    'Carlos Mendoza': {
      rol: 'Artista Senior',
      imagen: 'https://images.unsplash.com/photo-1595085610892-38f35b5ee483?q=80&w=1887&auto=format&fit=crop',
      biografia: 'Carlos es un maestro del realismo con más de 15 años de experiencia. Su técnica impecable y atención al detalle lo han convertido en uno de los artistas más respetados del estudio.',
      experiencia: '15 años',
      certificaciones: ['Certificación en Bioseguridad', 'Especialización en Realismo', 'Workshop de Retratos Avanzados']
    },
    'Ana García': {
      rol: 'Especialista en Traditional',
      imagen: 'https://images.unsplash.com/photo-1614981273937-73406725a3f2?q=80&w=1887&auto=format&fit=crop',
      biografia: 'Ana es una artista apasionada del estilo tradicional americano. Con años de experiencia, se especializa en diseños old school con colores vibrantes y líneas definidas.',
      experiencia: '6 años',
      certificaciones: ['Especialización en Traditional', 'Curso de Teoría del Color', 'Certificación en Higiene']
    },
    'Miguel Torres': {
      rol: 'Especialista en Blackwork',
      imagen: 'https://images.unsplash.com/photo-1588851280205-587b8134f4e1?q=80&w=1887&auto=format&fit=crop',
      biografia: 'Miguel es un maestro del blackwork y los diseños geométricos. Combina precisión matemática con creatividad artística.',
      experiencia: '5 años',
      certificaciones: ['Especialización en Blackwork', 'Curso de Geometría Sagrada', 'Workshop de Diseño Minimalista']
    },
    'Sofía Ruiz': {
      rol: 'Artista de Acuarela',
      imagen: 'https://images.unsplash.com/photo-1614981273937-73406725a3f2?q=80&w=1887&auto=format&fit=crop',
      biografia: 'Sofía es una artista innovadora especializada en tatuajes estilo acuarela. Su técnica única combina colores vibrantes con efectos de difuminado.',
      experiencia: '4 años',
      certificaciones: ['Certificación en Técnicas de Color', 'Workshop de Acuarela Avanzada']
    }
  };

  constructor(
    private tatuadorService: TatuadorService,
    private instagramService: InstagramService
  ) {}

  ngOnInit() {
    this.loadTatuadores();
  }

  loadTatuadores() {
    this.loading = true;
    this.tatuadorService.getTatuadores().subscribe({
      next: (response: ApiResponse<Tatuador[]>) => {
        if (response.status === 'success') {
          this.tatuadores = response.data.map(tatuador => this.enhanceArtistData(tatuador));
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tatuadores:', error);
        this.loading = false;
      }
    });
  }

  private enhanceArtistData(tatuador: Tatuador): EnhancedTatuador {
    const enhanced = this.enhancedData[tatuador.nombre] || {};
    const defaultPortfolio = this.generatePortfolioBySpecialty(tatuador.especialidad);
    
    const enhancedTatuador: EnhancedTatuador = {
      ...tatuador,
      rol: enhanced.rol || 'Artista Tatuador',
      imagen: enhanced.imagen || tatuador.imagen || 'https://images.unsplash.com/photo-1595085610892-38f35b5ee483?q=80&w=1887&auto=format&fit=crop',
      biografia: enhanced.biografia || `${tatuador.nombre} es un artista especializado en ${tatuador.especialidad}. ${tatuador.descripcion || 'Dedicado a crear obras de arte únicas en la piel.'}`,
      experiencia: enhanced.experiencia || tatuador.experiencia || '5+ años',
      certificaciones: enhanced.certificaciones || ['Certificación en Bioseguridad', 'Especialización en ' + tatuador.especialidad],
      instagramPosts: [],
      portfolio: enhanced.portfolio || defaultPortfolio
    };

    // Load real Instagram posts if username is available
    if (tatuador.instagram) {
      this.loadInstagramPosts(enhancedTatuador, tatuador.instagram);
    }

    return enhancedTatuador;
  }

  private loadInstagramPosts(tatuador: EnhancedTatuador, username: string) {
    // Usar método simple sin API tokens
    this.instagramService.getInstagramPostsSimple(username).subscribe({
      next: (posts: InstagramPost[]) => {
        tatuador.instagramPosts = posts;
      },
      error: (error) => {
        console.error(`Error loading Instagram posts for ${username}:`, error);
        tatuador.instagramPosts = this.generateMockInstagramPosts(tatuador.especialidad || '');
      }
    });
  }

  private generateMockInstagramPosts(especialidad: string): InstagramPost[] {
    const mockPosts: InstagramPost[] = [];
    const baseUrl = 'https://picsum.photos';
    
    for (let i = 0; i < 6; i++) {
      mockPosts.push({
        id: `mock_${especialidad}_${i}`,
        media_type: 'IMAGE',
        media_url: `${baseUrl}/400/400?random=${Date.now() + i}`,
        caption: this.generateMockCaption(especialidad),
        permalink: `https://instagram.com/p/mock_${i}`,
        timestamp: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
      });
    }
    
    return mockPosts;
  }

  private generateMockCaption(especialidad: string): string {
    const captions: { [key: string]: string[] } = {
      'Realismo': [
        '🎨 Retrato hiperrealista terminado! ¿Qué opinan? #realismo #tattoo #equinocciostudio',
        '✨ Detalles que marcan la diferencia en cada trabajo #precision #realism',
        '🖤 Proceso de sombreado en retrato #proceso #realismotattoo'
      ],
      'Traditional': [
        '⚡ Águila tradicional americana terminada! #traditional #oldschool #tattoo',
        '🌹 Pin-up clásica con colores vibrantes #pinup #traditional #tattooart',
        '🗡️ Daga tradicional con rosas #traditional #dagger #roses'
      ],
      'Blackwork': [
        '🔥 Mandala geométrico en proceso #blackwork #mandala #geometric',
        '⚫ Líneas perfectas en blackwork #precision #blackwork #tattoo',
        '🖤 Diseño tribal moderno #tribal #blackwork #modern'
      ],
      'Acuarela': [
        '🌈 Mariposa acuarela terminada! #watercolor #butterfly #colorful',
        '🎨 Flor con efecto acuarela #watercolortattoo #flower #art',
        '💙 Técnica de difuminado perfecta #watercolor #blending #tattoo'
      ]
    };
    
    const categoryPosts = captions[especialidad] || captions['Realismo'];
    return categoryPosts[Math.floor(Math.random() * categoryPosts.length)];
  }

  private generatePortfolioBySpecialty(especialidad: string) {
    const portfolios: { [key: string]: any[] } = {
      'Realismo': [
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600', titulo: 'Retrato Realista', estilo: 'Realismo' },
        { imagen: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600', titulo: 'Animal Salvaje', estilo: 'Realismo' }
      ],
      'Traditional': [
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600', titulo: 'Águila Americana', estilo: 'Traditional' },
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600', titulo: 'Pin-up Clásica', estilo: 'Old School' }
      ],
      'Blackwork': [
        { imagen: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600', titulo: 'Mandala Sagrado', estilo: 'Geométrico' },
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600', titulo: 'Líneas Abstractas', estilo: 'Blackwork' }
      ],
      'Acuarela': [
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600', titulo: 'Flor Acuarela', estilo: 'Acuarela' },
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600', titulo: 'Mariposa Colorida', estilo: 'Acuarela' }
      ]
    };
    return portfolios[especialidad] || portfolios['Realismo'];
  }

  private generateInstagramPostsBySpecialty(especialidad: string) {
    const posts: { [key: string]: any[] } = {
      'Realismo': [
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400', descripcion: 'Retrato hiperrealista terminado' },
        { imagen: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400', descripcion: 'Proceso de sombreado' }
      ],
      'Traditional': [
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400', descripcion: 'Águila tradicional' },
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400', descripcion: 'Pin-up old school' }
      ],
      'Blackwork': [
        { imagen: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400', descripcion: 'Mandala geométrico' },
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400', descripcion: 'Blackwork en brazo' }
      ],
      'Acuarela': [
        { imagen: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400', descripcion: 'Flor acuarela' },
        { imagen: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400', descripcion: 'Mariposa colorida' }
      ]
    };
    return posts[especialidad] || posts['Realismo'];
  }

  selectArtist(artist: EnhancedTatuador) {
    this.selectedArtist = this.selectedArtist?.id === artist.id ? null : artist;
  }

  openInstagram(username: string) {
    if (username) {
      this.instagramService.openInstagramProfile(username);
    }
  }

  openInstagramPost(permalink: string) {
    if (permalink) {
      window.open(permalink, '_blank');
    }
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hace 1 día';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }
}
