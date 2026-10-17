# KABEL

Directo a tus auriculares. El público escanea el QR del artista y escucha su directo en el móvil, sin app, sin cuenta y sin grabaciones.

Proyecto de YM Enterprise.

## Qué hay aquí

| Ruta | Qué es |
|---|---|
| `/` | Landing en español, inglés y danés |
| `/app/` | Prototipo: consola del artista y página del oyente |
| `/maquetas/` | Pantallas del prototipo con datos de ejemplo y la lluvia de ideas |

Todo es HTML estático, pensado para GitHub Pages.

## Cómo funciona el prototipo

- El audio viaja por WebRTC directamente del dispositivo del artista a cada oyente.
- Un servidor público de PeerJS solo pone en contacto a los dispositivos.
- Límite: 25 oyentes a la vez. Para más hace falta un servidor de audio (LiveKit), previsto para la Fase 1.
- No se guarda música, sesiones ni datos de oyentes. El perfil del artista y los artistas guardados viven en el navegador de cada uno.
- Hay que abrirlo por https (GitHub Pages ya lo hace): sin https el navegador no deja capturar audio.

## Prueba rápida

1. En el portátil, abre `/app/`, pulsa "Emitir como artista", crea el perfil y activa la entrada de audio.
2. Pulsa "Ir en directo" y luego "Mostrar QR".
3. Escanea el QR con un móvil y pulsa el botón de escuchar.
4. Prueba con wifi y con 4G, y bloquea la pantalla del iPhone para ver si se corta.
