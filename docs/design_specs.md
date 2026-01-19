# Especificações de Design - Plataforma Jo Terapeuta Capilar

## 🎨 Paleta de Cores

### Cores Principais
| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **White** | `#FFFFFF` | 255, 255, 255 | Background principal |
| **Black** | `#000000` | 0, 0, 0 | Texto, botões primários |
| **Nude/Beige** | `#E5D3C6` | 229, 211, 198 | Backgrounds secundários, banners |

### Cores Secundárias
| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Off-White** | `#FAFAFA` | 250, 250, 250 | Fundos alternados |
| **Light Gray** | `#EEEDEB` | 238, 237, 235 | Inputs, cards |
| **Gold/Bronze** | `#B8860B` | 184, 134, 11 | Logo accent (usar com moderação) |

### CSS Variables
```css
:root {
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-nude: #E5D3C6;
  --color-off-white: #FAFAFA;
  --color-light-gray: #EEEDEB;
  --color-gold: #B8860B;
  
  /* Semantic */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-nude);
  --text-primary: var(--color-black);
  --text-muted: #666666;
}
```

---

## 🔤 Tipografia

| Elemento | Font | Weight | Notas |
|----------|------|--------|-------|
| **Headings** | Manrope | 600-700 | Geométrica, moderna |
| **Body** | Poppins | 400-500 | Legível, amigável |
| **Logo** | Script cursivo | - | Toque pessoal (apenas logo) |

### Import (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Hierarquia
```css
h1 { font-family: 'Manrope', sans-serif; font-size: 2.5rem; font-weight: 700; }
h2 { font-family: 'Manrope', sans-serif; font-size: 2rem; font-weight: 600; }
h3 { font-family: 'Manrope', sans-serif; font-size: 1.5rem; font-weight: 600; }
body { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 400; }
```

---

## 🎯 Componentes UI

### Botões
- **Border-radius**: `0px` (cantos retos - característica da marca)
- **Primário**: Background preto, texto branco
- **Secundário**: Background transparente, borda preta

```css
.btn-primary {
  background: #000000;
  color: #FFFFFF;
  border: none;
  border-radius: 0;
  padding: 12px 24px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}

.btn-secondary {
  background: transparent;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 0;
  padding: 12px 24px;
}
```

### Cards
- Background branco ou off-white
- Sombra muito sutil ou sem sombra
- Bordas limpas

### Inputs
- Background light gray (`#EEEDEB`)
- Bordas subtis
- Border-radius mínimo (0-4px)

---

## 📐 Layout

- **Espaçamento generoso** (white space abundante)
- **Grid limpo** para produtos/cards
- **Navegação minimalista** no topo
- **Sem decorações excessivas**

---

## ✅ Design Principles

1. **Mobile-First** - Clientes usam quase exclusivamente telemóvel
2. **Minimalismo** - Menos é mais
3. **Profissionalismo** - Transmitir confiança e autoridade
4. **Naturalidade** - Cores quentes, orgânicas
5. **Clareza** - Fácil de navegar e entender

---

## 📱 Mobile-First Considerations

- **Touch targets**: Botões mínimo 44x44px
- **Bottom navigation**: Menu na parte inferior para área cliente
- **Cards grandes**: Texto legível sem zoom
- **Inputs grandes**: Fácil preenchimento no telemóvel
- **Gestos**: Swipe para ações rápidas

---

## 🌍 Internacionalização (i18n)

### Línguas Suportadas
| Prioridade | Língua | Código | Notas |
|------------|--------|--------|-------|
| **Primária** | 🇫🇷 Francês | `fr` | Língua principal da UI |
| Secundária | 🇵🇹 Português (PT) | `pt` | Fase posterior |

### Estratégia
- Utilizar `next-intl` para gestão de traduções
- Ficheiros de tradução em `messages/{locale}.json`
- URL prefix: `/fr/`, `/pt/` (com redirect automático baseado no browser)
