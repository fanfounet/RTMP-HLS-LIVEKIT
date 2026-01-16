# RTMP-HLS-LIVEKIT
## Démarrage
`docker compose up --pull always`

## installation du livekit CLI
(voir doc)
Sous MAC
`brew install livekit-cli`

## Création d'une salle
`
lk room create test-room \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`

## Création du ingress RTMP - création d'une entrée externe RTMP dans la salle
`
lk ingress create ingress-request.json \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`
Réponse
`
IngressID: IN_XLSkcYLxLxPY Status: ENDPOINT_INACTIVE
URL: rtmp://localhost:1935 Stream Key:xxxxxxxxx
`
Vous pouvez renseigner OBS par exemple avec l'adresse rtmp ainsi que la clé de stream qui vient dêtre générée
## Démarrage du egress - Enregistre dans hls les xxx.ts
`
lk egress start --type participant request.json \
  --url http://localhost:7880 \
  --api-key devkey \
  --api-secret secret
`

## Résultat
Ouvrir VLC et mettre l'adresse suivante :
`http://localhost:8000/index-live.m3u8`

## Utiliser l'interface graphique
`http://localhost:5000/dashboard.html`